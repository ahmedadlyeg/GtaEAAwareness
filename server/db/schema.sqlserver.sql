/* =============================================================================
   EA Awareness Hub - General Tax Authority (GTA), Qatar
   Production schema for Microsoft SQL Server 2019+ / Azure SQL (T-SQL)
   Schema: ea

   Conventions
   - All timestamps are UTC, datetime2(3). Local (Asia/Qatar, UTC+3, no DST)
     conversion happens in reporting views via AT TIME ZONE 'Arab Standard Time'.
   - JSON columns are nvarchar(max) guarded by ISJSON() check constraints.
   - Content identifiers (modules, rounds, questions) are short strings so the
     front end can keep its own stable ids.
   - The application connects with a dedicated login whose DEFAULT_SCHEMA is ea
     (see the end of this file); the application SQL uses unqualified names.

   Run as a DBA:  sqlcmd -S <server> -d <database> -i schema.sqlserver.sql
   The script is idempotent for objects (IF OBJECT_ID ... IS NULL) and seeds.
   ============================================================================= */
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

IF SCHEMA_ID(N'ea') IS NULL EXEC (N'CREATE SCHEMA ea AUTHORIZATION dbo;');
GO

/* ----------------------------------------------------------------------------
   Reference data
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.departments', N'U') IS NULL
CREATE TABLE ea.departments (
    id          int IDENTITY(1,1) NOT NULL CONSTRAINT pk_departments PRIMARY KEY,
    code        varchar(32)    NOT NULL CONSTRAINT uq_departments_code UNIQUE,
    name        nvarchar(128)  NOT NULL CONSTRAINT uq_departments_name UNIQUE,
    name_ar     nvarchar(128)  NULL,
    sort_order  int            NOT NULL CONSTRAINT df_departments_sort DEFAULT (100),
    is_active   bit            NOT NULL CONSTRAINT df_departments_active DEFAULT (1)
);
GO

/* ----------------------------------------------------------------------------
   Users (auto-provisioned at first-time sign-up: OTP to the GTA email, then a password)
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.users', N'U') IS NULL
CREATE TABLE ea.users (
    id                 int IDENTITY(1,1) NOT NULL CONSTRAINT pk_users PRIMARY KEY,
    email              nvarchar(254) NOT NULL,
    display_name       nvarchar(200) NOT NULL,
    department_id      int           NULL CONSTRAINT fk_users_department REFERENCES ea.departments(id),
    department_set_at  datetime2(3)  NULL,
    job_title          nvarchar(200) NULL,
    role               varchar(16)   NOT NULL CONSTRAINT df_users_role DEFAULT ('staff'),
    first_login_at     datetime2(3)  NULL,
    last_login_at      datetime2(3)  NULL,
    is_active          bit           NOT NULL CONSTRAINT df_users_active DEFAULT (1),
    password_hash      varchar(255)  NULL,          -- scrypt$N$r$p$saltB64$hashB64; NULL until first-time sign-up
    password_set_at    datetime2(3)  NULL,
    failed_logins      int           NOT NULL CONSTRAINT df_users_failed DEFAULT (0),
    locked_until       datetime2(3)  NULL,
    created_at         datetime2(3)  NOT NULL CONSTRAINT df_users_created DEFAULT (SYSUTCDATETIME()),
    updated_at         datetime2(3)  NOT NULL CONSTRAINT df_users_updated DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT ck_users_role  CHECK (role IN ('staff', 'ea_team', 'admin')),
    CONSTRAINT ck_users_email_lower CHECK (email = LOWER(email))
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_users_department' AND object_id = OBJECT_ID(N'ea.users'))
    CREATE INDEX ix_users_department ON ea.users (department_id) INCLUDE (role, is_active, first_login_at);
GO
-- Upgrade: password sign-in columns
IF COL_LENGTH(N'ea.users', N'password_hash') IS NULL ALTER TABLE ea.users ADD password_hash varchar(255) NULL;
IF COL_LENGTH(N'ea.users', N'password_set_at') IS NULL ALTER TABLE ea.users ADD password_set_at datetime2(3) NULL;
IF COL_LENGTH(N'ea.users', N'failed_logins') IS NULL ALTER TABLE ea.users ADD failed_logins int NOT NULL CONSTRAINT df_users_failed DEFAULT (0);
IF COL_LENGTH(N'ea.users', N'locked_until') IS NULL ALTER TABLE ea.users ADD locked_until datetime2(3) NULL;
GO

/* ----------------------------------------------------------------------------
   One-time passwords (sign-up + password reset; login/sign-off rows are legacy). Only a salted HMAC of the code is kept.
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.otp_challenges', N'U') IS NULL
CREATE TABLE ea.otp_challenges (
    id             uniqueidentifier NOT NULL CONSTRAINT pk_otp_challenges PRIMARY KEY NONCLUSTERED,
    user_email     nvarchar(254)    NOT NULL,
    user_id        int              NULL CONSTRAINT fk_otp_user REFERENCES ea.users(id),
    purpose        varchar(16)      NOT NULL,
    context        nvarchar(200)    NULL,          -- e.g. statement version for purpose = signoff
    code_hash      varbinary(32)    NOT NULL,      -- HMAC-SHA256(pepper, salt || code)
    salt           varbinary(16)    NOT NULL,
    expires_at     datetime2(3)     NOT NULL,
    attempts       int              NOT NULL CONSTRAINT df_otp_attempts DEFAULT (0),
    max_attempts   int              NOT NULL CONSTRAINT df_otp_max DEFAULT (5),
    consumed_at    datetime2(3)     NULL,
    locked_at      datetime2(3)     NULL,
    requested_ip   varchar(45)      NULL,
    created_at     datetime2(3)     NOT NULL CONSTRAINT df_otp_created DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT ck_otp_purpose  CHECK (purpose IN ('signup', 'reset', 'login', 'signoff')),  -- login/signoff: legacy rows
    CONSTRAINT ck_otp_attempts CHECK (attempts >= 0 AND max_attempts > 0)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_otp_email_created' AND object_id = OBJECT_ID(N'ea.otp_challenges'))
    CREATE CLUSTERED INDEX ix_otp_email_created ON ea.otp_challenges (user_email, purpose, created_at);
GO
IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'ck_otp_purpose' AND definition NOT LIKE N'%signup%')
    ALTER TABLE ea.otp_challenges DROP CONSTRAINT ck_otp_purpose;
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'ck_otp_purpose')
    ALTER TABLE ea.otp_challenges ADD CONSTRAINT ck_otp_purpose CHECK (purpose IN ('signup', 'reset', 'login', 'signoff'));
GO

/* ----------------------------------------------------------------------------
   Sessions: one row per successful login (login time, IP, UA, heartbeat)
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.user_sessions', N'U') IS NULL
CREATE TABLE ea.user_sessions (
    id            uniqueidentifier NOT NULL CONSTRAINT pk_user_sessions PRIMARY KEY NONCLUSTERED,
    user_id       int              NOT NULL CONSTRAINT fk_sessions_user REFERENCES ea.users(id),
    login_at      datetime2(3)     NOT NULL,
    last_seen_at  datetime2(3)     NOT NULL,
    logout_at     datetime2(3)     NULL,
    ip            varchar(45)      NULL,
    user_agent    nvarchar(512)    NULL,
    token_jti     varchar(64)      NOT NULL CONSTRAINT uq_sessions_jti UNIQUE
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'cx_sessions_login_at' AND object_id = OBJECT_ID(N'ea.user_sessions'))
    CREATE CLUSTERED INDEX cx_sessions_login_at ON ea.user_sessions (login_at);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_sessions_user_login' AND object_id = OBJECT_ID(N'ea.user_sessions'))
    CREATE INDEX ix_sessions_user_login ON ea.user_sessions (user_id, login_at) INCLUDE (last_seen_at, logout_at);
GO

/* ----------------------------------------------------------------------------
   Learning content and assessment definitions
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.content_modules', N'U') IS NULL
CREATE TABLE ea.content_modules (
    id          nvarchar(64)  NOT NULL CONSTRAINT pk_content_modules PRIMARY KEY,
    title       nvarchar(200) NOT NULL,
    title_ar    nvarchar(200) NULL,
    mandatory   bit           NOT NULL CONSTRAINT df_modules_mandatory DEFAULT (1),
    version     int           NOT NULL CONSTRAINT df_modules_version DEFAULT (1),
    sort_order  int           NOT NULL CONSTRAINT df_modules_sort DEFAULT (100),
    active      bit           NOT NULL CONSTRAINT df_modules_active DEFAULT (1),
    track       varchar(8)    NOT NULL CONSTRAINT df_modules_track DEFAULT ('ea'),   -- learning track used for exam eligibility
    CONSTRAINT ck_modules_track CHECK (track IN ('ea', 'togaf', 'kbf', 'kbp', 'kba'))   -- kb* = knowledge-base articles by level
);
GO
IF COL_LENGTH(N'ea.content_modules', N'track') IS NULL
    ALTER TABLE ea.content_modules ADD track varchar(8) NOT NULL CONSTRAINT df_modules_track DEFAULT ('ea');
GO
/* widen the track CHECK on databases created by an earlier version */
IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'ck_modules_track' AND definition NOT LIKE N'%kbp%')
    ALTER TABLE ea.content_modules DROP CONSTRAINT ck_modules_track;
GO
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'ck_modules_track')
    ALTER TABLE ea.content_modules ADD CONSTRAINT ck_modules_track CHECK (track IN ('ea', 'togaf', 'kbf', 'kbp', 'kba'));
GO

IF OBJECT_ID(N'ea.quiz_rounds', N'U') IS NULL
CREATE TABLE ea.quiz_rounds (
    id                     nvarchar(64)  NOT NULL CONSTRAINT pk_quiz_rounds PRIMARY KEY,
    title                  nvarchar(200) NOT NULL,
    mandatory              bit           NOT NULL CONSTRAINT df_rounds_mandatory DEFAULT (1),
    pass_pct               decimal(5,2)  NOT NULL CONSTRAINT df_rounds_pass DEFAULT (70),
    questions_per_attempt  int           NULL,   -- NULL = every active question of the round must be answered
    level                  varchar(16)   NOT NULL CONSTRAINT df_rounds_level DEFAULT ('foundation'),  -- certification path
    sort_order             int           NOT NULL CONSTRAINT df_rounds_sort DEFAULT (100),
    active                 bit           NOT NULL CONSTRAINT df_rounds_active DEFAULT (1),
    CONSTRAINT ck_rounds_pass CHECK (pass_pct BETWEEN 0 AND 100),
    CONSTRAINT ck_rounds_level CHECK (level IN ('foundation', 'practitioner', 'advanced'))
);
GO
IF COL_LENGTH(N'ea.quiz_rounds', N'level') IS NULL
    ALTER TABLE ea.quiz_rounds ADD level varchar(16) NOT NULL CONSTRAINT df_rounds_level DEFAULT ('foundation')
        CONSTRAINT ck_rounds_level CHECK (level IN ('foundation', 'practitioner', 'advanced'));
GO

IF OBJECT_ID(N'ea.questions', N'U') IS NULL
CREATE TABLE ea.questions (
    id          nvarchar(64)  NOT NULL CONSTRAINT pk_questions PRIMARY KEY,
    round_id    nvarchar(64)  NOT NULL CONSTRAINT fk_questions_round REFERENCES ea.quiz_rounds(id),
    tag         nvarchar(64)  NULL,
    type        varchar(16)   NOT NULL,
    prompt      nvarchar(max) NULL,           -- reporting copy only; the front end renders its own text
    points      int           NOT NULL CONSTRAINT df_questions_points DEFAULT (1),
    answer_key  nvarchar(max) NOT NULL,
    active      bit           NOT NULL CONSTRAINT df_questions_active DEFAULT (1),
    updated_at  datetime2(3)  NOT NULL CONSTRAINT df_questions_updated DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT ck_questions_type   CHECK (type IN ('mcq', 'truefalse', 'order', 'match', 'categorize')),
    CONSTRAINT ck_questions_points CHECK (points >= 0),
    CONSTRAINT ck_questions_key    CHECK (ISJSON(answer_key) = 1)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_questions_round' AND object_id = OBJECT_ID(N'ea.questions'))
    CREATE INDEX ix_questions_round ON ea.questions (round_id, active) INCLUDE (points, tag);
GO

/* ----------------------------------------------------------------------------
   Activity events (module views/completions, KB, downloads)
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.events', N'U') IS NULL
CREATE TABLE ea.events (
    id          bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_events PRIMARY KEY NONCLUSTERED,
    user_id     int              NOT NULL CONSTRAINT fk_events_user REFERENCES ea.users(id),
    session_id  uniqueidentifier NULL     CONSTRAINT fk_events_session REFERENCES ea.user_sessions(id),
    type        varchar(32)      NOT NULL,
    ref         nvarchar(200)    NULL,
    meta        nvarchar(max)    NULL,
    created_at  datetime2(3)     NOT NULL CONSTRAINT df_events_created DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT ck_events_type CHECK (type IN ('module_view', 'module_complete', 'kb_view', 'kb_search', 'adm_phase_view', 'download')),
    CONSTRAINT ck_events_meta CHECK (meta IS NULL OR ISJSON(meta) = 1)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'cx_events_created' AND object_id = OBJECT_ID(N'ea.events'))
    CREATE CLUSTERED INDEX cx_events_created ON ea.events (created_at);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_events_type_created' AND object_id = OBJECT_ID(N'ea.events'))
    CREATE INDEX ix_events_type_created ON ea.events (type, created_at) INCLUDE (user_id, ref);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_events_user_type' AND object_id = OBJECT_ID(N'ea.events'))
    CREATE INDEX ix_events_user_type ON ea.events (user_id, type) INCLUDE (ref, created_at);
GO

/* ----------------------------------------------------------------------------
   Assessment attempts and answers (server re-scored)
   ---------------------------------------------------------------------------- */
/* Certification exam sittings: one row per attempt per level (in progress or completed).
   question_set = {"<roundId>": ["<questionId>", ...]} issued by the server at start. */
IF OBJECT_ID(N'ea.cert_exams', N'U') IS NULL
CREATE TABLE ea.cert_exams (
    id            uniqueidentifier NOT NULL CONSTRAINT pk_cert_exams PRIMARY KEY,
    user_id       int              NOT NULL CONSTRAINT fk_cert_exams_user REFERENCES ea.users(id),
    level         varchar(16)      NOT NULL CONSTRAINT df_cert_exams_level DEFAULT ('foundation'),
    attempt_no    int              NOT NULL,
    status        varchar(12)      NOT NULL CONSTRAINT df_cert_exams_status DEFAULT ('in_progress'),
    question_set  nvarchar(max)    NOT NULL,
    started_at    datetime2(3)     NOT NULL,
    completed_at  datetime2(3)     NULL,
    score         int              NULL,
    max_score     int              NULL,
    pct           decimal(5,2)     NULL,
    passed        bit              NULL,
    parts         nvarchar(max)    NULL,
    is_preview    bit              NOT NULL CONSTRAINT df_cert_exams_preview DEFAULT (0),
    CONSTRAINT uq_cert_exams_attempt UNIQUE (user_id, level, attempt_no),
    CONSTRAINT ck_cert_exams_level CHECK (level IN ('foundation', 'practitioner', 'advanced')),
    CONSTRAINT ck_cert_exams_status CHECK (status IN ('in_progress', 'completed')),
    CONSTRAINT ck_cert_exams_attempt CHECK (attempt_no >= 1),
    CONSTRAINT ck_cert_exams_set CHECK (ISJSON(question_set) = 1),
    CONSTRAINT ck_cert_exams_parts CHECK (parts IS NULL OR ISJSON(parts) = 1)
);
GO
/* upgrade: exam-reviewer sittings */
IF COL_LENGTH(N'ea.cert_exams', N'is_preview') IS NULL
    ALTER TABLE ea.cert_exams ADD is_preview bit NOT NULL CONSTRAINT df_cert_exams_preview DEFAULT (0);
GO
/* upgrade from the single-level schema */
IF COL_LENGTH(N'ea.cert_exams', N'level') IS NULL
BEGIN
    ALTER TABLE ea.cert_exams ADD level varchar(16) NOT NULL CONSTRAINT df_cert_exams_level DEFAULT ('foundation')
        CONSTRAINT ck_cert_exams_level CHECK (level IN ('foundation', 'practitioner', 'advanced'));
    ALTER TABLE ea.cert_exams DROP CONSTRAINT uq_cert_exams_attempt;
    IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_cert_exams_user' AND object_id = OBJECT_ID(N'ea.cert_exams'))
        DROP INDEX ix_cert_exams_user ON ea.cert_exams;
END
GO
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = N'uq_cert_exams_attempt')
    ALTER TABLE ea.cert_exams ADD CONSTRAINT uq_cert_exams_attempt UNIQUE (user_id, level, attempt_no);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_cert_exams_user' AND object_id = OBJECT_ID(N'ea.cert_exams'))
    CREATE INDEX ix_cert_exams_user ON ea.cert_exams (user_id, level, status);
GO

IF OBJECT_ID(N'ea.certificates', N'U') IS NULL
CREATE TABLE ea.certificates (
    certificate_id  varchar(32)      NOT NULL CONSTRAINT pk_certificates PRIMARY KEY,
    user_id         int              NOT NULL CONSTRAINT fk_certificates_user REFERENCES ea.users(id),
    level           varchar(16)      NOT NULL CONSTRAINT df_certificates_level DEFAULT ('foundation'),
    exam_id         uniqueidentifier NOT NULL CONSTRAINT fk_certificates_exam REFERENCES ea.cert_exams(id),
    display_name    nvarchar(200)    NOT NULL,
    department      nvarchar(128)    NULL,
    score_pct       decimal(5,2)     NOT NULL,
    issued_at       datetime2(3)     NOT NULL,
    revoked_at      datetime2(3)     NULL,
    CONSTRAINT uq_certificates_user_level UNIQUE (user_id, level),
    CONSTRAINT ck_certificates_level CHECK (level IN ('foundation', 'practitioner', 'advanced'))
);
GO
IF COL_LENGTH(N'ea.certificates', N'level') IS NULL
BEGIN
    ALTER TABLE ea.certificates ADD level varchar(16) NOT NULL CONSTRAINT df_certificates_level DEFAULT ('foundation')
        CONSTRAINT ck_certificates_level CHECK (level IN ('foundation', 'practitioner', 'advanced'));
    IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = N'uq_certificates_user')
        ALTER TABLE ea.certificates DROP CONSTRAINT uq_certificates_user;
END
GO
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = N'uq_certificates_user_level')
    ALTER TABLE ea.certificates ADD CONSTRAINT uq_certificates_user_level UNIQUE (user_id, level);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_certificates_issued' AND object_id = OBJECT_ID(N'ea.certificates'))
    CREATE INDEX ix_certificates_issued ON ea.certificates (issued_at);
GO

IF OBJECT_ID(N'ea.cert_attempt_grants', N'U') IS NULL
CREATE TABLE ea.cert_attempt_grants (
    id          int IDENTITY(1,1) NOT NULL CONSTRAINT pk_cert_attempt_grants PRIMARY KEY,
    user_id     int            NOT NULL CONSTRAINT fk_cert_grants_user REFERENCES ea.users(id),
    level       varchar(16)    NOT NULL CONSTRAINT df_cert_grants_level DEFAULT ('foundation'),
    extra       int            NOT NULL,
    granted_by  int            NULL CONSTRAINT fk_cert_grants_by REFERENCES ea.users(id),
    note        nvarchar(500)  NULL,
    created_at  datetime2(3)   NOT NULL CONSTRAINT df_cert_grants_created DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT ck_cert_grants_extra CHECK (extra BETWEEN 1 AND 3),
    CONSTRAINT ck_cert_grants_level CHECK (level IN ('foundation', 'practitioner', 'advanced'))
);
GO
IF COL_LENGTH(N'ea.cert_attempt_grants', N'level') IS NULL
    ALTER TABLE ea.cert_attempt_grants ADD level varchar(16) NOT NULL CONSTRAINT df_cert_grants_level DEFAULT ('foundation')
        CONSTRAINT ck_cert_grants_level CHECK (level IN ('foundation', 'practitioner', 'advanced'));
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_cert_grants_user' AND object_id = OBJECT_ID(N'ea.cert_attempt_grants'))
    CREATE INDEX ix_cert_grants_user ON ea.cert_attempt_grants (user_id);
GO

IF OBJECT_ID(N'ea.quiz_attempts', N'U') IS NULL
CREATE TABLE ea.quiz_attempts (
    id            uniqueidentifier NOT NULL CONSTRAINT pk_quiz_attempts PRIMARY KEY NONCLUSTERED,
    user_id       int              NOT NULL CONSTRAINT fk_attempts_user  REFERENCES ea.users(id),
    round_id      nvarchar(64)     NOT NULL CONSTRAINT fk_attempts_round REFERENCES ea.quiz_rounds(id),
    session_id    uniqueidentifier NULL     CONSTRAINT fk_attempts_session REFERENCES ea.user_sessions(id),
    started_at    datetime2(3)     NOT NULL,
    completed_at  datetime2(3)     NOT NULL,
    score         int              NOT NULL,
    max_score     int              NOT NULL,
    passed        bit              NOT NULL,
    created_at    datetime2(3)     NOT NULL CONSTRAINT df_attempts_created DEFAULT (SYSUTCDATETIME()),
    cert_exam_id  uniqueidentifier NULL     CONSTRAINT fk_attempts_cert_exam REFERENCES ea.cert_exams(id),  -- part of a certification exam
    CONSTRAINT ck_attempts_score CHECK (score >= 0 AND max_score >= 0 AND score <= max_score)
);
GO
IF COL_LENGTH(N'ea.quiz_attempts', N'cert_exam_id') IS NULL
    ALTER TABLE ea.quiz_attempts ADD cert_exam_id uniqueidentifier NULL CONSTRAINT fk_attempts_cert_exam REFERENCES ea.cert_exams(id);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_attempts_cert_exam' AND object_id = OBJECT_ID(N'ea.quiz_attempts'))
    CREATE INDEX ix_attempts_cert_exam ON ea.quiz_attempts (cert_exam_id) WHERE cert_exam_id IS NOT NULL;
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'cx_attempts_completed' AND object_id = OBJECT_ID(N'ea.quiz_attempts'))
    CREATE CLUSTERED INDEX cx_attempts_completed ON ea.quiz_attempts (completed_at);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_attempts_user_round' AND object_id = OBJECT_ID(N'ea.quiz_attempts'))
    CREATE INDEX ix_attempts_user_round ON ea.quiz_attempts (user_id, round_id) INCLUDE (score, max_score, passed, completed_at);
GO

IF OBJECT_ID(N'ea.quiz_answers', N'U') IS NULL
CREATE TABLE ea.quiz_answers (
    attempt_id      uniqueidentifier NOT NULL CONSTRAINT fk_answers_attempt  REFERENCES ea.quiz_attempts(id) ON DELETE CASCADE,
    question_id     nvarchar(64)     NOT NULL CONSTRAINT fk_answers_question REFERENCES ea.questions(id),
    response        nvarchar(max)    NOT NULL,
    correct         bit              NOT NULL,
    points          int              NOT NULL,
    time_ms         int              NULL,
    client_correct  bit              NULL,      -- what the browser claimed (advisory, kept for diagnostics)
    CONSTRAINT pk_quiz_answers PRIMARY KEY (attempt_id, question_id),
    CONSTRAINT ck_answers_response CHECK (ISJSON(response) = 1)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_answers_question' AND object_id = OBJECT_ID(N'ea.quiz_answers'))
    CREATE INDEX ix_answers_question ON ea.quiz_answers (question_id) INCLUDE (correct);
GO

/* ----------------------------------------------------------------------------
   Sign-off (acknowledgement)
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.signoff_statements', N'U') IS NULL
CREATE TABLE ea.signoff_statements (
    version        nvarchar(32)  NOT NULL CONSTRAINT pk_signoff_statements PRIMARY KEY,
    title          nvarchar(200) NOT NULL,
    body_markdown  nvarchar(max) NOT NULL,
    sha256         char(64)      NOT NULL,   -- lower-case hex SHA-256 of UTF-8 body_markdown (LF line endings)
    active         bit           NOT NULL CONSTRAINT df_statements_active DEFAULT (0),
    published_at   datetime2(3)  NOT NULL CONSTRAINT df_statements_published DEFAULT (SYSUTCDATETIME())
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'uq_statements_one_active' AND object_id = OBJECT_ID(N'ea.signoff_statements'))
    CREATE UNIQUE INDEX uq_statements_one_active ON ea.signoff_statements (active) WHERE active = 1;
GO

IF OBJECT_ID(N'ea.signoffs', N'U') IS NULL
CREATE TABLE ea.signoffs (
    id                 uniqueidentifier NOT NULL CONSTRAINT pk_signoffs PRIMARY KEY NONCLUSTERED,
    receipt_id         varchar(40)      NOT NULL CONSTRAINT uq_signoffs_receipt UNIQUE,
    user_id            int              NOT NULL CONSTRAINT fk_signoffs_user REFERENCES ea.users(id),
    statement_version  nvarchar(32)     NOT NULL CONSTRAINT fk_signoffs_statement REFERENCES ea.signoff_statements(version),
    statement_sha256   char(64)         NOT NULL,
    signed_at          datetime2(3)     NOT NULL,
    otp_challenge_id   uniqueidentifier NULL CONSTRAINT fk_signoffs_otp REFERENCES ea.otp_challenges(id),  -- legacy OTP sign-offs
    verification_method varchar(16)     NOT NULL CONSTRAINT df_signoffs_method DEFAULT ('password'),
    ip                 varchar(45)      NULL,
    user_agent         nvarchar(512)    NULL,
    CONSTRAINT uq_signoffs_user_version UNIQUE (user_id, statement_version),
    CONSTRAINT ck_signoffs_method CHECK (verification_method IN ('password', 'otp'))
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'uq_signoffs_otp_nn' AND object_id = OBJECT_ID(N'ea.signoffs'))
    CREATE UNIQUE INDEX uq_signoffs_otp_nn ON ea.signoffs (otp_challenge_id) WHERE otp_challenge_id IS NOT NULL;
GO
-- Upgrade: password-confirmed sign-off (OTP id becomes optional)
IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = N'uq_signoffs_otp')
    ALTER TABLE ea.signoffs DROP CONSTRAINT uq_signoffs_otp;
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'ea.signoffs') AND name = N'otp_challenge_id' AND is_nullable = 0)
    ALTER TABLE ea.signoffs ALTER COLUMN otp_challenge_id uniqueidentifier NULL;
IF COL_LENGTH(N'ea.signoffs', N'verification_method') IS NULL
    ALTER TABLE ea.signoffs ADD verification_method varchar(16) NOT NULL CONSTRAINT df_signoffs_method DEFAULT ('otp')
        CONSTRAINT ck_signoffs_method CHECK (verification_method IN ('password', 'otp'));
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'cx_signoffs_signed_at' AND object_id = OBJECT_ID(N'ea.signoffs'))
    CREATE CLUSTERED INDEX cx_signoffs_signed_at ON ea.signoffs (signed_at);
GO

/* ----------------------------------------------------------------------------
   Transactional outbox for e-mail (worker polls status = queued)
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.email_outbox', N'U') IS NULL
CREATE TABLE ea.email_outbox (
    id               bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_email_outbox PRIMARY KEY,
    to_email         nvarchar(254)  NOT NULL,
    template         varchar(32)    NOT NULL,
    payload          nvarchar(max)  NOT NULL,
    status           varchar(8)     NOT NULL CONSTRAINT df_outbox_status DEFAULT ('queued'),
    attempts         int            NOT NULL CONSTRAINT df_outbox_attempts DEFAULT (0),
    next_attempt_at  datetime2(3)   NOT NULL CONSTRAINT df_outbox_next DEFAULT (SYSUTCDATETIME()),
    last_error       nvarchar(1000) NULL,
    created_at       datetime2(3)   NOT NULL CONSTRAINT df_outbox_created DEFAULT (SYSUTCDATETIME()),
    sent_at          datetime2(3)   NULL,
    CONSTRAINT ck_outbox_status   CHECK (status IN ('queued', 'sent', 'failed')),
    CONSTRAINT ck_outbox_template CHECK (template IN ('signup_otp', 'reset_otp', 'login_otp', 'signoff_otp', 'signoff_receipt', 'certificate_issued')),
    CONSTRAINT ck_outbox_payload  CHECK (ISJSON(payload) = 1)
);
GO
IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'ck_outbox_template' AND definition NOT LIKE N'%signup_otp%')
    ALTER TABLE ea.email_outbox DROP CONSTRAINT ck_outbox_template;
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'ck_outbox_template')
    ALTER TABLE ea.email_outbox ADD CONSTRAINT ck_outbox_template
        CHECK (template IN ('signup_otp', 'reset_otp', 'login_otp', 'signoff_otp', 'signoff_receipt', 'certificate_issued'));
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_outbox_status_next' AND object_id = OBJECT_ID(N'ea.email_outbox'))
    CREATE INDEX ix_outbox_status_next ON ea.email_outbox (status, next_attempt_at);
GO

/* ----------------------------------------------------------------------------
   Audit log (append-only; grant INSERT/SELECT only to the app role)
   ---------------------------------------------------------------------------- */
IF OBJECT_ID(N'ea.audit_log', N'U') IS NULL
CREATE TABLE ea.audit_log (
    id             bigint IDENTITY(1,1) NOT NULL CONSTRAINT pk_audit_log PRIMARY KEY NONCLUSTERED,
    actor_user_id  int            NULL CONSTRAINT fk_audit_user REFERENCES ea.users(id),
    action         varchar(64)    NOT NULL,
    entity         varchar(64)    NULL,
    entity_id      nvarchar(64)   NULL,
    detail         nvarchar(max)  NULL,
    ip             varchar(45)    NULL,
    created_at     datetime2(3)   NOT NULL CONSTRAINT df_audit_created DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT ck_audit_detail CHECK (detail IS NULL OR ISJSON(detail) = 1)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'cx_audit_created' AND object_id = OBJECT_ID(N'ea.audit_log'))
    CREATE CLUSTERED INDEX cx_audit_created ON ea.audit_log (created_at);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'ix_audit_actor' AND object_id = OBJECT_ID(N'ea.audit_log'))
    CREATE INDEX ix_audit_actor ON ea.audit_log (actor_user_id, created_at);
GO

/* =============================================================================
   Reporting views (Power BI / SSRS friendly). Local time = Asia/Qatar.
   ============================================================================= */
CREATE OR ALTER VIEW ea.v_user_progress AS
WITH active_statement AS (
    SELECT TOP (1) version FROM ea.signoff_statements WHERE active = 1
),
mand_modules AS (
    SELECT id FROM ea.content_modules WHERE mandatory = 1 AND active = 1
),
mand_rounds AS (
    SELECT id FROM ea.quiz_rounds WHERE mandatory = 1 AND active = 1
)
SELECT
    u.id                     AS user_id,
    u.email,
    u.display_name,
    d.name                   AS department,
    u.job_title,
    u.role,
    u.first_login_at,
    u.last_login_at,
    (SELECT COUNT(*) FROM ea.user_sessions s WHERE s.user_id = u.id)                          AS logins,
    (SELECT COUNT(DISTINCT e.ref) FROM ea.events e
       WHERE e.user_id = u.id AND e.type = 'module_complete')                                  AS modules_completed,
    (SELECT COUNT(DISTINCT e.ref) FROM ea.events e JOIN mand_modules m ON m.id = e.ref
       WHERE e.user_id = u.id AND e.type = 'module_complete')                                  AS mandatory_modules_completed,
    (SELECT COUNT(*) FROM mand_modules)                                                        AS mandatory_modules_total,
    (SELECT MAX(CAST(a.score AS decimal(9,2)) * 100 / NULLIF(a.max_score, 0))
       FROM ea.quiz_attempts a WHERE a.user_id = u.id)                                         AS best_score_pct,
    (SELECT COUNT(DISTINCT a.round_id) FROM ea.quiz_attempts a JOIN mand_rounds r ON r.id = a.round_id
       WHERE a.user_id = u.id AND a.passed = 1)                                                AS mandatory_rounds_passed,
    (SELECT COUNT(*) FROM mand_rounds)                                                         AS mandatory_rounds_total,
    (SELECT COUNT(*) FROM ea.cert_exams x WHERE x.user_id = u.id AND x.level = 'foundation')  AS cert_exam_attempts,
    (SELECT MAX(x.pct) FROM ea.cert_exams x WHERE x.user_id = u.id AND x.level = 'foundation' AND x.status = 'completed') AS cert_best_pct,
    (SELECT cp.certificate_id FROM ea.certificates cp WHERE cp.user_id = u.id AND cp.level = 'practitioner' AND cp.revoked_at IS NULL) AS practitioner_certificate_id,
    (SELECT ca.certificate_id FROM ea.certificates ca WHERE ca.user_id = u.id AND ca.level = 'advanced' AND ca.revoked_at IS NULL) AS advanced_certificate_id,
    c.certificate_id,
    c.issued_at              AS certified_at,
    so.signed_at,
    so.receipt_id
FROM ea.users u
LEFT JOIN ea.departments d ON d.id = u.department_id
LEFT JOIN ea.certificates c ON c.user_id = u.id AND c.level = 'foundation' AND c.revoked_at IS NULL
LEFT JOIN ea.signoffs so
       ON so.user_id = u.id
      AND so.statement_version = (SELECT version FROM active_statement)
WHERE u.is_active = 1;
GO

CREATE OR ALTER VIEW ea.v_logins_by_day AS
SELECT
    CAST((s.login_at AT TIME ZONE 'UTC') AT TIME ZONE 'Arab Standard Time' AS date) AS login_date,
    COUNT(*)                  AS logins,
    COUNT(DISTINCT s.user_id) AS unique_users
FROM ea.user_sessions s
GROUP BY CAST((s.login_at AT TIME ZONE 'UTC') AT TIME ZONE 'Arab Standard Time' AS date);
GO

CREATE OR ALTER VIEW ea.v_department_summary AS
SELECT
    COALESCE(p.department, N'(not set)')                                        AS department,
    COUNT(*)                                                                    AS users,
    SUM(CASE WHEN p.mandatory_modules_completed >= p.mandatory_modules_total THEN 1 ELSE 0 END) AS completed_modules_users,
    SUM(CASE WHEN p.mandatory_rounds_passed     >= p.mandatory_rounds_total  THEN 1 ELSE 0 END) AS passed_users,
    SUM(CASE WHEN p.signed_at IS NOT NULL THEN 1 ELSE 0 END)                    AS signed_users,
    CAST(100.0 * SUM(CASE WHEN p.mandatory_modules_completed >= p.mandatory_modules_total THEN 1 ELSE 0 END) / COUNT(*) AS decimal(5,1)) AS completion_pct,
    CAST(AVG(p.best_score_pct) AS decimal(5,1))                                 AS avg_best_score_pct,
    CAST(100.0 * SUM(CASE WHEN p.signed_at IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*) AS decimal(5,1)) AS signed_pct
FROM ea.v_user_progress p
GROUP BY COALESCE(p.department, N'(not set)');
GO

CREATE OR ALTER VIEW ea.v_question_stats AS
SELECT
    q.id        AS question_id,
    q.round_id,
    q.tag,
    q.type,
    COUNT(a.question_id)                                         AS answers,
    SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END)               AS correct_answers,
    CAST(100.0 * SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(a.question_id), 0) AS decimal(5,1)) AS correct_pct
FROM ea.questions q
LEFT JOIN ea.quiz_answers a ON a.question_id = q.id
GROUP BY q.id, q.round_id, q.tag, q.type;
GO

/* =============================================================================
   Seed data (idempotent)
   ============================================================================= */
MERGE ea.departments AS t
USING (VALUES
    ('IS', N'Information Technology', N'إدارة تقنية المعلومات', 10),
    ('PQ', N'Planning & Quality', N'إدارة التخطيط والجودة', 20),
    ('FAA', N'Financial & Administrative Affairs', N'إدارة الشؤون المالية والإدارية', 25),
    ('PRC', N'Public Relations & Communication', N'إدارة العلاقات العامة والاتصال', 27),
    ('TPS', N'Taxpayer Services', N'إدارة خدمات دافعي الضرائب', 30),
    ('CT', N'Consumption Tax', N'إدارة ضريبة الاستهلاك', 35),
    ('TP', N'Tax Policies', N'إدارة السياسات الضريبية', 40),
    ('IT', N'Income Tax', N'إدارة ضريبة الدخل', 50),
    ('TTI', N'Tax Treaties & International Cooperation', N'إدارة الاتفاقيات الضريبية والتعاون الدولي', 55),
    ('TR', N'Tax Revenues', N'إدارة الإيرادات الضريبية', 60),
    ('LA', N'Legal Affairs', N'إدارة الشؤون القانونية', 70),
    ('IA', N'Internal Audit', N'إدارة التدقيق الداخلي', 80),
    ('HR', N'Human Resources', N'إدارة الموارد البشرية', 90),
    ('OTHER', N'Other', N'أخرى', 999)
) AS s (code, name, name_ar, sort_order)
ON t.code = s.code
WHEN NOT MATCHED THEN INSERT (code, name, name_ar, sort_order) VALUES (s.code, s.name, s.name_ar, s.sort_order);
GO

MERGE ea.content_modules AS t
USING (VALUES
    (N'ea-basics',     N'What is Enterprise Architecture?',   N'ما هي البنية المؤسسية؟',        1, 1, 10),
    (N'ea-principles', N'GTA Architecture Principles',        N'مبادئ البنية في الهيئة',         1, 1, 20),
    (N'ea-adm',        N'The Architecture Development Method', N'منهجية تطوير البنية',          1, 1, 30),
    (N'ea-governance', N'Architecture Governance & Review',   N'حوكمة البنية والمراجعة',         1, 1, 40),
    (N'ea-repository', N'Using the EA Repository',            N'استخدام مستودع البنية',          0, 1, 50),
    (N'ea-standards',  N'Technology Standards Catalogue',     N'دليل المعايير التقنية',          0, 1, 60)
) AS s (id, title, title_ar, mandatory, version, sort_order)
ON t.id = s.id
WHEN NOT MATCHED THEN INSERT (id, title, title_ar, mandatory, version, sort_order)
     VALUES (s.id, s.title, s.title_ar, s.mandatory, s.version, s.sort_order);
GO

MERGE ea.quiz_rounds AS t
USING (VALUES
    (N'round-1', N'Round 1 - EA Foundations', 1, 70.00, 10),
    (N'round-2', N'Round 2 - EA in Practice', 0, 70.00, 20)
) AS s (id, title, mandatory, pass_pct, sort_order)
ON t.id = s.id
WHEN NOT MATCHED THEN INSERT (id, title, mandatory, pass_pct, sort_order)
     VALUES (s.id, s.title, s.mandatory, s.pass_pct, s.sort_order);
GO

/* Placeholder questions - the EA team replaces these via `npm run seed:questions`. */
MERGE ea.questions AS t
USING (VALUES
    (N'r1-q01', N'round-1', N'ea-basics',     'mcq',        N'[placeholder] What is the primary purpose of Enterprise Architecture?', 1, N'{"answer":1}'),
    (N'r1-q02', N'round-1', N'ea-principles', 'truefalse',  N'[placeholder] Every new system must be reviewed by the EA team.',       1, N'{"answer":true}'),
    (N'r1-q03', N'round-1', N'ea-adm',        'order',      N'[placeholder] Put the first ADM phases in order.',                       2, N'{"items":["preliminary","vision","business","is"]}'),
    (N'r1-q04', N'round-1', N'ea-adm',        'match',      N'[placeholder] Match each domain to its focus.',                          2, N'{"pairs":[{"l":"business","r":"capabilities"},{"l":"data","r":"entities"},{"l":"application","r":"systems"}]}'),
    (N'r1-q05', N'round-1', N'ea-governance', 'categorize', N'[placeholder] Classify each item as principle or standard.',             2, N'{"items":[{"t":"reuse-before-buy","b":"principle"},{"t":"tls-1.2","b":"standard"},{"t":"data-is-an-asset","b":"principle"}]}'),
    (N'r2-q01', N'round-2', N'ea-repository', 'mcq',        N'[placeholder] Where are architecture decisions recorded?',               1, N'{"answer":2}'),
    (N'r2-q02', N'round-2', N'ea-standards',  'truefalse',  N'[placeholder] Departments may adopt any database engine without review.', 1, N'{"answer":false}'),
    (N'r2-q03', N'round-2', N'ea-governance', 'mcq',        N'[placeholder] Who chairs the Architecture Review Board?',                1, N'{"answer":0}')
) AS s (id, round_id, tag, type, prompt, points, answer_key)
ON t.id = s.id
WHEN NOT MATCHED THEN INSERT (id, round_id, tag, type, prompt, points, answer_key)
     VALUES (s.id, s.round_id, s.tag, s.type, s.prompt, s.points, s.answer_key);
GO

/* Active sign-off statement. sha256 = SHA-256 of the UTF-8 body with LF line endings;
   NCHAR(10) is used so the hash does not depend on how this file was checked out. */
IF NOT EXISTS (SELECT 1 FROM ea.signoff_statements WHERE version = N'2026.1')
INSERT INTO ea.signoff_statements (version, title, body_markdown, sha256, active, published_at)
VALUES (
    N'2026.1',
    N'Enterprise Architecture Awareness - Acknowledgement',
    N'# EA Awareness Acknowledgement' + NCHAR(10) + NCHAR(10)
  + N'I confirm that I have completed the Enterprise Architecture (EA) awareness programme of the General Tax Authority (GTA).' + NCHAR(10) + NCHAR(10)
  + N'- I understand the GTA architecture principles and the architecture governance process.' + NCHAR(10)
  + N'- I will consult the EA team and follow the architecture review process before introducing or changing information systems, integrations, data stores or technology standards.' + NCHAR(10)
  + N'- I will record architecture decisions affecting my systems in the EA repository.' + NCHAR(10) + NCHAR(10)
  + N'_Placeholder statement - to be replaced by the EA team before go-live._',
    '31a28ee76229b01301313b268d0fefac322e988c67c8593db2444949f79009b2',
    1,
    SYSUTCDATETIME()
);
GO

/* =============================================================================
   Application login (run once per environment; replace the placeholders).
   The app uses unqualified table names, so DEFAULT_SCHEMA must be ea.
   =============================================================================
-- CREATE LOGIN ea_hub_app WITH PASSWORD = '<from vault>';            -- or use a gMSA / Entra ID managed identity
-- CREATE USER  ea_hub_app FOR LOGIN ea_hub_app WITH DEFAULT_SCHEMA = ea;
-- GRANT SELECT, INSERT, UPDATE ON SCHEMA::ea TO ea_hub_app;
-- DENY  UPDATE, DELETE ON ea.audit_log TO ea_hub_app;                 -- audit log is append-only
-- DENY  UPDATE, DELETE ON ea.signoffs  TO ea_hub_app;                 -- sign-offs are immutable
*/
