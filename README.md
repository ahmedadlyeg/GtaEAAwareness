# GTA · Enterprise Architecture Awareness Hub (IT edition)

An awareness programme for **GTA IT staff** on Enterprise Architecture, the
**Qatar Government Enterprise Architecture (GEA)** and the TOGAF® Standard,
10th Edition, grounded in GTA's documented baseline architecture. Branded with the GTA presentation template
(maroon `#89143C` / `#511C3C`, gold `#A29160`, diagonal light-beam plates,
Doha skyline imagery, Tajawal type).

## What's inside

| Area | Contents |
|---|---|
| **EA Foundations** | Self-paced Foundation course, part 1 — 11 modules, each with *Mark as completed*: 42010 concepts, GEA dimensions & metamodel traceability, levels & roles, frameworks, **Qatar GEA** (mandate, principles, reference models, obligations), **GTA baseline architecture**, business (BRM), information/application/integration (IRM, ARM, GDX), infrastructure/security/service management (TRM, NIA, ITIL), governance (TRB, Design Authorities, checkpoints, exceptions, self-assessment), maturity (GEA EAMM) |
| **TOGAF** | Part 2 — 11 topics, each with *Mark as completed* (the ADM topic requires exploring all 10 phases): Interactive ADM wheel — objectives, inputs, steps, outputs, artefacts, techniques, pitfalls and a GTA example for all 10 phases; documentation structure; Enterprise Continuum; Architecture Repository; content metamodel & building blocks; the 7 GEA principles + 4 TOGAF principles; GEA mapping of every phase; deliverables; capability & governance; agile; glossary |
| **Knowledge Base** | 83 searchable articles, each with *Mark as completed*, a level filter and a path-progress banner; incl. Qatar GEA and GTA Baseline categories, templates & checklists (ADR, principle, TRB submission, GEA compliance, SAD outline, NFR catalogue, integration, classification→controls, cloud hosting, tech-debt, TIME). Part C of the exam is drawn from it |
| **Certification path** | Three paths, each with its own exam (70% overall, 3 attempts per path; admins can grant more) and GTA-branded certificate with a public `#/verify/<ID>` page. **Foundation** (GTA-EAF): unlocks at 80% of EA modules and 80% of TOGAF topics; 34 questions in three parts (EA Foundation, TOGAF, Knowledge Base). **Practitioner** (GTA-EAP): requires the Foundation certificate and 80% of the 55 Practitioner knowledge-base articles marked completed; 20 questions in two parts from a 32-question bank. **Advanced** (GTA-EAA): requires the Practitioner certificate and 80% of the 10 Advanced articles; 15 questions from a 22-question bank |
| **Sign-off** | Final step after certification: versioned acknowledgement (SHA-256 of the statement) confirmed with the user's password; receipt emailed |
| **Dashboard** | EA team/admin only: certified count, access by department, most active employees, top scorers, **progress per employee** (search, status filter, sort, +1 attempt), funnel to certificate, sign-ins per day, heat map, exam score distribution, hardest questions, by-department table, CSV exports (departments, employees) |
| **Diagrams** | 36 SVG diagrams generated in brand colours (`js/diagrams.js`) |

## Run it

**Demo (no server):** open `index.html` in a browser. Everything is stored in
that browser; one-time codes are shown on screen. Create an account once with any
`@gta.gov.qa` address, then sign in with email + password; use `ea.team@gta.gov.qa` to see the dashboard (synthetic population
of ~160 staff plus your own activity).

**Sign-in model:** a one-time code is emailed to the GTA address only at first-time
sign-up (and for *Forgot password*). After that, users sign in with their GTA email and the
password they chose (10+ characters, a letter and a number, not their email name; 5 failed
attempts lock the account for 15 minutes). Sign-off is confirmed with the password.

**As an application (DB + email for sign-up codes):**
```
cd server
cp .env.example .env        # set JWT_SECRET, SMTP_* (GTA Exchange relay), ADMIN_EMAILS
npm install
npm run sync:content        # loads modules, answer keys and the sign-off statement from js/data
npm start                   # serves the hub + API on http://localhost:8080
```
Then set `apiMode: "rest"` in `js/config.js`. See `server/README.md` for SQL
Server deployment, SMTP, and the data model, and `docs/api-contract.md` for the API.

## Files
```
index.html               single-page app shell
css/app.css              GTA design system
js/config.js             apiMode (mock | rest), allowed email domains, pass mark
js/api.js                data layer: MockAdapter (localStorage) + RestAdapter
js/app.js                router, views, quiz engine, sign-off, dashboard
js/diagrams.js           SVG diagram library
js/charts.js             SVG chart kit with tooltips
js/data/content.js       EA modules + sign-off statement
js/data/togaf.js         TOGAF ADM phases, continuum, repository, principles…
js/data/kb.js            knowledge-base articles
js/data/quiz.js          question bank and rounds (ids must match the server seed)
assets/img/              GTA logos, emblem, skyline imagery (from the GTA template)
fonts/                   Tajawal
docs/api-contract.md     REST contract shared by front end and server
server/                  Node.js reference server, SQL Server + SQLite schemas, tests
```

## Certificate settings
Edit `certification` in `js/config.js` (front end) and `CERT_*` in `server/.env` (server
rules): unlock %, pass %, attempts and ID prefix. Put the IT Director's name in
`signatoryName` and, optionally, a transparent PNG of the signature in
`signatureImage` (e.g. `assets/img/signature.png`); without it the certificate shows a
"Digitally signed" e-signature line.

## Editing content
Content is data, not markup: edit the files in `js/data/`. When you change a
question or the sign-off statement, keep the `id`/`version` scheme and re-run
`npm run sync:content` so the server's answer key and statement hash match.

## Notes
- Sources: Qatar GEA document set (Overview v1.2, BRM v1.0, IRM v1.1, ARM,
  TRM, Security Management, Service Management v1.0, Governance Model) and the
  *GTA Digital Strategy — Current State Understanding Report* (April 2025).
  Baseline diagrams (landscape, integration, data flow, hosting, IT governance,
  capability heat map) are simplified from that report. Target states and
  roadmaps remain illustrative until aligned with D2/D3.
- Deliberately omitted: specific security products and their gaps, network
  capacities, staffing numbers and outsourcing vendors from the baseline report.
  Security is discussed at architecture-layer level only.
- External links point to The Open Group, ISO, NIST, DAMA, etc. — confirm they
  resolve inside the GTA network.
- English (LTR). The CSS uses logical properties, so an Arabic RTL edition
  needs translated `js/data/*` files and `dir="rtl"`.
- TOGAF and ArchiMate are registered trademarks of The Open Group.
