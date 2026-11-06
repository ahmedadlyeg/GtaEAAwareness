/* =====================================================================
   EA Awareness Hub — application (router, views, quiz engine)
   ===================================================================== */
(function () {
  "use strict";
  var API = window.EA_API, CFG = window.EA_CONFIG || {}, DG = window.EA_DIAGRAMS, CH = window.EA_CHARTS;
  var CONTENT = window.EA_CONTENT, QUIZ = window.EA_QUIZ, TOG = window.TOGAF || {}, KB = window.KB_ARTICLES || [];
  var state = { user: null, progress: null, hb: null };
  var app = document.getElementById("app");
  var nonitLang = (function () { try { return localStorage.getItem("eahub.nonit.lang") === "ar" ? "ar" : "en"; } catch (e) { return "en"; } })();
  var nonitExample = "without";

  // the TOGAF section counts as a (mandatory) module for progress and sign-off
  var TOGAF_MOD = { id: "togaf", n: "T", title: "TOGAF deep dive", short: "TOGAF deep dive", mandatory: true, virtual: true };
  if (!CONTENT.modules.some(function (m) { return m.id === "togaf"; })) CONTENT.modules.push(TOGAF_MOD);
  var LEARN = CONTENT.modules.filter(function (m) { return !m.virtual; });

  /* ---------------- helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function initials(n) { return String(n || "?").split(" ").map(function (s) { return s.charAt(0); }).join("").slice(0, 2).toUpperCase(); }
  function fmtDate(iso, time) { var d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + (time ? " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : ""); }
  function toast(html, ms) { var t = document.createElement("div"); t.className = "toast"; t.innerHTML = html; document.body.appendChild(t); requestAnimationFrame(function () { t.classList.add("on"); }); setTimeout(function () { t.classList.remove("on"); setTimeout(function () { t.remove(); }, 300); }, ms || 3800); }
  var ICON = {
    home: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    layers: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5" opacity=".5"/></svg>',
    cycle: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v3M20 12h-3M12 20v-3M4 12h3"/></svg>',
    book: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/></svg>',
    pen: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    chart: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    award: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="M8.5 13.7L7 22l5-3 5 3-1.5-8.3"/></svg>',
    lock: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    briefcase: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>',
    arrow: "→"
  };

  /* ---------------- progress & preconditions ---------------- */
  function mandatoryModules() { return CONTENT.modules.filter(function (m) { return m.mandatory; }); }
  function mandatoryRounds() { return QUIZ.rounds.filter(function (r) { return r.mandatory; }); }
  var CERT = CFG.certification || {};
  var TOPICS = CONTENT.togafTopics || [];
  var LEVELS = API.certLevels ? API.certLevels() : [{ id: "foundation", title: "Enterprise Architecture Foundation", short: "Foundation", requires: null, tracks: ["ea", "togaf"] }];
  function levelDef(id) { return LEVELS.filter(function (l) { return l.id === (id || "foundation"); })[0] || LEVELS[0]; }
  var TRACK_LABEL = { ea: ["EA Foundation modules", "#/ea"], togaf: ["TOGAF topics", "#/togaf"], kbp: ["Practitioner knowledge-base articles", "#/kb?l=Practitioner"], kba: ["Advanced knowledge-base articles", "#/kb?l=Advanced"] };
  function certState(p, level) {
    p = p || state.progress || {};
    if (level && level !== "foundation") { var cl = (p.certifications || {})[level]; if (cl) return cl; var L = levelDef(level), tr = {}; (L.tracks || []).forEach(function (k) { tr[k] = { done: 0, total: 1, pct: 0 }; }); return { level: level, title: L.title, requires: L.requires, prerequisiteMet: false, unlockPct: CERT.unlockPct || 80, passPct: CERT.passPct || 70, maxAttempts: CERT.maxAttempts || 3, attemptsUsed: 0, eligible: false, track: tr, inProgress: null, exams: [], certificate: null }; }
    var c = (p.certifications && p.certifications.foundation) || p.certification;
    if (c) return c;
    return { unlockPct: CERT.unlockPct || 80, passPct: CERT.passPct || 70, maxAttempts: CERT.maxAttempts || 3, attemptsUsed: 0, eligible: false, track: { ea: { done: 0, total: LEARN.length, pct: 0 }, togaf: { done: 0, total: TOPICS.length, pct: 0 } }, inProgress: null, exams: [], certificate: null };
  }
  window.EA_signoffPreconditions = function (p) {
    p = p || {};
    var c = certState(p);
    var items = [
      { id: "ea", title: "EA Foundation modules — " + c.track.ea.done + " / " + c.track.ea.total, ok: c.track.ea.pct >= c.unlockPct, href: "#/ea" },
      { id: "togaf", title: "TOGAF topics — " + c.track.togaf.done + " / " + c.track.togaf.total, ok: c.track.togaf.pct >= c.unlockPct, href: "#/togaf" },
      { id: "cert", title: "Foundation certificate earned", ok: !!c.certificate, href: "#/cert" }
    ];
    return { ok: !!c.certificate, items: items, mods: [], rounds: [] };
  };
  function refreshProgress() { return API.progress().then(function (p) { state.progress = p; return p; }); }
  function pctDone() {
    var p = state.progress; if (!p) return 0;
    var c = certState(p), t = c.track;
    var read = (t.ea.done + t.togaf.done) / Math.max(1, t.ea.total + t.togaf.total);
    return read * 75 + (c.certificate ? 20 : 0) + (p.signoff ? 5 : 0);
  }
  function examStatus(c) {
    c = c || certState();
    if (c.certificate) return "certified";
    if (c.inProgress) return "in_progress";
    if (!c.eligible) return "locked";
    if (c.attemptsUsed >= c.maxAttempts) return "exhausted";
    return "ready";
  }
  function unlockWatch(before) {
    var c = certState();
    if (!before && c.eligible && !c.certificate) toast("<b>Certification exam unlocked.</b> You have completed " + c.unlockPct + "% of both tracks — <a href='#/cert' style='color:#C9B37A'>open the certification path</a>.", 6000);
  }
  function isDone(id) { return state.progress && state.progress.modulesCompleted.indexOf(id) >= 0; }
  function canBank() { return state.user && (state.user.reviewer || state.user.role === "admin" || state.user.role === "ea_team"); }
  function isAdmin() { return state.user && (state.user.role === "admin" || state.user.role === "ea_team"); }

  /* ---------------- shell ---------------- */
  var NAV = [["home", "Home", "home"], ["nonit", "EA for Non-IT", "briefcase"], ["ea", "EA Foundations", "layers"], ["togaf", "TOGAF", "cycle"], ["kb", "Knowledge Base", "book"], ["cert", "Certification path", "award"], ["signoff", "Sign-off", "pen"], ["dashboard", "Dashboard", "chart"]];
  function shell(active, inner) {
    var u = state.user;
    var nav = NAV.filter(function (n) { return n[0] !== "dashboard" || isAdmin(); }).map(function (n) {
      return '<a href="#/' + n[0] + '" class="' + (active === n[0] ? "on" : "") + '">' + ICON[n[2]] + n[1] + "</a>";
    }).join("");
    return (API.name === "mock" ? '<div class="modebar"><b>DEMO MODE</b> · data is stored in this browser only. Switch <code>apiMode</code> to <code>"rest"</code> in js/config.js to use the server.</div>' : "") +
      '<header class="topbar"><div class="wrap topbar-in"><a class="brand" href="#/home"><img src="assets/img/logo-white.png" alt="General Tax Authority"><span class="brand-sep"></span><span class="brand-t"><b>EA Awareness Hub</b><span>Information Technology · GEA-aligned</span></span></a>' +
      '<button class="menu-btn" aria-label="Menu" onclick="document.querySelector(\'.nav\').classList.toggle(\'open\')"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<nav class="nav" aria-label="Main">' + nav + "</nav>" +
      (u ? '<div class="user-chip"><a href="#/profile" title="Profile" style="display:flex;align-items:center;gap:9px;color:#fff"><span class="avatar">' + esc(initials(u.displayName)) + '</span><span class="nm">' + esc(u.displayName) + '</span></a><button id="logout">Sign out</button></div>' : "") +
      "</div></header><main id=\"main\">" + inner + "</main>" +
      '<footer class="footer plate"><div class="wrap"><img src="assets/img/logo-white.png" alt="General Tax Authority"><div>Enterprise Architecture Awareness Hub · For GTA IT staff<br><span style="opacity:.7">Content aligned to the TOGAF® Standard, 10th Edition and ArchiMate® 4. TOGAF and ArchiMate are registered trademarks of The Open Group.</span></div></div></footer>';
  }
  /* if the menu does not fit, collapse the brand text so no tab is hidden */
  function fitNav() {
    var tb = $(".topbar"), nv = $(".nav"); if (!tb || !nv || window.innerWidth <= 1080) { if (tb) tb.classList.remove("compact"); return; }
    tb.classList.remove("compact");
    if (nv.scrollWidth > nv.clientWidth + 1) tb.classList.add("compact");
  }
  window.addEventListener("resize", function () { clearTimeout(fitNav._t); fitNav._t = setTimeout(fitNav, 120); });
  function mount(active, inner, after) {
    app.innerHTML = shell(active, inner);
    var lo = $("#logout"); if (lo) lo.onclick = function () { API.logout().then(function () { state.user = null; clearInterval(state.hb); location.hash = "#/login"; route(); }); };
    hydrateFigures(app);
    fitNav();
    window.scrollTo(0, 0);
    if (after) after();
  }
  function phead(eyebrow, title, sub, meta) {
    return '<section class="plate phead"><div class="wrap"><div><div class="eyebrow">' + eyebrow + "</div><h1>" + title + "</h1><p>" + sub + "</p></div>" + (meta ? '<div class="ph-meta">' + meta + "</div>" : "") + "</div></section>";
  }
  function hydrateFigures(root) {
    $$("figure[data-dg]", root).forEach(function (f) {
      var id = f.getAttribute("data-dg"); var cap = f.getAttribute("data-cap");
      f.className = "fig"; f.innerHTML = DG.render(id) + (cap ? "<figcaption><b>Figure</b>" + esc(cap) + "</figcaption>" : "");
    });
    $$(".strip[data-img]", root).forEach(function (s) { s.style.backgroundImage = "url(assets/img/" + s.getAttribute("data-img") + ".jpg)"; });
    $$("[data-scale]", root).forEach(function (s) {
      var c = TOG.compliance || [];
      var col = ["#8C93A0", "#C9B37A", "#2F6DB8", "#138A72", "#0B5F4F", "#B42318"];
      s.className = "scale"; s.innerHTML = c.map(function (x, i) { return '<div style="border-top:4px solid ' + col[i] + '"><b>' + esc(x.t) + "</b>" + esc(x.d) + "</div>"; }).join("");
    });
  }

  /* ---------------- login ---------------- */
  function viewLogin() {
    document.title = "Sign in · EA Awareness Hub";
    app.innerHTML =
      '<div class="login"><section class="plate login-art"><div class="hero-bg" style="background-image:url(assets/img/skyline-night.jpg)"></div>' +
      '<div><img src="assets/img/logo-white.png" alt="General Tax Authority" style="height:54px"></div>' +
      '<div><div class="eyebrow" style="color:#C9B37A">Enterprise Architecture · IT awareness programme</div><h1>See how the Authority fits together — before you change it.</h1><p>A self-paced course on Enterprise Architecture, the Qatar GEA and the TOGAF® Standard — with a searchable knowledge base, certification paths and certificates from the IT Department.</p></div>' +
      '<div class="hero-stats"><div><b>' + LEARN.length + '</b><span>modules</span></div><div><b>10</b><span>ADM phases</span></div><div><b>' + KB.length + '</b><span>KB articles</span></div><div><b>' + QUIZ.questions.length + '</b><span>questions</span></div></div></section>' +
      '<section class="login-form"><div class="login-box" id="lb"></div></section></div>';
    var box = $("#lb"), ch = null, email = "", setup = null, mode = "signup";
    var dom = esc((CFG.allowedDomains || ["gta.gov.qa"])[0]);
    function head(eb, h2, p) { return '<img src="assets/img/logo-color.png" alt="General Tax Authority"><div class="eyebrow">' + eb + "</div><h2>" + h2 + '</h2><p class="muted">' + p + "</p>"; }
    function full(b2) { b2.style.width = "100%"; b2.style.justifyContent = "center"; }
    function signin(err, info) {
      box.innerHTML = head("Sign in", "Welcome back", "Use your GTA email address and your password.") +
        (info ? '<div class="callout note" style="margin:0 0 14px"><b>Done</b>' + info + "</div>" : "") +
        '<form id="fs"><div class="field"><label for="em">GTA email address</label><input id="em" type="email" autocomplete="username" placeholder="name@' + dom + '" required value="' + esc(email) + '"></div>' +
        '<div class="field"><label for="pw">Password</label><div class="pwrap"><input id="pw" type="password" autocomplete="current-password" required><button type="button" class="pwshow" aria-label="Show password">Show</button></div></div>' +
        '<div class="err" id="er">' + (err || "") + '</div><button class="btn btn-m" id="sbtn" type="submit">Sign in</button></form>' +
        '<div class="auth-links"><a href="#" id="toSignup">First time here? <b>Create your account</b></a><a href="#" id="toReset">Forgot password?</a></div>' +
        (API.name === "mock" ? '<p class="fine" style="margin-top:16px">Demo mode: any <code>@gta.gov.qa</code> address works — create an account first. <code>ea.team@gta.gov.qa</code> gets the administrator dashboard.</p>' : "") +
        '<p class="fine">Sign-in times are recorded to measure programme participation, in line with GTA data-protection policy.</p>';
      full($("#sbtn")); wirePw(box);
      (email ? $("#pw") : $("#em")).focus();
      $("#toSignup").onclick = function (e) { e.preventDefault(); email = $("#em").value.trim().toLowerCase(); mode = "signup"; start(); };
      $("#toReset").onclick = function (e) { e.preventDefault(); email = $("#em").value.trim().toLowerCase(); mode = "reset"; start(); };
      $("#fs").onsubmit = function (e) {
        e.preventDefault(); email = $("#em").value.trim().toLowerCase(); var bt = $("#sbtn"); bt.disabled = true; bt.textContent = "Signing in…"; $("#er").textContent = "";
        API.login(email, $("#pw").value).then(done).catch(function (x) {
          bt.disabled = false; bt.textContent = "Sign in";
          if (x.code === "password_not_set") { mode = "signup"; start(null, "Your account is not set up yet. We'll send a one-time code to finish creating it."); return; }
          $("#er").innerHTML = esc(x.message) + (x.code === "account_locked" ? ' <a href="#" id="rl">Reset password</a>' : "");
          var rl = $("#rl"); if (rl) rl.onclick = function (ev) { ev.preventDefault(); mode = "reset"; start(); };
        });
      };
    }
    function start(err, info) {
      var su = mode === "signup";
      box.innerHTML = head(su ? "First-time sign-up" : "Reset password", su ? "Create your account" : "Forgot your password?", su ? "Enter your GTA email. We'll send a one-time code to confirm it's yours — you only do this once, then you sign in with your email and a password you choose." : "Enter your GTA email. If it has an account, we'll send a one-time code so you can choose a new password.") +
        (info ? '<div class="callout note" style="margin:0 0 14px"><b>Note</b>' + esc(info) + "</div>" : "") +
        '<form id="f1"><div class="field"><label for="em">GTA email address</label><input id="em" type="email" autocomplete="email" placeholder="name@' + dom + '" required value="' + esc(email) + '"></div><div class="err" id="er">' + esc(err || "") + '</div><button class="btn btn-m" id="obtn" type="submit">Send my one-time code</button></form>' +
        '<div class="auth-links"><a href="#" id="toSignin">← Back to sign in</a></div>';
      full($("#obtn")); $("#em").focus();
      $("#toSignin").onclick = function (e) { e.preventDefault(); signin(); };
      $("#f1").onsubmit = function (e) {
        e.preventDefault(); email = $("#em").value.trim().toLowerCase();
        $("#er").textContent = ""; var bt = $("#obtn"); bt.disabled = true; bt.textContent = "Sending…";
        API.requestOtp(email, mode).then(function (r) { ch = r; code(); }).catch(function (x) {
          bt.disabled = false; bt.textContent = "Send my one-time code";
          if (x.code === "account_exists") { signin(esc(x.message)); return; }
          $("#er").textContent = x.message;
        });
      };
    }
    function code(err) {
      box.innerHTML = head("Check your inbox", "Enter the 6-digit code", "Sent to <b>" + esc(ch.maskedEmail) + "</b>. It expires in 10 minutes." + (mode === "reset" ? " If you don't receive it, check the address is the one you registered." : "")) +
        (ch.devCode ? '<div class="devcode">Demo mode — your code is <b>' + ch.devCode + "</b></div>" : "") +
        '<form id="f2">' + otpInputs() + '<div class="err" id="er">' + esc(err || "") + '</div><button class="btn btn-m" id="vbtn" type="submit">Verify</button></form>' +
        '<div class="auth-links"><a href="#" id="back">Use a different email</a><a href="#" id="again">Send a new code</a></div>';
      full($("#vbtn")); wireOtp(box);
      $("#back").onclick = function (e) { e.preventDefault(); start(); };
      $("#again").onclick = function (e) { e.preventDefault(); API.requestOtp(email, mode).then(function (r) { ch = r; code(); toast("A new code is on its way."); }); };
      $("#f2").onsubmit = function (e) {
        e.preventDefault();
        API.verifyOtp(ch.challengeId, readOtp(box)).then(function (r) { setup = r; choose(); }).catch(function (x) { $("#er").textContent = x.message; });
      };
    }
    function choose(err) {
      var su = mode === "signup";
      box.innerHTML = head(su ? "Email confirmed" : "Choose a new password", su ? "Choose your password" : "Set a new password", "From now on you'll sign in with <b>" + esc(email) + "</b> and this password.") +
        '<form id="fp"><div class="field"><label for="p1">Password</label><div class="pwrap"><input id="p1" type="password" autocomplete="new-password" required><button type="button" class="pwshow" aria-label="Show password">Show</button></div></div>' +
        '<ul class="pwrules" id="rules"><li data-r="len">At least 10 characters</li><li data-r="mix">At least one letter and one number</li><li data-r="name">Doesn\'t contain your email name</li></ul>' +
        '<div class="field"><label for="p2">Confirm password</label><input id="p2" type="password" autocomplete="new-password" required></div>' +
        '<div class="err" id="er">' + esc(err || "") + '</div><button class="btn btn-m" id="pbtn" type="submit">' + (su ? "Create account" : "Save new password") + "</button></form>";
      full($("#pbtn")); wirePw(box); $("#p1").focus();
      var local = email.split("@")[0];
      $("#p1").oninput = function () {
        var v = this.value;
        var ok = { len: v.length >= 10, mix: /[A-Za-z]/.test(v) && /[0-9]/.test(v), name: !!v && (local.length < 3 || v.toLowerCase().indexOf(local) < 0) };
        $$("#rules li").forEach(function (li) { li.className = ok[li.getAttribute("data-r")] ? "ok" : ""; });
      };
      $("#fp").onsubmit = function (e) {
        e.preventDefault(); var p1 = $("#p1").value, p2 = $("#p2").value;
        if (p1 !== p2) { $("#er").textContent = "The two passwords don't match."; return; }
        var issue = API.passwordIssue ? API.passwordIssue(p1, email) : null; if (issue) { $("#er").textContent = issue; return; }
        var bt = $("#pbtn"); bt.disabled = true;
        API.setPassword(setup.setupToken, p1).then(function (r) { toast(su ? "<b>Account created.</b> Next time, sign in with your email and password." : "<b>Password updated.</b>"); done(r); })
          .catch(function (x) { bt.disabled = false; if (x.code === "setup_expired" || x.code === "otp_expired" || x.code === "unauthorized") { start(x.message); return; } $("#er").textContent = x.message; });
      };
    }
    function done(r) { state.user = r.user; startHeartbeat(); if (!r.user.department) step3(); else { location.hash = "#/home"; route(); } }
    function step3() {
      var depts = ["Information Technology", "Planning & Quality", "Financial & Administrative Affairs", "Public Relations & Communication", "Internal Audit", "Legal Affairs", "Human Resources", "Taxpayer Services", "Consumption Tax", "Income Tax", "Tax Treaties & International Cooperation", "Tax Policies", "Tax Revenues", "Other"];
      box.innerHTML = '<img src="assets/img/logo-color.png" alt="General Tax Authority"><div class="eyebrow">One-time setup</div><h2>Welcome, ' + esc(state.user.displayName.split(" ")[0]) + '</h2><p class="muted">Tell us where you work so progress can be reported by department.</p>' +
        '<form id="f3"><div class="field"><label for="dn">Display name</label><input id="dn" value="' + esc(state.user.displayName) + '" required></div>' +
        '<div class="field"><label for="dp">Department</label><select id="dp">' + depts.map(function (d) { return "<option>" + esc(d) + "</option>"; }).join("") + '</select></div>' +
        '<div class="field"><label for="jt">Job title (optional)</label><input id="jt" placeholder="e.g., Integration Engineer"></div><button class="btn btn-m" style="width:100%;justify-content:center">Start learning</button></form>';
      $("#f3").onsubmit = function (e) {
        e.preventDefault();
        API.updateMe({ displayName: $("#dn").value.trim(), department: $("#dp").value, jobTitle: $("#jt").value.trim() }).then(function (r) { state.user = r.user; location.hash = "#/home"; route(); });
      };
    }
    signin();
  }
  function wirePw(root) { $$(".pwshow", root).forEach(function (b) { b.onclick = function () { var i = b.previousElementSibling; i.type = i.type === "password" ? "text" : "password"; b.textContent = i.type === "password" ? "Show" : "Hide"; }; }); }
  function otpInputs() { var s = '<div class="otp">'; for (var i = 0; i < 6; i++) s += '<input inputmode="numeric" maxlength="1" aria-label="Digit ' + (i + 1) + '" autocomplete="one-time-code">'; return s + "</div>"; }
  function wireOtp(root) {
    var ins = $$(".otp input", root); ins[0].focus();
    ins.forEach(function (inp, i) {
      inp.addEventListener("input", function () { inp.value = inp.value.replace(/\D/g, "").slice(-1); if (inp.value && i < 5) ins[i + 1].focus(); });
      inp.addEventListener("keydown", function (e) { if (e.key === "Backspace" && !inp.value && i > 0) ins[i - 1].focus(); });
      inp.addEventListener("paste", function (e) { var t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6); if (t.length) { e.preventDefault(); t.split("").forEach(function (c, k) { if (ins[k]) ins[k].value = c; }); ins[Math.min(5, t.length - 1)].focus(); } });
    });
  }
  function readOtp(root) { return $$(".otp input", root).map(function (i) { return i.value; }).join(""); }
  function startHeartbeat() {
    clearInterval(state.hb);
    state.hb = setInterval(function () { if (document.visibilityState === "visible") API.heartbeat(); }, (CFG.heartbeatSeconds || 60) * 1000);
  }

  /* ---------------- home ---------------- */
  function viewHome() {
    document.title = "EA Awareness Hub · General Tax Authority";
    var p = state.progress, c = certState(p), t = c.track, es = examStatus(c);
    var modsDone = t.ea.done, topicsDone = t.togaf.done;
    var next = (function () {
      if (es === "certified") return p.signoff ? ["Certified", "View your certificate", "#/cert/certificate"] : ["Certified — final step", "Sign the acknowledgement", "#/signoff"];
      if (es === "in_progress") return ["Resume your exam", "Attempt " + c.inProgress.attemptNo + " of " + c.maxAttempts + " is open", "#/cert/exam"];
      if (es === "ready") return ["Exam unlocked", "Take the Foundation certification exam", "#/cert"];
      if (es === "exhausted") return ["Attempts used", "Contact the EA team for another attempt", "#/cert"];
      var m = LEARN.filter(function (x) { return !isDone(x.id); })[0];
      if (t.ea.pct < c.unlockPct && m) return ["Continue with module " + m.n, m.title, "#/ea/" + m.id];
      var tp = TOPICS.filter(function (x) { return !isDone(x.id); })[0];
      if (tp) return ["Continue TOGAF", tp.title, "#/togaf?t=" + tp.sec];
      return ["Certification path", "See what is left", "#/cert"];
    })();
    var esTxt = { certified: "Certified", in_progress: "In progress", ready: "Unlocked", exhausted: "Attempts used", locked: "Locked" }[es];
    var pathCards = [
      ["01", "EA Foundations", "Eleven modules: 42010 concepts, GEA dimensions, frameworks, the Qatar GEA, GTA's baseline, business, information, integration, infrastructure, security, governance and maturity.", "#/ea", t.ea.pct, modsDone + " / " + t.ea.total + " modules · " + c.unlockPct + "% to unlock", "layers"],
      ["02", "TOGAF", "Eleven topics: the ADM phase by phase, continuum, repository, content metamodel, GEA and TOGAF principles, governance and agile.", "#/togaf", t.togaf.pct, topicsDone + " / " + t.togaf.total + " topics · " + c.unlockPct + "% to unlock", "cycle"],
      ["03", "Knowledge Base", KB.length + " articles, templates and checklists. Part C of the exam is drawn from here — GEA standards, ADRs, STRIDE, resilience, integration and GTA's baseline.", "#/kb", Math.min(100, (p.kbViewed || 0) / 15 * 100), (p.kbViewed || 0) + " articles read · recommended", "book"],
      ["04", "Certification paths", "Foundation → Practitioner → Advanced. Each path has its own exam (" + c.passPct + "% to pass, " + c.maxAttempts + " attempts) and a certificate from the IT Department. Practitioner and Advanced unlock by studying those knowledge-base articles.", "#/cert", es === "certified" ? 100 : es === "locked" ? 0 : 50, LEVELS.map(function (l) { return certState(p, l.id).certificate ? "✓ " + l.short : ""; }).filter(Boolean).join(" · ") || "Foundation: " + esTxt, "award"]
    ];
    var html =
      '<section class="plate hero"><div class="hero-bg" style="background-image:url(assets/img/skyline-night.jpg)"></div><div class="wrap">' +
      '<div><div class="eyebrow">Enterprise Architecture awareness · GTA IT</div><h1>Architecture is how the Authority holds together.</h1>' +
      '<p class="lede">A self-paced Foundation course for everyone in GTA IT — engineers, analysts, security, infrastructure and project teams. Learn the discipline, the Qatar GEA and the TOGAF method, pass the exam and earn your certificate from the IT Department.</p>' +
      '<div class="hero-cta"><a class="btn btn-gold" href="' + next[2] + '">' + esc(next[0]) + " " + ICON.arrow + '</a><a class="btn btn-ghost" href="#/kb">Search the knowledge base</a></div>' +
      '<div class="hero-stats"><div><b>' + LEARN.length + '</b><span>Modules</span></div><div><b>' + (TOG.phases || []).length + '</b><span>ADM phases</span></div><div><b>' + KB.length + '</b><span>KB articles</span></div><div><b>' + QUIZ.questions.length + '</b><span>Exam bank</span></div></div></div>' +
      '<div class="hero-card"><div style="display:flex;gap:18px;align-items:center"><div style="width:130px;flex:none">' + CH.ring(pctDone(), "#C9B37A", "your progress").replace('stroke="#F1ECEE"', 'stroke="rgba(255,255,255,.18)"').replace('fill="#16181D"', 'fill="#fff"') + '</div>' +
      '<div><div class="eyebrow" style="color:#C9B37A">Next step</div><div style="font-size:19px;font-weight:800;line-height:1.35;margin:6px 0 10px">' + esc(next[1]) + '</div><a class="btn btn-white btn-sm" href="' + next[2] + '">Go ' + ICON.arrow + "</a></div></div>" +
      '<div style="margin-top:18px;border-top:1px solid rgba(255,255,255,.18);padding-top:14px;font-size:13.5px;display:grid;gap:6px">' +
      "<div>EA Foundation modules <b style='float:right'>" + modsDone + " / " + t.ea.total + "</b></div><div>TOGAF topics <b style='float:right'>" + topicsDone + " / " + t.togaf.total + "</b></div><div>Certification exam <b style='float:right'>" + esTxt + "</b></div><div>Acknowledgement <b style='float:right'>" + (p.signoff ? "Signed " + fmtDate(p.signoff.signedAt) : "Pending") + "</b></div></div></div>" +
      "</div></section>" +
      '<section class="section"><div class="wrap"><div class="sec-h"><div><div class="eyebrow">Foundation track</div><h2>Four steps to your certificate</h2><div class="rule"></div></div><p>Mark each module and topic as completed as you go. The exam unlocks at ' + c.unlockPct + "% of EA Foundations and " + c.unlockPct + "% of TOGAF; score " + c.passPct + "% to certify.</p></div>" +
      '<div class="grid g4">' + pathCards.map(function (c) {
        return '<a class="card hov path" href="' + c[3] + '"><div class="card-top"></div><svg class="bgicon" viewBox="0 0 24 24">' + ICON[c[6]].replace(/^<svg[^>]*>/, "").replace("</svg>", "") + '</svg><span class="num">STEP ' + c[0] + "</span><h3>" + c[1] + "</h3><p>" + c[2] + '</p><div class="progress"><i style="width:' + c[4] + '%"></i></div><div style="display:flex;justify-content:space-between;margin-top:8px;font-size:12.5px;color:#5E6573"><span>' + c[5] + '</span><span class="go">Open ' + ICON.arrow + "</span></div></a>";
      }).join("") + "</div></div></section>" +
      '<section class="section" style="padding-top:0"><div class="wrap"><div class="grid g2" style="align-items:center;gap:40px"><div><div class="eyebrow">The big picture</div><h2 style="font-size:30px;color:#33091F;margin-top:6px">One description, many decisions</h2><div class="rule"></div>' +
      '<p class="muted" style="margin-top:16px;font-size:16.5px">Every change you make — a new API, a database migration, a SaaS subscription, a firewall rule — lands somewhere in this picture and affects things above and below it. Enterprise Architecture keeps that picture described, connected and current so impact is a query, not a week of meetings.</p>' +
      '<div class="chips" style="margin-top:14px"><a class="chip" href="#/ea/m2">Domains &amp; traceability</a><a class="chip" href="#/togaf">The ADM</a><a class="chip" href="#/kb?c=Templates%20%26%20Checklists">Templates</a><a class="chip" href="#/ea/m8">Governance</a></div></div>' +
      '<figure data-dg="ea-domains" data-cap="Strategy, the four core domains and cross-cutting concerns."></figure></div></div></section>' +
      '<section class="section" style="padding-top:0"><div class="wrap"><div class="strip" data-img="skyline-fog"><div class="in"><span class="eyebrow" style="color:#C9B37A">Why now</span><h3>Strategy 2025 needs architecture</h3><p>Digitised processes, a national data hub and trusted services all depend on knowing how systems, data and processes connect. That knowledge has to be shared by everyone who changes them.</p></div></div></div></section>' +
      '<section class="section" style="padding-top:0"><div class="wrap"><div class="sec-h"><div><div class="eyebrow">From the knowledge base</div><h2>Start with these</h2><div class="rule"></div></div><a class="btn btn-line" href="#/kb">All ' + KB.length + " articles " + ICON.arrow + '</a></div><div class="grid g3">' +
      KB.filter(function (a) { return a.cat === "Templates & Checklists"; }).slice(0, 3).concat(KB.filter(function (a) { return a.cat === "TOGAF"; }).slice(0, 3)).map(function (a) { return kbCard(a); }).join("") + "</div></div></section>";
    mount("home", html);
  }

  /* ---------------- EA for Non-IT (bilingual) ---------------- */
  function viewNonIT() {
    var D = window.EA_NONIT || {};
    var d = D[nonitLang] || D.en;
    if (!d) { mount("nonit", '<section class="section"><div class="wrap"><p>Content unavailable.</p></div></section>'); return; }
    var rtl = d.dir === "rtl";
    document.title = (rtl ? "البنية المؤسسية لغير المختصين" : "EA for Non-IT") + " · EA Awareness Hub";
    var exLabel = rtl ? "أمثلة" : "Examples";
    var openLabel = "↗";
    function card(t, dsc) {
      return '<div class="card" style="padding:22px"><h3 style="font-size:18.5px;margin-bottom:8px">' + esc(t) + '</h3><p class="muted" style="font-size:15.5px;line-height:1.65">' + esc(dsc) + "</p></div>";
    }
    function kpis(arr, color) {
      return '<div style="display:flex;gap:22px;margin-top:16px;flex-wrap:wrap">' + arr.map(function (k) {
        return '<div><div style="font-size:25px;font-weight:800;color:' + color + ';line-height:1.1">' + esc(k[0]) + '</div><div style="font-size:12.5px;color:#6B6570;margin-top:3px">' + esc(k[1]) + "</div></div>";
      }).join("") + "</div>";
    }
    function secH(h, lead) {
      return '<div class="sec-h"><div><h2>' + esc(h) + '</h2><div class="rule"></div></div>' + (lead ? "<p>" + esc(lead) + "</p>" : "") + "</div>";
    }
    var ex = d.example, emb = ex.embed;
    var frameSrc = "examples/ea-impact.html#" + (rtl ? "ar-" : "") + nonitExample;
    var html =
      '<div class="nonit" dir="' + d.dir + '" lang="' + d.lang + '">' +
      phead(esc(d.eyebrow), esc(d.title), esc(d.sub), '<button class="btn btn-line" id="nonit-lang" type="button">' + esc(d.otherLabel) + "</button>") +
      // What EA is
      '<section class="section"><div class="wrap">' + secH(d.what.h) +
      '<div style="max-width:900px;display:grid;gap:14px">' + d.what.paras.map(function (p) { return '<p style="font-size:17px;line-height:1.72;color:#39333F">' + esc(p) + "</p>"; }).join("") + "</div></div></section>" +
      // Why it matters
      '<section class="section" style="padding-top:0"><div class="wrap">' + secH(d.why.h, d.why.lead) +
      '<div class="grid g3">' + d.why.items.map(function (i) { return card(i.t, i.d); }).join("") + "</div></div></section>" +
      // Building blocks
      '<section class="section" style="padding-top:0"><div class="wrap">' + secH(d.components.h, d.components.lead) +
      '<div style="display:grid;gap:12px;max-width:940px">' + d.components.layers.map(function (l) {
        return '<div class="card" style="padding:18px 22px;border-' + (rtl ? "right" : "left") + ':6px solid ' + l.c + '">' +
          '<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><span style="font-weight:800;font-size:18px">' + esc(l.name) + '</span><span class="eyebrow" style="color:' + l.c + '">' + esc(l.q) + "</span></div>" +
          '<p class="muted" style="margin-top:7px;font-size:15.5px;line-height:1.6">' + esc(l.plain) + "</p>" +
          '<p style="margin-top:8px;font-size:14.5px;color:#6B6570"><b>' + exLabel + ":</b> " + esc(l.ex) + "</p></div>";
      }).join("") + "</div></div></section>" +
      // Worked example
      '<section class="section" style="padding-top:0"><div class="wrap">' + secH(ex.h, ex.lead) +
      '<div class="grid g2">' +
      '<div class="card" style="padding:24px;border-top:4px solid #2E8B57"><div class="eyebrow" style="color:#2E8B57">' + esc(ex.withTitle) + '</div><p style="margin-top:9px;font-size:15.5px;line-height:1.65">' + esc(ex.withText) + "</p>" + kpis(ex.withKpis, "#2E8B57") + "</div>" +
      '<div class="card" style="padding:24px;border-top:4px solid #C24A2C"><div class="eyebrow" style="color:#C24A2C">' + esc(ex.withoutTitle) + '</div><p style="margin-top:9px;font-size:15.5px;line-height:1.65">' + esc(ex.withoutText) + "</p>" + kpis(ex.withoutKpis, "#C24A2C") + "</div>" +
      "</div>" +
      '<div class="strip" style="margin-top:18px;background:#33091F;border-radius:14px"><div class="in" style="padding:22px 26px"><p style="font-size:17px;line-height:1.6;color:#fff;margin:0">' + esc(ex.close) + "</p></div></div>" +
      // embedded interactive slide + scenario sidebar
      '<div style="margin-top:26px"><div class="sec-h"><div><h2 style="font-size:24px">' + esc(emb.heading) + '</h2><div class="rule"></div></div>' +
      '<a class="btn btn-line btn-sm" id="ea-full" href="' + esc(frameSrc) + '" target="_blank" rel="noopener">' + esc(emb.full) + "</a></div>" +
      '<p class="muted" style="margin:-4px 0 16px;font-size:15.5px">' + esc(emb.lead) + "</p>" +
      '<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:stretch">' +
      '<div style="flex:0 0 240px;display:flex;flex-direction:column;gap:10px">' +
      emb.links.map(function (lk) {
        var v = lk[0], title = v === "with" ? ex.withTitle : ex.withoutTitle, accent = v === "with" ? "#2E8B57" : "#C24A2C", on = v === nonitExample;
        return '<button type="button" class="ea-ex-link" data-ex="' + v + '" style="text-align:' + (rtl ? "right" : "left") + ';cursor:pointer;border:1.5px solid ' + (on ? "var(--m)" : "var(--line)") + ';background:' + (on ? "var(--m-blush)" : "#fff") + ';border-radius:12px;padding:14px 16px;box-shadow:inset ' + (rtl ? "-5px" : "5px") + ' 0 0 0 ' + accent + '">' +
          '<div style="font-weight:800;font-size:16px;color:var(--ink)">' + esc(title) + "</div>" +
          '<div style="font-size:13.5px;color:var(--muted);margin-top:3px">' + esc(lk[1]) + "</div></button>";
      }).join("") +
      "</div>" +
      '<div style="flex:1 1 440px;min-width:300px"><div style="position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#151B26">' +
      '<iframe id="ea-frame" title="' + esc(ex.h) + '" src="' + esc(frameSrc) + '" style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div></div>' +
      "</div></div></div></section>" +
      // How executives realise the benefit
      '<section class="section" style="padding-top:0"><div class="wrap">' + secH(d.realize.h) +
      '<div class="grid g2">' + d.realize.items.map(function (i) { return card(i.t, i.d); }).join("") + "</div></div></section>" +
      "</div>";
    mount("nonit", html, function () {
      var b = $("#nonit-lang");
      if (b) b.onclick = function () {
        nonitLang = d.other;
        try { localStorage.setItem("eahub.nonit.lang", nonitLang); } catch (e) {}
        viewNonIT();
      };
      var links = $$(".ea-ex-link");
      function paint() { links.forEach(function (x) { var on = x.getAttribute("data-ex") === nonitExample; x.style.borderColor = on ? "var(--m)" : "var(--line)"; x.style.background = on ? "var(--m-blush)" : "#fff"; }); }
      links.forEach(function (x) {
        x.onclick = function () {
          nonitExample = x.getAttribute("data-ex");
          var src = "examples/ea-impact.html#" + (rtl ? "ar-" : "") + nonitExample;
          var fr = $("#ea-frame"); if (fr) fr.src = src;
          var fl = $("#ea-full"); if (fl) fl.href = src;
          paint();
        };
      });
    });
  }

  /* ---------------- EA modules ---------------- */
  function viewEA(mid) {
    var m = LEARN.filter(function (x) { return x.id === mid; })[0] || LEARN[0];
    document.title = m.title + " · EA Foundations";
    API.logEvent("module_view", m.id);
    var idx = LEARN.indexOf(m), prev = LEARN[idx - 1], next = LEARN[idx + 1];
    var side = "<h6>EA Foundations</h6>" + LEARN.map(function (x) {
      return '<a href="#/ea/' + x.id + '" class="' + (x.id === m.id ? "on" : "") + '"><span class="n">' + x.n + "</span><span>" + esc(x.short) + (x.mandatory ? "" : ' <span class="tag gray" style="margin-inline-start:4px">optional</span>') + '</span><span class="ck' + (isDone(x.id) ? " done" : "") + '"></span></a>';
    }).join("") + '<h6>Then</h6><a href="#/togaf"><span class="n">T</span><span>TOGAF · ' + certState().track.togaf.done + " / " + TOPICS.length + ' topics</span></a><a href="#/cert"><span class="n">★</span><span>Certification path</span></a>';
    var done = isDone(m.id);
    var html = phead("EA Foundations · Module " + m.n, "Enterprise Architecture, technically", "Eleven modules that build the shared vocabulary GTA IT needs: from the definition of architecture through the Qatar GEA, GTA's baseline, the reference models and governance.",
      '<span class="pill">' + LEARN.filter(function (x) { return isDone(x.id); }).length + " / " + LEARN.length + " complete</span>") +
      '<section class="section"><div class="wrap doc"><aside class="side">' + side + '</aside><article class="article"><header><div class="eyebrow">Module ' + m.n + (m.mandatory ? " · Mandatory" : " · Optional") + "</div><h2>" + esc(m.title) + '</h2><p class="stand">' + esc(m.stand) + '</p><div class="meta-row"><span>' + m.minutes + " min read</span><span>" + m.level + "</span>" + (done ? '<span class="done-badge">✓ Completed</span>' : "") + '</div></header><div class="prose">' + m.body +
      '<div class="keys"><div class="eyebrow">Key takeaways</div><ul>' + m.keys.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul></div>" +
      (m.refs && m.refs.length ? '<div class="refs"><span class="eyebrow" style="color:#8C93A0">Further reading</span><br>' + m.refs.map(function (r) { return '<a href="' + esc(r.u) + '" target="_blank" rel="noopener">' + esc(r.t) + " ↗</a>"; }).join("") + "</div>" : "") +
      '</div><div class="complete-bar"><div class="st">' + (done ? '<span class="done-badge">✓ You completed this module</span>' : "<span>Finished reading? Mark the module as completed — the exam unlocks at " + certState().unlockPct + "% of modules.</span>") + "</div>" +
      (done ? "" : '<button class="btn btn-m" id="mc">Mark as completed</button>') + '</div><div class="pager">' +
      (prev ? '<a class="btn btn-line" href="#/ea/' + prev.id + '">← ' + esc(prev.short) + "</a>" : "<span></span>") +
      (next ? '<a class="btn btn-line" href="#/ea/' + next.id + '">' + esc(next.short) + " →</a>" : '<a class="btn btn-line" href="#/togaf">TOGAF topics →</a>') + "</div></article></div></section>";
    mount("ea", html, function () {
      var b = $("#mc"); if (b) b.onclick = function () { var was = certState().eligible; b.disabled = true; API.logEvent("module_complete", m.id).then(refreshProgress).then(function () { toast("<b>Module " + m.n + " completed.</b> " + certState().track.ea.done + " / " + LEARN.length + " modules done."); viewEA(m.id); unlockWatch(was); }); };
    });
  }

  /* ---------------- TOGAF ---------------- */
  function viewTogaf() {
    document.title = "TOGAF deep dive · EA Awareness Hub";
    var ph = TOG.phases || [];
    var viewed = JSON.parse(localStorage.getItem("eahub.v2.adm." + (state.user && state.user.id)) || "[]");
    var sections = [["t-structure", "Structure of the standard"], ["t-adm", "ADM explorer"], ["t-levels", "Architecture levels"], ["t-continuum", "Enterprise Continuum"], ["t-repo", "Architecture Repository"], ["t-content", "Content & building blocks"], ["t-principles", "Architecture principles"], ["t-deliverables", "Deliverables"], ["t-governance", "Capability & governance"], ["t-agile", "TOGAF and agile"], ["t-glossary", "Glossary"]];
    function sideHtml() { return "<h6>TOGAF topics · " + certState().track.togaf.done + " / " + sections.length + "</h6>" + sections.map(function (s, i) { return '<a href="#/togaf" data-sec="' + s[0] + '"><span class="n">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span><span>" + s[1] + '</span><span class="ck' + (isDone("togaf:" + s[0]) ? " done" : "") + '"></span></a>'; }).join("") + '<h6>Then</h6><a href="#/cert"><span class="n">★</span><span>Certification path</span></a>'; }
    function topicBar(sec) {
      var d = isDone("togaf:" + sec), adm = sec === "t-adm";
      return '<div class="complete-bar tbar" data-bar="' + sec + '"><div class="st">' + (d ? '<span class="done-badge">✓ Topic completed</span>' : "<span>" + (adm ? "Explore all ADM phases on the wheel, then mark this topic as completed." : "Finished this topic? Mark it as completed to record your progress.") + "</span>") + "</div>" + (d ? "" : '<button class="btn btn-m btn-sm" data-mark="' + sec + '">Mark as completed</button>') + "</div>";
    }
    var side = sideHtml();
    function list(a, cls) { return '<ul class="chk' + (cls ? " " + cls : "") + '">' + (a || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
    var st = TOG.structure || {};
    var html = phead("TOGAF deep dive", "The TOGAF® Standard, 10th Edition", "Eleven topics on the method GTA tailors for its architecture work under the Qatar GEA. Mark each topic as completed — the certification exam unlocks at " + certState().unlockPct + "% of topics.",
      '<span class="pill" id="tcount">' + certState().track.togaf.done + " / " + sections.length + ' topics completed</span><span class="pill" id="admcount">' + viewed.length + " / " + ph.length + " ADM phases explored</span>") +
      '<section class="section"><div class="wrap doc"><aside class="side">' + side + '</aside><div style="min-width:0;display:grid;gap:28px">' +
      // structure
      '<article class="article" id="t-structure"><header><div class="eyebrow">01 · Structure</div><h2>How the standard is organised</h2><p class="stand">Since the 10th Edition, TOGAF separates a stable core from configurable guidance — adopt the core, then pick the Series Guides that fit the problem.</p></header><div class="prose">' +
      '<figure data-dg="togaf-structure" data-cap="Fundamental Content and Series Guides together form the TOGAF Standard; the TOGAF Library holds further material."></figure>' +
      '<h4>Fundamental Content</h4><div class="grid2">' + (st.fundamental || []).map(function (x) { return '<div class="mini"><h5>' + esc(x.t) + "</h5><p>" + esc(x.d) + "</p></div>"; }).join("") + "</div>" +
      '<h4>Representative Series Guides</h4><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Guide</th><th>What it adds</th></tr></thead><tbody>' + (st.seriesGuides || []).map(function (x) { return "<tr><td>" + esc(x.t) + "</td><td>" + esc(x.d) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      (st.library ? '<div class="callout note"><b>TOGAF Library</b>' + esc(st.library) + "</div>" : "") + "</div></article>" +
      // ADM
      '<article class="article" id="t-adm"><header><div class="eyebrow">02 · Architecture Development Method</div><h2>ADM explorer</h2><p class="stand">Select a phase on the cycle to see its objectives, inputs, steps, outputs, artefacts, techniques and a worked GTA example. Exploring all ten phases completes the TOGAF section.</p></header>' +
      '<div class="adm"><div class="adm-wheel" id="wheel"></div><div class="adm-panel" id="admp"></div></div></article>' +
      // levels
      '<article class="article" id="t-levels"><header><div class="eyebrow">03 · Partitioning</div><h2>Strategic, segment and capability architectures</h2></header><div class="prose"><figure data-dg="ea-levels" data-cap="Architecture levels — breadth vs detail."></figure>' +
      '<table class="tbl"><thead><tr><th>Level</th><th>Description</th><th>Horizon</th></tr></thead><tbody>' + (TOG.levels || []).map(function (l) { return "<tr><td>" + esc(l.t) + "</td><td>" + esc(l.d) + "</td><td>" + esc(l.horizon || "") + "</td></tr>"; }).join("") + "</tbody></table></div></article>" +
      // continuum
      '<article class="article" id="t-continuum"><header><div class="eyebrow">04 · Enterprise Continuum</div><h2>From generic to GTA-specific</h2><p class="stand">A classification of architecture and solution assets by how generic or specific they are — the basis for reuse.</p></header><div class="prose"><figure data-dg="enterprise-continuum" data-cap="Architecture Continuum guides the Solutions Continuum at each level."></figure>' +
      '<div class="grid2">' + ((TOG.continuum || {}).architecture || []).map(function (x, i) { var s = (TOG.continuum.solutions || [])[i] || {}; return '<div class="mini"><h5>' + esc(x.t) + "</h5><p>" + esc(x.d) + '</p><h5 style="margin-top:10px;color:#138A72">' + esc(s.t || "") + "</h5><p>" + esc(s.d || "") + "</p></div>"; }).join("") + "</div>" +
      ((TOG.continuum || {}).note || "") + "</div></article>" +
      // repository
      '<article class="article" id="t-repo"><header><div class="eyebrow">05 · Architecture Repository</div><h2>Where architecture content lives</h2></header><div class="prose"><figure data-dg="architecture-repository" data-cap="Components of the TOGAF Architecture Repository."></figure>' +
      '<dl class="defs">' + (TOG.repository || []).map(function (x) { return "<dt>" + esc(x.t) + "</dt><dd>" + esc(x.d) + "</dd>"; }).join("") + "</dl></div></article>" +
      // content
      '<article class="article" id="t-content"><header><div class="eyebrow">06 · Architecture Content</div><h2>Metamodel, artefacts and building blocks</h2><p class="stand">The content framework defines what architecture descriptions contain and how elements relate — so that content from different teams fits together.</p></header><div class="prose"><figure data-dg="content-metamodel" data-cap="Core metamodel entities grouped by domain, with representative relationships."></figure>' +
      '<h4>Key relationships</h4><div class="tbl-wrap"><table class="tbl"><thead><tr><th>From</th><th>Relationship</th><th>To</th></tr></thead><tbody>' + (((TOG.metamodel || {}).relations) || []).map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td><code>" + esc(r[1]) + "</code></td><td>" + esc(r[2]) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<h4>Building blocks</h4><figure data-dg="building-blocks" data-cap="Architecture Building Blocks are realised by Solution Building Blocks."></figure></div></article>' +
      // principles
      '<article class="article" id="t-principles"><header><div class="eyebrow">07 · Architecture principles</div><h2>The seven GEA principles plus TOGAF principles, in the TOGAF template</h2><p class="stand">Name, statement, rationale and implications. GEA principles are mandatory; GTA-specific implications are illustrative until approved by the GTA Technical Review Board.</p></header><div class="grid g2">' +
      (TOG.principles || []).map(function (p, i) { return '<div class="pcard"><div class="ph"><span>Principle ' + (i + 1) + "</span><b>" + esc(p.name) + '</b></div><div class="pb"><p style="margin:0;font-weight:700;color:#16181D">' + esc(p.statement) + "</p><h6>Rationale</h6><p style=\"margin:0\">" + esc(p.rationale) + "</p><h6>Implications</h6><ul>" + (p.implications || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>"; }).join("") + "</div></article>" +
      // deliverables
      '<article class="article" id="t-deliverables"><header><div class="eyebrow">08 · Deliverables</div><h2>Key TOGAF deliverables</h2></header><div class="chips" id="dfilter" style="margin-bottom:12px"></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Deliverable</th><th>Phase</th><th>Purpose</th></tr></thead><tbody id="dtable"></tbody></table></div></article>' +
      // governance
      '<article class="article" id="t-governance"><header><div class="eyebrow">09 · EA capability &amp; governance</div><h2>Running architecture as a capability</h2></header><div class="prose">' + (TOG.capabilityFramework || "") +
      '<h4>Architecture compliance levels</h4><div data-scale="1"></div><figure data-dg="governance-flow" data-cap="Illustrative GTA governance flow."></figure></div></article>' +
      // agile
      '<article class="article" id="t-agile"><header><div class="eyebrow">10 · Agile</div><h2>TOGAF and agile delivery</h2></header><div class="prose">' + (TOG.agile || "") + '<figure data-dg="transition-roadmap" data-cap="Transition architectures give agile teams a stable intermediate target."></figure></div></article>' +
      // glossary
      '<article class="article" id="t-glossary"><header><div class="eyebrow">11 · Glossary</div><h2>TOGAF terms</h2></header><div class="glossary">' + (TOG.glossary || []).slice().sort(function (a, b) { return a.t.localeCompare(b.t); }).map(function (g) { return "<div><b>" + esc(g.t) + "</b> — " + esc(g.d) + "</div>"; }).join("") + "</div>" +
      "</article>" +
      "</div></div></section>";
    sections.forEach(function (sc) {
      var k = html.indexOf('id="' + sc[0] + '"'); if (k < 0) return;
      var e = html.indexOf("</article>", k); html = html.slice(0, e) + topicBar(sc[0]) + html.slice(e);
    });
    mount("togaf", html, function () {
      function wireSide() { $$(".side a[data-sec]").forEach(function (a) { a.onclick = function (e) { e.preventDefault(); var t = document.getElementById(a.getAttribute("data-sec")); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 86, behavior: "smooth" }); }; }); }
      function wireBars() {
        $$("[data-mark]").forEach(function (b) {
          b.onclick = function () {
            var sec = b.getAttribute("data-mark");
            if (sec === "t-adm" && viewed.length < ph.length) { toast("Explore all " + ph.length + " ADM phases first — " + viewed.length + " so far."); return; }
            var was = certState().eligible; b.disabled = true;
            API.logEvent("module_complete", "togaf:" + sec).then(refreshProgress).then(function () {
              var bar = $('[data-bar="' + sec + '"]'); bar.outerHTML = topicBar(sec);
              $(".side").innerHTML = sideHtml(); wireSide(); wireBars();
              $("#tcount").textContent = certState().track.togaf.done + " / " + sections.length + " topics completed";
              toast("<b>Topic completed.</b> " + certState().track.togaf.done + " / " + sections.length + " TOGAF topics done.");
              unlockWatch(was);
            });
          };
        });
      }
      wireBars();
      var jump = parse().q.t; if (jump) setTimeout(function () { var t = document.getElementById(jump); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 86 }); }, 60);
      $$(".side a[data-sec]").forEach(function (a) { a.onclick = function (e) { e.preventDefault(); var t = document.getElementById(a.getAttribute("data-sec")); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 86, behavior: "smooth" }); }; });
      var sel = "A";
      function drawWheel() {
        $("#wheel").innerHTML = '<div class="fig" style="margin:0">' + DG.render("adm-cycle", { selected: sel }) + "<figcaption><b>Select</b>a phase · Requirements Management sits at the centre</figcaption></div>";
        $$("#wheel .adm-node").forEach(function (n) {
          var go = function () { sel = n.getAttribute("data-phase"); drawWheel(); drawPanel(); };
          n.addEventListener("click", go); n.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
        });
      }
      var tab = "overview";
      function drawPanel() {
        var p = ph.filter(function (x) { return x.id === sel; })[0]; if (!p) return;
        if (viewed.indexOf(p.id) < 0) { viewed.push(p.id); localStorage.setItem("eahub.v2.adm." + (state.user && state.user.id), JSON.stringify(viewed)); API.logEvent("adm_phase_view", p.id); }
        $("#admcount").textContent = viewed.length + " / " + ph.length + " ADM phases explored";
        var tabs = [["overview", "Overview"], ["inputs", "Inputs"], ["steps", "Steps"], ["outputs", "Outputs"], ["artifacts", "Artefacts"], ["gta", "At GTA"]];
        var body = "";
        if (tab === "overview") body = '<h4 style="margin-top:0">Objectives</h4>' + list(p.objectives) + '<h4>Techniques</h4><div class="chips">' + (p.techniques || []).map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + '</div><h4>Key points</h4>' + list(p.keyPoints) + '<div class="callout warn" style="margin-top:16px"><b>Pitfalls</b><ul style="margin:4px 0 0;padding-inline-start:18px">' + (p.pitfalls || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
        if (tab === "inputs") body = list(p.inputs);
        if (tab === "steps") body = list(p.steps, "num");
        if (tab === "outputs") body = list(p.outputs);
        if (tab === "artifacts") body = '<p class="muted" style="margin-top:0">Typical catalogues, matrices and diagrams from the TOGAF Architecture Content for this phase.</p><div class="chips">' + (p.artifacts || []).map(function (t) { var k = /catalog/i.test(t) ? "teal" : /matrix/i.test(t) ? "gold" : /diagram|map/i.test(t) ? "" : "gray"; return '<span class="tag ' + k + '" style="font-size:12.5px;padding:5px 12px">' + esc(t) + "</span>"; }).join("") + '</div><div class="legend" style="margin-top:14px"><span><i style="background:#E4F3EF"></i>Catalogue</span><span><i style="background:#F5F0E3"></i>Matrix</span><span><i style="background:#F8EEF2"></i>Diagram / map</span></div>';
        if (tab === "gta") body = '<div class="prose" style="font-size:15.5px">' + (p.gtaExample || "") + "</div>";
        $("#admp").innerHTML = '<div class="hd plate"><div class="eyebrow" style="color:#C9B37A">Phase ' + esc(p.code) + "</div><h3>" + esc(p.name) + "</h3><p>" + esc(p.tagline || "") + '</p></div><div class="tabs">' + tabs.map(function (t) { return '<button data-t="' + t[0] + '" class="' + (tab === t[0] ? "on" : "") + '">' + t[1] + "</button>"; }).join("") + '</div><div class="bd">' + body + "</div>";
        $$("#admp .tabs button").forEach(function (b) { b.onclick = function () { tab = b.getAttribute("data-t"); drawPanel(); }; });
        $$("#admp .chk.num li").forEach(function (li) { li.style.setProperty("--x", 1); });
        updateDone();
      }
      function updateDone() {
        var bar = $('[data-bar="t-adm"] .st span'); if (bar && !isDone("togaf:t-adm")) bar.textContent = viewed.length >= ph.length ? "All ADM phases explored — mark this topic as completed." : "Explore all " + ph.length + " ADM phases on the wheel (" + viewed.length + " so far), then mark this topic as completed.";
      }
      // deliverables filter
      var dl = TOG.deliverables || [], phases = []; dl.forEach(function (x) { if (phases.indexOf(x.phase) < 0) phases.push(x.phase); });
      var df = "All";
      function drawD() {
        $("#dfilter").innerHTML = ["All"].concat(phases).map(function (p) { return '<button class="chip' + (df === p ? " on" : "") + '" data-p="' + esc(p) + '">' + esc(p) + "</button>"; }).join("");
        $("#dtable").innerHTML = dl.filter(function (x) { return df === "All" || x.phase === df; }).map(function (x) { return "<tr><td>" + esc(x.t) + '</td><td><span class="tag">' + esc(x.phase) + "</span></td><td>" + esc(x.d) + "</td></tr>"; }).join("");
        $$("#dfilter .chip").forEach(function (b) { b.onclick = function () { df = b.getAttribute("data-p"); drawD(); }; });
      }
      drawD(); drawWheel(); drawPanel();
    });
  }

  /* ---------------- Knowledge base ---------------- */
  function kbCard(a, q) {
    function hl(s) { if (!q || typeof q !== "string") return esc(s); var out = esc(s); q.split(/\s+/).filter(function (w) { return w.length > 2; }).forEach(function (w) { out = out.replace(new RegExp("(^|[^A-Za-z0-9])(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "$1<mark>$2</mark>"); }); return out; }
    var lv = { Foundation: "teal", Practitioner: "blue", Advanced: "gold" }[a.level] || "gray";
    return '<a class="card hov kb-card' + (a.optional ? " kb-opt" : "") + '" href="#/kb/' + a.id + '"><span class="cat">' + (a.optional ? '<span class="optb">Optional</span>' + esc(a.cat.replace(/^Optional Reading:\s*/, "")) : esc(a.cat)) + "</span><h3>" + hl(a.title) + "</h3><p>" + hl(a.summary) + '</p><div class="ft"><span class="tag ' + lv + '">' + esc(a.level) + "</span><span>" + (a.minutes || 4) + " min</span>" + (a.diagram ? "<span>· diagram</span>" : "") + (isDone("kb:" + a.id) ? '<span class="kbdone">✓ Completed</span>' : "") + "</div></a>";
  }
  var kbIndex = null;
  function buildIndex() {
    if (kbIndex) return kbIndex;
    var tmp = document.createElement("div");
    kbIndex = KB.map(function (a) { tmp.innerHTML = a.body || ""; return { a: a, title: a.title.toLowerCase(), tags: (a.tags || []).join(" ").toLowerCase(), sum: (a.summary || "").toLowerCase(), body: tmp.textContent.toLowerCase() }; });
    return kbIndex;
  }
  function search(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return KB.slice();
    return buildIndex().map(function (x) {
      var res = words.map(function (w) { return new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"); });
      var s = 0; res.forEach(function (re) { if (re.test(x.title)) s += 8; re.lastIndex = 0; if (re.test(x.tags)) s += 5; re.lastIndex = 0; if (re.test(x.sum)) s += 3; re.lastIndex = 0; var c = (x.body.match(re) || []).length; s += Math.min(c, 6); });
      var all = res.every(function (re) { re.lastIndex = 0; return re.test(x.title + " " + x.tags + " " + x.sum + " " + x.body); });
      return { a: x.a, s: all ? s : 0 };
    }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.a; });
  }
  function viewKB(params) {
    document.title = "Knowledge Base · EA Awareness Hub";
    var cats = []; KB.forEach(function (a) { if (cats.indexOf(a.cat) < 0) cats.push(a.cat); });
    var st = { q: params.q || "", c: params.c || "", l: params.l || "" };
    var html = phead("Knowledge Base", "Architecture reference for GTA IT", "Concepts, TOGAF and ArchiMate topics, domain guidance, Qatar and GTA context, and ready-to-use templates and checklists. Press <code style=\"background:rgba(255,255,255,.15);color:#fff\">/</code> to search.",
      '<span class="pill">' + KB.length + " articles</span><span class=\"pill\">" + cats.length + " categories</span>") +
      '<section class="section"><div class="wrap"><div class="kb-tools"><div class="search">' + ICON.search + '<input id="q" type="search" placeholder="Search e.g. ADR template, master data, Phase E, zero trust…" value="' + esc(st.q) + '" aria-label="Search the knowledge base"><kbd>/</kbd></div>' +
      '<div class="seg" id="lv">' + [["", "All levels"], ["Foundation", "Foundation"], ["Practitioner", "Practitioner"], ["Advanced", "Advanced"]].map(function (x) { return '<button data-l="' + x[0] + '"' + (st.l === x[0] ? ' class="on"' : "") + ">" + x[1] + "</button>"; }).join("") + '</div></div><div id="kbpath"></div>' +
      '<div class="kb-layout"><aside class="facet" id="facet"></aside><div><div class="muted" id="cnt" style="margin-bottom:12px;font-size:14px"></div><div class="grid g3" id="res"></div></div></div></div></section>';
    mount("kb", html, function () {
      var t;
      function draw() {
        var list = search(st.q);
        var counts = {}; list.forEach(function (a) { if (!st.l || a.level === st.l) counts[a.cat] = (counts[a.cat] || 0) + 1; });
        $("#facet").innerHTML = "<h6>Categories</h6>" + '<button data-c="" class="' + (!st.c ? "on" : "") + '"><span>All</span><span class="c">' + list.filter(function (a) { return !st.l || a.level === st.l; }).length + "</span></button>" +
          cats.map(function (c) { return '<button data-c="' + esc(c) + '" class="' + (st.c === c ? "on" : "") + '"><span>' + esc(c) + '</span><span class="c">' + (counts[c] || 0) + "</span></button>"; }).join("");
        $$("#facet button").forEach(function (b) { b.onclick = function () { st.c = b.getAttribute("data-c"); draw(); }; });
        var res = list.filter(function (a) { return (!st.c || a.cat === st.c) && (!st.l || a.level === st.l); });
        $("#cnt").textContent = res.length + " article" + (res.length === 1 ? "" : "s") + (st.q ? " matching “" + st.q + "”" : "") + (st.c ? " in " + st.c : "");
        var trk = st.l === "Practitioner" ? ["kbp", "practitioner"] : st.l === "Advanced" ? ["kba", "advanced"] : null;
        if (trk) { var cs = certState(null, trk[1]), tt = cs.track[trk[0]] || { done: 0, total: 0, pct: 0 }, LL = levelDef(trk[1]); $("#kbpath").innerHTML = '<div class="kbpath"><div><span class="eyebrow">' + esc(LL.short) + ' certification path</span><b>' + tt.done + " / " + tt.total + " " + st.l + ' articles completed</b><span class="muted">' + cs.unlockPct + "% unlocks the " + esc(LL.short) + " exam" + (LL.requires ? " (after the " + esc(levelDef(LL.requires).short) + " certificate)" : "") + '</span></div><div class="progress"><i style="width:' + tt.pct + '%"></i><b class="mark" style="left:' + cs.unlockPct + '%"></b></div><a class="btn btn-line btn-sm" href="#/cert/' + trk[1] + '">Certification path ' + ICON.arrow + "</a></div>"; }
        else if (!st.q && !st.c && !st.l) { var ops = KB.filter(function (x) { return x.optional; }); $("#kbpath").innerHTML = ops.length ? '<a class="kbopt-promo" href="#/kb?c=' + encodeURIComponent(ops[0].cat) + '"><span class="eyebrow">Optional reading</span><b>' + esc(ops[0].cat.replace(/^Optional Reading:\s*/, "")) + '</b><span>' + ops.length + " articles with worked GTA examples — zoom levels, context, container, component, deployment and dynamic diagrams, messaging, notation checklist and diagrams as code. Not required for certification.</span><em>Open " + ICON.arrow + "</em></a>" : ""; }
        else $("#kbpath").innerHTML = "";
        $("#res").innerHTML = res.length ? res.map(function (a) { return kbCard(a, st.q); }).join("") : '<div class="empty card" style="grid-column:1/-1">No articles match. Try a broader term such as <b>data</b>, <b>ADM</b> or <b>template</b>.</div>';
      }
      $("#q").addEventListener("input", function () { st.q = this.value.trim(); draw(); clearTimeout(t); t = setTimeout(function () { if (st.q.length > 2) API.logEvent("kb_search", st.q); }, 1200); });
      $$("#lv button").forEach(function (b) { b.onclick = function () { $$("#lv button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); st.l = b.getAttribute("data-l"); draw(); }; });
      draw();
    });
  }
  function viewKBArticle(id) {
    var a = KB.filter(function (x) { return x.id === id; })[0];
    if (!a) { location.hash = "#/kb"; return; }
    document.title = a.title + " · Knowledge Base";
    API.logEvent("kb_view", a.id);
    var rel = (a.related || []).map(function (r) { return KB.filter(function (x) { return x.id === r; })[0]; }).filter(Boolean);
    var sameCat = KB.filter(function (x) { return x.cat === a.cat; });
    var side = "<h6>" + esc(a.cat) + "</h6>" + sameCat.map(function (x) { return '<a href="#/kb/' + x.id + '" class="' + (x.id === a.id ? "on" : "") + '"><span>' + esc(x.title) + "</span></a>"; }).join("") + '<h6>Knowledge Base</h6><a href="#/kb">← All articles</a>';
    var html = phead("Knowledge Base · " + esc(a.cat), esc(a.title), esc(a.summary), '<span class="pill">' + esc(a.level) + '</span><span class="pill">' + (a.minutes || 4) + " min read</span>") +
      '<section class="section"><div class="wrap doc"><aside class="side">' + side + '</aside><article class="article"><div class="prose">' +
      (a.diagram ? '<figure data-dg="' + esc(a.diagram) + '"></figure>' : "") + a.body +
      ((a.refs || []).length ? '<div class="refs"><span class="eyebrow" style="color:#8C93A0">References</span><br>' + a.refs.map(function (r) { return '<a href="' + esc(r.u) + '" target="_blank" rel="noopener">' + esc(r.t) + " ↗</a>"; }).join("") + "</div>" : "") +
      '<div class="chips" style="margin-top:16px">' + (a.tags || []).map(function (t) { return '<a class="chip" href="#/kb?q=' + encodeURIComponent(t) + '">#' + esc(t) + "</a>"; }).join("") + "</div></div>" +
      '<div class="complete-bar" id="kbbar"></div>' +
      (rel.length ? '<h4 style="margin:34px 0 14px;color:#33091F">Related articles</h4><div class="grid g2">' + rel.map(function (r) { return kbCard(r); }).join("") + "</div>" : "") +
      "</article></div></section>";
    var lvId = a.optional ? null : a.level === "Practitioner" ? "practitioner" : a.level === "Advanced" ? "advanced" : null, trkId = lvId === "practitioner" ? "kbp" : lvId === "advanced" ? "kba" : null;
    function bar() {
      var d = isDone("kb:" + a.id), cs = lvId ? certState(null, lvId) : null, tt = cs ? cs.track[trkId] : null;
      $("#kbbar").innerHTML = '<div class="st">' + (d ? '<span class="done-badge">✓ Article completed</span>' : "<span>" + (a.optional ? "<b>Optional reading</b> — not required for any certification path" : lvId ? "Counts towards the <b>" + esc(levelDef(lvId).short) + " certification path</b>" : "Foundation-level article") + " — mark it as completed when you have studied it.</span>") + (tt ? '<span class="muted" style="display:block;font-size:13px;margin-top:4px">' + tt.done + " / " + tt.total + " " + a.level + " articles completed · " + cs.unlockPct + '% unlocks the exam · <a href="#/cert/' + lvId + '">path</a></span>' : "") + "</div>" + (d ? "" : '<button class="btn btn-m" id="kbmc">Mark as completed</button>');
      var b = $("#kbmc"); if (b) b.onclick = function () {
        var was = lvId ? certState(null, lvId).eligible : true; b.disabled = true;
        API.logEvent("module_complete", "kb:" + a.id).then(refreshProgress).then(function () {
          bar(); toast("<b>Article completed.</b>" + (lvId ? " " + certState(null, lvId).track[trkId].done + " / " + certState(null, lvId).track[trkId].total + " " + a.level + " articles done." : ""));
          if (lvId && !was && certState(null, lvId).eligible) toast("<b>" + esc(levelDef(lvId).short) + " exam unlocked.</b> <a href='#/cert/" + lvId + "' style='color:#C9B37A'>Open the certification path</a>.", 6000);
        });
      };
    }
    mount("kb", html, bar);
  }

  /* ---------------- Certification paths ---------------- */
  function certPct(c) { return c.exams.length ? Math.max.apply(null, c.exams.map(function (x) { return x.pct; })) : null; }
  function lvRounds(level) { return QUIZ.rounds.filter(function (r) { return (r.level || "foundation") === (level || "foundation"); }); }
  function examSize(level) { return lvRounds(level).reduce(function (s2, r) { return s2 + (r.perAttempt || r.q.length); }, 0); }
  function bankSize(level) { return lvRounds(level).reduce(function (s2, r) { return s2 + r.q.length; }, 0); }
  function partOf(rid) { return QUIZ.rounds.filter(function (r) { return r.id === rid; })[0] || { title: rid, part: "?" }; }
  var LV_STYLE = { foundation: { tag: "Foundation track", band: "Enterprise<br>Architecture", seal: "EA FOUNDATION", mono: "F" }, practitioner: { tag: "Practitioner track", band: "Enterprise<br>Architecture", seal: "EA PRACTITIONER", mono: "P" }, advanced: { tag: "Advanced track", band: "Enterprise<br>Architecture", seal: "EA ADVANCED", mono: "A" } };
  var LV_BLURB = {
    foundation: "EA Foundations aligned to the Qatar GEA, the TOGAF® Standard and the knowledge base.",
    practitioner: "Practitioner-level knowledge base: GEA reference models, standards and governance, architecture practice, data, integration, security and technology.",
    advanced: "Advanced topics: target-state reference architecture, capability-based planning, zero trust, hybrid cloud, data sharing, microservices and platform engineering."
  };
  function lvStatusTxt(es) { return { certified: "Certified", in_progress: "Exam in progress", ready: "Exam unlocked", exhausted: "Attempts used", locked: "Locked" }[es]; }
  function trackRows(c) { return Object.keys(c.track || {}).map(function (k) { return { id: k, label: (TRACK_LABEL[k] || [k])[0], href: (TRACK_LABEL[k] || ["", "#/kb"])[1], t: c.track[k] }; }); }

  function viewCert(level) {
    level = levelDef(level).id;
    var L = levelDef(level), p = state.progress, c = certState(p, level), es = examStatus(c), best = certPct(c), left = Math.max(0, c.maxAttempts - c.attemptsUsed);
    document.title = L.title + " · Certification path";
    var tabs = '<div class="lvtabs">' + LEVELS.map(function (l, i) {
      var cs = certState(p, l.id), e = examStatus(cs);
      var prog = cs.certificate ? 100 : (function () { var r = trackRows(cs); return r.length ? r.reduce(function (s2, x) { return s2 + Math.min(100, x.t.pct); }, 0) / r.length : 0; })();
      return '<a class="lvtab lv-' + l.id + (l.id === level ? " on" : "") + '" href="#/cert/' + l.id + '"><span class="lvn">' + (i + 1) + '</span><span class="lvt"><b>' + esc(l.short || l.title) + "</b><span>" + (cs.certificate ? "✓ Certified" : !cs.prerequisiteMet && l.requires ? ICON.lock + " Requires " + esc(levelDef(l.requires).short) : lvStatusTxt(e)) + '</span></span><span class="lvp"><i style="width:' + prog + '%"></i></span></a>';
    }).join("") + "</div>";
    function step(n, st, title, sub, pct, meta, cta, mark) {
      return '<li class="cstep ' + st + '"><div class="cnum">' + (st === "done" ? "✓" : st === "locked" ? ICON.lock : n) + '</div><div class="cbody"><div class="ctop"><h3>' + title + '</h3><span class="cst ' + st + '">' + { done: "Completed", active: "In progress", locked: "Locked", todo: "Not started", optional: "Recommended" }[st] + "</span></div><p>" + sub + "</p>" +
        (pct !== null ? '<div class="progress"><i style="width:' + Math.min(100, pct) + '%"></i>' + (mark ? '<b class="mark" style="left:' + c.unlockPct + '%" title="Unlock threshold"></b>' : "") + "</div>" : "") +
        '<div class="cfoot"><span>' + meta + "</span>" + (cta || "") + "</div></div></li>";
    }
    var base = "#/cert/" + level;
    var examCta = { ready: '<a class="btn btn-m btn-sm" href="' + base + '/exam">Start attempt ' + (c.attemptsUsed + 1) + " " + ICON.arrow + "</a>", in_progress: '<a class="btn btn-m btn-sm" href="' + base + '/exam">Resume attempt ' + (c.inProgress ? c.inProgress.attemptNo : "") + " " + ICON.arrow + "</a>", certified: '<a class="btn btn-line btn-sm" href="' + base + '/certificate">View certificate</a>', locked: '<span class="muted" style="font-size:13px">Unlocks when the steps above are done</span>', exhausted: '<span class="muted" style="font-size:13px">Ask the EA team for another attempt</span>' }[es];
    var n = 0, steps = '<ol class="cpath">';
    if (L.requires && c.preview) { steps += step(++n, "done", "Prerequisite: " + esc(levelDef(L.requires).title) + " certificate", "Waived for the exam reviewer account.", null, "Reviewer access", ""); }
    else if (L.requires) { var rq = levelDef(L.requires), rc = certState(p, L.requires); steps += step(++n, rc.certificate ? "done" : "locked", "Prerequisite: " + esc(rq.title) + " certificate", "This path builds on the " + esc(rq.short) + " level. Earn that certificate first.", null, rc.certificate ? "Held · " + esc(rc.certificate.certificateId) : "Not yet earned", rc.certificate ? "" : '<a class="btn btn-line btn-sm" href="#/cert/' + rq.id + '">Go to ' + esc(rq.short) + " " + ICON.arrow + "</a>"); }
    trackRows(c).forEach(function (r) {
      var st = r.t.pct >= c.unlockPct ? "done" : r.t.done ? "active" : "todo";
      var how = r.id === "ea" ? "Read the eleven modules and mark each one as completed." : r.id === "togaf" ? "Work through the eleven TOGAF topics — including all ten ADM phases — and mark each as completed." : "Open each " + (r.id === "kbp" ? "Practitioner" : "Advanced") + "-level article in the knowledge base and mark it as completed. The exam questions are drawn from these articles.";
      steps += step(++n, st, esc(r.label), how + " You need " + c.unlockPct + "% (" + Math.ceil(r.t.total * c.unlockPct / 100) + " of " + r.t.total + ").", r.t.pct, r.t.done + " / " + r.t.total + " completed", st === "done" ? "" : '<a class="btn btn-line btn-sm" href="' + r.href + '">' + (r.t.done ? "Continue" : "Start") + " " + ICON.arrow + "</a>", true);
    });
    if (level === "foundation") { var kb = p.kbViewed || 0; steps += step(++n, kb >= 15 ? "done" : "optional", "Knowledge Base", "Part C of the exam is drawn from the knowledge base: GEA standards and checklists, ADR and NFR templates, STRIDE, resilience tiers, integration and API standards, and GTA's baseline.", Math.min(100, kb / 15 * 100), kb + " articles read · 15 recommended", '<a class="btn btn-line btn-sm" href="#/kb">Browse ' + ICON.arrow + "</a>"); }
    var rs = lvRounds(level);
    steps += step(++n, es === "certified" ? "done" : es === "locked" ? "locked" : "active", esc(L.short) + " certification exam", (rs.length > 1 ? rs.length + " parts in one sitting — " + rs.map(function (r) { return esc(r.part + " · " + r.title); }).join(", ") + " — " : "One sitting — ") + examSize(level) + " questions drawn at random from a bank of " + bankSize(level) + ". Score " + c.passPct + "% overall to pass.", es === "certified" ? 100 : best !== null ? best : null, "Attempts used " + c.attemptsUsed + " / " + c.maxAttempts + (best !== null ? " · best " + Math.round(best) + "%" : ""), examCta);
    steps += step(++n, c.certificate ? "done" : "locked", "Certificate — " + esc(L.title), "Issued by the Information Technology Department of the General Tax Authority, signed by the " + esc(CERT.signatoryTitle || "IT Director") + ", with a unique ID anyone can verify.", null, c.certificate ? "ID " + esc(c.certificate.certificateId) + " · issued " + fmtDate(c.certificate.issuedAt) : "Issued automatically when you pass", c.certificate ? '<a class="btn btn-gold btn-sm" href="' + base + '/certificate">Open certificate ' + ICON.arrow + "</a>" : "");
    if (level === "foundation") steps += step(++n, p.signoff ? "done" : c.certificate ? "active" : "locked", "Acknowledgement", "Confirm with your password that you will apply GEA and the Authority's architecture practices.", null, p.signoff ? "Signed " + fmtDate(p.signoff.signedAt) : "Final step after certification", p.signoff ? "" : c.certificate ? '<a class="btn btn-line btn-sm" href="#/signoff">Sign ' + ICON.arrow + "</a>" : "");
    steps += "</ol>";
    var nextL = LEVELS[LEVELS.indexOf(L) + 1];
    var status = { certified: ["Certified", "You hold the " + L.title + " certificate." + (nextL ? " Next: the " + nextL.short + " path." : "")], in_progress: ["Exam in progress", "Your attempt is open — resume where you left off."], ready: ["Exam unlocked", "You have " + left + " attempt" + (left === 1 ? "" : "s") + " left."], exhausted: ["All attempts used", "The EA team can grant another attempt."], locked: [L.requires && !c.prerequisiteMet ? "Prerequisite needed" : "Exam locked", L.requires && !c.prerequisiteMet ? "Earn the " + levelDef(L.requires).title + " certificate first." : "Complete " + c.unlockPct + "% of the required topics to unlock."] }[es];
    var rowsT = trackRows(c), readPct = rowsT.length ? rowsT.reduce(function (s2, x) { return s2 + Math.min(100, x.t.pct); }, 0) / rowsT.length : 0;
    var ringPct = c.certificate ? 100 : readPct * 0.8 + (best !== null ? 5 : 0);
    var side = '<div class="card csum lv-' + level + '"><div class="csum-ring">' + CH.ring(ringPct, "#89143C", esc(L.short) + " path") + '</div><div class="eyebrow" style="text-align:center">' + esc(status[0]) + '</div><p class="muted" style="text-align:center;margin:6px 0 16px">' + esc(status[1]) + "</p>" +
      '<dl class="kv"><dt>Questions</dt><dd>' + examSize(level) + (rs.length > 1 ? " in " + rs.length + " parts" : "") + "</dd><dt>Pass mark</dt><dd>" + c.passPct + "% overall</dd><dt>Attempts</dt><dd>" + c.maxAttempts + " (first attempt + " + (c.maxAttempts - 1) + " retakes)</dd><dt>Unlocks at</dt><dd>" + c.unlockPct + "% of " + rowsT.map(function (r) { return r.label.toLowerCase(); }).join(" and ") + (L.requires ? ", plus the " + esc(levelDef(L.requires).short) + " certificate" : "") + "</dd></dl>" +
      (es === "certified" ? '<a class="btn btn-gold" style="width:100%;justify-content:center;margin-top:16px" href="' + base + '/certificate">View certificate ' + ICON.arrow + "</a>" + (nextL ? '<a class="btn btn-line" style="width:100%;justify-content:center;margin-top:8px" href="#/cert/' + nextL.id + '">' + esc(nextL.short) + " path " + ICON.arrow + "</a>" : "") : es === "ready" || es === "in_progress" ? '<a class="btn btn-m" style="width:100%;justify-content:center;margin-top:16px" href="' + base + '/exam">' + (es === "ready" ? "Start the exam" : "Resume the exam") + " " + ICON.arrow + "</a>" : "") + "</div>";
    var hist = c.exams.length ? '<div class="card" style="margin-top:26px"><h3 style="margin-top:0">Your ' + esc(L.short) + ' attempts</h3><div class="tbl-wrap"><table class="tbl" style="margin:0"><thead><tr><th>Attempt</th><th>Date</th>' + rs.map(function (r) { return "<th>" + (rs.length > 1 ? "Part " + r.part + " · " : "") + esc(r.title) + "</th>"; }).join("") + "<th>Overall</th><th>Result</th></tr></thead><tbody>" +
      c.exams.map(function (x) { return "<tr><td>#" + x.attemptNo + "</td><td>" + fmtDate(x.completedAt, true) + "</td>" + rs.map(function (r) { var pt = (x.parts || []).filter(function (y) { return y.roundId === r.id; })[0]; return "<td>" + (pt ? Math.round(pt.pct) + "%" : "–") + "</td>"; }).join("") + "<td><b>" + Math.round(x.pct) + "%</b></td><td>" + (x.passed ? '<span class="tag teal">Passed</span>' : '<span class="tag">Not passed</span>') + "</td></tr>"; }).join("") + "</tbody></table></div></div>" : "";
    var html = phead("Certification path · " + esc(L.short), esc(L.title), esc(LV_BLURB[level] || "") + " Three paths — Foundation, Practitioner, Advanced — each with its own exam and certificate.",
      '<span class="pill">' + esc(status[0]) + '</span><span class="pill">Attempts ' + c.attemptsUsed + " / " + c.maxAttempts + "</span>") +
      '<section class="section"><div class="wrap">' + (c.preview ? '<div class="rvbanner"><b>Reviewer mode</b> All reading is complete and every exam is open with unlimited attempts. Attempts are scored and show every answer, but no certificate is issued and nothing counts in the dashboard. <a class="btn btn-gold btn-sm" href="#/cert/bank">Open the full question bank ' + ICON.arrow + "</a></div>" : canBank() ? '<div class="rvbanner lite"><b>EA team</b> Review every exam question with answers and explanations. <a class="btn btn-line btn-sm" href="#/cert/bank">Question bank ' + ICON.arrow + "</a></div>" : "") + tabs + '<div class="cgrid"><div>' + steps + hist + "</div><aside>" + side + "</aside></div></div></section>";
    mount("cert", html);
  }

  /* ---------------- Certification exam ---------------- */
  function viewExam(level) {
    level = levelDef(level).id;
    var L = levelDef(level), c = certState(null, level);
    document.title = L.short + " exam · EA Awareness Hub";
    if (c.certificate) { location.hash = "#/cert/" + level + "/certificate"; return; }
    var es = examStatus(c);
    if (es === "locked" || es === "exhausted") { location.hash = "#/cert/" + level; return; }
    if (es === "ready") {
      var left = c.maxAttempts - c.attemptsUsed, rs = lvRounds(level);
      var intro = phead("Certification exam · " + esc(L.short), "Before you start", "Attempt " + (c.attemptsUsed + 1) + " of " + c.maxAttempts + ".", '<span class="pill">' + examSize(level) + " questions</span><span class=\"pill\">Pass " + c.passPct + "%</span>") +
        '<section class="section"><div class="wrap quiz"><div class="qcard"><h3>' + esc(L.title) + ' — certification exam</h3><div class="grid g' + Math.min(3, rs.length) + '" style="margin:18px 0">' +
        rs.map(function (r) { return '<div class="mini"><span class="eyebrow">' + (rs.length > 1 ? "Part " + r.part : "Exam") + "</span><h5 style=\"margin:4px 0\">" + esc(r.title) + "</h5><p>" + (r.perAttempt || r.q.length) + " questions · " + esc(r.d) + "</p></div>"; }).join("") + "</div>" +
        '<ul class="chk"><li>Questions are drawn at random for each attempt; answers are checked when you submit, not one by one.</li><li>Starting uses one of your attempts (' + left + " left). If you close the page, you can resume the same attempt.</li><li>You need " + c.passPct + "% overall." + (rs.length > 1 ? " Your score per part is shown at the end." : "") + "</li></ul>" +
        '<div class="qfoot"><a class="btn btn-line" href="#/cert/' + level + '">Not now</a><button class="btn btn-m" id="begin">Start attempt ' + (c.attemptsUsed + 1) + " " + ICON.arrow + "</button></div></div></div></section>";
      mount("cert", intro, function () { $("#begin").onclick = function () { this.disabled = true; API.startExam(level).then(function (ex) { return refreshProgress().then(function () { runExam(ex, level); }); }).catch(function (e) { toast(esc(e.message)); location.hash = "#/cert/" + level; }); }; });
      return;
    }
    API.startExam(level).then(function (ex) { runExam(ex, level); }).catch(function (e) { toast(esc(e.message)); location.hash = "#/cert/" + level; });
  }
  function runExam(ex, level) {
    var L = levelDef(level), KEY = "eahub.v2.exam." + ex.examId;
    var list = []; ex.parts.forEach(function (pt) { pt.questionIds.forEach(function (id) { if (QUIZ.byId[id]) list.push({ roundId: pt.roundId, q: QUIZ.byId[id] }); }); });
    var multi = ex.parts.length > 1;
    var saved = {}; try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
    var answers = saved.answers || [], i = answers.length, qStart = Date.now(), cur = null;
    var html = phead("Certification exam · Attempt " + ex.attemptNo + " of " + ex.maxAttempts, esc(L.title), "Answer every question, then submit. Your progress is kept if you leave this page.", '<span class="pill">' + list.length + " questions</span><span class=\"pill\">Pass " + certState(null, level).passPct + "%</span>") +
      '<section class="section"><div class="wrap quiz" id="qz"></div></section>';
    function ready(v) { $("#go").disabled = !v; }
    var renderers = {
      mcq: function (q, el) {
        el.innerHTML = '<div class="opts">' + q.options.map(function (o, k) { return '<button class="opt" data-k="' + k + '"><span class="k">' + "ABCDEFG".charAt(k) + "</span><span>" + esc(o) + "</span></button>"; }).join("") + "</div>";
        $$(".opt", el).forEach(function (b) { b.onclick = function () { if (cur.checked) return; $$(".opt", el).forEach(function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); cur.resp = +b.getAttribute("data-k"); ready(true); }; });
      },
      truefalse: function (q, el) {
        el.innerHTML = '<div class="opts" style="grid-template-columns:1fr 1fr"><button class="opt" data-v="1"><span class="k">T</span><span>True</span></button><button class="opt" data-v="0"><span class="k">F</span><span>False</span></button></div>';
        $$(".opt", el).forEach(function (b) { b.onclick = function () { if (cur.checked) return; $$(".opt", el).forEach(function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); cur.resp = b.getAttribute("data-v") === "1"; ready(true); }; });
      },
      order: function (q, el) {
        var items = shuffle(q.items); if (items.join() === q.items.join()) items.reverse();
        cur.resp = items.slice(); ready(true);
        function draw() {
          el.innerHTML = '<div class="dragl">' + cur.resp.map(function (t, k) { return '<div class="dragi"><span class="h">' + (k + 1 < 10 ? "0" : "") + (k + 1) + "</span><span>" + esc(t) + '</span><span class="mv"><button data-k="' + k + '" data-d="-1" aria-label="Move up">↑</button><button data-k="' + k + '" data-d="1" aria-label="Move down">↓</button></span></div>'; }).join("") + "</div>";
          $$(".mv button", el).forEach(function (b) { b.onclick = function () { if (cur.checked) return; var k = +b.getAttribute("data-k"), d = +b.getAttribute("data-d"), j = k + d; if (j < 0 || j >= cur.resp.length) return; var t = cur.resp[k]; cur.resp[k] = cur.resp[j]; cur.resp[j] = t; draw(); }; });
        }
        cur.redraw = draw; draw();
      },
      match: function (q, el) {
        var rights = shuffle(q.pairs.map(function (p) { return p.r; })), pairs = {}, pick = null;
        function draw() {
          var n = 0, num = {}; Object.keys(pairs).forEach(function (l) { num[l] = ++n; });
          var rnum = {}; Object.keys(pairs).forEach(function (l) { rnum[pairs[l]] = num[l]; });
          el.innerHTML = '<div class="match"><div class="col">' + q.pairs.map(function (p) { var c = pick === p.l ? " picked" : pairs[p.l] ? " paired" : ""; return '<button class="mitem l' + c + '" data-l="' + esc(p.l) + '">' + (num[p.l] ? '<span class="pn">' + num[p.l] + "</span>" : "") + esc(p.l) + "</button>"; }).join("") +
            '</div><div class="col">' + rights.map(function (r) { return '<button class="mitem r' + (rnum[r] ? " paired" : "") + '" data-r="' + esc(r) + '">' + (rnum[r] ? '<span class="pn">' + rnum[r] + "</span>" : "") + esc(r) + "</button>"; }).join("") + "</div></div>";
          $$(".mitem.l", el).forEach(function (b) { b.onclick = function () { if (cur.checked) return; var l = b.getAttribute("data-l"); if (pairs[l]) { delete pairs[l]; pick = l; } else pick = pick === l ? null : l; draw(); }; });
          $$(".mitem.r", el).forEach(function (b) { b.onclick = function () { if (cur.checked || !pick) return; var r = b.getAttribute("data-r"); Object.keys(pairs).forEach(function (l) { if (pairs[l] === r) delete pairs[l]; }); pairs[pick] = r; pick = null; draw(); }; });
          cur.resp = Object.keys(pairs).map(function (l) { return { l: l, r: pairs[l] }; });
          ready(cur.resp.length === q.pairs.length);
        }
        cur.redraw = draw; cur.pairs = pairs; draw();
      },
      categorize: function (q, el) {
        var place = {}, pick = null, toks = shuffle(q.items.map(function (x) { return x.t; }));
        function draw() {
          el.innerHTML = '<div class="tray">' + toks.filter(function (t) { return place[t] === undefined; }).map(function (t) { return '<button class="tok' + (pick === t ? " picked" : "") + '" data-t="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div>" +
            '<div class="buckets">' + q.buckets.map(function (b, k) { return '<div class="bucket' + (pick ? " hot" : "") + '" data-b="' + k + '"><h6>' + esc(b) + '</h6><div class="tray">' + toks.filter(function (t) { return place[t] === k; }).map(function (t) { return '<button class="tok" data-t="' + esc(t) + '" data-in="1">' + esc(t) + "</button>"; }).join("") + "</div></div>"; }).join("") + "</div>";
          $$(".tok", el).forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); if (cur.checked) return; var t = b.getAttribute("data-t"); if (b.getAttribute("data-in")) { if (pick && pick !== t) { place[pick] = +b.closest(".bucket").getAttribute("data-b"); pick = null; } else { delete place[t]; pick = t; } } else pick = pick === t ? null : t; draw(); }; });
          $$(".bucket", el).forEach(function (b) { b.onclick = function () { if (cur.checked || !pick) return; place[pick] = +b.getAttribute("data-b"); pick = null; draw(); }; });
          cur.resp = Object.keys(place).map(function (t) { return { t: t, b: place[t] }; });
          ready(cur.resp.length === q.items.length);
        }
        cur.redraw = draw; draw();
      }
    };

    function drawQ() {
      var it = list[i], q = it.q, pt = partOf(it.roundId); qStart = Date.now(); cur = { q: q, resp: null, checked: false };
      var inPart = list.filter(function (x) { return x.roundId === it.roundId; }), k = inPart.indexOf(it);
      var hint = { mcq: "Choose one answer.", truefalse: "True or false?", order: "Use the arrows to put the items in order.", match: "Tap an item on the left, then its match on the right.", categorize: "Tap a card, then the column it belongs to." }[q.type];
      var parts = ex.parts.map(function (pp) { var r = partOf(pp.roundId), n2 = list.filter(function (x) { return x.roundId === r.id; }).length, done = answers.filter(function (a) { return a.roundId === r.id; }).length; return '<div class="xpart' + (r.id === it.roundId ? " on" : "") + (done === n2 ? " done" : "") + '"><span>' + (multi ? "Part " + r.part + " · " : "") + esc(r.title) + '</span><div class="progress"><i style="width:' + (done / Math.max(1, n2) * 100) + '%"></i></div></div>'; }).join("");
      $("#qz").innerHTML = '<div class="xparts" style="grid-template-columns:repeat(' + ex.parts.length + ',minmax(0,1fr))">' + parts + '</div><div class="qhead"><span class="eyebrow">' + (multi ? "Part " + pt.part + " · " : "") + "question " + (k + 1) + " of " + inPart.length + " · " + esc(q.tag) + '</span><span class="tag">' + q.points + ' pts</span></div>' +
        '<div class="qcard"><h3>' + esc(q.q) + '</h3><p class="muted" style="margin-top:-10px;font-size:13.5px">' + hint + '</p><div id="qa"></div><div class="qfoot"><span class="muted" style="font-size:13px">Question ' + (i + 1) + " of " + list.length + '</span><button class="btn btn-m" id="go" disabled>' + (i < list.length - 1 ? "Save and continue →" : "Review and submit →") + "</button></div></div>";
      renderers[q.type](q, $("#qa"));
      $("#go").onclick = function () {
        answers.push({ roundId: it.roundId, questionId: q.id, response: cur.resp, timeMs: Date.now() - qStart });
        try { localStorage.setItem(KEY, JSON.stringify({ answers: answers })); } catch (e) {}
        if (i < list.length - 1) { i++; drawQ(); window.scrollTo({ top: 0, behavior: "smooth" }); } else confirmSubmit();
      };
    }
    function confirmSubmit() {
      $("#qz").innerHTML = '<div class="qcard" style="text-align:center"><div class="eyebrow">All ' + list.length + ' questions answered</div><h3 style="margin:10px 0">Submit attempt ' + ex.attemptNo + "?</h3><p class=\"muted\">Answers cannot be changed after you submit. You need " + certState(null, level).passPct + "% overall to earn the certificate.</p>" +
        '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap"><button class="btn btn-line" id="redo">Start this attempt over</button><button class="btn btn-m" id="sub">Submit exam</button></div></div>';
      $("#redo").onclick = function () { answers = []; i = 0; try { localStorage.removeItem(KEY); } catch (e) {} drawQ(); };
      $("#sub").onclick = function () {
        this.disabled = true; this.textContent = "Scoring…";
        var body = { completedAt: new Date().toISOString(), parts: ex.parts.map(function (pt) { return { roundId: pt.roundId, answers: answers.filter(function (a) { return a.roundId === pt.roundId; }).map(function (a) { return { questionId: a.questionId, response: a.response, timeMs: a.timeMs }; }) }; }) };
        API.submitExam(ex.examId, body).then(function (res) { try { localStorage.removeItem(KEY); } catch (e) {} return refreshProgress().then(function () { result(res); }); })
          .catch(function (e) { toast(esc(e.message)); $("#sub").disabled = false; $("#sub").textContent = "Submit exam"; });
      };
    }
    function result(res) {
      var pass = res.passed, wrong = {};
      answers.forEach(function (a) { var q = QUIZ.byId[a.questionId]; if (!API.scoreAnswer(q, a.response).correct) (wrong[a.roundId] = wrong[a.roundId] || []).push(q.tag); });
      var links = { "x-ea": "#/ea", "x-togaf": "#/togaf", "x-kb": "#/kb" };
      function link(rid) { return links[rid] || (level === "advanced" ? "#/kb?l=Advanced" : "#/kb?l=Practitioner"); }
      var nextL = LEVELS[LEVELS.indexOf(L) + 1];
      if (res.preview) { previewResult(res); return; }
      $("#qz").innerHTML = '<div class="qcard result' + (pass ? " pass" : "") + '">' + (pass ? '<div class="burst"></div>' : "") + '<div style="color:#89143C">' + CH.ring(res.pct, pass ? "#138A72" : "#A8204F", res.score + " / " + res.maxScore + " pts") + "</div>" +
        "<h3 style=\"margin:6px 0\">" + (pass ? "Congratulations — you are certified at " + esc(L.short) + " level" : "Not passed this time") + '</h3><p class="muted">' + (pass ? "Your certificate " + esc(res.certificate.certificateId) + " has been issued and emailed to you." : "You scored " + Math.round(res.pct) + "%; " + certState(null, level).passPct + "% is needed. " + (res.attemptsLeft ? res.attemptsLeft + " attempt" + (res.attemptsLeft === 1 ? "" : "s") + " left — review the topics below, then try again." : "All attempts are used — the EA team can grant another.")) + "</p>" +
        '<div class="grid g' + Math.min(3, res.parts.length) + '" style="margin-top:18px;text-align:start">' + res.parts.map(function (pt) { var r = partOf(pt.roundId); return '<div class="mini"><span class="eyebrow">' + (multi ? "Part " + r.part : "Score") + "</span><h5 style=\"margin:4px 0\">" + esc(r.title) + '</h5><div class="score" style="font-size:28px">' + Math.round(pt.pct) + '%</div><div class="progress" style="margin:6px 0"><i style="width:' + pt.pct + '%"></i></div>' + (wrong[pt.roundId] ? '<p class="muted" style="font-size:12.5px;margin:6px 0 0">Review: ' + esc(wrong[pt.roundId].filter(function (v, k2, a2) { return a2.indexOf(v) === k2; }).join(", ")) + ' · <a href="' + link(pt.roundId) + '">open</a></p>' : '<p class="muted" style="font-size:12.5px;margin:6px 0 0">All correct</p>') + "</div>"; }).join("") + "</div>" +
        '<div style="display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap"><a class="btn btn-line" href="#/cert/' + level + '">Certification path</a>' + (pass ? '<a class="btn btn-gold" href="#/cert/' + level + '/certificate">View my certificate ' + ICON.arrow + "</a>" + (nextL ? '<a class="btn btn-line" href="#/cert/' + nextL.id + '">' + esc(nextL.short) + " path →</a>" : "") : "") + "</div></div>";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function previewResult(res) {
      $("#qz").innerHTML = '<div class="qcard result"><div style="color:#89143C">' + CH.ring(res.pct, res.passed ? "#138A72" : "#A8204F", res.score + " / " + res.maxScore + " pts") + '</div><h3 style="margin:6px 0">Preview attempt scored — ' + Math.round(res.pct) + "%</h3><p class=\"muted\">Reviewer mode: no certificate is issued. Every question from this attempt is listed below with your answer, the correct answer and the explanation.</p>" +
        '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px"><a class="btn btn-line" href="#/cert/' + level + '">Certification path</a><a class="btn btn-m" href="#/cert/' + level + '/exam">New attempt</a><a class="btn btn-gold" href="#/cert/bank?l=' + level + '">Full question bank</a></div></div>' +
        '<div class="bank" style="margin-top:22px">' + answers.map(function (a, k) { var q = QUIZ.byId[a.questionId], ok = API.scoreAnswer(q, a.response).correct; return bankCard(q, k + 1, true, a.response, ok); }).join("") + "</div>";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    mount("cert", html, function () { if (i >= list.length) confirmSubmit(); else drawQ(); });
  }

  /* ---------------- Question bank (EA team / reviewers) ---------------- */
  function fmtResp(q, r) {
    if (r === null || r === undefined) return "No answer";
    if (q.type === "mcq") return q.options[r] !== undefined ? "ABCDEFG".charAt(r) + ". " + q.options[r] : "No answer";
    if (q.type === "truefalse") return r ? "True" : "False";
    if (q.type === "order") return (r || []).join(" → ");
    if (q.type === "match") return (r || []).map(function (x) { return x.l + " — " + x.r; }).join("; ");
    if (q.type === "categorize") return q.buckets.map(function (b, k) { return b + ": " + (r || []).filter(function (x) { return x.b === k; }).map(function (x) { return x.t; }).join(", "); }).join(" · ");
    return "";
  }
  function bankCard(q, num, showAns, resp, ok) {
    var r = partOf(roundOfQ(q.id)), L = levelDef(r.level);
    var ans = "";
    if (q.type === "mcq") ans = '<ol class="bopts">' + q.options.map(function (o, k) { return '<li class="' + (showAns && k === q.answer ? "right" : "") + '"><span class="k">' + "ABCDEFG".charAt(k) + "</span>" + esc(o) + "</li>"; }).join("") + "</ol>";
    if (q.type === "truefalse") ans = '<ol class="bopts"><li class="' + (showAns && q.answer ? "right" : "") + '"><span class="k">T</span>True</li><li class="' + (showAns && !q.answer ? "right" : "") + '"><span class="k">F</span>False</li></ol>';
    if (q.type === "order") ans = showAns ? '<ol class="bord">' + q.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ol>' : '<p class="muted">' + q.items.length + " items to put in order.</p>";
    if (q.type === "match") ans = '<table class="tbl bmt"><tbody>' + q.pairs.map(function (p2) { return "<tr><td>" + esc(p2.l) + "</td><td>" + (showAns ? "→ <b>" + esc(p2.r) + "</b>" : "…") + "</td></tr>"; }).join("") + "</tbody></table>";
    if (q.type === "categorize") ans = '<div class="bcat">' + q.buckets.map(function (b, k) { return '<div><h6>' + esc(b) + "</h6>" + (showAns ? q.items.filter(function (it) { return it.b === k; }).map(function (it) { return '<span class="tag">' + esc(it.t) + "</span>"; }).join(" ") : "") + "</div>"; }).join("") + "</div>" + (showAns ? "" : '<p class="muted">Items: ' + q.items.map(function (it) { return esc(it.t); }).join(", ") + "</p>");
    var typeName = { mcq: "Multiple choice", truefalse: "True / false", order: "Ordering", match: "Matching", categorize: "Categorising" }[q.type];
    return '<article class="bq' + (resp !== undefined ? (ok ? " okq" : " badq") : "") + '"><header><span class="bnum">' + (num || "") + '</span><span class="tag">' + esc(L.short) + "</span><span class=\"tag gray\">" + (lvRounds(r.level).length > 1 ? "Part " + r.part + " · " : "") + esc(r.title) + '</span><span class="tag gold">' + typeName + "</span><span class=\"muted\" style=\"margin-inline-start:auto;font-size:12px\">" + esc(q.id) + " · " + q.points + " pts · " + esc(q.tag) + "</span></header>" +
      "<h4>" + esc(q.q) + "</h4>" + ans +
      (resp !== undefined ? '<div class="byour ' + (ok ? "ok" : "bad") + '"><b>' + (ok ? "✓ Your answer was correct" : "✕ Your answer") + "</b>" + (ok ? "" : ": " + esc(fmtResp(q, resp))) + "</div>" : "") +
      (showAns ? '<div class="bwhy"><b>Why</b> ' + esc(q.why) + '<span class="src">SOURCE · ' + esc(q.src) + "</span></div>" : "") + "</article>";
  }
  var _roundOfQ = null;
  function roundOfQ(id) { if (!_roundOfQ) { _roundOfQ = {}; QUIZ.rounds.forEach(function (r) { r.q.forEach(function (x) { _roundOfQ[x] = r.id; }); }); } return _roundOfQ[id]; }
  function viewBank(params) {
    document.title = "Question bank · EA Awareness Hub";
    if (!canBank()) { location.hash = "#/cert"; return; }
    var st = { l: params.l || "foundation", r: "", q: "", ans: true };
    var html = phead("Certification path · Question bank", "Every exam question", "All " + QUIZ.questions.length + " questions across the Foundation, Practitioner and Advanced exams, with correct answers, explanations and sources. Visible to the EA team and exam reviewers only.",
      LEVELS.map(function (l) { return '<span class="pill">' + esc(l.short) + " · " + bankSize(l.id) + "</span>"; }).join("")) +
      '<section class="section"><div class="wrap"><div class="bank-tools"><div class="seg" id="bl">' + LEVELS.map(function (l) { return '<button data-l="' + l.id + '"' + (l.id === st.l ? ' class="on"' : "") + ">" + esc(l.short) + "</button>"; }).join("") + '</div><select id="br"></select><input id="bs" type="search" placeholder="Search question text, tag or source"><label class="bchk"><input type="checkbox" id="ba" checked> Show answers</label><button class="btn btn-line btn-sm" id="bp">Print</button></div><div class="muted" id="bc" style="margin:10px 0 14px;font-size:13.5px"></div><div class="bank" id="bk"></div></div></section>';
    mount("cert", html, function () {
      function fillParts() { var rs = lvRounds(st.l); $("#br").innerHTML = '<option value="">All parts (' + bankSize(st.l) + ")</option>" + rs.map(function (r) { return '<option value="' + r.id + '">' + (rs.length > 1 ? "Part " + r.part + " · " : "") + esc(r.title) + " (" + r.q.length + ")</option>"; }).join(""); $("#br").value = st.r; }
      function draw() {
        var rs = lvRounds(st.l).filter(function (r) { return !st.r || r.id === st.r; }), list = [];
        rs.forEach(function (r) { r.q.forEach(function (id) { var q = QUIZ.byId[id]; if (!q) return; var t = (q.q + " " + q.tag + " " + q.src + " " + id).toLowerCase(); if (!st.q || t.indexOf(st.q.toLowerCase()) >= 0) list.push(q); }); });
        $("#bc").textContent = list.length + " question" + (list.length === 1 ? "" : "s") + " · each attempt draws " + examSize(st.l) + " of " + bankSize(st.l) + " at random";
        $("#bk").innerHTML = list.map(function (q, k) { return bankCard(q, k + 1, st.ans); }).join("") || '<div class="card">No questions match.</div>';
      }
      $$("#bl button").forEach(function (b) { b.onclick = function () { $$("#bl button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); st.l = b.getAttribute("data-l"); st.r = ""; fillParts(); draw(); }; });
      $("#br").onchange = function () { st.r = this.value; draw(); };
      $("#bs").oninput = function () { st.q = this.value.trim(); draw(); };
      $("#ba").onchange = function () { st.ans = this.checked; draw(); };
      $("#bp").onclick = function () { window.print(); };
      fillParts(); draw();
    });
  }

  /* ---------------- Certificate ---------------- */
  function sealSvg(year, level) {
    var st = LV_STYLE[level] || LV_STYLE.foundation;
    var pts = [], n = 48; for (var k = 0; k < n * 2; k++) { var r = k % 2 ? 92 : 100, a = Math.PI * k / n; pts.push((100 + r * Math.cos(a)).toFixed(1) + "," + (100 + r * Math.sin(a)).toFixed(1)); }
    var inner = level === "advanced" ? "#1E1A22" : level === "practitioner" ? "#511C3C" : "#89143C";
    return '<svg class="seal" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="sg-' + level + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3CF94"/><stop offset=".5" stop-color="#B49B5C"/><stop offset="1" stop-color="#8E7A45"/></linearGradient><path id="sarc-' + level + '" d="M100,100 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"/></defs>' +
      '<polygon points="' + pts.join(" ") + '" fill="url(#sg-' + level + ')"/><circle cx="100" cy="100" r="84" fill="none" stroke="#FBF6E6" stroke-width="1.5"/><circle cx="100" cy="100" r="76" fill="' + inner + '"/><circle cx="100" cy="100" r="50" fill="none" stroke="#C9B37A" stroke-width="1"/>' +
      '<text font-family="Tajawal,sans-serif" font-size="11" font-weight="800" letter-spacing="2.2" fill="#F5E9C8"><textPath href="#sarc-' + level + '" startOffset="0">GENERAL TAX AUTHORITY • ' + st.seal + " • </textPath></text>" +
      '<text x="100" y="96" text-anchor="middle" font-family="Tajawal,sans-serif" font-size="26" font-weight="800" fill="#fff">EA</text><text x="100" y="116" text-anchor="middle" font-family="Tajawal,sans-serif" font-size="9.5" font-weight="700" letter-spacing="1.6" fill="#E3CF94">' + esc((levelDef(level).short || "").toUpperCase()) + '</text><text x="100" y="132" text-anchor="middle" font-family="Tajawal,sans-serif" font-size="10" font-weight="700" fill="#E3CF94">' + year + "</text></svg>";
  }
  function certificateHtml(cd, level) {
    level = level || cd.level || "foundation";
    var L = levelDef(level), st = LV_STYLE[level] || LV_STYLE.foundation, d = new Date(cd.issuedAt), year = d.getFullYear();
    var verify = location.href.split("#")[0] + "#/verify/" + cd.certificateId;
    var sig = CERT.signatureImage ? '<img class="sigimg" src="' + esc(CERT.signatureImage) + '" alt="Signature">' : '<div class="esig"><span>Digitally signed</span>' + esc(CERT.signatoryName || "IT Director") + "</div>";
    var body = {
      foundation: "has successfully completed the <b>" + esc(L.title) + "</b> course — EA Foundations aligned to the Qatar Government Enterprise Architecture (GEA), the TOGAF<sup>®</sup> Standard, 10th Edition, and the EA Knowledge Base — and passed the Foundation certification examination",
      practitioner: "has successfully completed the <b>" + esc(L.title) + "</b> path — the practitioner-level body of knowledge on the Qatar GEA reference models, standards and governance, architecture practice, data, integration, security and technology — and passed the Practitioner certification examination",
      advanced: "has successfully completed the <b>" + esc(L.title) + "</b> path — advanced architecture practice including target-state reference architecture, capability-based planning, zero trust, hybrid cloud, data sharing, microservices and platform engineering — and passed the Advanced certification examination"
    }[level] || "";
    return '<div class="cert cert-' + level + '" id="certificate"><div class="cert-in">' +
      '<div class="cert-band"><img src="assets/img/logo-white-stacked.png" alt="General Tax Authority"><div class="cert-band-t"><span>' + esc(st.tag) + "</span><b>" + st.band + '</b><em>' + esc((L.short || "").toUpperCase()) + "</em></div>" + sealSvg(year, level) + "</div>" +
      '<div class="cert-main"><div class="cert-corner tl"></div><div class="cert-corner br"></div>' +
      '<div class="cert-eyebrow">' + esc(CERT.issuer || "Information Technology Department") + " · " + esc(CERT.organisation || "General Tax Authority") + "</div>" +
      '<h1 class="cert-title">Certificate of Completion</h1><div class="cert-ar">شهادة إتمام</div>' +
      '<p class="cert-lead">This is to certify that</p><div class="cert-name">' + esc(cd.displayName) + "</div>" + (cd.department ? '<div class="cert-dept">' + esc(cd.department) + "</div>" : "") +
      '<p class="cert-body">' + body + " with a score of <b>" + Math.round(cd.scorePct) + "%</b>.</p>" +
      '<p class="cert-grant">Granted by the Information Technology Department of the General Tax Authority, State of Qatar.</p>' +
      '<div class="cert-foot"><div class="cf"><div class="cf-v">' + d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + '</div><div class="cf-l">Date of issue</div></div>' +
      '<div class="cf sig">' + sig + '<div class="cf-line"></div>' + (CERT.signatoryName ? '<div class="cf-v">' + esc(CERT.signatoryName) + "</div>" : "") + '<div class="cf-l">' + esc(CERT.signatoryTitle || "Director, Information Technology") + "</div></div></div>" +
      '<div class="cert-id"><span>Certificate ID <b>' + esc(cd.certificateId) + "</b></span><span>Verify at " + esc(verify) + "</span></div></div></div></div>";
  }
  function viewCertificate(level) {
    level = levelDef(level).id;
    var L = levelDef(level), c = certState(null, level);
    if (!c.certificate) { location.hash = "#/cert/" + level; return; }
    document.title = "Certificate " + c.certificate.certificateId + " · EA Awareness Hub";
    var others = LEVELS.filter(function (l) { return l.id !== level && certState(null, l.id).certificate; });
    var html = phead("Certification path · " + esc(L.short), "Your certificate", esc(L.title) + " — issued by the IT Department of the General Tax Authority. Print it or save it as a PDF; anyone can verify the ID.",
      '<span class="pill">' + esc(c.certificate.certificateId) + "</span>") +
      '<section class="section"><div class="wrap"><div class="cert-actions"><a class="btn btn-line btn-sm" href="#/cert/' + level + '">← ' + esc(L.short) + ' path</a><div style="display:flex;gap:8px;flex-wrap:wrap">' + others.map(function (l) { return '<a class="btn btn-line btn-sm" href="#/cert/' + l.id + '/certificate">' + esc(l.short) + " certificate</a>"; }).join("") + '<button class="btn btn-line btn-sm" id="cpy">Copy verification link</button><button class="btn btn-m btn-sm" id="prt">Print / save as PDF</button></div></div>' + certificateHtml(c.certificate, level) + "</div></section>";
    mount("cert", html, function () {
      $("#prt").onclick = function () { document.body.classList.add("print-cert"); window.print(); setTimeout(function () { document.body.classList.remove("print-cert"); }, 500); };
      $("#cpy").onclick = function () { var u = location.href.split("#")[0] + "#/verify/" + c.certificate.certificateId; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { toast("Verification link copied."); }).catch(function () { toast(esc(u)); }); };
    });
  }
  function viewVerify(id) {
    document.title = "Verify certificate · EA Awareness Hub";
    app.innerHTML = '<div class="verify plate"><div class="vcard"><img src="assets/img/logo-color.png" alt="General Tax Authority" style="height:62px"><div class="eyebrow" style="margin-top:18px">Certificate verification</div><div id="vr" class="muted" style="margin-top:10px">Checking ' + esc(id) + "…</div>" + (state.user ? '<a class="btn btn-line btn-sm" style="margin-top:18px" href="#/home">Back to the hub</a>' : '<a class="btn btn-line btn-sm" style="margin-top:18px" href="#/login">Sign in to the hub</a>') + "</div></div>";
    API.verifyCertificate(id).then(function (v) {
      $("#vr").innerHTML = '<div class="vok">✓ Valid certificate</div><h2 style="margin:6px 0;color:#33091F">' + esc(v.displayName) + '</h2><p style="margin:0">' + esc(v.department || "") + "</p><dl class=\"kv\" style=\"margin-top:16px;text-align:start\"><dt>Certificate</dt><dd class=\"mono\">" + esc(v.certificateId) + "</dd><dt>Certification</dt><dd>" + esc(v.title || levelDef(v.level).title) + "</dd><dt>Issued</dt><dd>" + fmtDate(v.issuedAt) + "</dd><dt>Score</dt><dd>" + Math.round(v.scorePct) + "%</dd><dt>Issuer</dt><dd>IT Department, General Tax Authority</dd></dl>" + (API.name === "mock" ? '<p class="fine" style="margin-top:12px">Demo mode verifies certificates stored in this browser only.</p>' : "");
    }).catch(function () { $("#vr").innerHTML = '<div class="vbad">✕ No valid certificate with ID ' + esc(id) + "</div>"; });
  }

  /* ---------------- Sign-off ---------------- */
  function sha256(text) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); });
    }
    var h = 0; for (var i = 0; i < text.length; i++) { h = (h * 31 + text.charCodeAt(i)) >>> 0; } return Promise.resolve("fallback-" + h.toString(16));
  }
  function viewSignoff() {
    document.title = "Sign-off · EA Awareness Hub";
    var S = CONTENT.signoff, p = state.progress, pre = window.EA_signoffPreconditions(p), txt = S.title + "\n" + S.body.join("\n");
    var html = phead("Acknowledgement", "Sign-off", "The final step of the Foundation track: confirm that you will apply GEA and the Authority's architecture practices. You confirm with your hub password, and a receipt is emailed to your GTA mailbox.",
      '<span class="pill">Statement ' + esc(S.version) + "</span>") +
      '<section class="section"><div class="wrap"><div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:26px;align-items:start" id="sg"></div></div></section>';
    mount("signoff", html, function () {
      sha256(txt).then(function (hash) {
        var stmt = '<div class="statement"><div class="eyebrow">Statement ' + esc(S.version) + "</div><h3>" + esc(S.title) + '</h3><p class="muted">I, <b>' + esc(state.user.displayName) + "</b> (" + esc(state.user.email) + (state.user.department ? ", " + esc(state.user.department) : "") + '), confirm that:</p><ol class="prose" style="font-size:15.5px">' + S.body.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ol><div class="hash">SHA-256 · ' + hash + "</div></div>";
        var right;
        if (p.signoff) {
          right = '<div class="receipt"><span class="stamp">SIGNED</span><div class="eyebrow">Receipt</div><h3 style="margin:8px 0 18px;color:#33091F">Acknowledgement recorded</h3><dl class="kv"><dt>Receipt</dt><dd class="mono">' + esc(p.signoff.receiptId) + "</dd><dt>Name</dt><dd>" + esc(state.user.displayName) + "</dd><dt>Email</dt><dd>" + esc(state.user.email) + "</dd><dt>Statement</dt><dd>" + esc(p.signoff.statementVersion) + "</dd><dt>Signed</dt><dd>" + fmtDate(p.signoff.signedAt, true) + '</dd><dt>Verified by</dt><dd>' + (p.signoff.verifiedBy === "otp" ? "One-time code to GTA email" : "Account password") + '</dd></dl><p class="fine" style="margin-top:16px">A confirmation email with this receipt was sent to your GTA mailbox.</p><button class="btn btn-line btn-sm" onclick="window.print()">Print receipt</button></div>';
        } else {
          right = '<div class="card"><div class="eyebrow">Before you sign</div><h3 style="margin:8px 0 14px">Requirements</h3><ul class="pre-list">' +
            pre.items.map(function (m) { return '<li class="' + (m.ok ? "ok" : "") + '"><span class="dot">' + (m.ok ? "✓" : "") + "</span>" + esc(m.title) + (m.ok ? "" : '<a href="' + m.href + '">Open</a>') + "</li>"; }).join("") +
            '</ul><div id="sgf" style="margin-top:18px"></div></div>';
        }
        $("#sg").innerHTML = stmt + right;
        if (p.signoff) return;
        var f = $("#sgf");
        if (!pre.ok) { f.innerHTML = '<div class="callout note"><b>Locked</b>Sign-off opens once you hold the Foundation certificate. <a href="#/cert">See your certification path</a>.</div>'; return; }
        f.innerHTML = '<label style="display:flex;gap:10px;align-items:flex-start;font-size:14.5px;font-weight:700"><input type="checkbox" id="agree" style="margin-top:5px;width:18px;height:18px;accent-color:#89143C"> I have read the statement and agree to it.</label>' +
          '<div class="field" style="margin-top:14px"><label for="spw">Confirm with your password</label><div class="pwrap"><input id="spw" type="password" autocomplete="current-password"><button type="button" class="pwshow" aria-label="Show password">Show</button></div></div><div class="err" id="er"></div>' +
          '<button class="btn btn-m" id="conf" style="margin-top:6px;width:100%;justify-content:center" disabled>Confirm and sign</button>';
        wirePw(f);
        function en() { $("#conf").disabled = !($("#agree").checked && $("#spw").value.length); }
        $("#agree").onchange = en; $("#spw").oninput = en;
        $("#conf").onclick = function () {
          var b = this; b.disabled = true; b.textContent = "Signing…"; $("#er").textContent = "";
          API.signoff($("#spw").value, S.version, hash).then(function (r) { return refreshProgress().then(function () { toast("<b>Signed.</b> Receipt " + esc(r.receiptId) + " emailed to you."); viewSignoff(); }); })
            .catch(function (e) { b.disabled = false; b.textContent = "Confirm and sign"; $("#er").textContent = e.code === "invalid_credentials" ? "Your password is incorrect." : e.message; });
        };
      });
    });
  }

  /* ---------------- Profile ---------------- */
  function viewProfile() {
    var u = state.user, p = state.progress;
    var depts = ["Information Technology", "Planning & Quality", "Financial & Administrative Affairs", "Public Relations & Communication", "Internal Audit", "Legal Affairs", "Human Resources", "Taxpayer Services", "Consumption Tax", "Income Tax", "Tax Treaties & International Cooperation", "Tax Policies", "Tax Revenues", "Other"];
    var html = phead("Profile", esc(u.displayName), esc(u.email), '<span class="pill">' + esc(u.role) + "</span>") +
      '<section class="section"><div class="wrap grid g2"><form class="card" id="pf"><h3>Your details</h3><div class="field"><label>Display name</label><input id="dn" value="' + esc(u.displayName) + '"></div><div class="field"><label>Department</label><select id="dp">' + depts.map(function (d) { return "<option" + (d === u.department ? " selected" : "") + ">" + esc(d) + "</option>"; }).join("") + '</select></div><div class="field"><label>Job title</label><input id="jt" value="' + esc(u.jobTitle || "") + '"></div><button class="btn btn-m">Save</button></form>' +
      '<div class="card"><h3>Your record</h3><dl class="kv"><dt>First sign-in</dt><dd>' + (u.firstLoginAt ? fmtDate(u.firstLoginAt, true) : "–") + "</dd><dt>EA modules</dt><dd>" + certState(p).track.ea.done + " / " + LEARN.length + " completed</dd><dt>TOGAF topics</dt><dd>" + certState(p).track.togaf.done + " / " + TOPICS.length + " completed</dd><dt>KB articles</dt><dd>" + (p.kbViewed || 0) + " read</dd>" + LEVELS.map(function (l) { var cs = certState(p, l.id); return "<dt>" + esc(l.short) + "</dt><dd>" + (cs.certificate ? '<a href="#/cert/' + l.id + '/certificate">' + esc(cs.certificate.certificateId) + "</a>" : cs.attemptsUsed + " / " + cs.maxAttempts + " attempts" + (certPct(cs) !== null ? " · best " + Math.round(certPct(cs)) + "%" : "")) + "</dd>"; }).join("") + "<dt>Sign-off</dt><dd>" + (p.signoff ? esc(p.signoff.receiptId) : "Pending") + "</dd></dl></div>" +
      '<form class="card" id="cpf"><h3>Change password</h3><div class="field"><label for="cp0">Current password</label><input id="cp0" type="password" autocomplete="current-password" required></div><div class="field"><label for="cp1">New password</label><input id="cp1" type="password" autocomplete="new-password" required></div><div class="field"><label for="cp2">Confirm new password</label><input id="cp2" type="password" autocomplete="new-password" required></div><p class="fine" style="margin-top:0">At least 10 characters with a letter and a number; not your email name.</p><div class="err" id="cper"></div><button class="btn btn-m">Update password</button></form></div></section>';
    mount("", html, function () {
      $("#cpf").onsubmit = function (e) {
        e.preventDefault(); var n1 = $("#cp1").value;
        if (n1 !== $("#cp2").value) { $("#cper").textContent = "The new passwords don't match."; return; }
        var iss = API.passwordIssue ? API.passwordIssue(n1, u.email) : null; if (iss) { $("#cper").textContent = iss; return; }
        API.changePassword($("#cp0").value, n1).then(function () { toast("<b>Password updated.</b>"); $("#cpf").reset(); $("#cper").textContent = ""; }).catch(function (x) { $("#cper").textContent = x.message; });
      };
      $("#pf").onsubmit = function (e) { e.preventDefault(); API.updateMe({ displayName: $("#dn").value.trim(), department: $("#dp").value, jobTitle: $("#jt").value.trim() }).then(function (r) { state.user = r.user; toast("Profile saved."); viewProfile(); }); };
    });
  }

  /* ---------------- Dashboard ---------------- */
  function viewDashboard() {
    document.title = "Dashboard · EA Awareness Hub";
    if (!isAdmin()) { mount("dashboard", phead("Dashboard", "Restricted", "The programme dashboard is available to the EA team and administrators.") + '<section class="section"><div class="wrap"><div class="card">Ask the EA team for access.</div></div></section>'); return; }
    var f = { days: 45, department: "" };
    var html = phead("Programme dashboard", "Foundation track &amp; adoption", "Access, learning progress, exam results and certification across GTA — by department and by employee.",
      (API.name === "mock" ? '<span class="pill">Synthetic demo population + your browser\'s data</span>' : '<span class="pill">Live data</span>')) +
      '<section class="section"><div class="wrap"><div class="filters"><div class="field"><label>Period</label><div class="seg" id="rng"><button data-d="14">14 days</button><button data-d="30">30 days</button><button data-d="45" class="on">45 days</button></div></div><div class="field"><label for="dpf">Department</label><select id="dpf"><option value="">All departments</option></select></div><div style="margin-inline-start:auto;display:flex;gap:8px"><button class="btn btn-line btn-sm" id="csvd">Departments CSV</button><button class="btn btn-line btn-sm" id="csve">Employees CSV</button></div></div><div id="dash"><div class="card">Loading…</div></div></div></section>';
    mount("dashboard", html, function () {
      $$("#rng button").forEach(function (b) { b.onclick = function () { $$("#rng button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); f.days = +b.getAttribute("data-d"); load(); }; });
      $("#dpf").onchange = function () { f.department = this.value; load(); };
      var last = null, emp = { q: "", st: "", sort: "displayName", asc: true, page: 0, tsl: "foundation" };
      function csv(name, rows) {
        var blob = new Blob(["﻿" + rows.map(function (r) { return r.map(function (c) { return '"' + String(c === null || c === undefined ? "" : c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n")], { type: "text/csv" });
        var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
      }
      $("#csvd").onclick = function () {
        if (!last) return;
        csv("ea-hub-departments.csv", [["department", "users", "active_users", "logins", "minutes", "certified", "certified_pct", "avg_score_pct", "signed_pct"]].concat(last.deptAccess.map(function (d) { var b = last.byDepartment.filter(function (x) { return x.department === d.department; })[0] || {}; return [d.department, d.users, d.activeUsers, d.logins, Math.round(d.minutes), d.certified, (d.users ? d.certified / d.users * 100 : 0).toFixed(1), (b.avgScorePct || 0).toFixed(1), (b.signedPct || 0).toFixed(1)]; })));
      };
      $("#csve").onclick = function () {
        if (!last) return;
        csv("ea-hub-employees.csv", [["name", "email", "department", "ea_pct", "togaf_pct", "kb_practitioner_pct", "kb_advanced_pct", "kb_read", "foundation_attempts", "foundation_best_pct", "foundation_status", "foundation_certificate", "practitioner_certificate", "practitioner_best_pct", "advanced_certificate", "advanced_best_pct", "signed", "logins", "minutes", "last_seen"]].concat(last.employees.map(function (e) { var lv = e.levels || {}, P = lv.practitioner || {}, A = lv.advanced || {}; return [e.displayName, e.email, e.department, Math.round(e.eaPct), Math.round(e.togafPct), Math.round(e.kbpPct || 0), Math.round(e.kbaPct || 0), e.kbRead, e.examAttempts, e.bestPct === null ? "" : Math.round(e.bestPct), stOf(e)[1], e.certificateId || "", P.certificateId || "", P.bestPct == null ? "" : Math.round(P.bestPct), A.certificateId || "", A.bestPct == null ? "" : Math.round(A.bestPct), e.signed ? "yes" : "no", e.logins, e.minutes, e.lastSeenAt || ""]; })));
      };
      function load() {
        var from = new Date(Date.now() - (f.days - 1) * 86400000).toISOString().slice(0, 10);
        API.dashboard({ from: from, to: new Date().toISOString().slice(0, 10), department: f.department }).then(function (d) {
          last = d; emp.page = 0;
          if ($("#dpf").options.length === 1 && d.departments) d.departments.forEach(function (x) { var o = document.createElement("option"); o.textContent = x; $("#dpf").appendChild(o); });
          draw(d);
        }).catch(function (e) { $("#dash").innerHTML = '<div class="card">' + esc(e.message) + "</div>"; });
      }
      var unl = (CERT.unlockPct || 80), maxA = (CERT.maxAttempts || 3);
      function stOf(e) {
        if (e.certified) return ["st-cert", "Certified"];
        if (e.examAttempts >= (e.maxAttempts || maxA)) return ["st-ex", "Attempts used"];
        if (e.eaPct >= unl && e.togafPct >= unl) return ["st-unl", e.examAttempts ? "Retake open" : "Exam unlocked"];
        if (e.eaPct > 0 || e.togafPct > 0) return ["st-prog", "Learning"];
        return ["st-none", "Not started"];
      }
      function lvBadges(e) { var lv = e.levels || {}; return ["practitioner", "advanced"].map(function (k) { return lv[k] && lv[k].certified ? ' <span class="lvb lv-' + k + '" title="' + esc(levelDef(k).title) + ' certified">' + esc(levelDef(k).short.charAt(0)) + "✓</span>" : ""; }).join(""); }
      function grantLevel(e) { var lv = e.levels || {}, hit = null; LEVELS.forEach(function (l) { var r = lv[l.id] || (l.id === "foundation" ? { certified: e.certified, attempts: e.examAttempts, maxAttempts: e.maxAttempts || maxA } : null); if (!hit && r && !r.certified && r.attempts >= (r.maxAttempts || maxA)) hit = l.id; }); return hit; }
      function mb(v) { return '<span class="minibar"><i style="width:' + Math.min(100, v) + '%"></i></span>' + Math.round(v) + "%"; }
      function ago(iso) { if (!iso) return "–"; var h = (Date.now() - new Date(iso)) / 3600000; return h < 1 ? "just now" : h < 24 ? Math.round(h) + " h ago" : Math.round(h / 24) + " d ago"; }
      function draw(d) {
        var k = d.kpis, fm = CH.fmt;
        $("#dash").innerHTML =
          '<div class="kpis"><div class="kpi kpi-h"><div class="l">Certified</div><div class="v">' + fm(k.certified || 0) + '<small> · ' + fm(k.certifiedRatePct || 0, 0) + '%</small></div><div class="s">Foundation · of ' + k.enrolled + " enrolled" + (k.certifiedByLevel ? " · Practitioner " + (k.certifiedByLevel.practitioner || 0) + " · Advanced " + (k.certifiedByLevel.advanced || 0) : "") + "</div></div>" +
          '<div class="kpi"><div class="l">Active users</div><div class="v">' + fm(k.activeUsers) + '</div><div class="s">' + fm(k.logins) + " sign-ins · " + fm(k.avgMinutesPerUser, 0) + " min each</div></div>" +
          '<div class="kpi"><div class="l">Average best exam score</div><div class="v">' + fm(k.avgScorePct, 0) + '<small>%</small></div><div class="s">' + fm(k.examAttempts || 0) + " attempts · " + fm(k.passRatePct, 0) + "% passed</div></div>" +
          '<div class="kpi"><div class="l">Acknowledgements</div><div class="v">' + fm(k.signoffRatePct, 0) + '<small>%</small></div><div class="s">' + d.funnel.signedOff + " signed after certifying</div></div></div>" +
          '<div class="dash-grid">' +
          '<div class="panel c7"><div class="ph"><div><h4>Access by department</h4><div class="sub">Sign-ins in the period — which departments use the hub most</div></div></div><div class="chart" id="c-dacc"></div></div>' +
          '<div class="panel c5"><h4>Foundation track funnel</h4><div class="sub">From enrolment to certificate and acknowledgement</div><div class="chart" id="c-fun"></div></div>' +
          '<div class="panel c6"><h4>Most active employees</h4><div class="sub">Top 10 by sign-ins in the period</div><ol class="rank">' + (d.topUsersByAccess || []).map(function (u, i) { return '<li><span class="rk">' + (i + 1) + '</span><span class="nm">' + esc(u.displayName) + '<span class="sb">' + esc(u.department) + " · last seen " + ago(u.lastSeenAt) + '</span></span><span class="vv">' + u.logins + "<small>" + Math.round(u.minutes) + " min</small></span></li>"; }).join("") + "</ol></div>" +
          '<div class="panel c6"><div class="ph"><div><h4>Top scorers</h4><div class="sub">Best certification exam score per employee</div></div><div class="seg" id="tsl">' + LEVELS.map(function (l) { return '<button data-l="' + l.id + '"' + (l.id === emp.tsl ? ' class="on"' : "") + ">" + esc(l.short) + "</button>"; }).join("") + '</div></div><ol class="rank" id="tsr"></ol></div>' +
          '<div class="panel c12"><h4>Certification paths</h4><div class="sub">Unlocked (prerequisites met), certified and exam attempts in the period, per path</div><div class="lvgrid">' + (d.levels || []).map(function (l) { var pc = k.enrolled ? l.certified / k.enrolled * 100 : 0; return '<div class="lvcard lv-' + l.level + '"><span class="eyebrow">' + esc(levelDef(l.level).short) + "</span><h5>" + esc(l.title) + '</h5><div class="lvnums"><div><b>' + l.certified + "</b><span>certified</span></div><div><b>" + l.unlocked + "</b><span>unlocked</span></div><div><b>" + l.attempts + '</b><span>attempts</span></div></div><div class="progress"><i style="width:' + pc + '%"></i></div><span class="muted" style="font-size:12px">' + CH.fmt(pc, 0) + "% of enrolled</span></div>"; }).join("") + "</div></div>" +
          '<div class="panel c12"><div class="ph"><div><h4>Progress per employee</h4><div class="sub">Reading progress, exam attempts and certification for every employee in the filter. Click a column to sort.</div></div></div>' +
          '<div class="emp-tools"><input id="eq" type="search" placeholder="Search name, email or department" value="' + esc(emp.q) + '"><select id="es"><option value="">All statuses</option><option>Certified</option><option>Practitioner certified</option><option>Advanced certified</option><option>Exam unlocked</option><option>Retake open</option><option>Attempts used</option><option>Learning</option><option>Not started</option></select><span class="muted" id="ecount" style="font-size:13px"></span></div><div class="tbl-wrap" id="etbl"></div></div>' +
          '<div class="panel c8"><div class="ph"><div><h4>Sign-ins per day</h4><div class="sub">Total sign-ins and distinct users</div></div><div class="legend"><span><i style="background:' + CH.CAT[0] + '"></i>Sign-ins</span><span><i style="background:' + CH.CAT[1] + '"></i>Unique users</span></div></div><div class="chart" id="c-line"></div></div>' +
          '<div class="panel c4"><h4>Exam score distribution</h4><div class="sub">Best exam score per employee · pass ' + (CERT.passPct || 70) + '%</div><div class="chart" id="c-dist"></div></div>' +
          '<div class="panel c7"><h4>When people sign in</h4><div class="sub">Sign-ins by weekday and hour (Doha time) — darker is busier</div><div class="chart" id="c-heat"></div></div>' +
          '<div class="panel c5"><h4>Hardest exam questions</h4><div class="sub">Lowest % answered correctly — candidates for clearer content</div><div class="chart" id="c-q"></div></div>' +
          '<div class="panel c7"><div class="ph"><div><h4>By department</h4><div class="sub">Certification, score and acknowledgement</div></div></div><div class="tbl-wrap"><table class="tbl" style="margin:0"><thead><tr><th>Department</th><th>People</th><th>Active</th><th>Certified</th><th>Avg score</th><th>Signed</th></tr></thead><tbody>' +
          d.byDepartment.map(function (r) { var da = (d.deptAccess || []).filter(function (x) { return x.department === r.department; })[0] || { activeUsers: 0, certified: 0 }; return "<tr><td>" + esc(r.department) + "</td><td>" + r.users + "</td><td>" + da.activeUsers + "</td><td>" + bar(r.users ? da.certified / r.users * 100 : 0, CH.CAT[0]) + "</td><td>" + fm(r.avgScorePct, 0) + "%</td><td>" + bar(r.signedPct, CH.CAT[1]) + "</td></tr>"; }).join("") + "</tbody></table></div></div>" +
          '<div class="panel c5"><h4>Module completion</h4><div class="sub">People who marked each EA module as completed</div><div class="chart" id="c-mod"></div></div>' +
          "</div>";
        var da = (d.deptAccess || []).slice(0, 12);
        CH.hbars($("#c-dacc"), da.map(function (x) { return { label: x.department.length > 26 ? x.department.slice(0, 25) + "…" : x.department, value: x.logins, note: x.activeUsers + " of " + x.users + " active · " + Math.round(x.minutes) + " min · " + x.certified + " certified" }; }), { ml: 230, color: CH.CAT[0], label: "Sign-ins by department" });
        CH.funnel($("#c-fun"), [{ label: "Enrolled", value: d.funnel.enrolled }, { label: "Started", value: d.funnel.startedLearning }, { label: "Exam unlocked", value: d.funnel.examUnlocked }, { label: "Certified", value: d.funnel.certified }, { label: "Signed off", value: d.funnel.signedOff }]);
        CH.line($("#c-line"), d.loginsByDay.map(function (x) { return x.date; }), [{ name: "Sign-ins", values: d.loginsByDay.map(function (x) { return x.logins; }) }, { name: "Unique users", values: d.loginsByDay.map(function (x) { return x.uniqueUsers; }) }], { area: true, label: "Sign-ins per day", xfmt: function (s, long) { var dt = new Date(s + "T00:00:00"); return long ? dt.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }) : dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); } });
        CH.heatmap($("#c-heat"), d.loginHeatmap);
        CH.columns($("#c-dist"), d.scoreDistribution.map(function (x) { return { label: x.bucket, value: x.count }; }), { width: 480, height: 300, colorFn: function (r) { return parseInt(r.label, 10) >= (CERT.passPct || 70) ? CH.CAT[1] : "#C9A9B6"; }, unit: "employees", tipLabel: function (r) { return "Best score " + r.label + "%"; } });
        CH.hbars($("#c-q"), d.questionStats.slice(0, 7).map(function (q) { return { label: q.tag, value: q.correctPct, note: q.attempts + " answers · " + q.questionId }; }), { max: 100, vfmt: function (v) { return Math.round(v) + "%"; }, color: CH.CAT[2], ml: 170 });
        CH.hbars($("#c-mod"), d.moduleViews.map(function (m) { var loc = CONTENT.modules.filter(function (x) { return x.id === m.moduleId; })[0]; return { label: loc ? (loc.short || loc.title) : m.title, value: m.completions, note: m.views + " views" }; }), { ml: 190, color: CH.CAT[3] });
        function drawTs() { var rows = ((d.topScorersByLevel || {})[emp.tsl] || (emp.tsl === "foundation" ? d.topScorers : []) || []); $("#tsr").innerHTML = rows.length ? rows.map(function (u, i) { return '<li><span class="rk">' + (i + 1) + '</span><span class="nm">' + esc(u.displayName) + '<span class="sb">' + esc(u.department) + " · " + u.attempts + " attempt" + (u.attempts === 1 ? "" : "s") + (u.certified ? " · certified " + fmtDate(u.certifiedAt) : "") + '</span></span><span class="vv">' + Math.round(u.bestPct) + "%<small>" + (u.certified ? "Certified" : "Not passed") + "</small></span></li>"; }).join("") : '<li style="display:block" class="muted">No ' + esc(levelDef(emp.tsl).short) + " exam attempts yet.</li>"; }
        $$("#tsl button").forEach(function (b) { b.onclick = function () { $$("#tsl button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); emp.tsl = b.getAttribute("data-l"); drawTs(); }; });
        drawTs();
        $("#es").value = emp.st;
        $("#eq").oninput = function () { emp.q = this.value; emp.page = 0; drawEmp(); };
        $("#es").onchange = function () { emp.st = this.value; emp.page = 0; drawEmp(); };
        drawEmp();
      }
      function drawEmp() {
        var rows = (last.employees || []).filter(function (e) {
          var q = emp.q.trim().toLowerCase();
          if (q && (e.displayName + " " + e.email + " " + e.department).toLowerCase().indexOf(q) < 0) return false;
          var lv = e.levels || {};
          if (emp.st === "Practitioner certified") return !!(lv.practitioner && lv.practitioner.certified);
          if (emp.st === "Advanced certified") return !!(lv.advanced && lv.advanced.certified);
          if (emp.st && stOf(e)[1] !== emp.st) return false; return true;
        });
        var key = emp.sort, dir = emp.asc ? 1 : -1;
        rows.sort(function (a, b) { var x = a[key], y = b[key]; if (x === null || x === undefined) x = -1; if (y === null || y === undefined) y = -1; if (typeof x === "string") return x.localeCompare(y) * dir; if (typeof x === "boolean") { x = +x; y = +y; } return (x - y) * dir; });
        var PER = 25, pages = Math.max(1, Math.ceil(rows.length / PER)); emp.page = Math.min(emp.page, pages - 1);
        var cols = [["displayName", "Employee"], ["department", "Department"], ["eaPct", "EA modules"], ["togafPct", "TOGAF"], ["kbpPct", "KB Pract."], ["kbaPct", "KB Adv."], ["examAttempts", "Attempts"], ["bestPct", "Best score"], ["certified", "Status"], ["logins", "Sign-ins"], ["lastSeenAt", "Last seen"]];
        $("#ecount").textContent = rows.length + " employee" + (rows.length === 1 ? "" : "s");
        $("#etbl").innerHTML = '<table class="tbl" style="margin:0"><thead><tr>' + cols.map(function (c) { return '<th class="sort' + (emp.sort === c[0] ? " on" + (emp.asc ? " asc" : "") : "") + '" data-k="' + c[0] + '">' + c[1] + "</th>"; }).join("") + "<th></th></tr></thead><tbody>" +
          rows.slice(emp.page * PER, emp.page * PER + PER).map(function (e) {
            var st = stOf(e);
            return "<tr><td><b>" + esc(e.displayName) + '</b><br><span class="muted" style="font-size:12px">' + esc(e.email) + "</span></td><td>" + esc(e.department) + "</td><td>" + mb(e.eaPct) + "</td><td>" + mb(e.togafPct) + "</td><td>" + mb(e.kbpPct || 0) + "</td><td>" + mb(e.kbaPct || 0) + "</td><td>" + e.examAttempts + " / " + (e.maxAttempts || maxA) + "</td><td>" + (e.bestPct === null ? "–" : "<b>" + Math.round(e.bestPct) + "%</b>") + '</td><td><span class="st-chip ' + st[0] + '">' + st[1] + "</span>" + lvBadges(e) + (e.signed ? ' <span class="tag teal" title="Acknowledgement signed">✓ signed</span>' : "") + "</td><td>" + e.logins + "</td><td>" + ago(e.lastSeenAt) + "</td><td>" +
              (function () { var g = grantLevel(e); return g ? '<button class="btn btn-line btn-sm" data-grant="' + esc(e.userId) + '" data-lv="' + g + '" data-name="' + esc(e.displayName) + '">+1 ' + esc(levelDef(g).short) + " attempt</button>" : ""; })() + "</td></tr>";
          }).join("") + "</tbody></table>" +
          '<div class="pager2"><span>Page ' + (emp.page + 1) + " of " + pages + '</span><span style="display:flex;gap:6px"><button class="btn btn-line btn-sm" id="pp"' + (emp.page ? "" : " disabled") + '>← Previous</button><button class="btn btn-line btn-sm" id="pn"' + (emp.page < pages - 1 ? "" : " disabled") + ">Next →</button></span></div>";
        $$("#etbl th.sort").forEach(function (th) { th.onclick = function () { var k = th.getAttribute("data-k"); if (emp.sort === k) emp.asc = !emp.asc; else { emp.sort = k; emp.asc = k === "displayName" || k === "department"; } drawEmp(); }; });
        $("#pp").onclick = function () { emp.page--; drawEmp(); }; $("#pn").onclick = function () { emp.page++; drawEmp(); };
        $$("[data-grant]").forEach(function (b) { b.onclick = function () { if (!confirm("Grant one extra " + levelDef(b.getAttribute("data-lv")).short + " exam attempt to " + b.getAttribute("data-name") + "?")) return; API.grantCertAttempts(b.getAttribute("data-grant"), 1, "Granted from dashboard", b.getAttribute("data-lv")).then(function () { toast("Extra attempt granted to " + esc(b.getAttribute("data-name")) + "."); load(); }).catch(function (e) { toast(esc(e.message)); }); }; });
      }
      function bar(v, c) { return '<span class="bar-cell"><i style="width:' + Math.max(2, v * 0.7) + 'px;background:' + c + '"></i>' + Math.round(v) + "%</span>"; }
      load();
    });
  }


  /* ---------------- router ---------------- */
  function parse() {
    var h = (location.hash || "#/home").replace(/^#\/?/, ""); var q = {};
    var parts = h.split("?"); if (parts[1]) parts[1].split("&").forEach(function (kv) { var p = kv.split("="); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ""); });
    return { seg: parts[0].split("/"), q: q };
  }
  function route() {
    var r = parse(), s = r.seg;
    if (s[0] === "verify" && s[1]) { viewVerify(decodeURIComponent(s[1])); return; }
    if (!state.user) { viewLogin(); return; }
    if (s[0] === "login") { location.hash = "#/home"; return; }
    refreshProgress().then(function () {
      switch (s[0]) {
        case "nonit": viewNonIT(); break;
        case "ea": viewEA(s[1] || LEARN[0].id); break;
        case "togaf": viewTogaf(); break;
        case "kb": if (s[1]) viewKBArticle(s[1]); else viewKB(r.q); break;
        case "assess": location.hash = "#/cert"; break;
        case "cert": (function () {
          var lv = LEVELS.some(function (l) { return l.id === s[1]; }) ? s[1] : null, sub = lv ? s[2] : s[1];
          if (!lv) lv = sub === "exam" || sub === "certificate" ? "foundation" : (LEVELS.filter(function (l) { var c = certState(null, l.id); return !c.certificate && (c.prerequisiteMet !== false); })[0] || LEVELS[0]).id;
          if (s[1] === "bank") { viewBank(r.q); return; }
          if (sub === "exam") viewExam(lv); else if (sub === "certificate") viewCertificate(lv); else viewCert(lv);
        })(); break;
        case "signoff": viewSignoff(); break;
        case "dashboard": viewDashboard(); break;
        case "profile": viewProfile(); break;
        default: viewHome();
      }
    });
  }
  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/input|textarea|select/i.test((document.activeElement || {}).tagName || "")) { var q = $("#q"); if (q) { e.preventDefault(); q.focus(); } else { location.hash = "#/kb"; } }
  });
  API.me().then(function (r) { state.user = r.user; state.progress = r.progress; startHeartbeat(); route(); }).catch(function () { route(); });
})();
