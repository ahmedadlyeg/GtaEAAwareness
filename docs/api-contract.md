# EA Awareness Hub — API contract (v1)

Single source of truth shared by the front end (`js/api.js`) and the reference
server (`server/`). Base path: `/api/v1`. JSON in, JSON out. Times are ISO-8601 UTC.

Authentication: GTA staff **sign up once** with their GTA email — the server
emails a 6-digit one-time code, verifying it returns a short-lived set-password
token, and the user chooses a password. From then on they **sign in with GTA
email + password**, which returns a bearer token (JWT, 8h). A forgotten
password is reset the same way (code → new password). Every call below except
`/auth/otp/*`, `/auth/password`, `/auth/login` and `/cert/verify/:id` needs
`Authorization: Bearer <token>`. `/admin/*` needs role `admin` or `ea_team`.

Allowed email domains come from server config (`ALLOWED_EMAIL_DOMAINS`,
default `gta.gov.qa`). Code rules: 6 digits, stored only as a salted hash,
valid 10 minutes, max 5 verify attempts, max 3 requests per email per purpose
per 15 min. Passwords: stored as scrypt hashes (`scrypt$N$r$p$salt$hash`);
policy 10–128 characters, at least one letter and one digit, must not contain
the email name (part before `@`), not a common password. After
`LOGIN_MAX_FAILURES` (5) consecutive wrong passwords the account is locked for
`LOGIN_LOCK_MIN` (15) minutes; a successful sign-in or a reset clears it.
`/auth/otp/*`, `/auth/password` and `/auth/login` share a per-IP rate limit
(`RATE_LIMIT_AUTH` per 15 min).

## Auth
| Method | Path | Body | Response |
|---|---|---|---|
| POST | /auth/otp/request | `{ email, purpose: "signup" \| "reset" }` (default `signup`) | `202 { challengeId, expiresAt, maskedEmail }`. `signup` for an email that already has a password → `409 account_exists`. `reset` always answers 202 (no account enumeration) but only sends a code when the account exists and has a password. `purpose: "login"` is no longer accepted (`400 validation`). |
| POST | /auth/otp/verify | `{ challengeId, code }` | `200 { setupToken, purpose: "signup"\|"reset", email }` — no session yet. `setupToken` is a JWT (15 min, `SETUP_TOKEN_TTL_MIN`), usable once. |
| POST | /auth/password | `{ setupToken, password }` | `200 { token, user, expiresAt }` — sign-up: provisions the user if new and sets the password; reset: replaces the password and clears any lock. Opens a session (row in `user_sessions`: login time, IP, UA). Errors: `400 weak_password`, `401 unauthorized` (bad/expired/used token), `409 account_exists` (sign-up token for an account that meanwhile has a password). |
| POST | /auth/login | `{ email, password }` | `200 { token, user, expiresAt }` + session row. Errors: `401 invalid_credentials` (wrong password or unknown email — same message), `409 password_not_set` (account exists without a password: finish sign-up with a code), `423 account_locked`, `403 forbidden` (disabled). |
| POST | /auth/password/change | `{ currentPassword, newPassword }` (signed in) | `204`. Wrong current password → `401 invalid_credentials` (counts towards the lock); `400 weak_password`. |
| POST | /auth/logout | – | `204` — closes the session row (`logout_at`) |
| POST | /auth/heartbeat | – | `204` — updates `last_seen_at` on the session (front end calls every 60 s while visible) |

`user` = `{ id, email, displayName, department, jobTitle, role: "staff"|"ea_team"|"admin", firstLoginAt, reviewer: boolean }` — `reviewer` is true for addresses in `REVIEWER_EMAILS` (see *Exam reviewer accounts*).

Sign-up auto-provisions the user (displayName derived from the email local part
until HR/AD sync fills it). Department may be set by the user once via
`PATCH /me`. Administrators can set a password from the server console with
`npm run set-password -- <email> <password>` (same policy).

## Me and progress
| Method | Path | Body | Response |
|---|---|---|---|
| GET | /me | – | `{ user, progress }` |
| PATCH | /me | `{ displayName?, department?, jobTitle? }` | `{ user }` |
| GET | /me/progress | – | `progress` |
| POST | /events | `{ type, ref, meta? }` | `204` |

`type` ∈ `module_view`, `module_complete`, `kb_view`, `kb_search`, `adm_phase_view`, `download`.
`progress` = `{ modulesCompleted: [moduleId], kbViewed: n, attempts: [{ roundId, bestScore, maxScore, lastAt, passed }], signoff: null | { statementVersion, signedAt, receiptId }, certification, certifications }` — see *Certification*: `certification` = the foundation level (unchanged), `certifications` = `{ foundation, practitioner, advanced }`.

Module ids: EA Foundation modules (`m1`, `mgea`, …, track `ea`), TOGAF
topics (`togaf:t-structure` … `togaf:t-glossary`, track `togaf`) and
knowledge-base articles (`kb:<articleId>`, track `kbf` / `kbp` / `kba` by the
article's level Foundation / Practitioner / Advanced; never mandatory). A
`module_complete` event with one of these refs marks it complete.

## Assessment
| Method | Path | Body | Response |
|---|---|---|---|
| POST | /quiz/attempts | `attempt` | `201 { attemptId, score, maxScore, passed }` |
| GET | /quiz/attempts | – | `[attempt summary]` for the current user |

`attempt` = `{ roundId, startedAt, completedAt, answers: [{ questionId, response, correct, points, timeMs }] }`
The server re-scores `correct` / `points` against its own copy of the answer
key (`questions` table) — client values are advisory only. Pass mark: 70 %.

## Certification paths (Foundation → Practitioner → Advanced)
Rules (server config, env-overridable, shared by all levels): `CERT_UNLOCK_PCT` 80,
`CERT_PASS_PCT` 70, `CERT_MAX_ATTEMPTS` 3 per level (first sitting + 2 retakes;
admins can grant more per level). Levels (`config.certLevels`, mirroring
`js/config.js` `certification.levels`):

| level | title | requires | tracks (each ≥ 80 %) | exam parts (questions per sitting) | ID prefix |
|---|---|---|---|---|---|
| `foundation` | Enterprise Architecture Foundation | – | `ea`, `togaf` | `x-ea` 14, `x-togaf` 10, `x-kb` 10 | `GTA-EAF` (`CERT_PREFIX`) |
| `practitioner` | Enterprise Architecture Practitioner | foundation certificate | `kbp` | `x-prac-a` 10, `x-prac-b` 10 | `GTA-EAP` (`CERT_PREFIX_PRACTITIONER`) |
| `advanced` | Enterprise Architecture Advanced | practitioner certificate | `kba` | `x-adv` 15 | `GTA-EAA` (`CERT_PREFIX_ADVANCED`) |

* **Unlock** — the prerequisite certificate is held **and** every track of the
  level is ≥ 80 % complete (each separately; an empty track counts as 100 %).
* **Exam** — the active rounds whose `quiz_rounds.level` is the level, sampled at
  random from each pool (`questions_per_attempt`). The server issues the set;
  starting a sitting consumes an attempt of that level; an unfinished sitting is
  resumed, never re-issued.
* **Pass** — overall score (all parts) ≥ 70 % → one certificate per user **per
  level**. Each part is also stored as a `quiz_attempts` row (with
  `cert_exam_id`) so question statistics keep working.

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | /cert | user | – | `{ levels: { foundation, practitioner, advanced } }` (same as `progress.certifications`) |
| POST | /cert/exams | user | `{ level? }` (default `foundation`) | `201` new / `200` resumed: `{ examId, level, attemptNo, maxAttempts, attemptsLeft, startedAt, parts: [{ roundId, questionIds }], resumed }` |
| POST | /cert/exams/:examId/submit | user | `{ completedAt?, parts: [{ roundId, answers: [{ questionId, response, timeMs? }] }] }` | `200 { examId, level, attemptNo, score, maxScore, pct, passed, parts: [{ roundId, score, maxScore, pct }], attemptsLeft, certificate: null \| certificateDto }` |
| GET | /cert/verify/:certificateId | **public** | – | `200 { valid: true, ...certificateDto }` or `404 { valid: false }` |
| POST | /admin/users/:userId/cert-attempts | admin, ea_team | `{ extra: 1..3, note?, level? }` (default `foundation`) | `{ level, attemptsUsed, maxAttempts }` (grants extra sittings for that level; audited) |

Errors: `400 validation` (unknown `level`), `403 exam_locked` (prerequisite
certificate missing — the message names it — or reading below the unlock
threshold — the message gives the counts), `403 attempts_exhausted`, `409 already_certified`, `409 exam_closed`
(sitting already submitted), `400 validation` (answers must cover exactly the
issued questions, no more, no fewer), `404 not_found` (unknown / other user's exam).
On pass the server queues the `certificate_issued` e-mail and audits `cert.issue`.

```
certification (one level) = {
  level, title,         // e.g. "practitioner", "Enterprise Architecture Practitioner"
  requires,             // null | prerequisite level
  prerequisiteMet,      // prerequisite certificate held (true when requires is null)
  unlockPct, passPct,
  maxAttempts,          // CERT_MAX_ATTEMPTS + admin grants for this level
  attemptsUsed,         // sittings of this level started (completed or in progress)
  eligible,             // prerequisite met AND unlock rule met
  track: { <trackId>: { done, total, pct } },   // only this level's tracks: foundation {ea, togaf}, practitioner {kbp}, advanced {kba}
  inProgress: null | { examId, attemptNo, startedAt, parts: [{ roundId, questionIds }] },
  exams: [{ examId, attemptNo, startedAt, completedAt, score, maxScore, pct, passed, parts: [{ roundId, score, maxScore, pct }] }],  // completed, newest first
  certificate: null | certificateDto
}
certificateDto = { certificateId, level, title, issuedAt, scorePct, displayName, department }   // e.g. GTA-EAF-2026-7K3QX9, GTA-EAP-…, GTA-EAA-…
```

### Exam reviewer accounts

Addresses listed in `REVIEWER_EMAILS` (default `exam.reviewer@gta.gov.qa`) are exam reviewers, for checking the question bank:

- Every level object in `progress.certifications` (and `progress.certification`) has `preview: true`, `prerequisiteMet: true`, `eligible: true`, `maxAttempts: 99` and `certificate: null`, whatever the reading progress or certificates.
- `POST /cert/exams` works for every level at any time (resumes an open sitting as usual) and never returns `already_certified` or `exam_locked`; start and submit responses add `preview: true`.
- Submissions are scored normally and stored (`cert_exams.is_preview = 1`) but never issue a certificate or send the certificate e-mail; `attemptsLeft = 99 − attemptsUsed`.
- `POST /signoff` → `409 preconditions_not_met` ("Reviewer accounts cannot sign the acknowledgement").
- Reviewers are excluded from `/admin/dashboard` (every KPI, chart, list and question statistic), `/admin/users` and every `/admin/export` kind.
- Create or refresh the account with `npm run create-reviewer [-- <email> <password>]` (default password `GtaExams2026!`); `npm run seed:demo` runs it automatically.

## Sign-off (acknowledgement)
| Method | Path | Body | Response |
|---|---|---|---|
| GET | /signoff/statement | – | `{ version, title, bodyMarkdown, sha256 }` (active statement) |
| POST | /signoff | `{ password, statementVersion, sha256 }` | `201 { receiptId, signedAt }` — the user's password confirms the signature (`401 invalid_credentials` if wrong; counts towards the lock; `423 account_locked`). |
| POST | /signoff/otp | – | `410 gone` — sign-off codes are no longer used. |

Checks run in this order: password present (`400 validation`), statement
version and sha256 match the active statement (`409 statement_mismatch`),
not already signed and pre-condition met (`409 preconditions_not_met`), then
the password. The `signoffs` row records `verification_method = 'password'`
(older rows: `'otp'` with their `otp_challenge_id`).

Pre-condition enforced server-side: the user holds a valid EA Foundation
certificate (Practitioner / Advanced are not required) (otherwise `409 preconditions_not_met`). On success the server queues a
confirmation email (receipt id, statement version, timestamp) in
`email_outbox` and writes `audit_log`.

## Admin dashboard
| Method | Path | Query | Response |
|---|---|---|---|
| GET | /admin/dashboard | `from, to, department?` | `dashboard` |
| GET | /admin/users | `q?, department?, status?` (`signed`, `certified`/`passed`, `in_progress`, `not_started`, `pending`) | `[{ user, lastLoginAt, logins, modulesCompleted, bestScore, examAttempts, certificateId, signedAt, status }]` |
| GET | /admin/export | `kind=employees|users|attempts|signoffs|sessions`, `from?, to?, department?` | `text/csv` (`employees` = the `employees` rows below) |

`dashboard` =
```
{
  kpis: { enrolled, activeUsers, logins, avgScorePct, passRatePct, signoffRatePct, avgMinutesPerUser,
          certified, certifiedRatePct, examAttempts,
          certifiedByLevel: { foundation, practitioner, advanced } },
  loginsByDay:      [{ date, logins, uniqueUsers }],
  loginHeatmap:     [[n x 24] x 7]   // Sun..Sat × hour (Asia/Qatar)
  funnel:           { enrolled, startedLearning, examUnlocked, certified, signedOff,
                      completedModules /* = examUnlocked */, passedAssessment /* = certified */ },
  byDepartment:     [{ department, users, completionPct /* exam unlocked */, avgScorePct, certifiedPct, signedPct }],
  scoreDistribution:[{ bucket: "0-49"|"50-59"|"60-69"|"70-79"|"80-89"|"90-100", count }],
  questionStats:    [{ questionId, tag, attempts, correctPct }],
  moduleViews:      [{ moduleId, title, views, completions }],
  recentSignoffs:   [{ displayName, department, signedAt, receiptId }],
  deptAccess:       [{ department, users, activeUsers, logins, minutes, certified }],      // by logins desc
  topUsersByAccess: [{ userId, displayName, department, logins, minutes, lastSeenAt }],     // top 10 by logins, then minutes
  topScorers:       [{ userId, displayName, department, bestPct, attempts, certified, certifiedAt }], // foundation; top 10 by best exam %, earlier first on ties
  topScorersByLevel:{ foundation: [...], practitioner: [...], advanced: [...] },             // same row shape, top 10 each
  levels:           [{ level, title, unlocked, certified, attempts /* sittings started in the window */ }],
  employees:        [{ userId, displayName, email, department, eaPct, togafPct, kbRead, examAttempts, maxAttempts,
                       bestPct, certified, certificateId, signed, logins, minutes, lastSeenAt,   // foundation fields
                       kbpPct, kbaPct,
                       levels: { foundation|practitioner|advanced: { certified, certificateId, bestPct, attempts, maxAttempts, eligible } } }], // by name
  departments:      [name]
}
```
`moduleViews` covers EA modules and TOGAF topics only (not `kb:` articles).
Single-level fields (`kpis` scores, `funnel`, `topScorers`, employee `bestPct`,
`examAttempts`, `certified`, `certificateId`) refer to the **foundation** level.
Export `kind=employees` adds `kbp_pct, kba_pct, practitioner_certified,
practitioner_best_pct, practitioner_attempts, advanced_certified,
advanced_best_pct, advanced_attempts`.
Scores (`avgScorePct`, `scoreDistribution`, `bestPct`) are certification-exam
scores: each person's best completed sitting (overall %). `avgScorePct` and
`scoreDistribution` use sittings completed in the window; `passRatePct` = exam
takers in the window who were certified in the window. `logins` / `minutes`
are within the window; progress (`eaPct`, `togafPct`, `kbRead`, certification)
and `lastSeenAt` are cumulative up to `to`.

## Errors
`{ error: { code, message } }` with codes `invalid_domain`, `rate_limited`,
`otp_expired`, `otp_invalid`, `otp_locked`, `unauthorized`, `forbidden`,
`invalid_credentials` (401), `password_not_set` (409), `account_exists` (409),
`account_locked` (423), `weak_password` (400), `gone` (410),
`preconditions_not_met`, `statement_mismatch`, `validation`, `not_found`,
`exam_locked`, `attempts_exhausted`, `already_certified`, `exam_closed`.
