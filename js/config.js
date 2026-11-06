/* =====================================================================
   EA Awareness Hub — runtime configuration
   ---------------------------------------------------------------------
   apiMode   "mock"  everything is stored in this browser (localStorage);
                     OTP codes are shown on screen. Use for demos/reviews.
             "rest"  talk to the reference server (see /server/README.md)
                     using the contract in /docs/api-contract.md.
   ===================================================================== */
window.EA_CONFIG = {
  apiMode: "mock",
  apiBase: "/api/v1",
  allowedDomains: ["gta.gov.qa"],
  // Mock mode only: these addresses get the admin dashboard.
  mockAdmins: ["ea.team@gta.gov.qa", "admin@gta.gov.qa"],
  // Exam reviewers: all reading done, every exam unlocked, unlimited attempts,
  // no certificates issued, excluded from dashboard statistics.
  // (Server: REVIEWER_EMAILS + `npm run create-reviewer`.)
  reviewerEmails: ["exam.reviewer@gta.gov.qa"],
  // Demo mode only: the reviewer account is created automatically on first sign-in.
  mockReviewer: { email: "exam.reviewer@gta.gov.qa", password: "GtaExams2026!", displayName: "Exam Reviewer" },
  // Pass mark for assessment rounds (server enforces its own in REST mode)
  passPct: 70,
  // Statement users acknowledge on the Sign-off page
  signoffVersion: "EA-ACK-2026.2",
  heartbeatSeconds: 60,
  // Foundation track certification (the server enforces its own copy in REST mode)
  certification: {
    title: "Enterprise Architecture Foundation",
    unlockPct: 80,          // % of EA Foundation modules AND % of TOGAF topics marked complete
    passPct: 70,            // overall exam score needed to certify
    maxAttempts: 3,         // first attempt + 2 retakes
    issuer: "Information Technology Department",
    organisation: "General Tax Authority",
    signatoryName: "",                        // the IT Director's name, e.g. "Eng. ..." (shown above the title)
    signatoryTitle: "Director, Information Technology",
    signatureImage: "",                       // optional: assets/img/signature.png
    certPrefix: "GTA-EAF",
    // Certification paths. `tracks` must reach unlockPct; `requires` = certificate needed first.
    // Track ids: ea = EA Foundations modules, togaf = TOGAF topics,
    //            kbp / kba = Practitioner / Advanced knowledge-base articles.
    levels: [
      { id: "foundation", title: "Enterprise Architecture Foundation", short: "Foundation", prefix: "GTA-EAF", requires: null, tracks: ["ea", "togaf"] },
      { id: "practitioner", title: "Enterprise Architecture Practitioner", short: "Practitioner", prefix: "GTA-EAP", requires: "foundation", tracks: ["kbp"] },
      { id: "advanced", title: "Enterprise Architecture Advanced", short: "Advanced", prefix: "GTA-EAA", requires: "practitioner", tracks: ["kba"] }
    ]
  }
};
