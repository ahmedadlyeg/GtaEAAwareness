# GTA EA Awareness Hub — Build & Test Report

**Date:** 2026-11-06
**Environment:** Windows 11, Node.js v24.18.0, npm 11.16.0
**Database:** SQLite (`better-sqlite3` 12.11.1) — file `server/data/ea-hub.db`
**App:** Node.js / Express backend serving the vanilla-JS SPA + REST API at `/api/v1`

---

## 1. Summary

| Result | Value |
|---|---|
| **Automated tests** | **50 / 50 passed, 0 failed** (4 modules, 7 suites) |
| Backend build | ✅ Dependencies installed, native SQLite binary loads |
| Database | ✅ Schema applied automatically; content synced; demo population seeded |
| Live server | ✅ Boots, health OK, serves SPA + API on `http://localhost:8080` |
| End-to-end smoke test | ✅ 14 live scenarios passed (auth, admin, certs, sign-off, security) |

The project was delivered as a complete, well-architected codebase. This report covers
making it **run with a real database**, exercising **every test module**, and
**verifying the live application** end-to-end.

---

## 2. Build steps performed

| Step | Command | Result |
|---|---|---|
| Install dependencies | `npm install` | 191 packages, `better-sqlite3` native binary verified loading |
| Configure environment | wrote `server/.env` from `.env.example` | random `JWT_SECRET` + `OTP_PEPPER`; `ADMIN_EMAILS=ea.admin@gta.gov.qa`; `EA_TEAM_EMAILS=ea.team@gta.gov.qa` |
| Load content into DB | `npm run sync:content` | 115 modules, 6 rounds, 109 questions, sign-off statement `EA-ACK-2026.2` (sha256 `0d598e5c…`) |
| Seed demo population | `npm run seed:demo` | 180 users, 712 sessions, 16,689 events, 252 exams, 675 attempts, 112 certificates, 93 sign-offs |
| Create reviewer | (auto, via seed) | `exam.reviewer@gta.gov.qa` |
| Set admin password | `npm run set-password -- ea.admin@gta.gov.qa …` | role `admin` |

> **Note on `npm install`:** npm's script sandbox flags `better-sqlite3`'s build step,
> but the package ships a prebuilt binary for this platform, so it loads without a
> rebuild (`require('better-sqlite3')` → OK). No action needed.

---

## 3. Automated test modules (`node --test`)

### Module 1 — `test/api.test.js` → auth, events, scoring, sign-off, admin
**22 tests, 22 passed.** Highlights:
- Scoring: all question types (mcq, truefalse, order, match, categorize)
- Auth: domain allow-list, sign-up (code → set-password), `account_exists`, login, wrong password, **5-failure lockout (15 min)**, reset is account-safe, change password, OTP challenge lockout after 5 bad codes, OTP expiry, max 3 requests/window, 401 on unauthenticated, heartbeat + logout
- Learner: `GET /me`, department set-once, event validation, **server-side re-scoring**, attempt validation, sign-off requires certificate, receipt email + audit log
- Admin: dashboard 403 for staff, 200 for admin with correct contract shape

### Module 2 — `test/cert.test.js` → certification
**11 tests, 11 passed.** Content sync (11 EA / 11 TOGAF / 3 parts), 80%-per-track unlock, sampled set (14/10/10) + resume, exact-set submit validation, attempt decrement, 3-sitting exhaustion, admin-only extra-attempt grant, passing issues + emails certificate, public verification, password-confirmed sign-off, dashboard shape.

### Module 3 — `test/levels.test.js` → certification paths (Foundation / Practitioner / Advanced)
**11 tests, 11 passed.** KB articles become `kb:<id>` modules per level, unknown level rejected, Practitioner locked without Foundation cert, Foundation earn flow, Practitioner 80%-article gate + sampled 10+10, per-level attempt grants, GTA-EAP issuance + verify, Advanced gate + 15 questions + GTA-EAA, sign-off needs only Foundation, per-level dashboard/export data.

### Module 4 — `test/reviewer.test.js` → exam reviewer
**6 tests, 6 passed.** Idempotent reviewer creation, reviewer flagged on sign-in, all three levels open immediately with unlimited sittings and no certificate, reviewer cannot sign acknowledgement, excluded from dashboard/users/exports, normal staff unaffected.

**Totals: 50 tests / 50 passed / 0 failed** (raw per-module logs in `server/test/`, captured during this run).

---

## 4. Live end-to-end smoke test (running server)

All against `http://localhost:8080`:

| # | Scenario | Expected | Actual |
|---|---|---|---|
| 1 | `GET /api/v1/health` | 200 | ✅ `{status:ok, db:sqlite, mail:dev}` |
| 2 | `GET /` SPA shell | HTML | ✅ `<!DOCTYPE html>` |
| 3 | `GET /server/.env` (source protection) | 404 | ✅ 404 |
| 4 | Sign-up OTP request | 202 + masked email | ✅ `te********@gta.gov.qa` |
| 5 | Verify OTP → setup token | 200 | ✅ setup token (purpose `signup`) |
| 6 | Set password → provision user | 200 + JWT | ✅ role `staff`, JWT issued |
| 7 | Login with chosen password | 200 + JWT | ✅ |
| 8 | Wrong password | 401 `invalid_credentials` | ✅ |
| 9 | Non-GTA domain | 400 `invalid_domain` | ✅ |
| 10 | Admin dashboard (admin token) | 200 full KPIs | ✅ 112 certified, 91.5% pass rate, 15 depts, 117 question stats |
| 11 | Admin dashboard (staff token) | 403 | ✅ |
| 12 | `GET /admin/export?kind=employees` | 200 CSV, UTF-8 BOM | ✅ 181 rows + header, BOM `EF BB BF` present |
| 13 | Public cert verify (valid id) | 200 valid | ✅ `GTA-EAF-2026-RVEBYH` → valid, foundation, 83.5% |
| 14 | Public cert verify (unknown id) | 404 | ✅ |
| 15 | Sign-off without certificate | 409 `preconditions_not_met` | ✅ |

---

## 5. Final database state

```
users:            182     certificates:    154
user_sessions:    718     signoffs:         93
events:        16,804     email_outbox:    249
cert_exams:       252     audit_log:       105
quiz_attempts:    675     content_modules: 121
quiz_answers:   7,578     quiz_rounds:       8
                          questions:       117
```

---

## 6. How to run it locally

```bash
cd server
npm install
npm run sync:content     # load modules + answer keys from js/data (run once / after content edits)
npm run seed:demo        # optional: demo population for the dashboard
npm start                # http://localhost:8080  (SPA + API)
npm test                 # the 50 automated tests above
```

To switch the SPA from the in-browser mock to this server, set `apiMode: "rest"` in
[`js/config.js`](js/config.js).

## 7. Deploying to personal hosting (Node.js)

This mirrors the Nudj-style single-origin deployment — one Node process serves both
the API and the static SPA, so no separate frontend host or CORS setup is needed:

1. Upload the project; run `npm ci --omit=dev` in `server/`.
2. Set production env vars (the host's panel or a `.env`): a strong `JWT_SECRET` and
   `OTP_PEPPER`, `NODE_ENV=production`, `ALLOWED_EMAIL_DOMAINS`, `ADMIN_EMAILS`,
   and `SMTP_*` for real email (otherwise codes/receipts only log to the console).
3. `SQLITE_PATH` → a writable, persistent path (keep it in your backups). SQLite needs
   no DB server, which suits personal hosting. For SQL Server instead, set
   `DB_DRIVER=mssql` + `MSSQL_CONNECTION_STRING` and apply `db/schema.sqlserver.sql`.
4. Start with a process manager (`pm2`, systemd, or the host's Node runner) pointing at
   `server/src/server.js`; put the host's HTTPS proxy in front and set `TRUST_PROXY=1`.
5. Health probe: `GET /api/v1/health`.

See [`server/README.md`](server/README.md) for the full production/SQL-Server/email guide
and [`docs/api-contract.md`](docs/api-contract.md) for the API contract.
