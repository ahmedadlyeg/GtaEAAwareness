/* =====================================================================
   EA Awareness Hub — data layer
   One interface, two adapters:
     MockAdapter  localStorage + synthetic population for the dashboard
     RestAdapter  the reference server (docs/api-contract.md)
   Every method returns a Promise so the UI never knows which is active.
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.EA_CONFIG || {};
  var LS = "eahub.v2.";

  function ApiError(code, message) { var e = new Error(message || code); e.code = code; return e; }
  function nowIso() { return new Date().toISOString(); }
  function uid(p) { return (p || "") + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }
  function load(k, d) { try { var v = localStorage.getItem(LS + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) {} }
  function domainOk(email) {
    var m = /^[^@\s]+@([^@\s]+)$/.exec(String(email || "").trim().toLowerCase());
    if (!m) return false;
    return (CFG.allowedDomains || []).some(function (d) { return m[1] === d.toLowerCase(); });
  }
  function mask(email) {
    var p = email.split("@"); var n = p[0];
    return n.slice(0, 2) + "•••" + (n.length > 4 ? n.slice(-1) : "") + "@" + p[1];
  }
  function nameFrom(email) {
    return email.split("@")[0].split(/[._-]/).filter(Boolean)
      .map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); }).join(" ");
  }
  function delay(v, ms) { return new Promise(function (r) { setTimeout(function () { r(v); }, ms || 220); }); }
  function fail(code, msg, ms) { return new Promise(function (_, j) { setTimeout(function () { j(ApiError(code, msg)); }, ms || 220); }); }

  /* ---------------- passwords (policy mirrors the server) ---------------- */
  var COMMON = ["password", "password1", "password123", "qwerty123", "123456789a", "welcome123", "gta12345678", "letmein123", "admin12345", "p@ssw0rd123"];
  function isReviewer(email) { return (CFG.reviewerEmails || []).indexOf(String(email || "").toLowerCase()) >= 0; }
  function passwordIssue(pw, email) {
    pw = String(pw || "");
    if (pw.length < 10) return "Use at least 10 characters.";
    if (pw.length > 128) return "Use at most 128 characters.";
    if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return "Include at least one letter and one number.";
    var local = String(email || "").split("@")[0].toLowerCase();
    if (local && local.length >= 3 && pw.toLowerCase().indexOf(local) >= 0) return "Do not include your email name in the password.";
    if (COMMON.indexOf(pw.toLowerCase()) >= 0) return "That password is too common.";
    return null;
  }
  function hashPw(pw, salt) {
    // Demo mode only (the server uses scrypt). SHA-256 of salt + password via Web Crypto.
    var data = new TextEncoder().encode(salt + ":" + pw);
    return crypto.subtle.digest("SHA-256", data).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); });
  }

  /* ---------------- scoring (mirrors server re-scoring) ---------------- */
  function scoreAnswer(q, response) {
    var ok = false;
    try {
      if (q.type === "mcq") ok = response === q.answer;
      else if (q.type === "truefalse") ok = response === q.answer;
      else if (q.type === "order") ok = JSON.stringify(response) === JSON.stringify(q.items);
      else if (q.type === "match") ok = q.pairs.every(function (p) {
        return (response || []).some(function (r) { return r.l === p.l && r.r === p.r; });
      });
      else if (q.type === "categorize") ok = q.items.every(function (it) {
        return (response || []).some(function (r) { return r.t === it.t && r.b === it.b; });
      });
    } catch (e) { ok = false; }
    return { correct: ok, points: ok ? q.points : 0 };
  }


  /* ---------------- certification helpers (mirror the server rules) ---------------- */
  function certCfg() { var c = CFG.certification || {}; return { unlockPct: c.unlockPct || 80, passPct: c.passPct || 70, maxAttempts: c.maxAttempts || 3, prefix: c.certPrefix || "GTA-EAF" }; }
  function certLevels() {
    var c = CFG.certification || {};
    return c.levels || [{ id: "foundation", title: c.title || "Enterprise Architecture Foundation", short: "Foundation", prefix: c.certPrefix || "GTA-EAF", requires: null, tracks: ["ea", "togaf"] }];
  }
  function levelDef(id) { return certLevels().filter(function (l) { return l.id === (id || "foundation"); })[0] || certLevels()[0]; }
  function trackItems() {
    var C = window.EA_CONTENT || { modules: [], togafTopics: [] }, K = window.KB_ARTICLES || [];
    function kb(lv) { return K.filter(function (a) { return a.level === lv && !a.optional; }).map(function (a) { return "kb:" + a.id; }); }
    return { ea: (C.modules || []).filter(function (m) { return !m.virtual; }).map(function (m) { return m.id; }), togaf: (C.togafTopics || []).map(function (t) { return t.id; }),
      kbf: kb("Foundation"), kbp: kb("Practitioner"), kba: kb("Advanced") };
  }
  function trackStatus(doneMap, ids) {
    var T = trackItems(), out = {};
    (ids || ["ea", "togaf"]).forEach(function (k) { var items = T[k] || [], d = items.filter(function (id) { return doneMap[id]; }).length; out[k] = { done: d, total: items.length, pct: items.length ? d / items.length * 100 : 100 }; });
    return out;
  }
  function sampleSet(level) {
    var Q = window.EA_QUIZ || { rounds: [] }, set = [];
    Q.rounds.filter(function (r) { return (r.level || "foundation") === (level || "foundation"); }).forEach(function (r) {
      var pool = r.q.slice();
      for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
      set.push({ roundId: r.id, questionIds: pool.slice(0, Math.min(pool.length, r.perAttempt || pool.length)) });
    });
    return set;
  }
  function certId(prefix, year, rnd) {
    var A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "";
    for (var i = 0; i < 6; i++) s += A.charAt(Math.floor((rnd ? rnd() : Math.random()) * A.length));
    return prefix + "-" + year + "-" + s;
  }

  /* =================================================================
     MOCK ADAPTER
     ================================================================= */
  var Mock = {
    name: "mock",
    _token: function () { return load("token", null); },
    _me: function () {
      var t = this._token(); if (!t) return null;
      var users = load("users", {}); return users[t.email] || null;
    },
    _requireUser: function () { var u = this._me(); if (!u) throw ApiError("unauthorized", "Please sign in."); return u; },

    requestOtp: function (email, purpose) {
      email = String(email || "").trim().toLowerCase(); purpose = purpose === "reset" ? "reset" : "signup";
      if (!domainOk(email)) return fail("invalid_domain", "Use your GTA email address (@" + (CFG.allowedDomains || []).join(", @") + ").");
      var u = load("users", {})[email];
      if (purpose === "signup" && u && u.passwordHash) return fail("account_exists", "An account already exists for this email — sign in, or reset your password.");
      var code = String(Math.floor(100000 + Math.random() * 900000));
      var ch = { id: uid("ch_"), email: email, purpose: purpose, code: code, attempts: 0, expiresAt: new Date(Date.now() + 10 * 60000).toISOString() };
      var real = purpose === "signup" || (u && u.passwordHash);
      if (real) { var all = load("otp", {}); all[ch.id] = ch; save("otp", all); }
      return delay({ challengeId: ch.id, expiresAt: ch.expiresAt, maskedEmail: mask(email), devCode: real ? code : undefined }, 450);
    },

    verifyOtp: function (challengeId, code) {
      var all = load("otp", {}); var ch = all[challengeId];
      if (!ch) return fail("otp_invalid", "That code is not valid. Request a new one.");
      if (ch.consumed) return fail("otp_invalid", "That code was already used.");
      if (new Date(ch.expiresAt) < new Date()) return fail("otp_expired", "The code has expired. Request a new one.");
      if (ch.attempts >= 5) return fail("otp_locked", "Too many attempts. Request a new code.");
      if (String(code).trim() !== ch.code) {
        ch.attempts++; save("otp", all);
        return fail("otp_invalid", "Incorrect code. " + (5 - ch.attempts) + " attempt(s) left.");
      }
      ch.consumed = nowIso(); save("otp", all);
      var tok = uid("st_"), st = load("setup", {}); st[tok] = { email: ch.email, purpose: ch.purpose, exp: Date.now() + 15 * 60000 }; save("setup", st);
      return delay({ setupToken: tok, purpose: ch.purpose, email: ch.email });
    },

    _startSession: function (u) {
      var users = load("users", {});
      u.lastLoginAt = nowIso(); u.failedLogins = 0; u.lockedUntil = null; users[u.email] = u; save("users", users);
      var sessions = load("sessions", []);
      var s = { id: uid("s_"), userId: u.id, email: u.email, loginAt: nowIso(), lastSeenAt: nowIso(), logoutAt: null, ua: navigator.userAgent };
      sessions.push(s); save("sessions", sessions);
      save("token", { email: u.email, sessionId: s.id });
      var pub = {}; Object.keys(u).forEach(function (k) { if (k !== "passwordHash" && k !== "salt") pub[k] = u[k]; }); pub.reviewer = isReviewer(u.email);
      return { token: "mock." + s.id, user: pub };
    },

    setPassword: function (setupToken, password) {
      var self = this, st = load("setup", {}), t = st[setupToken];
      if (!t || t.exp < Date.now()) return fail("setup_expired", "This step has expired. Request a new code.");
      var issue = passwordIssue(password, t.email); if (issue) return fail("weak_password", issue);
      var users = load("users", {}), u = users[t.email];
      if (!u) u = { id: uid("u_"), email: t.email, displayName: nameFrom(t.email), department: "", jobTitle: "", role: (CFG.mockAdmins || []).indexOf(t.email) >= 0 ? "admin" : "staff", firstLoginAt: nowIso() };
      var salt = uid("");
      return hashPw(password, salt).then(function (h) {
        u.salt = salt; u.passwordHash = h; u.passwordSetAt = nowIso();
        delete st[setupToken]; save("setup", st);
        return delay(self._startSession(u), 200);
      });
    },

    _seedReviewer: function () {
      var R = CFG.mockReviewer; if (!R) return Promise.resolve();
      var users = load("users", {}); if (users[R.email] && users[R.email].passwordHash) return Promise.resolve();
      var u = { id: uid("u_"), email: R.email, displayName: R.displayName || "Exam Reviewer", department: "Information Technology", jobTitle: "Exam reviewer", role: "ea_team", firstLoginAt: nowIso() };
      var salt = uid("");
      return hashPw(R.password, salt).then(function (h) {
        u.salt = salt; u.passwordHash = h; u.passwordSetAt = nowIso();
        users = load("users", {}); users[R.email] = u; save("users", users);
        var T = trackItems(), ev = load("events", []), at = nowIso();
        ["ea", "togaf", "kbf", "kbp", "kba"].forEach(function (k) { (T[k] || []).forEach(function (id) { ev.push({ userId: u.id, type: "module_complete", ref: id, meta: null, at: at }); }); });
        (window.KB_ARTICLES || []).forEach(function (a) { if (a.optional) ev.push({ userId: u.id, type: "module_complete", ref: "kb:" + a.id, meta: null, at: at }); });
        save("events", ev);
      });
    },

    login: function (email, password) {
      var self = this; email = String(email || "").trim().toLowerCase();
      if (CFG.mockReviewer && email === CFG.mockReviewer.email && !(load("users", {})[email] || {}).passwordHash) return this._seedReviewer().then(function () { return self.login(email, password); });
      var users = load("users", {}), u = users[email];
      if (!u) return fail("invalid_credentials", "Email or password is incorrect.");
      if (!u.passwordHash) return fail("password_not_set", "Complete first-time sign-up with the code sent to your GTA email.");
      if (u.lockedUntil && new Date(u.lockedUntil) > new Date()) return fail("account_locked", "Too many failed attempts. Try again after " + new Date(u.lockedUntil).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " or reset your password.");
      return hashPw(password, u.salt).then(function (h) {
        if (h !== u.passwordHash) {
          u.failedLogins = (u.failedLogins || 0) + 1;
          if (u.failedLogins >= 5) { u.lockedUntil = new Date(Date.now() + 15 * 60000).toISOString(); u.failedLogins = 0; }
          users[email] = u; save("users", users);
          throw ApiError(u.lockedUntil ? "account_locked" : "invalid_credentials", u.lockedUntil ? "Too many failed attempts. Your account is locked for 15 minutes." : "Email or password is incorrect.");
        }
        return delay(self._startSession(u), 250);
      });
    },

    changePassword: function (current, next) {
      var me = this._requireUser(), users = load("users", {}), u = users[me.email];
      return hashPw(current, u.salt).then(function (h) {
        if (h !== u.passwordHash) throw ApiError("invalid_credentials", "Your current password is incorrect.");
        var issue = passwordIssue(next, u.email); if (issue) throw ApiError("weak_password", issue);
        var salt = uid(""); return hashPw(next, salt).then(function (h2) { u.salt = salt; u.passwordHash = h2; u.passwordSetAt = nowIso(); users[u.email] = u; save("users", users); return null; });
      });
    },

    logout: function () {
      var t = this._token();
      if (t) {
        var sessions = load("sessions", []);
        sessions.forEach(function (s) { if (s.id === t.sessionId) s.logoutAt = nowIso(); });
        save("sessions", sessions);
      }
      localStorage.removeItem(LS + "token");
      return delay(null, 60);
    },

    heartbeat: function () {
      var t = this._token(); if (!t) return Promise.resolve();
      var sessions = load("sessions", []);
      sessions.forEach(function (s) { if (s.id === t.sessionId) s.lastSeenAt = nowIso(); });
      save("sessions", sessions); return Promise.resolve();
    },

    me: function () {
      var u0 = this._me(), u = null;
      if (u0) { u = {}; Object.keys(u0).forEach(function (k) { if (k !== "passwordHash" && k !== "salt") u[k] = u0[k]; }); u.reviewer = isReviewer(u0.email); }
      if (!u) return fail("unauthorized", "Not signed in", 10);
      return this.progress().then(function (p) { return { user: u, progress: p }; });
    },

    updateMe: function (patch) {
      var u = this._requireUser(); var users = load("users", {});
      ["displayName", "department", "jobTitle"].forEach(function (k) { if (patch[k] !== undefined) u[k] = patch[k]; });
      users[u.email] = u; save("users", users); return delay({ user: u }, 120);
    },

    logEvent: function (type, ref, meta) {
      var u = this._me(); if (!u) return Promise.resolve();
      var ev = load("events", []);
      ev.push({ userId: u.id, type: type, ref: ref, meta: meta || null, at: nowIso() });
      if (ev.length > 4000) ev = ev.slice(-4000);
      save("events", ev); return Promise.resolve();
    },

    progress: function () {
      var u = this._me(); if (!u) return Promise.resolve(null);
      var ev = load("events", []).filter(function (e) { return e.userId === u.id; });
      var done = {}; var kb = {};
      ev.forEach(function (e) { if (e.type === "module_complete") done[e.ref] = 1; if (e.type === "kb_view") kb[e.ref] = 1; });
      var att = load("attempts", []).filter(function (a) { return a.userId === u.id; });
      var best = {};
      att.forEach(function (a) {
        var b = best[a.roundId];
        if (!b || a.score > b.bestScore) best[a.roundId] = { roundId: a.roundId, bestScore: a.score, maxScore: a.maxScore, passed: a.passed, lastAt: a.completedAt };
      });
      var so = load("signoffs", []).filter(function (s) { return s.userId === u.id; })[0] || null;
      return Promise.resolve({ modulesCompleted: Object.keys(done), kbViewed: Object.keys(kb).length,
        attempts: Object.keys(best).map(function (k) { return best[k]; }), signoff: so, certification: this._certStatus(u, done, "foundation"), certifications: this._allCerts(u, done) });
    },

    _allCerts: function (u, done) { var self = this, o = {}; certLevels().forEach(function (l) { o[l.id] = self._certStatus(u, done, l.id); }); return o; },
    _certStatus: function (u, done, level) {
      var c = certCfg(), L = levelDef(level); level = L.id;
      function lv(x) { return (x.level || "foundation") === level; }
      if (!done) { done = {}; load("events", []).forEach(function (e) { if (e.userId === u.id && e.type === "module_complete") done[e.ref] = 1; }); }
      var tr = trackStatus(done, L.tracks);
      var exams = load("certExams", []).filter(function (x) { return x.userId === u.id && lv(x); });
      var grants = load("certGrants", []).filter(function (g) { return g.userId === u.id && lv(g); }).reduce(function (s, g) { return s + g.extra; }, 0);
      var certs = load("certs", []).filter(function (x) { return x.userId === u.id; });
      var cert = certs.filter(lv)[0] || null;
      var pre = !L.requires || certs.some(function (x) { return (x.level || "foundation") === L.requires; });
      var ip = exams.filter(function (x) { return x.status === "in_progress"; })[0] || null;
      var rv = isReviewer(u.email);
      var max = rv ? 99 : c.maxAttempts + grants;
      if (rv) { pre = true; cert = null; }
      var tracksOk = Object.keys(tr).every(function (k) { return tr[k].pct >= c.unlockPct; });
      return {
        level: level, title: L.title, requires: L.requires, prerequisiteMet: pre,
        unlockPct: c.unlockPct, passPct: c.passPct, maxAttempts: max, attemptsUsed: exams.length,
        eligible: rv || (pre && tracksOk), track: tr, preview: rv,
        inProgress: ip ? { examId: ip.id, attemptNo: ip.attemptNo, startedAt: ip.startedAt, parts: ip.set } : null,
        exams: exams.filter(function (x) { return x.status === "completed"; }).sort(function (a, b) { return a.completedAt < b.completedAt ? 1 : -1; })
          .map(function (x) { return { examId: x.id, attemptNo: x.attemptNo, startedAt: x.startedAt, completedAt: x.completedAt, score: x.score, maxScore: x.maxScore, pct: x.pct, passed: x.passed, parts: x.parts }; }),
        certificate: cert ? { certificateId: cert.certificateId, issuedAt: cert.issuedAt, scorePct: cert.scorePct, displayName: cert.displayName, department: cert.department, level: level, title: L.title } : null
      };
    },

    startExam: function (level) {
      level = levelDef(level).id;
      var u = this._requireUser(), st = this._certStatus(u, null, level);
      if (st.certificate) return fail("already_certified", "You already hold the " + st.title + " certificate.");
      if (st.inProgress) return delay({ examId: st.inProgress.examId, level: level, attemptNo: st.inProgress.attemptNo, maxAttempts: st.maxAttempts, attemptsLeft: st.maxAttempts - st.attemptsUsed, startedAt: st.inProgress.startedAt, parts: st.inProgress.parts });
      if (!st.prerequisiteMet) return fail("exam_locked", "Earn the " + levelDef(st.requires).title + " certificate first.");
      if (!st.eligible) return fail("exam_locked", "Complete at least " + st.unlockPct + "% of the required topics to unlock the exam.");
      if (st.attemptsUsed >= st.maxAttempts) return fail("attempts_exhausted", "You have used all " + st.maxAttempts + " attempts. Contact the EA team to request another.");
      var ex = { id: uid("x_"), userId: u.id, level: level, attemptNo: st.attemptsUsed + 1, status: "in_progress", set: sampleSet(level), startedAt: nowIso() };
      var all = load("certExams", []); all.push(ex); save("certExams", all);
      return delay({ examId: ex.id, level: level, attemptNo: ex.attemptNo, maxAttempts: st.maxAttempts, attemptsLeft: st.maxAttempts - ex.attemptNo, startedAt: ex.startedAt, parts: ex.set }, 300);
    },

    submitExam: function (examId, body) {
      var u = this._requireUser(), c = certCfg(), Q = window.EA_QUIZ.byId;
      var all = load("certExams", []), ex = all.filter(function (x) { return x.id === examId && x.userId === u.id; })[0];
      if (!ex || ex.status !== "in_progress") return fail("exam_closed", "This exam is no longer open.");
      var issued = {}; ex.set.forEach(function (p) { p.questionIds.forEach(function (id) { issued[id] = p.roundId; }); });
      var got = 0, bad = false;
      (body.parts || []).forEach(function (p) { (p.answers || []).forEach(function (a) { if (issued[a.questionId] !== p.roundId) bad = true; got++; }); });
      if (bad || got !== Object.keys(issued).length) return fail("validation", "Answers do not match the issued exam.");
      var score = 0, max = 0, atts = load("attempts", []), completedAt = body.completedAt || nowIso();
      var parts = body.parts.map(function (p) {
        var ps = 0, pm = 0, ans = p.answers.map(function (a) { var q = Q[a.questionId], r = scoreAnswer(q, a.response); ps += r.points; pm += q.points; return { questionId: a.questionId, response: a.response, correct: r.correct, points: r.points, timeMs: a.timeMs }; });
        score += ps; max += pm;
        atts.push({ id: uid("a_"), userId: u.id, roundId: p.roundId, certExamId: ex.id, startedAt: ex.startedAt, completedAt: completedAt, answers: ans, score: ps, maxScore: pm, passed: pm ? ps / pm * 100 >= c.passPct : false });
        return { roundId: p.roundId, score: ps, maxScore: pm, pct: pm ? ps / pm * 100 : 0 };
      });
      save("attempts", atts);
      var pct = max ? score / max * 100 : 0, passed = pct >= c.passPct;
      ex.status = "completed"; ex.completedAt = completedAt; ex.score = score; ex.maxScore = max; ex.pct = pct; ex.passed = passed; ex.parts = parts;
      if (isReviewer(u.email)) ex.preview = true;
      save("certExams", all);
      var cert = null, L = levelDef(ex.level), rvw = isReviewer(u.email);
      if (rvw) ex.preview = true;
      if (passed && !rvw) {
        cert = { certificateId: certId(L.prefix || c.prefix, new Date().getFullYear()), level: L.id, userId: u.id, examId: ex.id, displayName: u.displayName, department: u.department || "", scorePct: Math.round(pct), issuedAt: nowIso() };
        var cs = load("certs", []); cs.push(cert); save("certs", cs);
        var out = load("outbox", []); out.push({ to: u.email, template: "certificate_issued", payload: cert, status: "queued", createdAt: nowIso() }); save("outbox", out);
      }
      var used = load("certExams", []).filter(function (x) { return x.userId === u.id && (x.level || "foundation") === L.id; }).length;
      var st = this._certStatus(u, null, L.id);
      return delay({ examId: ex.id, attemptNo: ex.attemptNo, score: score, maxScore: max, pct: pct, passed: passed, parts: parts, attemptsLeft: Math.max(0, st.maxAttempts - used), preview: rvw,
        level: L.id, certificate: cert ? { certificateId: cert.certificateId, issuedAt: cert.issuedAt, scorePct: cert.scorePct, displayName: cert.displayName, department: cert.department, level: L.id, title: L.title } : null }, 400);
    },

    verifyCertificate: function (id) {
      var c = load("certs", []).filter(function (x) { return x.certificateId === String(id || "").toUpperCase(); })[0];
      if (!c) return fail("not_found", "No certificate with that ID.");
      var L = levelDef(c.level); return delay({ valid: true, level: L.id, title: L.title, certificateId: c.certificateId, displayName: c.displayName, department: c.department, issuedAt: c.issuedAt, scorePct: c.scorePct });
    },

    grantCertAttempts: function (userId, extra, note, level) {
      var u = this._requireUser();
      if (u.role !== "admin" && u.role !== "ea_team") return fail("forbidden", "Only the EA team can grant attempts.");
      if (String(userId).indexOf("demo_") === 0) return fail("validation", "Demo employees are synthetic — grants apply to real accounts.");
      var g = load("certGrants", []); g.push({ userId: userId, level: levelDef(level).id, extra: extra || 1, note: note || "", grantedBy: u.email, at: nowIso() }); save("certGrants", g);
      return delay({ ok: true });
    },

    saveAttempt: function (attempt) {
      var u = this._requireUser();
      var Q = window.EA_QUIZ ? window.EA_QUIZ.byId : {};
      var score = 0, max = 0;
      var answers = attempt.answers.map(function (a) {
        var q = Q[a.questionId]; if (!q) throw ApiError("validation", "Unknown question " + a.questionId);
        var r = scoreAnswer(q, a.response); score += r.points; max += q.points;
        return { questionId: a.questionId, response: a.response, correct: r.correct, points: r.points, timeMs: a.timeMs };
      });
      var rec = { id: uid("a_"), userId: u.id, roundId: attempt.roundId, startedAt: attempt.startedAt,
        completedAt: attempt.completedAt || nowIso(), answers: answers, score: score, maxScore: max,
        passed: max ? score / max * 100 >= (CFG.passPct || 70) : false };
      var all = load("attempts", []); all.push(rec); save("attempts", all);
      return delay({ attemptId: rec.id, score: score, maxScore: max, passed: rec.passed }, 260);
    },

    signoff: function (password, version, sha256) {
      var self = this; var u = this._requireUser(), full = load("users", {})[u.email];
      return this.progress().then(function (p) {
        var pre = window.EA_signoffPreconditions ? window.EA_signoffPreconditions(p) : { ok: true };
        if (isReviewer(u.email)) throw ApiError("preconditions_not_met", "Reviewer accounts cannot sign the acknowledgement.");
        if (!pre.ok) throw ApiError("preconditions_not_met", "Earn the Foundation certificate before signing the acknowledgement.");
        return hashPw(password, full.salt);
      }).then(function (h) {
        if (h !== full.passwordHash) throw ApiError("invalid_credentials", "Your password is incorrect.");
        var rec = { receiptId: "EA-" + new Date().getFullYear() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          userId: u.id, email: u.email, displayName: u.displayName, department: u.department,
          statementVersion: version, sha256: sha256, signedAt: nowIso(), verifiedBy: "password" };
        var all = load("signoffs", []).filter(function (s) { return !(s.userId === u.id && s.statementVersion === version); });
        all.push(rec); save("signoffs", all);
        var out = load("outbox", []);
        out.push({ to: u.email, template: "signoff_receipt", payload: rec, status: "queued", createdAt: nowIso() });
        save("outbox", out);
        return { receiptId: rec.receiptId, signedAt: rec.signedAt };
      });
    },

    dashboard: function (filters) {
      var u = this._requireUser();
      if (u.role !== "admin" && u.role !== "ea_team") return fail("forbidden", "The dashboard is for the EA team and administrators.");
      var data = Demo.dataset();
      // merge this browser's real records on top of the synthetic population
      var users = load("users", {});
      var skip = {}; Object.keys(users).forEach(function (k) { if (isReviewer(users[k].email)) skip[users[k].id] = 1; });
      Object.keys(users).forEach(function (k) { var x = users[k]; if (skip[x.id]) return; data.users.push({ id: x.id, name: x.displayName, dept: x.department || "Information Technology", email: x.email, real: true }); });
      load("sessions", []).forEach(function (s) { data.sessions.push({ userId: s.userId, at: new Date(s.loginAt), minutes: Math.max(1, (new Date(s.lastSeenAt) - new Date(s.loginAt)) / 60000) }); });
      load("events", []).forEach(function (e) { data.events.push({ userId: e.userId, type: e.type, ref: e.ref, at: new Date(e.at) }); });
      load("attempts", []).forEach(function (a) { data.attempts.push({ userId: a.userId, roundId: a.roundId, at: new Date(a.completedAt), score: a.score, max: a.maxScore, passed: a.passed, answers: a.answers }); });
      load("signoffs", []).forEach(function (s) { data.signoffs.push({ userId: s.userId, at: new Date(s.signedAt), receiptId: s.receiptId }); });
      load("certExams", []).forEach(function (x) { if (x.status === "completed") data.exams.push({ userId: x.userId, level: x.level || "foundation", at: new Date(x.completedAt), pct: x.pct, passed: x.passed, attemptNo: x.attemptNo }); });
      load("certs", []).forEach(function (c) { data.certs.push({ userId: c.userId, level: c.level || "foundation", at: new Date(c.issuedAt), certificateId: c.certificateId, pct: c.scorePct }); });
      var grants = load("certGrants", []); data.grants = grants;
      ["sessions", "events", "attempts", "exams", "certs", "signoffs"].forEach(function (k) { data[k] = data[k].filter(function (x) { return !skip[x.userId]; }); });
      return delay(Demo.aggregate(data, filters || {}), 350);
    }
  };

  /* =================================================================
     Synthetic population for the dashboard (deterministic)
     ================================================================= */
  var Demo = {
    _cache: null,
    depts: [
      ["Information Technology", 58], ["Planning & Quality", 14], ["Taxpayer Services", 26], ["Tax Policies", 9],
      ["Income Tax", 18], ["Tax Revenues", 15], ["Legal Affairs", 7], ["Internal Audit", 6], ["Human Resources", 8], ["Consumption Tax", 11], ["Tax Treaties & International Cooperation", 5], ["Financial & Administrative Affairs", 9]
    ],
    rng: function (seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; },
    dataset: function () {
      if (this._cache) return JSON.parse(JSON.stringify(this._cache), function (k, v) {
        return (k === "at" && typeof v === "string") ? new Date(v) : v; });
      var R = this.rng(20261102);
      var first = ["Ahmed","Mohammed","Fatima","Mariam","Khalid","Noora","Hamad","Aisha","Omar","Sara","Yousef","Hessa","Ali","Latifa","Abdulla","Reem","Jassim","Dana","Nasser","Maha","Saad","Alanoud","Faisal","Lulwa"];
      var last = ["Al-Thani","Al-Kuwari","Al-Marri","Al-Sulaiti","Al-Mohannadi","Al-Naimi","Al-Hajri","Al-Emadi","Al-Khater","Al-Ansari","Al-Muftah","Al-Baker","Al-Obaidli","Al-Mannai"];
      var Q = (window.EA_QUIZ && window.EA_QUIZ.questions) || [];
      var rounds = (window.EA_QUIZ && window.EA_QUIZ.rounds) || [];
      var mods = (window.EA_CONTENT && window.EA_CONTENT.modules) || [];
      var users = [], sessions = [], events = [], attempts = [], signoffs = [], exams = [], certs = [];
      var end = new Date(); end.setHours(23, 59, 0, 0);
      var DAYS = 45;
      var difficulty = {}; Q.forEach(function (q) { difficulty[q.id] = 0.45 + R() * 0.5; });
      this.depts.forEach(function (d) {
        for (var i = 0; i < d[1]; i++) {
          var id = "demo_" + users.length;
          var it = d[0] === "Information Technology";
          var engagement = Math.min(1, R() * (it ? 1.25 : 0.95) + (it ? 0.15 : 0));
          var fn = first[Math.floor(R() * first.length)], ln = last[Math.floor(R() * last.length)];
          users.push({ id: id, name: fn + " " + ln, dept: d[0], eng: engagement, email: (fn + "." + ln.replace("Al-", "al")).toLowerCase() + users.length + "@gta.gov.qa" });
          if (engagement < 0.12) continue; // enrolled, never logged in
          var startDay = Math.floor(R() * 30);
          var nLogins = 1 + Math.floor(engagement * 14 * R() + engagement * 4);
          for (var j = 0; j < nLogins; j++) {
            var day = Math.min(DAYS - 1, startDay + Math.floor(R() * (DAYS - startDay)));
            var dt = new Date(end.getTime() - (DAYS - 1 - day) * 86400000);
            var dow = dt.getDay(); if (dow === 5 || (dow === 6 && R() < 0.8)) { dt = new Date(dt.getTime() - 86400000 * 2); }
            var hr = R() < 0.82 ? 7 + Math.floor(R() * 8) : 15 + Math.floor(R() * 7);
            if (R() < 0.18) hr = 9 + Math.floor(R() * 3);
            dt.setHours(hr, Math.floor(R() * 60), 0, 0);
            sessions.push({ userId: id, at: dt, minutes: 3 + Math.round(R() * 16 * engagement + R() * 5) });
          }
          var firstAt = sessions.filter(function (s) { return s.userId === id; }).sort(function (a, b) { return a.at - b.at; })[0].at;
          var readCount = Math.round(mods.length * Math.min(1, engagement * 1.15 + R() * 0.15));
          mods.forEach(function (m, mi) {
            if (R() < 0.85 || mi < readCount) events.push({ userId: id, type: "module_view", ref: m.id, at: new Date(firstAt.getTime() + mi * 3600000) });
            if (mi < readCount) events.push({ userId: id, type: "module_complete", ref: m.id, at: new Date(firstAt.getTime() + mi * 3600000 + 600000) });
          });
          var kbViews = Math.floor(engagement * 12 * R());
          for (var k = 0; k < kbViews; k++) events.push({ userId: id, type: "kb_view", ref: "kb" + k, at: new Date(firstAt.getTime() + k * 7200000) });
          // TOGAF topics read
          var topics = ((window.EA_CONTENT || {}).togafTopics || []);
          var tRead = Math.round(topics.length * Math.min(1, engagement * 1.1 + R() * 0.2));
          topics.forEach(function (t, ti) { if (ti < tRead) events.push({ userId: id, type: "module_complete", ref: t.id, at: new Date(firstAt.getTime() + (mods.length + ti) * 3600000 + 600000) }); });
          // certification exams per level
          function runLevel(level, after, bonus) {
            var got = null, rs = rounds.filter(function (r) { return (r.level || "foundation") === level; }); if (!rs.length) return null;
            for (var t = 0; t < 3 && !got; t++) {
              var sc = 0, mx = 0, exAt = new Date(after.getTime() + 86400000 * (1 + R() * 5 + t * 3));
              if (exAt > end) exAt = new Date(end.getTime() - R() * 86400000 * 2);
              rs.forEach(function (r) {
                var pool = r.q.slice().sort(function () { return R() - 0.5; }).slice(0, r.perAttempt || r.q.length);
                var ps = 0, pm = 0, ans = [];
                pool.forEach(function (qid) {
                  var q = window.EA_QUIZ.byId[qid]; if (!q) return;
                  var pr = Math.min(0.97, (difficulty[qid] || 0.7) * 0.7 + engagement * 0.32 + t * 0.07 + bonus);
                  var ok = R() < pr; ps += ok ? q.points : 0; pm += q.points; ans.push({ questionId: qid, correct: ok });
                });
                sc += ps; mx += pm;
                attempts.push({ userId: id, roundId: r.id, at: exAt, score: ps, max: pm, passed: pm ? ps / pm * 100 >= 70 : false, answers: ans });
              });
              var pct = mx ? sc / mx * 100 : 0, ok2 = pct >= 70;
              exams.push({ userId: id, level: level, at: exAt, pct: pct, passed: ok2, attemptNo: t + 1 });
              if (ok2) { got = { userId: id, level: level, at: exAt, certificateId: certId({ foundation: "GTA-EAF", practitioner: "GTA-EAP", advanced: "GTA-EAA" }[level], exAt.getFullYear(), R), pct: Math.round(pct) }; certs.push(got); }
              if (!ok2 && R() < 0.25) break;
            }
            return got;
          }
          var eligible = readCount / Math.max(1, mods.length) >= 0.8 && tRead / Math.max(1, topics.length) >= 0.8;
          var certified = eligible && R() < 0.92 ? runLevel("foundation", firstAt, 0) : null;
          var K = window.KB_ARTICLES || [];
          ["Practitioner", "Advanced"].forEach(function (lv, li) {
            var arts = K.filter(function (a) { return a.level === lv && !a.optional; });
            var frac = Math.min(1, engagement * (li ? 0.9 : 1.05) * (0.45 + R() * 0.75));
            var n = Math.round(arts.length * frac);
            arts.slice(0, n).forEach(function (a, ai) { events.push({ userId: id, type: "module_complete", ref: "kb:" + a.id, at: new Date(firstAt.getTime() + 86400000 * (2 + li * 6) + ai * 1800000) }); });
          });
          
          var evs = events.filter(function (e) { return e.userId === id && e.type === "module_complete" && /^kb:/.test(e.ref); });
          var kbDone = {}; evs.forEach(function (e) { kbDone[e.ref] = 1; });
          var tp = trackStatus(kbDone, ["kbp", "kba"]);
          var prac = certified && tp.kbp.pct >= 80 && R() < 0.85 ? runLevel("practitioner", certified.at, -0.02) : null;
          if (prac && tp.kba.pct >= 80 && R() < 0.8) runLevel("advanced", prac.at, -0.05);
          if (certified && R() < 0.85) {
            var sat = new Date(certified.at.getTime() + 86400000 * R() * 4);
            if (sat > end) sat = new Date(end.getTime() - R() * 86400000);
            signoffs.push({ userId: id, at: sat, receiptId: "EA-2026-" + Math.floor(R() * 1e6).toString(36).toUpperCase() });
          }
        }
      });
      this._cache = { users: users, sessions: sessions, events: events, attempts: attempts, signoffs: signoffs, exams: exams, certs: certs };
      return this.dataset();
    },

    aggregate: function (d, f) {
      var from = f.from ? new Date(f.from) : new Date(Date.now() - 45 * 86400000);
      var to = f.to ? new Date(f.to) : new Date();
      to = new Date(to.getTime()); to.setHours(23, 59, 59, 999);
      var dept = f.department || "";
      var userMap = {}; d.users.forEach(function (u) { userMap[u.id] = u; });
      var inUsers = d.users.filter(function (u) { return !dept || u.dept === dept; });
      var inSet = {}; inUsers.forEach(function (u) { inSet[u.id] = 1; });
      function inRange(x) { return inSet[x.userId] && x.at >= from && x.at <= to; }
      var S = d.sessions.filter(inRange), E = d.events.filter(inRange), A = d.attempts.filter(inRange), SO = d.signoffs.filter(function (s) { return inSet[s.userId] && s.at <= to; });
      var active = {}; S.forEach(function (s) { active[s.userId] = 1; });
      var mins = {}; S.forEach(function (s) { mins[s.userId] = (mins[s.userId] || 0) + s.minutes; });
      var best = {}; A.forEach(function (a) { var k = a.userId + "|" + a.roundId; var p = a.score / (a.max || 1) * 100; if (!best[k] || p > best[k].p) best[k] = { p: p, passed: a.passed, userId: a.userId }; });
      var userBest = {}; Object.keys(best).forEach(function (k) { var b = best[k]; (userBest[b.userId] = userBest[b.userId] || []).push(b); });
      var mods = (window.EA_CONTENT && window.EA_CONTENT.modules) || [];
      var rounds = (window.EA_QUIZ && window.EA_QUIZ.rounds) || [];
      var mandRounds = rounds.filter(function (r) { return r.mandatory; }).length;
      var compl = {}; E.forEach(function (e) { if (e.type === "module_complete") { (compl[e.userId] = compl[e.userId] || {})[e.ref] = 1; } });
      var started = {}; E.forEach(function (e) { if (e.type === "module_view") started[e.userId] = 1; });
      var completedAll = {}; Object.keys(compl).forEach(function (u) { if (Object.keys(compl[u]).length >= Math.max(1, mods.length - 1)) completedAll[u] = 1; });
      var passedAll = {}; Object.keys(userBest).forEach(function (u) { if (userBest[u].filter(function (b) { return b.passed; }).length >= mandRounds) passedAll[u] = 1; });
      var signed = {}; SO.forEach(function (s) { signed[s.userId] = s; });
      var n = function (o) { return Object.keys(o).length; };
      var avgScore = (function () { var t = 0, c = 0; Object.keys(best).forEach(function (k) { t += best[k].p; c++; }); return c ? t / c : 0; })();
      var passRate = (function () { var t = 0, c = 0; Object.keys(best).forEach(function (k) { c++; if (best[k].passed) t++; }); return c ? t / c * 100 : 0; })();
      // logins by day
      var byDay = {}; var days = [];
      for (var t = new Date(from); t <= to; t = new Date(t.getTime() + 86400000)) { var key = t.toISOString().slice(0, 10); byDay[key] = { date: key, logins: 0, u: {} }; days.push(key); }
      S.forEach(function (s) { var k = s.at.toISOString().slice(0, 10); if (byDay[k]) { byDay[k].logins++; byDay[k].u[s.userId] = 1; } });
      var heat = []; for (var i = 0; i < 7; i++) { heat.push(new Array(24).fill(0)); }
      S.forEach(function (s) { heat[s.at.getDay()][s.at.getHours()]++; });
      var deptRows = this.depts.map(function (dd) {
        var us = d.users.filter(function (u) { return u.dept === dd[0]; });
        if (dept && dd[0] !== dept) return null;
        var c = 0, sc = 0, scn = 0, sg = 0;
        us.forEach(function (u) { if (completedAll[u.id]) c++; if (signed[u.id]) sg++; (userBest[u.id] || []).forEach(function (b) { sc += b.p; scn++; }); });
        return { department: dd[0], users: us.length, completionPct: us.length ? c / us.length * 100 : 0, avgScorePct: scn ? sc / scn : 0, signedPct: us.length ? sg / us.length * 100 : 0 };
      }).filter(Boolean);
      var buckets = [["0-49", 0, 50], ["50-59", 50, 60], ["60-69", 60, 70], ["70-79", 70, 80], ["80-89", 80, 90], ["90-100", 90, 101]];
      var dist = buckets.map(function (b) { var c = 0; Object.keys(best).forEach(function (k) { var p = best[k].p; if (p >= b[1] && p < b[2]) c++; }); return { bucket: b[0], count: c }; });
      var qs = {}; A.forEach(function (a) { (a.answers || []).forEach(function (x) { var o = qs[x.questionId] = qs[x.questionId] || { a: 0, c: 0 }; o.a++; if (x.correct) o.c++; }); });
      var QB = (window.EA_QUIZ && window.EA_QUIZ.byId) || {};
      var qstats = Object.keys(qs).map(function (k) { return { questionId: k, tag: QB[k] ? QB[k].tag : k, attempts: qs[k].a, correctPct: qs[k].c / qs[k].a * 100 }; })
        .sort(function (a, b) { return a.correctPct - b.correctPct; });
      var mv = mods.map(function (m) {
        var v = 0, c = 0; E.forEach(function (e) { if (e.ref === m.id) { if (e.type === "module_view") v++; if (e.type === "module_complete") c++; } });
        return { moduleId: m.id, title: m.short || m.title, views: v, completions: c };
      });
      var recent = SO.slice().sort(function (a, b) { return b.at - a.at; }).slice(0, 8).map(function (s) {
        var u = userMap[s.userId] || {}; return { displayName: u.name, department: u.dept, signedAt: s.at.toISOString(), receiptId: s.receiptId };
      });
      var totalMin = 0; Object.keys(mins).forEach(function (k) { totalMin += mins[k]; });
      /* ---- certification & per-employee views ---- */
      d.exams = d.exams || []; d.certs = d.certs || [];
      function LV(x) { return x.level || "foundation"; }
      var LEVELS = certLevels(), byLv = {};
      LEVELS.forEach(function (L) {
        var o = byLv[L.id] = { cert: {}, best: {}, count: {}, X: [] };
        d.certs.forEach(function (c) { if (LV(c) === L.id && inSet[c.userId] && c.at <= to) o.cert[c.userId] = c; });
        d.exams.forEach(function (x) { if (LV(x) !== L.id || !inSet[x.userId]) return; o.count[x.userId] = (o.count[x.userId] || 0) + 1; if (!o.best[x.userId] || x.pct > o.best[x.userId].pct) o.best[x.userId] = x; if (x.at >= from && x.at <= to) o.X.push(x); });
      });
      var X = byLv.foundation.X, certBy = byLv.foundation.cert, exBest = byLv.foundation.best, exCount = byLv.foundation.count;
      var allDone = {}; d.events.forEach(function (e) { if (e.type === "module_complete" && inSet[e.userId]) (allDone[e.userId] = allDone[e.userId] || {})[e.ref] = 1; });
      var kbAll = {}; d.events.forEach(function (e) { if (e.type === "kb_view" && inSet[e.userId]) (kbAll[e.userId] = kbAll[e.userId] || {})[e.ref] = 1; });
      var cc = (CFG.certification || {}).unlockPct || 80;
      var unlocked = {}; Object.keys(allDone).forEach(function (u) { var t = trackStatus(allDone[u]); if (t.ea.pct >= cc && t.togaf.pct >= cc) unlocked[u] = 1; });
      function grantsFor(uid, lv) { return (d.grants || []).filter(function (g) { return g.userId === uid && (g.level || "foundation") === lv; }).reduce(function (a, g) { return a + g.extra; }, 0); }
      var maxBase = (CFG.certification || {}).maxAttempts || 3;
      function levelRow(uid, L) {
        var o = byLv[L.id], c = o.cert[uid], b = o.best[uid], t = trackStatus(allDone[uid] || {}, L.tracks);
        var pre = !L.requires || !!byLv[L.requires].cert[uid];
        return { certified: !!c, certificateId: c ? c.certificateId : null, certifiedAt: c ? c.at.toISOString() : null, bestPct: b ? b.pct : null, attempts: o.count[uid] || 0, maxAttempts: maxBase + grantsFor(uid, L.id),
          eligible: pre && Object.keys(t).every(function (k) { return t[k].pct >= cc; }) };
      }
      var logins = {}, lastSeen = {}; S.forEach(function (x) { logins[x.userId] = (logins[x.userId] || 0) + 1; if (!lastSeen[x.userId] || x.at > lastSeen[x.userId]) lastSeen[x.userId] = x.at; });
      var deptNames = this.depts.map(function (x) { return x[0]; });
      d.users.forEach(function (u) { if (deptNames.indexOf(u.dept) < 0) deptNames.push(u.dept); });
      var deptAccess = deptNames.map(function (nm) {
        if (dept && nm !== dept) return null;
        var us = d.users.filter(function (u) { return u.dept === nm; }); if (!us.length) return null;
        var r = { department: nm, users: us.length, activeUsers: 0, logins: 0, minutes: 0, certified: 0 };
        us.forEach(function (u) { if (active[u.id]) r.activeUsers++; r.logins += logins[u.id] || 0; r.minutes += mins[u.id] || 0; if (certBy[u.id]) r.certified++; });
        return r;
      }).filter(Boolean).sort(function (a, b) { return b.logins - a.logins || b.minutes - a.minutes; });
      var employees = inUsers.map(function (u) {
        var t = trackStatus(allDone[u.id] || {}), b = exBest[u.id], c = certBy[u.id];
        var kt = trackStatus(allDone[u.id] || {}, ["kbp", "kba"]), lvs = {};
        LEVELS.forEach(function (L) { lvs[L.id] = levelRow(u.id, L); });
        return { userId: u.id, displayName: u.name, email: u.email || "", department: u.dept, eaPct: t.ea.pct, togafPct: t.togaf.pct, kbpPct: kt.kbp.pct, kbaPct: kt.kba.pct, levels: lvs, kbRead: Object.keys(kbAll[u.id] || {}).length,
          examAttempts: exCount[u.id] || 0, maxAttempts: ((CFG.certification || {}).maxAttempts || 3) + (d.grants || []).filter(function (g) { return g.userId === u.id; }).reduce(function (a, g) { return a + g.extra; }, 0), bestPct: b ? b.pct : null, certified: !!c, certificateId: c ? c.certificateId : null, certifiedAt: c ? c.at.toISOString() : null,
          signed: !!signed[u.id], logins: logins[u.id] || 0, minutes: Math.round(mins[u.id] || 0), lastSeenAt: lastSeen[u.id] ? lastSeen[u.id].toISOString() : null, real: !!u.real };
      }).sort(function (a, b) { return a.displayName.localeCompare(b.displayName); });
      var topUsersByAccess = employees.filter(function (e) { return e.logins > 0; }).slice().sort(function (a, b) { return b.logins - a.logins || b.minutes - a.minutes; }).slice(0, 10)
        .map(function (e) { return { userId: e.userId, displayName: e.displayName, department: e.department, logins: e.logins, minutes: e.minutes, lastSeenAt: e.lastSeenAt }; });
      var topScorers = employees.filter(function (e) { return e.bestPct !== null; }).slice().sort(function (a, b) { return b.bestPct - a.bestPct || (a.certifiedAt || "z").localeCompare(b.certifiedAt || "z"); }).slice(0, 10)
        .map(function (e) { return { userId: e.userId, displayName: e.displayName, department: e.department, bestPct: e.bestPct, attempts: e.examAttempts, certified: e.certified, certifiedAt: e.certifiedAt }; });
      var topScorersByLevel = {};
      LEVELS.forEach(function (L) {
        topScorersByLevel[L.id] = employees.filter(function (e) { return e.levels[L.id].bestPct !== null; }).slice().sort(function (a, b) { return b.levels[L.id].bestPct - a.levels[L.id].bestPct || (a.levels[L.id].certifiedAt || "z").localeCompare(b.levels[L.id].certifiedAt || "z"); }).slice(0, 10)
          .map(function (e) { var r = e.levels[L.id]; return { userId: e.userId, displayName: e.displayName, department: e.department, bestPct: r.bestPct, attempts: r.attempts, certified: r.certified, certifiedAt: r.certifiedAt }; });
      });
      var certifiedByLevel = {}, levelsSum = LEVELS.map(function (L) {
        var cn = Object.keys(byLv[L.id].cert).length; certifiedByLevel[L.id] = cn;
        return { level: L.id, title: L.title, unlocked: employees.filter(function (e) { return e.levels[L.id].eligible || e.levels[L.id].certified; }).length, certified: cn, attempts: byLv[L.id].X.length };
      });
      var distX = buckets.map(function (bk) { var c = 0; Object.keys(exBest).forEach(function (k) { var p = exBest[k].pct; if (p >= bk[1] && p < bk[2]) c++; }); return { bucket: bk[0], count: c }; });
      var nCert = n(certBy), bestAvg = (function () { var t = 0, c = 0; Object.keys(exBest).forEach(function (k) { t += exBest[k].pct; c++; }); return c ? t / c : 0; })();
      var exPass = X.length ? X.filter(function (x) { return x.passed; }).length / X.length * 100 : 0;
      return {
        kpis: { enrolled: inUsers.length, activeUsers: n(active), logins: S.length, avgScorePct: bestAvg, passRatePct: exPass, examAttempts: X.length,
          certified: nCert, certifiedByLevel: certifiedByLevel, certifiedRatePct: inUsers.length ? nCert / inUsers.length * 100 : 0,
          signoffRatePct: inUsers.length ? n(signed) / inUsers.length * 100 : 0, avgMinutesPerUser: n(active) ? totalMin / n(active) : 0 },
        loginsByDay: days.map(function (k) { return { date: k, logins: byDay[k].logins, uniqueUsers: n(byDay[k].u) }; }),
        loginHeatmap: heat,
        funnel: { enrolled: inUsers.length, startedLearning: n(started), examUnlocked: n(unlocked), certified: nCert, signedOff: n(signed), completedModules: n(unlocked), passedAssessment: nCert },
        byDepartment: deptRows.map(function (r) { var da = deptAccess.filter(function (x) { return x.department === r.department; })[0]; r.certifiedPct = r.users && da ? da.certified / r.users * 100 : 0; return r; }),
        scoreDistribution: distX, questionStats: qstats, moduleViews: mv, recentSignoffs: recent,
        deptAccess: deptAccess, topUsersByAccess: topUsersByAccess, topScorers: topScorers, topScorersByLevel: topScorersByLevel, levels: levelsSum, employees: employees,
        departments: deptNames
      };
    }
  };

  /* =================================================================
     REST ADAPTER
     ================================================================= */
  var Rest = {
    name: "rest",
    _tok: function () { return load("jwt", null); },
    _call: function (method, path, body, raw) {
      var h = { "Accept": "application/json" };
      if (body !== undefined) h["Content-Type"] = "application/json";
      var t = this._tok(); if (t) h.Authorization = "Bearer " + t;
      return fetch((CFG.apiBase || "/api/v1") + path, { method: method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined, credentials: "same-origin" })
        .then(function (r) {
          if (r.status === 204) return null;
          if (raw) return r.ok ? r.text() : r.json().then(function (j) { throw ApiError(j.error.code, j.error.message); });
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok) { if (r.status === 401 && (!j.error || j.error.code === "unauthorized")) localStorage.removeItem(LS + "jwt"); throw ApiError((j.error && j.error.code) || "http_" + r.status, (j.error && j.error.message) || r.statusText); }
            return j;
          });
        });
    },
    requestOtp: function (email, purpose) { return this._call("POST", "/auth/otp/request", { email: email, purpose: purpose === "reset" ? "reset" : "signup" }); },
    verifyOtp: function (id, code) { return this._call("POST", "/auth/otp/verify", { challengeId: id, code: code }); },
    setPassword: function (setupToken, password) { return this._call("POST", "/auth/password", { setupToken: setupToken, password: password }).then(function (r) { save("jwt", r.token); return r; }); },
    login: function (email, password) { return this._call("POST", "/auth/login", { email: email, password: password }).then(function (r) { save("jwt", r.token); return r; }); },
    changePassword: function (current, next) { return this._call("POST", "/auth/password/change", { currentPassword: current, newPassword: next }); },
    logout: function () { var self = this; return this._call("POST", "/auth/logout").catch(function () {}).then(function () { localStorage.removeItem(LS + "jwt"); }); },
    heartbeat: function () { return this._tok() ? this._call("POST", "/auth/heartbeat").catch(function () {}) : Promise.resolve(); },
    me: function () { return this._tok() ? this._call("GET", "/me") : Promise.reject(ApiError("unauthorized")); },
    updateMe: function (p) { return this._call("PATCH", "/me", p); },
    logEvent: function (type, ref, meta) { return this._tok() ? this._call("POST", "/events", { type: type, ref: ref, meta: meta }).catch(function () {}) : Promise.resolve(); },
    progress: function () { return this._call("GET", "/me/progress"); },
    saveAttempt: function (a) { return this._call("POST", "/quiz/attempts", a); },
    signoff: function (password, v, sha) { return this._call("POST", "/signoff", { password: password, statementVersion: v, sha256: sha }); },
    dashboard: function (f) {
      var q = []; f = f || {}; ["from", "to", "department"].forEach(function (k) { if (f[k]) q.push(k + "=" + encodeURIComponent(f[k])); });
      return this._call("GET", "/admin/dashboard" + (q.length ? "?" + q.join("&") : ""));
    },
    startExam: function (level) { return this._call("POST", "/cert/exams", { level: level || "foundation" }); },
    submitExam: function (id, body) { return this._call("POST", "/cert/exams/" + encodeURIComponent(id) + "/submit", body); },
    verifyCertificate: function (id) { return this._call("GET", "/cert/verify/" + encodeURIComponent(id)); },
    grantCertAttempts: function (userId, extra, note, level) { return this._call("POST", "/admin/users/" + encodeURIComponent(userId) + "/cert-attempts", { extra: extra || 1, note: note || "", level: level || "foundation" }); },
    exportCsv: function (kind) { return this._call("GET", "/admin/export?kind=" + kind, undefined, true); }
  };

  window.EA_API = CFG.apiMode === "rest" ? Rest : Mock;
  window.EA_API.scoreAnswer = scoreAnswer;
  window.EA_API.domainOk = domainOk;
  window.EA_API.passwordIssue = passwordIssue;
  window.EA_API.isReviewer = isReviewer;
  window.EA_API.certLevels = certLevels;
  window.EA_API.trackItems = trackItems;
})();
