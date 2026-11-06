-- =============================================================================
-- EA Awareness Hub - SQLite schema for local development and tests.
-- Mirrors db/schema.sqlserver.sql (schema `ea` there; unqualified names here).
-- Timestamps are ISO-8601 UTC text ('YYYY-MM-DDTHH:MM:SS.sssZ'), uuids are text,
-- binary values are BLOBs, booleans are 0/1 integers.
-- Applied automatically by the server on start-up (idempotent).
-- =============================================================================
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS departments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code        TEXT    NOT NULL UNIQUE,
    name        TEXT    NOT NULL UNIQUE,
    name_ar     TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 100,
    is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS users (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    email              TEXT    NOT NULL UNIQUE CHECK (email = lower(email)),
    display_name       TEXT    NOT NULL,
    department_id      INTEGER REFERENCES departments(id),
    department_set_at  TEXT,
    job_title          TEXT,
    role               TEXT    NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'ea_team', 'admin')),
    first_login_at     TEXT,
    last_login_at      TEXT,
    is_active          INTEGER NOT NULL DEFAULT 1,
    password_hash      TEXT,                          -- scrypt$N$r$p$saltB64$hashB64; NULL until first-time sign-up
    password_set_at    TEXT,
    failed_logins      INTEGER NOT NULL DEFAULT 0,
    locked_until       TEXT,
    created_at         TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at         TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_users_department ON users (department_id);

CREATE TABLE IF NOT EXISTS otp_challenges (
    id             TEXT    PRIMARY KEY,
    user_email     TEXT    NOT NULL,
    user_id        INTEGER REFERENCES users(id),
    purpose        TEXT    NOT NULL CHECK (purpose IN ('signup', 'reset', 'login', 'signoff')),  -- login/signoff: legacy rows only
    context        TEXT,
    code_hash      BLOB    NOT NULL,
    salt           BLOB    NOT NULL,
    expires_at     TEXT    NOT NULL,
    attempts       INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    max_attempts   INTEGER NOT NULL DEFAULT 5 CHECK (max_attempts > 0),
    consumed_at    TEXT,
    locked_at      TEXT,
    requested_ip   TEXT,
    created_at     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_otp_email_created ON otp_challenges (user_email, purpose, created_at);

CREATE TABLE IF NOT EXISTS user_sessions (
    id            TEXT    PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    login_at      TEXT    NOT NULL,
    last_seen_at  TEXT    NOT NULL,
    logout_at     TEXT,
    ip            TEXT,
    user_agent    TEXT,
    token_jti     TEXT    NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS ix_sessions_login_at   ON user_sessions (login_at);
CREATE INDEX IF NOT EXISTS ix_sessions_user_login ON user_sessions (user_id, login_at);

CREATE TABLE IF NOT EXISTS content_modules (
    id          TEXT    PRIMARY KEY,
    title       TEXT    NOT NULL,
    title_ar    TEXT,
    mandatory   INTEGER NOT NULL DEFAULT 1,
    version     INTEGER NOT NULL DEFAULT 1,
    sort_order  INTEGER NOT NULL DEFAULT 100,
    active      INTEGER NOT NULL DEFAULT 1,
    track       TEXT    NOT NULL DEFAULT 'ea' CHECK (track IN ('ea', 'togaf', 'kbf', 'kbp', 'kba'))   -- learning track used for exam eligibility (kb* = knowledge-base articles by level)
);

CREATE TABLE IF NOT EXISTS quiz_rounds (
    id                     TEXT    PRIMARY KEY,
    title                  TEXT    NOT NULL,
    mandatory              INTEGER NOT NULL DEFAULT 1,
    pass_pct               REAL    NOT NULL DEFAULT 70 CHECK (pass_pct BETWEEN 0 AND 100),
    questions_per_attempt  INTEGER,
    level                  TEXT    NOT NULL DEFAULT 'foundation' CHECK (level IN ('foundation', 'practitioner', 'advanced')),  -- certification path the round belongs to
    sort_order             INTEGER NOT NULL DEFAULT 100,
    active                 INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS questions (
    id          TEXT    PRIMARY KEY,
    round_id    TEXT    NOT NULL REFERENCES quiz_rounds(id),
    tag         TEXT,
    type        TEXT    NOT NULL CHECK (type IN ('mcq', 'truefalse', 'order', 'match', 'categorize')),
    prompt      TEXT,
    points      INTEGER NOT NULL DEFAULT 1 CHECK (points >= 0),
    answer_key  TEXT    NOT NULL CHECK (json_valid(answer_key)),
    active      INTEGER NOT NULL DEFAULT 1,
    updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_questions_round ON questions (round_id, active);

CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    session_id  TEXT    REFERENCES user_sessions(id),
    type        TEXT    NOT NULL CHECK (type IN ('module_view', 'module_complete', 'kb_view', 'kb_search', 'adm_phase_view', 'download')),
    ref         TEXT,
    meta        TEXT    CHECK (meta IS NULL OR json_valid(meta)),
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_events_type_created ON events (type, created_at);
CREATE INDEX IF NOT EXISTS ix_events_user_type    ON events (user_id, type);

-- Certification exam sittings (one row per attempt, per level; in progress or completed);
-- question_set = {"<roundId>": ["<questionId>", ...]} issued by the server at start.
CREATE TABLE IF NOT EXISTS cert_exams (
    id            TEXT    PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    level         TEXT    NOT NULL DEFAULT 'foundation' CHECK (level IN ('foundation', 'practitioner', 'advanced')),
    attempt_no    INTEGER NOT NULL CHECK (attempt_no >= 1),
    status        TEXT    NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    question_set  TEXT    NOT NULL CHECK (json_valid(question_set)),
    started_at    TEXT    NOT NULL,
    completed_at  TEXT,
    score         INTEGER,
    max_score     INTEGER,
    pct           REAL,
    passed        INTEGER,
    parts         TEXT    CHECK (parts IS NULL OR json_valid(parts)),
    is_preview    INTEGER NOT NULL DEFAULT 0 CHECK (is_preview IN (0, 1)),  -- 1 = exam-reviewer sitting (never certifies, excluded from reporting)
    UNIQUE (user_id, level, attempt_no)
);
CREATE INDEX IF NOT EXISTS ix_cert_exams_user ON cert_exams (user_id, level, status);

CREATE TABLE IF NOT EXISTS certificates (
    certificate_id  TEXT    PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id),
    level           TEXT    NOT NULL DEFAULT 'foundation' CHECK (level IN ('foundation', 'practitioner', 'advanced')),
    exam_id         TEXT    NOT NULL REFERENCES cert_exams(id),
    display_name    TEXT    NOT NULL,
    department      TEXT,
    score_pct       REAL    NOT NULL,
    issued_at       TEXT    NOT NULL,
    revoked_at      TEXT,
    UNIQUE (user_id, level)
);
CREATE INDEX IF NOT EXISTS ix_certificates_issued ON certificates (issued_at);

CREATE TABLE IF NOT EXISTS cert_attempt_grants (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    level       TEXT    NOT NULL DEFAULT 'foundation' CHECK (level IN ('foundation', 'practitioner', 'advanced')),
    extra       INTEGER NOT NULL CHECK (extra BETWEEN 1 AND 3),
    granted_by  INTEGER REFERENCES users(id),
    note        TEXT,
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_cert_grants_user ON cert_attempt_grants (user_id);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id            TEXT    PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    round_id      TEXT    NOT NULL REFERENCES quiz_rounds(id),
    session_id    TEXT    REFERENCES user_sessions(id),
    started_at    TEXT    NOT NULL,
    completed_at  TEXT    NOT NULL,
    score         INTEGER NOT NULL,
    max_score     INTEGER NOT NULL,
    passed        INTEGER NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    cert_exam_id  TEXT    REFERENCES cert_exams(id),   -- set when the attempt is one part of a certification exam
    CHECK (score >= 0 AND max_score >= 0 AND score <= max_score)
);
CREATE INDEX IF NOT EXISTS ix_attempts_cert_exam ON quiz_attempts (cert_exam_id);
CREATE INDEX IF NOT EXISTS ix_attempts_user_round ON quiz_attempts (user_id, round_id);
CREATE INDEX IF NOT EXISTS ix_attempts_completed  ON quiz_attempts (completed_at);

CREATE TABLE IF NOT EXISTS quiz_answers (
    attempt_id      TEXT    NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id     TEXT    NOT NULL REFERENCES questions(id),
    response        TEXT    NOT NULL CHECK (json_valid(response)),
    correct         INTEGER NOT NULL,
    points          INTEGER NOT NULL,
    time_ms         INTEGER,
    client_correct  INTEGER,
    PRIMARY KEY (attempt_id, question_id)
);
CREATE INDEX IF NOT EXISTS ix_answers_question ON quiz_answers (question_id);

CREATE TABLE IF NOT EXISTS signoff_statements (
    version        TEXT    PRIMARY KEY,
    title          TEXT    NOT NULL,
    body_markdown  TEXT    NOT NULL,
    sha256         TEXT    NOT NULL,
    active         INTEGER NOT NULL DEFAULT 0,
    published_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_statements_one_active ON signoff_statements (active) WHERE active = 1;

CREATE TABLE IF NOT EXISTS signoffs (
    id                 TEXT    PRIMARY KEY,
    receipt_id         TEXT    NOT NULL UNIQUE,
    user_id            INTEGER NOT NULL REFERENCES users(id),
    statement_version  TEXT    NOT NULL REFERENCES signoff_statements(version),
    statement_sha256   TEXT    NOT NULL,
    signed_at          TEXT    NOT NULL,
    otp_challenge_id   TEXT    UNIQUE REFERENCES otp_challenges(id),   -- legacy OTP-confirmed sign-offs
    verification_method TEXT   NOT NULL DEFAULT 'password' CHECK (verification_method IN ('password', 'otp')),
    ip                 TEXT,
    user_agent         TEXT,
    UNIQUE (user_id, statement_version)
);
CREATE INDEX IF NOT EXISTS ix_signoffs_signed_at ON signoffs (signed_at);

CREATE TABLE IF NOT EXISTS email_outbox (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    to_email         TEXT    NOT NULL,
    template         TEXT    NOT NULL CHECK (template IN ('signup_otp', 'reset_otp', 'login_otp', 'signoff_otp', 'signoff_receipt', 'certificate_issued')),
    payload          TEXT    NOT NULL CHECK (json_valid(payload)),
    status           TEXT    NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
    attempts         INTEGER NOT NULL DEFAULT 0,
    next_attempt_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    last_error       TEXT,
    created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    sent_at          TEXT
);
CREATE INDEX IF NOT EXISTS ix_outbox_status_next ON email_outbox (status, next_attempt_at);

CREATE TABLE IF NOT EXISTS audit_log (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_user_id  INTEGER REFERENCES users(id),
    action         TEXT    NOT NULL,
    entity         TEXT,
    entity_id      TEXT,
    detail         TEXT    CHECK (detail IS NULL OR json_valid(detail)),
    ip             TEXT,
    created_at     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ix_audit_created ON audit_log (created_at);
CREATE INDEX IF NOT EXISTS ix_audit_actor   ON audit_log (actor_user_id, created_at);

-- -----------------------------------------------------------------------------
-- Reporting views (local time = Asia/Qatar = UTC+3, no DST)
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS v_department_summary;
DROP VIEW IF EXISTS v_user_progress;
CREATE VIEW v_user_progress AS
SELECT
    u.id            AS user_id,
    u.email,
    u.display_name,
    d.name          AS department,
    u.job_title,
    u.role,
    u.first_login_at,
    u.last_login_at,
    (SELECT COUNT(*) FROM user_sessions s WHERE s.user_id = u.id) AS logins,
    (SELECT COUNT(DISTINCT e.ref) FROM events e
       WHERE e.user_id = u.id AND e.type = 'module_complete') AS modules_completed,
    (SELECT COUNT(DISTINCT e.ref) FROM events e
       JOIN content_modules m ON m.id = e.ref AND m.mandatory = 1 AND m.active = 1
       WHERE e.user_id = u.id AND e.type = 'module_complete') AS mandatory_modules_completed,
    (SELECT COUNT(*) FROM content_modules WHERE mandatory = 1 AND active = 1) AS mandatory_modules_total,
    (SELECT MAX(a.score * 100.0 / NULLIF(a.max_score, 0)) FROM quiz_attempts a
       WHERE a.user_id = u.id) AS best_score_pct,
    (SELECT COUNT(DISTINCT a.round_id) FROM quiz_attempts a
       JOIN quiz_rounds r ON r.id = a.round_id AND r.mandatory = 1 AND r.active = 1
       WHERE a.user_id = u.id AND a.passed = 1) AS mandatory_rounds_passed,
    (SELECT COUNT(*) FROM quiz_rounds WHERE mandatory = 1 AND active = 1) AS mandatory_rounds_total,
    (SELECT COUNT(*) FROM cert_exams x WHERE x.user_id = u.id AND x.level = 'foundation') AS cert_exam_attempts,
    (SELECT MAX(x.pct) FROM cert_exams x WHERE x.user_id = u.id AND x.level = 'foundation' AND x.status = 'completed') AS cert_best_pct,
    (SELECT cp.certificate_id FROM certificates cp WHERE cp.user_id = u.id AND cp.level = 'practitioner' AND cp.revoked_at IS NULL) AS practitioner_certificate_id,
    (SELECT ca.certificate_id FROM certificates ca WHERE ca.user_id = u.id AND ca.level = 'advanced' AND ca.revoked_at IS NULL) AS advanced_certificate_id,
    c.certificate_id,
    c.issued_at     AS certified_at,
    so.signed_at,
    so.receipt_id
FROM users u
LEFT JOIN departments d ON d.id = u.department_id
LEFT JOIN certificates c ON c.user_id = u.id AND c.level = 'foundation' AND c.revoked_at IS NULL
LEFT JOIN signoffs so
       ON so.user_id = u.id
      AND so.statement_version = (SELECT version FROM signoff_statements WHERE active = 1 LIMIT 1)
WHERE u.is_active = 1;

DROP VIEW IF EXISTS v_logins_by_day;
CREATE VIEW v_logins_by_day AS
SELECT
    date(s.login_at, '+3 hours') AS login_date,
    COUNT(*)                     AS logins,
    COUNT(DISTINCT s.user_id)    AS unique_users
FROM user_sessions s
GROUP BY date(s.login_at, '+3 hours');

CREATE VIEW v_department_summary AS
SELECT
    COALESCE(p.department, '(not set)') AS department,
    COUNT(*) AS users,
    SUM(CASE WHEN p.mandatory_modules_completed >= p.mandatory_modules_total THEN 1 ELSE 0 END) AS completed_modules_users,
    SUM(CASE WHEN p.mandatory_rounds_passed     >= p.mandatory_rounds_total  THEN 1 ELSE 0 END) AS passed_users,
    SUM(CASE WHEN p.signed_at IS NOT NULL THEN 1 ELSE 0 END) AS signed_users,
    ROUND(100.0 * SUM(CASE WHEN p.mandatory_modules_completed >= p.mandatory_modules_total THEN 1 ELSE 0 END) / COUNT(*), 1) AS completion_pct,
    ROUND(AVG(p.best_score_pct), 1) AS avg_best_score_pct,
    ROUND(100.0 * SUM(CASE WHEN p.signed_at IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*), 1) AS signed_pct
FROM v_user_progress p
GROUP BY COALESCE(p.department, '(not set)');

DROP VIEW IF EXISTS v_question_stats;
CREATE VIEW v_question_stats AS
SELECT
    q.id AS question_id,
    q.round_id,
    q.tag,
    q.type,
    COUNT(a.question_id) AS answers,
    SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) AS correct_answers,
    ROUND(100.0 * SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(a.question_id), 0), 1) AS correct_pct
FROM questions q
LEFT JOIN quiz_answers a ON a.question_id = q.id
GROUP BY q.id, q.round_id, q.tag, q.type;

-- -----------------------------------------------------------------------------
-- Seed data (idempotent)
-- -----------------------------------------------------------------------------
INSERT OR IGNORE INTO departments (code, name, name_ar, sort_order) VALUES
    ('IS', 'Information Technology', 'إدارة تقنية المعلومات', 10),
    ('PQ', 'Planning & Quality', 'إدارة التخطيط والجودة', 20),
    ('FAA', 'Financial & Administrative Affairs', 'إدارة الشؤون المالية والإدارية', 25),
    ('PRC', 'Public Relations & Communication', 'إدارة العلاقات العامة والاتصال', 27),
    ('TPS', 'Taxpayer Services', 'إدارة خدمات دافعي الضرائب', 30),
    ('CT', 'Consumption Tax', 'إدارة ضريبة الاستهلاك', 35),
    ('TP', 'Tax Policies', 'إدارة السياسات الضريبية', 40),
    ('IT', 'Income Tax', 'إدارة ضريبة الدخل', 50),
    ('TTI', 'Tax Treaties & International Cooperation', 'إدارة الاتفاقيات الضريبية والتعاون الدولي', 55),
    ('TR', 'Tax Revenues', 'إدارة الإيرادات الضريبية', 60),
    ('LA', 'Legal Affairs', 'إدارة الشؤون القانونية', 70),
    ('IA', 'Internal Audit', 'إدارة التدقيق الداخلي', 80),
    ('HR', 'Human Resources', 'إدارة الموارد البشرية', 90),
    ('OTHER', 'Other', 'أخرى', 999);

INSERT OR IGNORE INTO content_modules (id, title, title_ar, mandatory, version, sort_order) VALUES
    ('ea-basics',     'What is Enterprise Architecture?',    'ما هي البنية المؤسسية؟',   1, 1, 10),
    ('ea-principles', 'GTA Architecture Principles',         'مبادئ البنية في الهيئة',    1, 1, 20),
    ('ea-adm',        'The Architecture Development Method', 'منهجية تطوير البنية',      1, 1, 30),
    ('ea-governance', 'Architecture Governance & Review',    'حوكمة البنية والمراجعة',    1, 1, 40),
    ('ea-repository', 'Using the EA Repository',             'استخدام مستودع البنية',     0, 1, 50),
    ('ea-standards',  'Technology Standards Catalogue',      'دليل المعايير التقنية',     0, 1, 60);

INSERT OR IGNORE INTO quiz_rounds (id, title, mandatory, pass_pct, sort_order) VALUES
    ('round-1', 'Round 1 - EA Foundations', 1, 70, 10),
    ('round-2', 'Round 2 - EA in Practice', 0, 70, 20);

INSERT OR IGNORE INTO questions (id, round_id, tag, type, prompt, points, answer_key) VALUES
    ('r1-q01', 'round-1', 'ea-basics',     'mcq',        '[placeholder] What is the primary purpose of Enterprise Architecture?', 1, '{"answer":1}'),
    ('r1-q02', 'round-1', 'ea-principles', 'truefalse',  '[placeholder] Every new system must be reviewed by the EA team.',       1, '{"answer":true}'),
    ('r1-q03', 'round-1', 'ea-adm',        'order',      '[placeholder] Put the first ADM phases in order.',                       2, '{"items":["preliminary","vision","business","is"]}'),
    ('r1-q04', 'round-1', 'ea-adm',        'match',      '[placeholder] Match each domain to its focus.',                          2, '{"pairs":[{"l":"business","r":"capabilities"},{"l":"data","r":"entities"},{"l":"application","r":"systems"}]}'),
    ('r1-q05', 'round-1', 'ea-governance', 'categorize', '[placeholder] Classify each item as principle or standard.',             2, '{"items":[{"t":"reuse-before-buy","b":"principle"},{"t":"tls-1.2","b":"standard"},{"t":"data-is-an-asset","b":"principle"}]}'),
    ('r2-q01', 'round-2', 'ea-repository', 'mcq',        '[placeholder] Where are architecture decisions recorded?',               1, '{"answer":2}'),
    ('r2-q02', 'round-2', 'ea-standards',  'truefalse',  '[placeholder] Departments may adopt any database engine without review.', 1, '{"answer":false}'),
    ('r2-q03', 'round-2', 'ea-governance', 'mcq',        '[placeholder] Who chairs the Architecture Review Board?',                1, '{"answer":0}');

INSERT OR IGNORE INTO signoff_statements (version, title, body_markdown, sha256, active) VALUES (
    '2026.1',
    'Enterprise Architecture Awareness - Acknowledgement',
    '# EA Awareness Acknowledgement' || char(10) || char(10)
    || 'I confirm that I have completed the Enterprise Architecture (EA) awareness programme of the General Tax Authority (GTA).' || char(10) || char(10)
    || '- I understand the GTA architecture principles and the architecture governance process.' || char(10)
    || '- I will consult the EA team and follow the architecture review process before introducing or changing information systems, integrations, data stores or technology standards.' || char(10)
    || '- I will record architecture decisions affecting my systems in the EA repository.' || char(10) || char(10)
    || '_Placeholder statement - to be replaced by the EA team before go-live._',
    '31a28ee76229b01301313b268d0fefac322e988c67c8593db2444949f79009b2',
    1
);
