/* =====================================================================
   EA Awareness Hub — diagram library
   Each entry returns a self-contained SVG string, drawn in GTA brand
   colours. Call EA_DIAGRAMS.render(id, opts) -> "<svg…>".
   ===================================================================== */
(function () {
  "use strict";
  var C = {
    m: "#89143C", m2: "#A8204F", deep: "#511C3C", ink: "#33091F", rose: "#C46A8A", blush: "#F8EEF2", blush2: "#F1DEE6",
    gold: "#A29160", gold2: "#C9B37A", goldSoft: "#F5F0E3", teal: "#138A72", tealSoft: "#E4F3EF", blue: "#2F6DB8", blueSoft: "#E7EFF9",
    navy: "#0F4260", amber: "#B8861B", amberSoft: "#FBF3DF", text: "#16181D", slate: "#5E6573", muted: "#8C93A0", line: "#E6E1E3", line2: "#F0ECEE", white: "#FFFFFF"
  };
  var F = "Tajawal,Segoe UI,Tahoma,Arial,sans-serif";
  var MONO = "ui-monospace,Cascadia Mono,Consolas,monospace";
  var _id = 0;
  function nid(p) { _id++; return (p || "g") + _id; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function wrap(text, maxChars) {
    var words = String(text).split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if ((cur + " " + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
      else cur = (cur + " " + w).trim();
    });
    if (cur) lines.push(cur);
    return lines;
  }
  // text block: x,y = anchor of first baseline; o: size, weight, fill, anchor, width(px) or chars, lh, font
  function T(x, y, s, o) {
    o = o || {};
    var size = o.size || 14, lh = o.lh || size * 1.28;
    var chars = o.chars || (o.width ? Math.max(4, Math.floor(o.width / (size * 0.52))) : 999);
    var lines = o.nowrap ? [String(s)] : wrap(s, chars);
    if (o.vcenter) y = y - (lines.length - 1) * lh / 2 + size * 0.35;
    var out = '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || "middle") + '" font-family="' + (o.mono ? MONO : F) +
      '" font-size="' + size + '" font-weight="' + (o.weight || 400) + '" fill="' + (o.fill || C.text) + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : "") + (o.opacity ? ' opacity="' + o.opacity + '"' : "") + ">";
    lines.forEach(function (l, i) { out += '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + esc(l) + "</tspan>"; });
    return out + "</text>";
  }
  function R(x, y, w, h, o) {
    o = o || {};
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx === undefined ? 12 : o.rx) +
      '" fill="' + (o.fill || C.white) + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1.4) + '"' : "") +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + (o.opacity ? ' opacity="' + o.opacity + '"' : "") +
      (o.filter ? ' filter="url(#' + o.filter + ')"' : "") + (o.attrs || "") + "/>";
  }
  function L(x1, y1, x2, y2, o) {
    o = o || {};
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (o.stroke || C.rose) + '" stroke-width="' + (o.sw || 1.6) + '"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + (o.arrow ? ' marker-end="url(#' + o.arrow + ')"' : "") + (o.opacity ? ' opacity="' + o.opacity + '"' : "") + "/>";
  }
  function P(d, o) {
    o = o || {};
    return '<path d="' + d + '" fill="' + (o.fill || "none") + '" stroke="' + (o.stroke || C.rose) + '" stroke-width="' + (o.sw || 1.6) + '"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + (o.arrow ? ' marker-end="url(#' + o.arrow + ')"' : "") + (o.opacity ? ' opacity="' + o.opacity + '"' : "") + "/>";
  }
  function defs(extra) {
    var a = nid("ar"), b = nid("arg"), s = nid("sh"), g = nid("gr");
    var d = "<defs>" +
      '<marker id="' + a + '" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="' + C.m + '"/></marker>' +
      '<marker id="' + b + '" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="' + C.muted + '"/></marker>' +
      '<filter id="' + s + '" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#33091F" flood-opacity=".14"/></filter>' +
      '<linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + C.deep + '"/><stop offset="1" stop-color="' + C.m + '"/></linearGradient>' +
      (extra || "") + "</defs>";
    return { html: d, arrow: a, arrowGray: b, shadow: s, grad: g };
  }
  function svg(w, h, body, label) {
    return '<svg viewBox="0 0 ' + w + " " + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(label || "") + '" preserveAspectRatio="xMidYMid meet">' + body + "</svg>";
  }
  function pill(x, y, w, h, label, fill, color, size) {
    return R(x, y, w, h, { rx: h / 2, fill: fill }) + T(x + w / 2, y + h / 2, label, { size: size || 12, weight: 700, fill: color || "#fff", vcenter: true, nowrap: true });
  }
  function tagLabel(x, y, s, fill) { return T(x, y, s.toUpperCase(), { size: 10.5, mono: true, weight: 700, fill: fill || C.m, ls: 1.6, anchor: "start", nowrap: true }); }

  var D = {};

  /* ---------------- ADM cycle (also used interactively) ---------------- */
  D["adm-cycle"] = function (o) {
    o = o || {};
    var d = defs(), W = 620, H = 680, b = d.html, cx = 310, cy = 370, Rr = 215, r = 62;
    var phases = [["A", "Architecture Vision"], ["B", "Business Architecture"], ["C", "Information Systems Architectures"], ["D", "Technology Architecture"], ["E", "Opportunities & Solutions"], ["F", "Migration Planning"], ["G", "Implementation Governance"], ["H", "Architecture Change Management"]];
    var ids = ["A", "B", "C", "D", "E", "F", "G", "H"];
    var fills = [C.ink, C.deep, C.m, C.m2, "#9C2C55", "#7A1A42", "#5E1535", "#46102A"];
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + Rr + '" fill="none" stroke="' + C.blush2 + '" stroke-width="26"/>';
    // ring arrows
    for (var i = 0; i < 8; i++) {
      var a1 = (-90 + i * 45 + 17) * Math.PI / 180, a2 = (-90 + (i + 1) * 45 - 17) * Math.PI / 180;
      b += P("M" + (cx + Rr * Math.cos(a1)) + " " + (cy + Rr * Math.sin(a1)) + " A" + Rr + " " + Rr + " 0 0 1 " + (cx + Rr * Math.cos(a2)) + " " + (cy + Rr * Math.sin(a2)), { stroke: C.rose, sw: 2.4, arrow: d.arrow });
    }
    // spokes to RM
    for (i = 0; i < 8; i++) {
      var a = (-90 + i * 45) * Math.PI / 180;
      b += L(cx + 78 * Math.cos(a), cy + 78 * Math.sin(a), cx + (Rr - r - 4) * Math.cos(a), cy + (Rr - r - 4) * Math.sin(a), { stroke: C.gold2, sw: 1.4, dash: "4 4" });
    }
    function node(id, x, y, rad, code, name, fill, small) {
      var on = o.selected === id;
      var g = '<g class="adm-node' + (on ? " on" : "") + '" data-phase="' + id + '" tabindex="0" role="button" aria-label="' + esc(name) + '">';
      g += '<circle class="bg" cx="' + x + '" cy="' + y + '" r="' + rad + '" fill="' + fill + '" stroke="#fff" stroke-width="3" filter="url(#' + d.shadow + ')"/>';
      g += T(x, y - (small ? 6 : 12), code, { size: small ? 16 : 24, weight: 800, fill: on ? C.gold2 : "#fff", mono: true, nowrap: true });
      g += T(x, y + (small ? 12 : 10), name, { size: small ? 10.5 : 10.5, weight: 700, fill: "rgba(255,255,255,.92)", chars: small ? 16 : 15, lh: 12 });
      return g + "</g>";
    }
    // preliminary
    b += L(cx, 112, cx, cy - Rr - r, { stroke: C.gold, sw: 2, arrow: d.arrow });
    b += node("prelim", cx, 62, 50, "P", "Preliminary", C.gold, true);
    for (i = 0; i < 8; i++) {
      var ang = (-90 + i * 45) * Math.PI / 180;
      b += node(ids[i], cx + Rr * Math.cos(ang), cy + Rr * Math.sin(ang), r, phases[i][0], phases[i][1], fills[i]);
    }
    b += node("RM", cx, cy, 76, "RM", "Requirements Management", C.teal);
    return svg(W, H, b, "TOGAF Architecture Development Method cycle");
  };

  /* ---------------- TOGAF 10 documentation structure ---------------- */
  D["togaf-structure"] = function () {
    var d = defs(), W = 1000, H = 430, b = d.html;
    b += R(20, 20, 960, 390, { fill: C.goldSoft, rx: 22, stroke: "#E8DFC6" });
    b += tagLabel(44, 52, "TOGAF Library — guidance, white papers, emerging ideas", "#6B5C2E");
    b += R(44, 70, 912, 316, { fill: "#fff", rx: 18, stroke: C.line, filter: d.shadow });
    b += tagLabel(68, 102, "The TOGAF Standard, 10th Edition");
    // fundamental
    b += R(68, 118, 420, 246, { fill: "url(#" + d.grad + ")", rx: 16 });
    b += T(88, 150, "Fundamental Content", { size: 20, weight: 800, fill: "#fff", anchor: "start", nowrap: true });
    b += T(88, 172, "Stable, universal scaffolding", { size: 12.5, fill: "rgba(255,255,255,.75)", anchor: "start", nowrap: true });
    ["Introduction and Core Concepts", "Architecture Development Method", "ADM Techniques", "Applying the ADM", "Architecture Content", "EA Capability and Governance"].forEach(function (t, i) {
      var x = 88 + (i % 2) * 196, y = 190 + Math.floor(i / 2) * 56;
      b += R(x, y, 186, 46, { fill: "rgba(255,255,255,.12)", rx: 10, stroke: "rgba(255,255,255,.25)" });
      b += T(x + 93, y + 23, t, { size: 12, weight: 700, fill: "#fff", chars: 24, vcenter: true, lh: 14 });
    });
    // series guides
    b += R(512, 118, 420, 246, { fill: C.blush, rx: 16, stroke: C.blush2 });
    b += T(532, 150, "Series Guides", { size: 20, weight: 800, fill: C.ink, anchor: "start", nowrap: true });
    b += T(532, 172, "Configurable, evolving best practice", { size: 12.5, fill: C.slate, anchor: "start", nowrap: true });
    ["Business Architecture", "Information & Data", "Security & Risk", "Agile & Digital", "Government / Sector", "Practitioners' ADM"].forEach(function (t, i) {
      var x = 532 + (i % 2) * 196, y = 190 + Math.floor(i / 2) * 56;
      b += R(x, y, 186, 46, { fill: "#fff", rx: 10, stroke: C.blush2 });
      b += T(x + 93, y + 23, t, { size: 12.5, weight: 700, fill: C.deep, chars: 24, vcenter: true });
    });
    b += L(488, 240, 512, 240, { stroke: C.gold, sw: 2.5, arrow: d.arrow });
    return svg(W, H, b, "TOGAF Standard 10th Edition structure");
  };

  /* ---------------- Enterprise Continuum ---------------- */
  D["enterprise-continuum"] = function () {
    var d = defs(), W = 1000, H = 400, b = d.html;
    var arch = ["Foundation Architectures", "Common Systems Architectures", "Industry Architectures", "Organization-Specific Architectures"];
    var sol = ["Foundation Solutions", "Common Systems Solutions", "Industry Solutions", "Organization-Specific Solutions"];
    var ex = ["Generic: TOGAF TRM", "Security, network, data mgmt", "Qatar GEA reference models · tax admin models", "GTA target architecture · Dhareeba"];
    var w = 210, gap = 26, x0 = 50;
    b += tagLabel(x0, 40, "Architecture Continuum");
    b += tagLabel(x0, 236, "Solutions Continuum", C.teal);
    for (var i = 0; i < 4; i++) {
      var x = x0 + i * (w + gap);
      b += R(x, 54, w, 96, { fill: i === 3 ? C.m : C.blush, rx: 14, stroke: i === 3 ? C.m : C.blush2 });
      b += T(x + w / 2, 94, arch[i], { size: 15, weight: 800, fill: i === 3 ? "#fff" : C.deep, chars: 20, vcenter: true });
      b += T(x + w / 2, 175, ex[i], { size: 11.5, fill: C.slate, chars: 30, weight: 700 });
      b += R(x, 250, w, 96, { fill: i === 3 ? C.teal : C.tealSoft, rx: 14, stroke: i === 3 ? C.teal : "#BFE3D9" });
      b += T(x + w / 2, 290, sol[i], { size: 15, weight: 800, fill: i === 3 ? "#fff" : "#0B5F4F", chars: 20, vcenter: true });
      b += L(x + w / 2, 152, x + w / 2, 246, { stroke: C.muted, sw: 1.4, dash: "3 4", arrow: d.arrowGray });
      if (i < 3) { b += L(x + w + 2, 102, x + w + gap - 2, 102, { stroke: C.m, sw: 2, arrow: d.arrow }); b += L(x + w + 2, 298, x + w + gap - 2, 298, { stroke: C.teal, sw: 2, arrow: d.arrow }); }
    }
    b += L(x0, 372, x0 + 4 * w + 3 * gap, 372, { stroke: C.gold, sw: 2.5, arrow: d.arrow });
    b += T(x0, 392, "Generalisation", { size: 12, mono: true, fill: C.slate, anchor: "start", nowrap: true });
    b += T(x0 + 4 * w + 3 * gap, 392, "Specialisation", { size: 12, mono: true, fill: C.slate, anchor: "end", nowrap: true });
    b += T(500, 392, "Guide & support ↓ between continua", { size: 12, mono: true, fill: C.slate, nowrap: true });
    return svg(W, H, b, "TOGAF Enterprise Continuum");
  };

  /* ---------------- Architecture repository ---------------- */
  D["architecture-repository"] = function () {
    var d = defs(), W = 1000, H = 470, b = d.html;
    b += R(20, 20, 960, 430, { fill: "#FCFAFB", rx: 22, stroke: C.line });
    b += tagLabel(44, 54, "Architecture Repository");
    var boxes = [
      ["Architecture Metamodel", "Tailored content framework & method", 44, 74, 290, 90, C.ink],
      ["Architecture Capability", "Governance structures, roles, processes", 355, 74, 290, 90, C.deep],
      ["Governance Log", "Decisions, compliance assessments, waivers, contracts", 666, 74, 290, 90, C.m],
      ["Architecture Landscape", "Strategic · Segment · Capability views of baseline, transitions and target", 44, 184, 601, 120, C.m],
      ["Standards Information Base", "Legal, industry & GTA standards (incl. Qatar GEA)", 666, 184, 290, 120, C.m2],
      ["Reference Library", "Reference models, patterns, templates", 44, 324, 290, 104, "#9C2C55"],
      ["Architecture Requirements Repository", "Requirements from all phases", 355, 324, 290, 104, C.teal],
      ["Solutions Landscape", "SBBs that realise the landscape", 666, 324, 290, 104, C.navy]
    ];
    boxes.forEach(function (x) {
      b += R(x[2], x[3], x[4], x[5], { fill: x[6], rx: 14, filter: d.shadow });
      b += T(x[2] + 20, x[3] + 34, x[0], { size: 16.5, weight: 800, fill: "#fff", anchor: "start", nowrap: true });
      b += T(x[2] + 20, x[3] + 58, x[1], { size: 12.5, fill: "rgba(255,255,255,.82)", anchor: "start", width: x[4] - 40 });
    });
    // landscape levels
    ["Strategic", "Segment", "Capability"].forEach(function (s, i) { b += pill(64 + i * 120, 262, 108, 26, s, "rgba(255,255,255,.18)", "#fff", 11.5); });
    return svg(W, H, b, "TOGAF Architecture Repository");
  };

  /* ---------------- Content metamodel ---------------- */
  D["content-metamodel"] = function () {
    var d = defs(), W = 1000, H = 560, b = d.html;
    var cols = [
      ["Motivation", ["Driver", "Goal", "Objective", "Measure", "Principle"], C.gold],
      ["Business", ["Actor / Role", "Business Capability", "Value Stream", "Business Service", "Process", "Function"], C.deep],
      ["Data", ["Data Entity", "Logical Data Component", "Physical Data Component"], C.m],
      ["Application", ["Application Service", "Logical App Component", "Physical App Component"], C.m2],
      ["Technology", ["Technology Service", "Logical Tech Component", "Physical Tech Component"], "#5E6573"]
    ];
    var w = 176, gap = 15, x0 = 22, pos = {};
    cols.forEach(function (c, i) {
      var x = x0 + i * (w + gap);
      b += R(x, 20, w, 500, { fill: "#FCFAFB", rx: 16, stroke: C.line });
      b += R(x, 20, w, 44, { fill: c[2], rx: 16 }) + R(x, 48, w, 16, { fill: c[2], rx: 0 });
      b += T(x + w / 2, 47, c[0], { size: 15, weight: 800, fill: "#fff", nowrap: true });
      c[1].forEach(function (e, j) {
        var y = 84 + j * 70;
        b += R(x + 14, y, w - 28, 48, { fill: "#fff", rx: 10, stroke: c[2], sw: 1.4 });
        b += T(x + w / 2, y + 24, e, { size: 12.5, weight: 700, fill: C.text, chars: 20, vcenter: true, lh: 14 });
        pos[e] = [x + w / 2, y + 24, x + 14, x + w - 14];
      });
    });
    function link(a, z, label, dy) {
      var p = pos[a], q = pos[z];
      var x1 = p[3], x2 = q[2], y1 = p[1], y2 = q[1];
      b += P("M" + x1 + " " + y1 + " C" + (x1 + 40) + " " + y1 + " " + (x2 - 40) + " " + y2 + " " + (x2 - 2) + " " + y2, { stroke: C.rose, sw: 1.5, arrow: d.arrow });
      if (label) b += T((x1 + x2) / 2, (y1 + y2) / 2 + (dy || -6), label, { size: 10, mono: true, fill: C.slate, nowrap: true });
    }
    link("Objective", "Business Capability", "realised by");
    link("Business Service", "Data Entity", "uses");
    link("Process", "Logical Data Component", "");
    link("Logical Data Component", "Logical App Component", "");
    link("Data Entity", "Application Service", "accessed by");
    link("Application Service", "Technology Service", "served by");
    link("Physical App Component", "Physical Tech Component", "deployed on", 14);
    b += T(500, 546, "Simplified view of the TOGAF content metamodel — every element traces to a motivation", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "TOGAF content metamodel");
  };

  /* ---------------- Zachman grid ---------------- */
  D["zachman-grid"] = function () {
    var d = defs(), W = 1000, H = 440, b = d.html;
    var cols = ["What", "How", "Where", "Who", "When", "Why"], sub = ["Data", "Function", "Network", "People", "Time", "Motivation"];
    var rows = ["Executive (Scope)", "Business (Model)", "Architect (System)", "Engineer (Technology)", "Technician (Components)", "Enterprise (Operations)"];
    var x0 = 220, cw = 128, ch = 54, y0 = 70;
    cols.forEach(function (c, j) {
      var x = x0 + j * cw;
      b += R(x + 3, 14, cw - 6, 50, { fill: C.m, rx: 8 });
      b += T(x + cw / 2, 36, c, { size: 15, weight: 800, fill: "#fff", nowrap: true });
      b += T(x + cw / 2, 54, sub[j], { size: 11, mono: true, fill: "rgba(255,255,255,.75)", nowrap: true });
    });
    rows.forEach(function (r, i) {
      var y = y0 + i * ch;
      b += R(14, y + 3, 200, ch - 6, { fill: C.deep, rx: 8, opacity: String(1 - i * 0.1) });
      b += T(114, y + ch / 2, r, { size: 12.5, weight: 700, fill: "#fff", vcenter: true, nowrap: true });
      for (var j = 0; j < 6; j++) b += R(x0 + j * cw + 3, y + 3, cw - 6, ch - 6, { fill: (i + j) % 2 ? "#fff" : C.blush, rx: 8, stroke: C.line2 });
    });
    b += T(x0 + 1.5 * cw, y0 + 1.5 * ch + 4, "Business model × Process", { size: 11, fill: C.m, weight: 700, nowrap: true });
    b += T(x0 + 0.5 * cw, y0 + 2.5 * ch + 4, "Logical data model", { size: 11, fill: C.m, weight: 700, nowrap: true });
    b += T(500, 420, "Zachman is an ontology (a classification of descriptive artefacts), not a method — TOGAF supplies the method", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "Zachman framework grid");
  };

  /* ---------------- ISO 42010 conceptual model ---------------- */
  D["iso42010"] = function () {
    var d = defs(), W = 1000, H = 470, b = d.html;
    var n = {
      eoi: [70, 40, "Entity of interest", C.ink], arch: [70, 200, "Architecture", C.deep], ad: [400, 200, "Architecture description", C.m],
      sh: [400, 40, "Stakeholder", C.gold], cn: [730, 40, "Concern", C.gold], vp: [730, 200, "Viewpoint", C.m2], vw: [730, 360, "View", C.m2], mk: [400, 360, "Model", C.teal], dec: [70, 360, "Decision & rationale", C.navy]
    };
    function box(k) { var v = n[k]; return R(v[0], v[1], 220, 66, { fill: v[3], rx: 14, filter: d.shadow }) + T(v[0] + 110, v[1] + 33, v[2], { size: 15.5, weight: 800, fill: "#fff", vcenter: true, nowrap: true }); }
    function ln(a, z, lab, side) {
      var p = n[a], q = n[z];
      var x1 = p[0] + 110, y1 = p[1] + 33, x2 = q[0] + 110, y2 = q[1] + 33;
      // shorten to box edge
      if (y1 === y2) { x1 += x2 > x1 ? 110 : -110; x2 += x2 > x1 ? -112 : 112; }
      else { y1 += y2 > y1 ? 33 : -33; y2 += y2 > y1 ? -35 : 35; }
      b += L(x1, y1, x2, y2, { stroke: C.rose, sw: 1.8, arrow: d.arrow });
      b += T((x1 + x2) / 2 + (side || 0), (y1 + y2) / 2 - 6, lab, { size: 11, mono: true, fill: C.slate, nowrap: true, anchor: side ? "start" : "middle" });
    }
    ln("eoi", "arch", "exhibits", 8); ln("ad", "arch", "expresses"); ln("sh", "eoi", "has interest in"); ln("sh", "cn", "has"); ln("vp", "cn", "frames", 8); ln("vw", "vp", "governed by", 8); ln("ad", "vw", "includes"); ln("vw", "mk", "composed of"); ln("ad", "dec", "records");
    Object.keys(n).forEach(function (k) { b += box(k); });
    b += T(500, 456, "ISO/IEC/IEEE 42010:2022 — simplified conceptual model of an architecture description", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "ISO 42010 conceptual model");
  };

  /* ---------------- Value curve ---------------- */
  D["value-curve"] = function () {
    var d = defs(), W = 1000, H = 380, b = d.html;
    var x0 = 80, y0 = 320, w = 860, h = 260;
    b += L(x0, y0, x0 + w, y0, { stroke: C.line, sw: 1.5 }) + L(x0, y0, x0, y0 - h, { stroke: C.line, sw: 1.5 });
    b += '<path d="M' + x0 + " " + (y0 - h + 10) + " C " + (x0 + 260) + " " + (y0 - h + 30) + ", " + (x0 + 330) + " " + (y0 - 40) + ", " + (x0 + w) + " " + (y0 - 24) + " L " + (x0 + w) + " " + y0 + " L " + x0 + " " + y0 + ' Z" fill="' + C.blush + '"/>';
    b += P("M" + x0 + " " + (y0 - h + 10) + " C " + (x0 + 260) + " " + (y0 - h + 30) + ", " + (x0 + 330) + " " + (y0 - 40) + ", " + (x0 + w) + " " + (y0 - 24), { stroke: C.m, sw: 3 });
    [["Idea", 0], ["Options", 0.2], ["Design fixed", 0.45], ["Build", 0.68], ["Go-live", 0.9]].forEach(function (s) {
      var x = x0 + w * s[1] + 20;
      b += L(x, y0, x, y0 + 6, { stroke: C.muted }) + T(x, y0 + 24, s[0], { size: 12.5, weight: 700, fill: C.slate, nowrap: true });
    });
    b += T(x0 + 120, y0 - h + 4, "Shape the option set", { size: 13, weight: 800, fill: C.m, nowrap: true, anchor: "start" });
    b += T(x0 + 420, y0 - 120, "Warn about impacts", { size: 13, weight: 800, fill: C.deep, nowrap: true, anchor: "start" });
    b += T(x0 + 700, y0 - 54, "Explain afterwards", { size: 13, weight: 800, fill: C.slate, nowrap: true, anchor: "start" });
    b += '<text transform="translate(40 ' + (y0 - h / 2) + ') rotate(-90)" text-anchor="middle" font-family="' + F + '" font-size="12.5" font-weight="700" fill="' + C.slate + '">Value of architecture input</text>';
    b += T(x0 + w / 2, 372, "Project timeline →", { size: 12.5, weight: 700, fill: C.slate, nowrap: true });
    return svg(W, H, b, "Architecture value decays over a project timeline");
  };

  /* ---------------- C4 levels ---------------- */
  D["c4-levels"] = function () {
    var d = defs(), W = 1000, H = 360, b = d.html;
    var lv = [["1 · System context", "Dhareeba and the people & systems around it", C.ink], ["2 · Container", "Web app · API · database · topics", C.deep], ["3 · Component", "Modules inside the filing API", C.m], ["4 · Code", "Classes, tables — usually generated", C.m2]];
    lv.forEach(function (l, i) {
      var x = 30 + i * 238, s = 210 - i * 24, y = 40 + i * 12;
      b += R(x, y, 220, s, { fill: l[2], rx: 16, filter: d.shadow });
      b += T(x + 18, y + 36, l[0], { size: 16, weight: 800, fill: "#fff", anchor: "start", nowrap: true });
      b += T(x + 18, y + 62, l[1], { size: 12.5, fill: "rgba(255,255,255,.85)", anchor: "start", width: 190, lh: 16 });
      if (i < 3) b += L(x + 222, y + 100, x + 236, y + 108, { stroke: C.gold, sw: 2.2, arrow: d.arrow });
    });
    b += T(500, 320, "Zoom in one level at a time — enterprise views stop at containers; solution teams own levels 3–4", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "C4 model levels");
  };

  /* ---------------- Integration patterns ---------------- */
  D["integration-patterns"] = function () {
    var d = defs(), W = 1100, H = 430, b = d.html;
    function panel(x, title, sub) { b += R(x, 20, 340, 390, { fill: "#FCFAFB", rx: 18, stroke: C.line }) + T(x + 22, 52, title, { size: 16.5, weight: 800, fill: C.deep, anchor: "start", nowrap: true }) + T(x + 22, 74, sub, { size: 12, fill: C.slate, anchor: "start", nowrap: true }); }
    function node(x, y, w, t, f) { b += R(x, y, w, 40, { fill: f || "#fff", rx: 10, stroke: f ? "none" : C.rose }) + T(x + w / 2, y + 20, t, { size: 12.5, weight: 700, fill: f ? "#fff" : C.deep, vcenter: true, nowrap: true }); }
    panel(20, "Point-to-point", "Fast to start, brittle at scale");
    var pts = [[60, 120], [240, 120], [60, 230], [240, 230], [150, 330]];
    pts.forEach(function (p, i) { for (var j = i + 1; j < pts.length; j++) b += L(p[0] + 40, p[1] + 20, pts[j][0] + 40, pts[j][1] + 20, { stroke: C.rose, sw: 1.3, opacity: ".7" }); });
    ["Portal", "Risk", "Case", "MDM", "Finance"].forEach(function (t, i) { node(pts[i][0], pts[i][1], 80, t); });
    panel(380, "API-led (gateway)", "System → process → experience APIs");
    node(420, 110, 260, "Experience APIs · portal, mobile", C.m);
    node(420, 190, 260, "Process APIs · file return, refund", C.deep);
    node(420, 270, 260, "System APIs · MDM, case, finance", C.ink);
    b += R(410, 100, 280, 220, { fill: "none", rx: 14, stroke: C.gold, dash: "6 5", sw: 1.6 });
    b += T(550, 350, "Policies at the gateway: authN/Z,", { size: 12, fill: C.slate, nowrap: true });
    b += T(550, 368, "throttling, versioning, audit", { size: 12, fill: C.slate, nowrap: true });
    panel(740, "Event-driven", "Publish facts; consumers decide");
    node(760, 120, 110, "Filing svc");
    node(950, 120, 110, "Payment svc");
    b += R(760, 210, 300, 50, { fill: C.teal, rx: 25 }) + T(910, 235, "Event broker · ReturnFiled · PaymentReceived", { size: 12, weight: 700, fill: "#fff", vcenter: true, nowrap: true });
    node(760, 310, 90, "Risk", C.deep); node(865, 310, 90, "Analytics", C.deep); node(970, 310, 90, "Notify", C.deep);
    b += L(815, 162, 815, 206, { stroke: C.teal, sw: 2, arrow: d.arrow }); b += L(1005, 162, 1005, 206, { stroke: C.teal, sw: 2, arrow: d.arrow });
    [805, 910, 1015].forEach(function (x) { b += L(x, 262, x, 306, { stroke: C.teal, sw: 2, arrow: d.arrow }); });
    return svg(W, H, b, "Integration patterns compared");
  };

  /* ---------------- Zero trust ---------------- */
  D["zero-trust"] = function () {
    var d = defs(), W = 1000, H = 400, b = d.html;
    b += R(20, 40, 180, 300, { fill: C.blush, rx: 16 }) + tagLabel(40, 70, "Subjects");
    ["Staff device", "Taxpayer", "Partner system", "Service identity"].forEach(function (t, i) { b += R(40, 88 + i * 60, 140, 44, { fill: "#fff", rx: 10, stroke: C.rose }) + T(110, 110 + i * 60, t, { size: 12.5, weight: 700, fill: C.deep, vcenter: true, nowrap: true }); });
    b += R(300, 80, 260, 220, { fill: "url(#" + d.grad + ")", rx: 20, filter: d.shadow });
    b += T(430, 120, "Policy decision point", { size: 17, weight: 800, fill: "#fff", nowrap: true });
    ["Identity & MFA", "Device posture", "Data classification", "Context & risk score"].forEach(function (t, i) { b += pill(330, 140 + i * 36, 200, 28, t, "rgba(255,255,255,.14)", "#fff", 12); });
    b += R(620, 120, 120, 140, { fill: C.teal, rx: 16 }) + T(680, 180, "Policy enforcement point", { size: 13, weight: 800, fill: "#fff", vcenter: true, chars: 12, lh: 16 });
    b += R(800, 40, 180, 300, { fill: C.tealSoft, rx: 16 }) + tagLabel(820, 70, "Resources", C.teal);
    ["Tax core APIs", "Taxpayer data", "Analytics", "Admin consoles"].forEach(function (t, i) { b += R(820, 88 + i * 60, 140, 44, { fill: "#fff", rx: 10, stroke: C.teal }) + T(890, 110 + i * 60, t, { size: 12.5, weight: 700, fill: "#0B5F4F", vcenter: true, nowrap: true }); });
    b += L(200, 190, 296, 190, { stroke: C.m, sw: 2.2, arrow: d.arrow }); b += L(562, 190, 616, 190, { stroke: C.m, sw: 2.2, arrow: d.arrow }); b += L(742, 190, 796, 190, { stroke: C.teal, sw: 2.2, arrow: d.arrow });
    b += T(500, 372, "Never trust the network location — verify explicitly, grant least privilege, assume breach (NIST SP 800-207)", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "Zero trust architecture");
  };

  /* ---------------- Cloud models ---------------- */
  D["cloud-models"] = function () {
    var d = defs(), W = 1000, H = 420, b = d.html;
    var stack = ["Applications", "Data", "Runtime", "Middleware", "OS", "Virtualisation", "Servers", "Storage", "Networking"];
    var models = [["On-premises", 9], ["IaaS", 5], ["PaaS", 2], ["SaaS", 0]];
    models.forEach(function (m, j) {
      var x = 40 + j * 240;
      b += T(x + 100, 30, m[0], { size: 16, weight: 800, fill: C.deep, nowrap: true });
      stack.forEach(function (s, i) {
        var you = i < m[1];
        b += R(x, 46 + i * 36, 200, 30, { fill: you ? C.m : C.tealSoft, rx: 8 });
        b += T(x + 100, 61 + i * 36, s, { size: 12, weight: 700, fill: you ? "#fff" : "#0B5F4F", vcenter: true, nowrap: true });
      });
    });
    b += R(300, 384, 14, 14, { fill: C.m, rx: 3 }) + T(320, 396, "GTA manages", { size: 12.5, weight: 700, fill: C.slate, anchor: "start", nowrap: true });
    b += R(450, 384, 14, 14, { fill: C.tealSoft, rx: 3, stroke: C.teal }) + T(470, 396, "Provider manages (shared responsibility)", { size: 12.5, weight: 700, fill: C.slate, anchor: "start", nowrap: true });
    return svg(W, H, b, "Cloud service models and shared responsibility");
  };

  /* ---------------- Data governance ---------------- */
  D["data-governance"] = function () {
    var d = defs(), W = 1000, H = 420, b = d.html;
    var roles = [["Data governance council", "Sets policy, resolves cross-domain disputes", C.ink, 330, 30, 340], ["Data owner", "Accountable (e.g., Director, Taxpayer Service for taxpayer register)", C.deep, 60, 140, 270], ["Data steward", "Defines terms, quality rules, approves changes", C.m, 365, 140, 270], ["Data custodian", "Operates the stores: backup, access, security", C.m2, 670, 140, 270]];
    roles.forEach(function (r) {
      b += R(r[3], r[4], r[5], 84, { fill: r[2], rx: 14, filter: d.shadow });
      b += T(r[3] + r[5] / 2, r[4] + 30, r[0], { size: 16, weight: 800, fill: "#fff", nowrap: true });
      b += T(r[3] + r[5] / 2, r[4] + 54, r[1], { size: 12, fill: "rgba(255,255,255,.85)", width: r[5] - 30, lh: 15 });
    });
    [195, 500, 805].forEach(function (x) { b += P("M500 114 L" + x + " 138", { stroke: C.gold, sw: 1.8, arrow: d.arrow }); });
    var dims = ["Accuracy", "Completeness", "Consistency", "Timeliness", "Validity", "Uniqueness"];
    b += tagLabel(60, 268, "Data quality dimensions measured per critical data element");
    dims.forEach(function (t, i) { b += pill(60 + i * 148, 284, 136, 34, t, i % 2 ? C.tealSoft : C.blush, i % 2 ? "#0B5F4F" : C.deep, 13); });
    b += tagLabel(60, 356, "Artefacts", C.slate);
    ["Business glossary", "Data catalogue", "Lineage maps", "Quality scorecards", "Classification register"].forEach(function (t, i) { b += pill(60 + i * 178, 370, 166, 30, t, "#F1F2F4", C.slate, 12.5); });
    return svg(W, H, b, "Data governance roles and quality dimensions");
  };

  /* ---------------- ArchiMate 4 hexagon ---------------- */
  D["archimate-hexagon"] = function () {
    var d = defs(), W = 1000, H = 560, b = d.html, cx = 500, cy = 285;
    function hex(r, fill, stroke) {
      var p = []; for (var i = 0; i < 6; i++) { var a = (60 * i - 90) * Math.PI / 180; p.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1)); }
      return '<polygon points="' + p.join(" ") + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="2"' : "") + "/>";
    }
    b += hex(262, C.goldSoft, "#E8DFC6");
    b += hex(196, C.blush, C.blush2);
    b += hex(132, C.m);
    b += hex(70, C.ink);
    b += T(cx, cy - 4, "Common", { size: 15, weight: 800, fill: "#fff", nowrap: true });
    b += T(cx, cy + 14, "Domain", { size: 12, fill: "rgba(255,255,255,.8)", nowrap: true });
    b += T(cx, cy - 92, "Business", { size: 14, weight: 800, fill: "#fff", nowrap: true });
    b += T(cx - 70, cy + 52, "Application", { size: 12.5, weight: 800, fill: "#fff", nowrap: true });
    b += T(cx + 70, cy + 52, "Technology", { size: 12.5, weight: 800, fill: "#fff", nowrap: true });
    b += T(cx, cy - 158, "Strategy", { size: 15, weight: 800, fill: C.deep, nowrap: true });
    b += T(cx, cy + 170, "Implementation & Migration", { size: 14, weight: 800, fill: C.deep, nowrap: true });
    b += T(cx, cy - 226, "Motivation", { size: 15, weight: 800, fill: "#6B5C2E", nowrap: true });
    // side notes
    b += R(20, 60, 190, 170, { fill: "#fff", rx: 14, stroke: C.line });
    b += tagLabel(36, 88, "What changed");
    ["Layers → domains", "60 → 42 concepts", "Generic Process, Function,", "Event, Service, Role, Path", "in the Common Domain"].forEach(function (t, i) { b += T(36, 114 + i * 22, t, { size: 13, weight: i < 2 ? 800 : 400, fill: C.text, anchor: "start", nowrap: true }); });
    b += R(790, 60, 190, 170, { fill: "#fff", rx: 14, stroke: C.line });
    b += tagLabel(806, 88, "What stays");
    ["Business / App / Tech", "Motivation & Strategy", "Impl. & Migration", "Relationship families", "Viewpoint mechanism"].forEach(function (t, i) { b += T(806, 114 + i * 22, t, { size: 13, fill: C.text, anchor: "start", nowrap: true }); });
    b += T(500, 548, "ArchiMate 4 (The Open Group, April 2026) — simplified sketch of the new framework picture", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "ArchiMate 4 framework sketch");
  };

  /* ---------------- EA levels / scope ---------------- */
  D["ea-levels"] = function () {
    var d = defs(), W = 1000, H = 400, b = d.html;
    var lv = [["Strategic architecture", "Whole authority · 3–5 years · direction, principles, target state", 900, C.ink], ["Segment architecture", "A business area, e.g. compliance & revenue · 1–3 years · roadmap", 700, C.deep], ["Capability architecture", "One capability increment, e.g. digital objections · months · contracts", 500, C.m], ["Solution architecture", "One project or product · sprints · design & ADRs", 300, C.m2]];
    lv.forEach(function (l, i) {
      var w = l[2], x = 500 - w / 2, y = 30 + i * 86;
      b += R(x, y, w, 72, { fill: l[3], rx: 14, filter: d.shadow });
      b += T(500, y + 30, l[0], { size: 17, weight: 800, fill: "#fff", nowrap: true });
      b += T(500, y + 52, l[1], { size: 12.5, fill: "rgba(255,255,255,.85)", width: w - 30 });
    });
    b += T(70, 200, "Breadth", { size: 12, mono: true, fill: C.slate, nowrap: true });
    b += T(930, 200, "Detail", { size: 12, mono: true, fill: C.slate, nowrap: true });
    b += L(70, 214, 70, 360, { stroke: C.muted, arrow: d.arrowGray }) ;
    b += L(930, 360, 930, 214, { stroke: C.muted, arrow: d.arrowGray });
    return svg(W, H, b, "Architecture levels");
  };


  /* =================================================================
     Qatar GEA + GTA baseline diagrams
     Sources: GEA Framework Overview (MOTC), Figures 1–2;
              GTA Digital Strategy — Current State Understanding Report (Apr 2025)
     ================================================================= */

  /* ---------------- GEA summary view (Figure 1) ---------------- */
  D["gea-framework"] = function () {
    var d = defs(), W = 1100, H = 640, b = d.html;
    b += R(150, 20, 800, 54, { fill: C.ink, rx: 14 }) + T(550, 54, "Governance & Enablers", { size: 18, weight: 800, fill: "#fff", nowrap: true });
    b += R(20, 90, 110, 520, { fill: C.teal, rx: 14 });
    b += '<text transform="translate(82 350) rotate(-90)" text-anchor="middle" font-family="' + F + '" font-size="17" font-weight="800" fill="#fff">Security Management</text>';
    b += R(970, 90, 110, 520, { fill: C.navy, rx: 14 });
    b += '<text transform="translate(1032 350) rotate(-90)" text-anchor="middle" font-family="' + F + '" font-size="17" font-weight="800" fill="#fff">Service Management</text>';
    b += T(395, 108, "WHOLE OF GOVERNMENT (WoG) ARTEFACTS", { size: 11, mono: true, weight: 700, fill: C.m, ls: 1.2, nowrap: true });
    b += T(780, 108, "AGENCY ARTEFACTS (e.g., GTA)", { size: 11, mono: true, weight: 700, fill: C.teal, ls: 1.2, nowrap: true });
    var rows = [
      ["Business", "BRM", ["Business / Performance Reference Taxonomy", "Business Reference Architecture", "WoG Goals & KPIs · Shared Services Catalogue", "Standards"], ["Agency Goals & KPIs", "Customer profiles", "Services & delivery channel catalogues", "Customer – channel – service matrix"], C.deep],
      ["Information", "IRM", ["Information Taxonomy · data description & exchange formats", "Information Exchange Architecture", "GDX exchanged information catalogue", "Standards"], ["Information assets catalogue", "Business service / information asset matrix"], C.m],
      ["Application", "ARM", ["Application Reference Taxonomy", "Application Reference Architecture", "Applications catalogue · shared services / applications matrix", "Standards"], ["Application catalogue", "Service / information / application matrix"], C.m2],
      ["Infrastructure", "TRM", ["Infrastructure Reference Taxonomy", "Infrastructure Reference Architecture", "Infrastructure assets catalogue · application / infrastructure matrix", "Standards"], ["Infrastructure assets catalogue", "Application / infrastructure matrix"], "#5E6573"]
    ];
    rows.forEach(function (r, i) {
      var y = 122 + i * 122;
      b += R(146, y, 808, 110, { fill: "#FCFAFB", rx: 14, stroke: C.line });
      b += R(146, y, 120, 110, { fill: r[4], rx: 14 });
      b += T(206, y + 50, r[0], { size: 15, weight: 800, fill: "#fff", nowrap: true });
      b += T(206, y + 72, r[1], { size: 12, mono: true, weight: 700, fill: C.gold2, nowrap: true });
      b += R(280, y + 10, 400, 90, { fill: "#fff", rx: 10, stroke: C.blush2 });
      r[2].forEach(function (s, k) { b += T(294, y + 30 + k * 20, "• " + s, { size: 12, fill: C.text, anchor: "start", nowrap: true }); });
      b += R(692, y + 10, 250, 90, { fill: C.tealSoft, rx: 10 });
      r[3].forEach(function (s, k) { b += T(704, y + 30 + k * 20, "• " + s, { size: 12, fill: "#0B5F4F", anchor: "start", nowrap: true }); });
      if (i < 3) b += L(206, y + 110, 206, y + 122, { stroke: C.gold, sw: 2 });
    });
    b += T(550, 630, "Each of the four reference models has Architecture · Standards (mandatory / recommended / optional) · Taxonomy", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "Qatar GEA summary view");
  };

  /* ---------------- GEA metamodel (Figure 2, simplified) ---------------- */
  D["gea-metamodel"] = function () {
    var d = defs(), W = 1100, H = 700, b = d.html;
    b += R(20, 20, 520, 660, { fill: "#FBF7F9", rx: 16, stroke: C.line }) + R(560, 20, 520, 660, { fill: "#F4FAF8", rx: 16, stroke: C.line });
    b += T(280, 50, "Whole of Government — taxonomies", { size: 15, weight: 800, fill: C.deep, nowrap: true });
    b += T(820, 50, "Agency — entities (GTA examples)", { size: 15, weight: 800, fill: "#0B5F4F", nowrap: true });
    var lanes = [
      ["BRM · Performance", ["Goal", "Measurement Area"], ["Goal", "Key Performance Indicator"], "e.g., Enhance taxpayer services · % returns filed digitally", C.deep],
      ["BRM · Services", ["Service Domain", "Service Area"], ["Consumer → Channel → Service"], "e.g., Taxpayer → Dhareeba portal → File a return", C.deep],
      ["IRM", ["Information Domain", "Information Subject", "Sub-levels (code to 4 levels)"], ["Information Entity"], "e.g., Taxpayer, Tax return, Assessment", C.m],
      ["ARM", ["Application Domain", "Application Area", "Application Category"], ["Application"], "e.g., Dhareeba (SAP TRM), Tabadol (NewGen)", C.m2],
      ["TRM", ["Infrastructure Domain", "Infrastructure Area"], ["Infrastructure Asset"], "e.g., Azure landing zone, Meeza data centre", "#5E6573"]
    ];
    lanes.forEach(function (l, i) {
      var y = 74 + i * 120;
      b += tagLabel(40, y + 6, l[0], l[4]);
      l[1].forEach(function (t, k) {
        var x = 40 + k * 160;
        b += R(x, y + 18, 148, 40, { fill: l[4], rx: 10, opacity: String(1 - k * 0.18) });
        b += T(x + 74, y + 38, t, { size: 12, weight: 700, fill: "#fff", vcenter: true, nowrap: true });
        if (k < l[1].length - 1) b += L(x + 148, y + 38, x + 160, y + 38, { stroke: l[4], sw: 1.6 });
      });
      b += P("M 520 " + (y + 38) + " L 580 " + (y + 38), { stroke: C.gold, sw: 2, arrow: d.arrow, dash: "5 4" });
      b += T(550, y + 30, "categorises", { size: 10, mono: true, fill: C.slate, nowrap: true });
      b += R(590, y + 18, 470, 40, { fill: "#fff", rx: 10, stroke: l[4], sw: 1.6 });
      b += T(825, y + 38, l[2].join(" · "), { size: 13, weight: 800, fill: l[4], vcenter: true, nowrap: true });
      b += T(825, y + 80, l[3], { size: 12, fill: C.slate, nowrap: true });
    });
    var rel = ["KPI measures progress towards goals", "Channel aggregates services", "Information entity supports service", "Application enables service · creates & manages information", "Infrastructure asset hosts applications · stores information"];
    b += T(820, 676, "Infrastructure hosts applications · applications enable services · information supports services", { size: 11.5, fill: C.slate, weight: 700, nowrap: true });
    return svg(W, H, b, "Qatar GEA metamodel, simplified");
  };

  /* ---------------- GTA baseline landscape ---------------- */
  D["reference-arch-gta"] = function () {
    var d = defs(), W = 1200, H = 760, b = d.html;
    function band(y, h, title, fill) { b += R(20, y, 1160, h, { fill: fill, rx: 12 }) + R(20, y, 110, h, { fill: C.deep, rx: 12 }) + T(75, y + h / 2, title, { size: 13, weight: 800, fill: "#fff", vcenter: true, chars: 11, lh: 15 }); }
    function boxes(y, h, x0, x1, items, o) {
      o = o || {}; var n = items.length, gap = 8, w = (x1 - x0 - (n - 1) * gap) / n;
      items.forEach(function (it, i) {
        var x = x0 + i * (w + gap);
        b += R(x, y, w, h, { fill: o.fill || "#fff", rx: 9, stroke: o.fill ? "none" : C.line });
        var lines = String(it).split("|");
        b += T(x + w / 2, y + h / 2 - (lines.length > 1 ? 7 : 0), lines[0], { size: o.size || 12, weight: 800, fill: o.color || C.text, vcenter: true, width: w - 10, lh: 14 });
        if (lines[1]) b += T(x + w / 2, y + h / 2 + 12, lines[1], { size: 10.5, fill: o.sub || C.slate, vcenter: true, nowrap: true });
      });
    }
    band(20, 56, "Users", C.blush);
    boxes(30, 36, 140, 1170, ["GTA employees", "Taxpayers", "Tax agents / inspectors", "Vendors / suppliers", "Gov. / ministries", "Call-centre agents", "Licensing authorities"], { size: 11.5 });
    band(86, 62, "Channels", C.goldSoft);
    boxes(94, 46, 140, 1170, ["Dhareeba portal|SAP TRM", "Mobile apps|Hayaatna · Dhareeba", "Intranet|SharePoint", "Email|MS Exchange", "SMS gateway", "Call centre|Gov. Call Center", "Social media"], { size: 11.5 });
    // systems area
    band(158, 300, "Systems", "#FBF0F4");
    b += tagLabel(146, 180, "Core applications");
    boxes(190, 52, 146, 520, ["Dhareeba|Tax & Revenue Mgmt · SAP TRM", "Tax Support Mgmt|Dynamics · HPSM"], { fill: C.m, color: "#fff", sub: "rgba(255,255,255,.8)", size: 12 });
    boxes(250, 52, 146, 520, ["Tabadol|Info exchange · NewGen", "Payment gateway|XPI"], { fill: C.m, color: "#fff", sub: "rgba(255,255,255,.8)", size: 12 });
    b += tagLabel(146, 330, "Support applications");
    boxes(340, 46, 146, 520, ["Summit|ITSM", "WorkForce|Attendance", "Dynamics|Procurement"], { size: 11.5 });
    boxes(394, 46, 146, 520, ["ECM|SharePoint · OpenText · SAP", "Active Directory", "TAS|legacy tax system"], { size: 11.5 });
    b += R(536, 176, 300, 270, { fill: "#fff", rx: 12, stroke: C.blush2 });
    b += T(686, 202, "SharePoint applications", { size: 13, weight: 800, fill: C.deep, nowrap: true });
    b += T(686, 224, "≈ 25 in-house HR & admin apps", { size: 11.5, fill: C.slate, nowrap: true });
    ["Employee evaluation", "Annual leave plan", "Official missions", "Training programs", "Archiving system", "Employee files", "Suggestions", "Our Talents", "…and more"].forEach(function (s, i) {
      var x = 552 + (i % 3) * 94, y = 240 + Math.floor(i / 3) * 66;
      b += R(x, y, 86, 56, { fill: C.blush, rx: 8 });
      b += T(x + 43, y + 28, s, { size: 10.5, weight: 700, fill: C.deep, vcenter: true, width: 80, lh: 12 });
    });
    b += tagLabel(852, 180, "Integration", C.teal);
    [["ETL|Synapse + SAP Data Services", 190], ["API Connect|IBM", 252], ["Workflow|SharePoint", 314]].forEach(function (x) { boxes(x[1], 52, 852, 990, [x[0]], { fill: C.teal, color: "#fff", sub: "rgba(255,255,255,.85)", size: 12 }); });
    b += tagLabel(1004, 180, "External systems", C.navy);
    ["NAS|auth", "GDX|MCIT", "Mawared|HR", "Maliya|finance", "Tawasul|comms", "Tasdeeq · Emdad · Sharek"].forEach(function (s, i) { boxes(190 + i * 43, 37, 1004, 1170, [s], { fill: "#EAF1F7", color: C.navy, size: 11 }); });
    // data
    band(468, 62, "Data", C.tealSoft);
    boxes(476, 46, 140, 1170, ["Data warehouse|Azure Synapse + SAP BW", "Data analytics|SAP Analytics Cloud", "Visualisation|Power BI", "Data quality|SAP Data Services"], { size: 12, color: "#0B5F4F" });
    // infra
    band(540, 62, "Infra.", "#F1F2F4");
    boxes(548, 46, 140, 1170, ["Primary data centre|Azure — West Europe", "Disaster recovery|Azure — North Europe", "Meeza data centre|on-premises", "Qatar Central|cloud", "Network|GN WAN · HQ"], { size: 12 });
    // security
    band(612, 62, "Security", "#EEF3FA");
    boxes(620, 46, 140, 1170, ["Users", "Devices", "Applications", "Data", "Network", "SOC & NOC"], { size: 12, color: C.navy });
    b += T(600, 700, "GTA baseline (as-is) technology landscape — source: GTA Digital Strategy, Current State Understanding Report", { size: 12, fill: C.slate, weight: 700 });
    b += T(600, 720, "Simplified for awareness use; security control details intentionally omitted", { size: 11.5, fill: C.muted });
    return svg(W, 740, b, "GTA baseline technology landscape");
  };

  /* ---------------- GTA integration baseline ---------------- */
  D["gta-integration"] = function () {
    var d = defs(), W = 1100, H = 560, b = d.html;
    b += R(20, 20, 470, 500, { fill: "#FCFAFB", rx: 16, stroke: C.line });
    b += T(255, 50, "GTA systems", { size: 16, weight: 800, fill: C.deep, nowrap: true });
    function nb(x, y, w, h, t, s, f) { b += R(x, y, w, h, { fill: f || "#fff", rx: 10, stroke: f ? "none" : C.rose, filter: d.shadow }) + T(x + w / 2, y + h / 2 - (s ? 7 : 0), t, { size: 13, weight: 800, fill: f ? "#fff" : C.deep, vcenter: true, nowrap: true }) + (s ? T(x + w / 2, y + h / 2 + 12, s, { size: 11, fill: f ? "rgba(255,255,255,.8)" : C.slate, vcenter: true, nowrap: true }) : ""); }
    b += tagLabel(40, 80, "Core systems");
    nb(40, 92, 190, 54, "Dhareeba", "SAP TRM", C.m);
    nb(280, 92, 190, 54, "Tax Support Mgmt", "Dynamics", C.m);
    nb(40, 178, 190, 54, "Tabadol", "NewGen", C.m);
    b += L(230, 119, 278, 119, { stroke: C.m, sw: 2 });
    // missing link
    b += L(135, 148, 135, 176, { stroke: C.red || "#B42318", sw: 2.5, dash: "4 4" });
    b += R(150, 150, 150, 24, { fill: "#FDECEA", rx: 12 }) + T(225, 162, "missing integration", { size: 11, weight: 800, fill: "#B42318", vcenter: true, nowrap: true });
    b += tagLabel(40, 270, "Support systems (not exhaustive)");
    [["Payment gateway", "IBM Connect"], ["Summit", "ITSM"], ["WorkForce", "attendance"], ["Procurement", "Dynamics"], ["ECM", ""], ["Active Directory", ""]].forEach(function (s, i) { nb(40 + (i % 2) * 225, 282 + Math.floor(i / 2) * 64, 205, 50, s[0], s[1]); });
    b += T(255, 500, "All internal integrations are point-to-point — no middleware", { size: 12, weight: 800, fill: "#B42318", nowrap: true });
    // GDX
    b += R(530, 140, 180, 220, { fill: "url(#" + d.grad + ")", rx: 16, filter: d.shadow });
    b += T(620, 230, "GDX", { size: 26, weight: 800, fill: "#fff", nowrap: true });
    b += T(620, 258, "Government Data", { size: 12, fill: "rgba(255,255,255,.85)", nowrap: true });
    b += T(620, 274, "eXchange (MCIT)", { size: 12, fill: "rgba(255,255,255,.85)", nowrap: true });
    b += P("M 230 140 C 300 178, 420 232, 526 232", { stroke: C.m, sw: 2, arrow: d.arrow });
    // external entities
    b += R(750, 20, 330, 330, { fill: "#FCFAFB", rx: 16, stroke: C.line });
    b += T(915, 50, "External entities", { size: 16, weight: 800, fill: C.deep, nowrap: true });
    var ents = [["OECD & IRS", 1], ["MoI", 1], ["MoCI", 1], ["GAC", 1], ["MoF", 0], ["MoJ", 0], ["MoL", 0], ["Banks", 0], ["QFC", 0]];
    ents.forEach(function (e, i) {
      var x = 768 + (i % 2) * 152, y = 66 + Math.floor(i / 2) * 54;
      b += R(x, y, 142, 42, { fill: e[1] ? C.ink : C.blush2, rx: 10 }) + T(x + 71, y + 21, e[0], { size: 13, weight: 800, fill: e[1] ? "#fff" : C.deep, vcenter: true, nowrap: true });
    });
    b += L(712, 250, 748, 200, { stroke: C.m, sw: 2, arrow: d.arrow });
    b += P("M 232 200 C 420 200, 520 87, 764 87", { stroke: C.gold, sw: 2, arrow: d.arrow, dash: "6 4" });
    b += T(400, 186, "file transfer (FATCA / CRS)", { size: 11, mono: true, fill: C.slate, nowrap: true });
    b += R(750, 380, 330, 140, { fill: "#EEF3FA", rx: 16 });
    b += T(915, 408, "External government systems", { size: 13, weight: 800, fill: C.navy, nowrap: true });
    ["NAS · Tasdeeq", "Mawared (HR)", "Maliya – GFMI", "Tawasul · Emdad · Sharek"].forEach(function (s, i) { b += T(915, 434 + i * 21, s, { size: 12.5, fill: C.navy, nowrap: true }); });
    b += R(768, 360, 14, 14, { fill: C.ink, rx: 3 }) + T(788, 372, "Live", { size: 11.5, anchor: "start", fill: C.slate, nowrap: true, weight: 700 });
    b += R(840, 360, 14, 14, { fill: C.blush2, rx: 3 }) + T(860, 372, "In progress / planned", { size: 11.5, anchor: "start", fill: C.slate, nowrap: true, weight: 700 });
    b += T(550, 548, "GTA integration baseline — source: Current State Understanding Report", { size: 12, fill: C.slate, weight: 700 });
    return svg(W, H, b, "GTA integration baseline");
  };

  /* ---------------- GTA data & reporting baseline ---------------- */
  D["gta-data-flow"] = function () {
    var d = defs(), W = 1100, H = 430, b = d.html;
    var cols = [["Data sources", ["SAP TRM (Dhareeba)", "Dynamics", "Tabadol", "Summit · SharePoint", "Gov. entities · banks/FIs", "Tax laws & regulations"], C.deep],
      ["Data integration", ["ETL — Azure Synapse (non-SAP)", "ETL — SAP Data Services (SAP)", "Data quality — SAP Data Services"], C.m],
      ["Processing & analytics", ["Data warehouse — Synapse + SAP BW", "SAP Analytics Cloud (SAP data only)"], C.m2],
      ["Visualisation", ["Power BI", "MS Office (Excel) — manual reports"], C.teal],
      ["End users", ["Leadership — executive dashboards", "Departments — business reports"], C.navy]];
    var w = 196, gap = 20;
    cols.forEach(function (c, i) {
      var x = 20 + i * (w + gap);
      b += R(x, 20, w, 46, { fill: c[2], rx: 12 }) + T(x + w / 2, 43, c[0], { size: 14, weight: 800, fill: "#fff", vcenter: true, nowrap: true });
      c[1].forEach(function (s, k) { b += R(x, 80 + k * 46, w, 38, { fill: "#fff", rx: 9, stroke: C.line }) + T(x + w / 2, 99 + k * 46, s, { size: 11.5, weight: 700, fill: C.text, vcenter: true, width: w - 12, lh: 13 }); });
      if (i < 4) b += L(x + w + 2, 43, x + w + gap - 2, 43, { stroke: C.gold, sw: 2.4, arrow: d.arrow });
    });
    b += R(20, 368, 1060, 40, { fill: C.amberSoft, rx: 10 });
    b += T(550, 388, "Baseline gaps: no formal data strategy · governance, classification, metadata & stewardship roles missing · data-quality issues · limited self-service reporting", { size: 12, weight: 700, fill: "#6B4D0E", vcenter: true, nowrap: true });
    return svg(W, H, b, "GTA data and reporting baseline");
  };

  /* ---------------- GTA hosting baseline ---------------- */
  D["gta-hosting"] = function () {
    var d = defs(), W = 1000, H = 420, b = d.html;
    function site(x, y, w, h, t, s, f, items) {
      b += R(x, y, w, h, { fill: f, rx: 16, filter: d.shadow });
      b += T(x + 20, y + 32, t, { size: 16, weight: 800, fill: "#fff", anchor: "start", nowrap: true });
      b += T(x + 20, y + 52, s, { size: 12, fill: "rgba(255,255,255,.8)", anchor: "start", nowrap: true });
      (items || []).forEach(function (it, i) { b += T(x + 20, y + 78 + i * 18, "• " + it, { size: 11.5, fill: "rgba(255,255,255,.92)", anchor: "start", nowrap: true }); });
    }
    site(30, 30, 280, 150, "GTA building", "Doha — users & LAN", C.deep, ["Internet + Government Network", "IP telephony", "Wireless LAN"]);
    site(30, 230, 280, 150, "Meeza data centre", "Qatar — on-premises", "#5E6573", ["IT & security tooling", "Virtualisation platform", "Backup appliance"]);
    site(690, 30, 280, 150, "Azure — West Europe", "Primary production", C.m, ["SAP workloads (S/4HANA, BW/4HANA)", "Dhareeba & NSAP apps", "Prod · QA · pre-prod · dev"]);
    site(690, 230, 280, 150, "Azure — North Europe", "Disaster recovery", C.m2, ["Dhareeba DR resources", "Supporting DR services"]);
    b += R(390, 150, 220, 120, { fill: C.goldSoft, rx: 60, stroke: C.gold });
    b += T(500, 200, "Government Network", { size: 14, weight: 800, fill: "#5D5130", nowrap: true });
    b += T(500, 222, "GN WAN (MCIT)", { size: 12, fill: "#5D5130", nowrap: true });
    [[310, 105, 390, 190], [310, 305, 390, 235], [610, 190, 690, 105], [610, 235, 690, 305]].forEach(function (l) { b += L(l[0], l[1], l[2], l[3], { stroke: C.gold, sw: 2.2 }); });
    b += T(560, 112, "ExpressRoute", { size: 11, mono: true, fill: C.slate, nowrap: true });
    b += T(500, 408, "Baseline hosting — no formal multi-cloud or IT DR strategy yet; Qatar Central region service availability under review", { size: 12, fill: C.slate, weight: 700 });
    return svg(W, H, b, "GTA hosting baseline");
  };

  /* ---------------- GTA IT governance bodies ---------------- */
  D["gta-it-governance"] = function () {
    var d = defs(), W = 1000, H = 330, b = d.html;
    b += R(330, 20, 340, 70, { fill: C.ink, rx: 14, filter: d.shadow });
    b += T(500, 50, "IT Steering Committee", { size: 17, weight: 800, fill: "#fff", nowrap: true });
    b += T(500, 72, "Strategic · in place, meets ad hoc", { size: 12, fill: C.gold2, nowrap: true });
    var bodies = [["Project Mgmt Office", "Informal (monthly)", 1], ["Enterprise Architecture Office", "Planned — not yet established", 0], ["Change Advisory Board", "In place", 2], ["Information Security Committee", "Not in place", 0], ["Vendor Management Board", "Not in place", 0]];
    var st = [[C.amberSoft, "#E9CF8E", "#6B4D0E"], [C.tealSoft, "#BFE3D9", "#0B5F4F"]];
    bodies.forEach(function (x, i) {
      var bx = 20 + i * 196, s = x[2] === 2 ? st[1] : x[2] === 1 ? st[0] : ["#F6D9DF", "#E2A2B2", C.deep];
      b += L(500, 90, bx + 88, 150, { stroke: C.muted, sw: 1.4 });
      b += R(bx, 150, 176, 100, { fill: s[0], rx: 14, stroke: x[0].indexOf("Enterprise") === 0 ? C.m : s[1], sw: x[0].indexOf("Enterprise") === 0 ? 3 : 1.4 });
      b += T(bx + 88, 186, x[0], { size: 13.5, weight: 800, fill: s[2], vcenter: true, width: 160, lh: 16 });
      b += T(bx + 88, 226, x[1], { size: 11.5, fill: s[2], vcenter: true, width: 160, lh: 14 });
    });
    b += T(500, 290, "Operational bodies report to the IT Steering Committee — status as assessed in April 2025", { size: 12, fill: C.slate, weight: 700 });
    b += T(500, 310, "This awareness programme supports standing up the EA Office", { size: 12, fill: C.m, weight: 800 });
    return svg(W, H, b, "GTA digital/IT governance bodies");
  };

  /* ---------------- GEA dimensions (replaces generic BDAT view) ---------------- */
  D["ea-domains"] = function () {
    var d = defs(), W = 1000, H = 560, b = d.html;
    var layers = [
      ["Business — BRM", "Goals & KPIs (performance taxonomy) · customers · delivery channels · business services", C.deep],
      ["Information — IRM", "Information taxonomy · authoritative information entities · exchange via GDX", C.m],
      ["Application — ARM", "Application taxonomy · reference architecture · shared platforms & applications", C.m2],
      ["Infrastructure — TRM", "Infrastructure taxonomy · hosting, cloud, network, facilities, end-user devices", "#5E6573"]
    ];
    b += R(60, 30, 700, 60, { fill: C.ink, rx: 14 }) + T(410, 66, "Governance & enablers", { size: 18, weight: 800, fill: "#fff", nowrap: true });
    layers.forEach(function (l, i) {
      var y = 106 + i * 100;
      b += R(60, y, 700, 84, { fill: l[2], rx: 14, filter: d.shadow });
      b += T(88, y + 36, l[0], { size: 19, weight: 800, fill: "#fff", anchor: "start", nowrap: true });
      b += T(88, y + 60, l[1], { size: 13, fill: "rgba(255,255,255,.85)", anchor: "start", nowrap: true });
      if (i < 3) b += L(410, y + 84, 410, y + 100, { stroke: C.gold2, sw: 2 });
    });
    [["Security Management", C.teal], ["Service Management", C.navy]].forEach(function (c, i) {
      var x = 790 + i * 90;
      b += R(x, 30, 70, 460, { fill: c[1], rx: 12, opacity: ".14" }) + R(x, 30, 70, 460, { fill: "none", stroke: c[1], rx: 12, sw: 1.4 });
      b += '<text transform="translate(' + (x + 41) + ' 260) rotate(-90)" text-anchor="middle" font-family="' + F + '" font-size="16" font-weight="800" fill="' + c[1] + '">' + c[0] + "</text>";
    });
    b += T(410, 528, "Qatar GEA: four reference-model dimensions + three cross-cutting dimensions", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "Qatar GEA dimensions");
  };

  /* ---------------- Capability heat map — evidence from current-state report ---------------- */
  D["capability-map-gta"] = function (o) {
    o = o || {};
    var d = defs(), W = 1120, b = d.html;
    var heat = { 0: ["#FFFFFF", C.line, "Adequate", C.text], 1: [C.amberSoft, "#E9CF8E", "Improve", C.text], 2: ["#F6D9DF", "#E2A2B2", "Critical gap", C.text], 9: ["#F3F4F6", "#E5E7EB", "Not assessed", C.slate] };
    var groups = [
      ["Strategy & policy", C.ink, [["Tax policy research", 1], ["Strategy & KPI management", 2], ["Enterprise architecture", 2], ["Treaties & MAP case handling", 2]]],
      ["Taxpayer services", C.deep, [["Registration & TIN", 1], ["Return filing (Dhareeba)", 1], ["Payment & collection", 1], ["Refunds (incl. excise)", 1], ["Taxpayer support desk", 0], ["Disputes & exemptions", 9], ["Digital channels & UX", 1], ["Guidance & training content", 1]]],
      ["Compliance & revenue", C.m, [["Corporate income tax admin", 1], ["Excise tax admin", 1], ["Revenue reporting", 2], ["Evasion & inspections", 1], ["Exchange of information", 1], ["Tax audit", 9]]],
      ["Data & insight", C.m2, [["Data management & governance", 2], ["Data quality", 2], ["Executive reporting & BI", 2], ["Historical data (TAS)", 1]]],
      ["Enabling", "#5E6573", [["Integration", 2], ["Case management", 2], ["Content & documents", 1], ["IT service management", 1], ["HR & workforce", 1], ["Finance & procurement (ERP)", 1], ["GRC & PMO tooling", 2], ["Resilience & DR", 2]]]
    ];
    var y = 20;
    groups.forEach(function (g) {
      var rows = Math.ceil(g[2].length / 4), h = 56 + rows * 54;
      b += R(14, y, 1092, h, { fill: "#FCFAFB", rx: 16, stroke: C.line });
      b += R(14, y, 6, h, { fill: g[1], rx: 3 });
      b += T(36, y + 30, g[0], { size: 14.5, weight: 800, fill: C.deep, anchor: "start", nowrap: true });
      g[2].forEach(function (c, i) {
        var x = 36 + (i % 4) * 266, yy = y + 44 + Math.floor(i / 4) * 54, hv = o.plain ? heat[0] : heat[c[1]];
        b += R(x, yy, 254, 44, { fill: hv[0], rx: 10, stroke: hv[1], sw: 1.4 });
        b += T(x + 127, yy + 22, c[0], { size: 13, weight: 700, fill: hv[3], vcenter: true, chars: 34 });
      });
      y += h + 12;
    });
    if (!o.plain) {
      [[0, "Adequate"], [1, "Improve"], [2, "Critical gap"], [9, "Not assessed"]].forEach(function (l, i) {
        b += R(640 + i * 118, y + 4, 14, 14, { fill: heat[l[0]][0], stroke: heat[l[0]][1], rx: 3 });
        b += T(660 + i * 118, y + 16, l[1], { size: 11.5, fill: C.slate, anchor: "start", nowrap: true, weight: 700 });
      });
      b += T(14, y + 16, "Heat derived from department pain points in the Current State Understanding Report (Apr 2025)", { size: 11.5, fill: C.muted, anchor: "start", nowrap: true });
    }
    return svg(W, y + 30, b, "GTA capability heat map from the current-state assessment");
  };


  /* ---------------- Gap analysis — baseline items ---------------- */
  D["gap-analysis"] = function () {
    var d = defs(), W = 1000, H = 480, b = d.html;
    var base = ["Point-to-point integrations", "~25 SharePoint apps", "TAS + Dhareeba data split", "Excel / manual reporting"];
    var tgt = ["Integration platform", "Rationalised apps", "Unified taxpayer data", "Self-service BI", "GRC & PMO tools"];
    var cell = [["Replace", "", "", "", ""], ["", "Consolidate", "", "", ""], ["", "", "Migrate", "", ""], ["", "", "", "Replace", ""]];
    var x0 = 228, y0 = 90, cw = 126, ch = 60;
    b += tagLabel(x0, 40, "Target building blocks →");
    b += tagLabel(20, y0 - 14, "Baseline ↓", C.slate);
    tgt.concat(["Eliminated"]).forEach(function (t, j) {
      var x = x0 + j * cw;
      b += R(x + 4, 50, cw - 8, 32, { fill: j === 5 ? "#F3F1F2" : C.m, rx: 8 });
      b += T(x + cw / 2, 66, t, { size: 11.5, weight: 700, fill: j === 5 ? C.slate : "#fff", vcenter: true, chars: 18, lh: 12 });
    });
    base.concat(["New"]).forEach(function (r, i) {
      var y = y0 + i * ch;
      b += R(20, y + 4, 200, ch - 8, { fill: i === 4 ? "#F3F1F2" : C.blush, rx: 8 });
      b += T(120, y + ch / 2, r, { size: 12.5, weight: 700, fill: i === 4 ? C.slate : C.deep, vcenter: true, chars: 26 });
      for (var j = 0; j < 6; j++) {
        var x = x0 + j * cw, v = (cell[i] || [])[j] || "";
        if (i === 4 && j === 4) v = "Gap: build/buy";
        b += R(x + 4, y + 4, cw - 8, ch - 8, { fill: v ? (v.indexOf("Gap") === 0 ? C.amberSoft : C.tealSoft) : "#fff", rx: 8, stroke: C.line });
        if (v) b += T(x + cw / 2, y + ch / 2, v, { size: 12, weight: 800, fill: v.indexOf("Gap") === 0 ? "#6B4D0E" : "#0B5F4F", vcenter: true, nowrap: true });
      }
    });
    b += T(500, 420, "Baseline rows from the Current State Understanding Report (Apr 2025); target columns follow its key considerations", { size: 12.5, fill: C.slate, weight: 700 });
    b += T(500, 444, "Indicative — the approved target state is defined in the Target State Design Report", { size: 11.5, fill: C.muted });
    return svg(W, H, b, "Gap analysis from GTA baseline");
  };

  /* ---------------- Transition roadmap — themes from the report ---------------- */
  D["transition-roadmap"] = function () {
    var d = defs(), W = 1100, H = 440, b = d.html;
    var cols = [["Baseline", "Apr 2025 assessment"], ["Foundation", "strategies & frameworks"], ["Strengthen", "platforms & processes"], ["Target", "per target-state design"]];
    var x0 = 170, cw = 230;
    cols.forEach(function (c, i) {
      var x = x0 + i * cw;
      b += R(x + 6, 20, cw - 12, 50, { fill: i === 0 ? "#5E6573" : i === 3 ? C.m : C.deep, rx: 12 });
      b += T(x + cw / 2, 42, c[0], { size: 15, weight: 800, fill: "#fff", nowrap: true });
      b += T(x + cw / 2, 60, c[1], { size: 11, mono: true, fill: "rgba(255,255,255,.75)", nowrap: true });
    });
    var lanes = [["Business", [[0, 1, "Excel reporting"], [1, 2, "KPI & strategy mgmt"], [2, 4, "Self-service executive dashboards"]]],
      ["Data", [[0, 1, "No data strategy"], [1, 2, "Data mgmt framework"], [2, 4, "Governed, quality-assured data"]]],
      ["Application", [[0, 1, "SharePoint sprawl"], [1, 2, "Dhareeba 2.0 · GRC · PMO"], [2, 4, "Rationalised portfolio"]]],
      ["Integration", [[0, 1, "Point-to-point"], [1, 2, "Integration strategy"], [2, 4, "Platform + GDX · Dhareeba–Tabadol"]]],
      ["Technology", [[0, 1, "No cloud / DR strategy"], [1, 2, "Multi-cloud & ITDR"], [2, 4, "Tested DR · cloud governance"]]]];
    lanes.forEach(function (l, i) {
      var y = 86 + i * 62;
      b += R(14, y, 1072, 54, { fill: i % 2 ? "#fff" : "#FCFAFB", rx: 10, stroke: C.line2 });
      b += T(30, y + 32, l[0], { size: 14, weight: 800, fill: C.deep, anchor: "start", nowrap: true });
      l[1].forEach(function (s) {
        var x = x0 + s[0] * cw + 10, w = (s[1] - s[0]) * cw - 20, tg = s[1] === 4;
        b += R(x, y + 9, w, 36, { fill: tg ? C.m : s[0] === 0 ? "#E9E6E8" : C.blush2, rx: 18 });
        b += T(x + w / 2, y + 27, s[2], { size: 12, weight: 700, fill: tg ? "#fff" : C.deep, vcenter: true, nowrap: true });
      });
    });
    b += T(550, 412, "Themes from the report's key considerations — indicative sequencing, not the approved roadmap (see D3 Implementation Roadmap)", { size: 12, fill: C.slate, weight: 700 });
    return svg(W, H, b, "Indicative transition themes from the GTA baseline");
  };

  /* ---------------- Building blocks — real SBBs ---------------- */
  D["building-blocks"] = function () {
    var d = defs(), W = 1000, H = 440, b = d.html;
    b += R(30, 40, 430, 360, { fill: C.blush, rx: 20, stroke: C.blush2 });
    b += tagLabel(54, 74, "Architecture Building Blocks (ABB)");
    b += T(54, 100, "What is needed — vendor-neutral", { size: 13, fill: C.slate, anchor: "start", nowrap: true });
    b += R(540, 40, 430, 360, { fill: C.tealSoft, rx: 20, stroke: "#BFE3D9" });
    b += tagLabel(564, 74, "Solution Building Blocks (SBB) — GTA baseline", C.teal);
    b += T(564, 100, "How it is delivered today", { size: 13, fill: C.slate, anchor: "start", nowrap: true });
    var pairs = [["Core tax & revenue management", "Dhareeba — SAP TRM"], ["Taxpayer authentication", "National Authentication System (NAS)"], ["Cross-government data exchange", "GDX (MCIT shared service)"], ["International information exchange", "Tabadol — NewGen"], ["API management", "IBM API Connect"], ["Enterprise data warehouse", "Azure Synapse + SAP BW"]];
    pairs.forEach(function (p, i) {
      var y = 118 + i * 46;
      b += R(54, y, 382, 36, { fill: "#fff", rx: 10, stroke: C.rose });
      b += T(245, y + 18, p[0], { size: 13, weight: 700, fill: C.deep, vcenter: true, nowrap: true });
      b += R(564, y, 382, 36, { fill: "#fff", rx: 10, stroke: C.teal });
      b += T(755, y + 18, p[1], { size: 12.5, weight: 700, fill: "#0B5F4F", vcenter: true, nowrap: true });
      b += L(438, y + 18, 560, y + 18, { stroke: C.gold, sw: 1.8, arrow: d.arrow });
    });
    b += T(500, 428, "Shared WoG services (NAS, GDX) are reused rather than rebuilt — a core GEA principle (Promote reuse)", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "Architecture vs solution building blocks at GTA");
  };


  /* ---------------- GEA BRM — Business Architecture Framework (BRM Fig. 1) ---------------- */
  D["gea-brm-framework"] = function () {
    var d = defs(), W = 1260, H = 520, b = d.html, cx = 630;
    var tiers = [["Strategy", ["Qatar National Vision 2030 · Qatar Government strategies", "Sector / agency strategies · customer needs · emerging trends"], C.ink],
      ["Service Design", ["Design thinking · process modelling & simulation", "Capability modelling · information requirements"], C.deep],
      ["Service Transformation", ["Transformation roadmap · implementation projects", "GEA reference architectures · GEA standards"], C.m],
      ["Service Operations", ["Customer feedback · business process monitoring", "Continuous improvement"], C.m2]];
    function hw(k) { return 200 + k * 105; }
    tiers.forEach(function (t, i) {
      var y = 24 + i * 112;
      b += '<polygon points="' + (cx - hw(i)) + "," + y + " " + (cx + hw(i)) + "," + y + " " + (cx + hw(i + 1)) + "," + (y + 100) + " " + (cx - hw(i + 1)) + "," + (y + 100) + '" fill="' + t[2] + '" filter="url(#' + d.shadow + ')"/>';
      b += T(cx, y + 28, t[0], { size: 17, weight: 800, fill: C.gold2, nowrap: true });
      b += T(cx, y + 52, t[1][0], { size: 12.5, fill: "#fff", nowrap: true });
      b += T(cx, y + 72, t[1][1], { size: 12.5, fill: "#fff", nowrap: true });
    });
    b += T(cx, 505, "GEA BRM — strategy-driven, performance-oriented business architecture framework", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "GEA business architecture framework");
  };

  /* ---------------- GEA IRM — Information Exchange Architecture (GDX) ---------------- */
  D["gea-gdx"] = function () {
    var d = defs(), W = 1100, H = 560, b = d.html;
    var bands = [["Service consumption governance", [["Developer portal", 0], ["Subscription mgmt", 0], ["API catalogue", 0], ["Service analytics", 0]]],
      ["Service gateway", [["Schema validation", 1], ["XML firewall", 1], ["Security AAA", 1], ["Service-level mgmt", 1], ["REST / SOAP bridge", 1]]],
      ["Service mediation", [["Content transformation", 1], ["Protocol switching", 1], ["Routing", 1], ["Publish / subscribe", 1], ["Quality of service", 1], ["Service composition", 1], ["Async communication", 1]]],
      ["Service registry", [["Repository", 1], ["Registry", 1], ["Policy management", 1], ["Service virtualisation", 1]]],
      ["Management & monitoring", [["System monitoring", 1], ["Service monitoring", 1], ["Auditing / logging", 1], ["Data dictionary", 1]]],
      ["Agency systems", [["Authoritative systems of record", 2], ["Legacy systems", 2]]]];
    ["Service provider agencies", "Service consumer agencies", "Platform admins (MoTC → MCIT)"].forEach(function (a, i) { b += pill(260 + i * 260, 16, 230, 30, a, C.goldSoft, "#5D5130", 12); });
    bands.forEach(function (bd, i) {
      var y = 60 + i * 74;
      b += R(20, y, 1060, 64, { fill: i === 5 ? "#EEF3FA" : "#F4FAF8", rx: 12 });
      b += T(130, y + 32, bd[0], { size: 13, weight: 800, fill: i === 5 ? C.navy : "#0B5F4F", vcenter: true, width: 200, lh: 15 });
      var n = bd[1].length, x0 = 250, w = (820 - (n - 1) * 8) / n;
      bd[1].forEach(function (c, k) {
        var f = c[1] === 0 ? C.m : c[1] === 1 ? C.navy : C.teal;
        b += R(x0 + k * (w + 8), y + 12, w, 40, { fill: f, rx: 20 });
        b += T(x0 + k * (w + 8) + w / 2, y + 32, c[0], { size: 11.5, weight: 700, fill: "#fff", vcenter: true, width: w - 10, lh: 13 });
      });
    });
    [[C.navy, "Existing WoG service"], [C.m, "Potential / future WoG service"], [C.teal, "Agency-owned"]].forEach(function (l, i) { b += R(250 + i * 250, 512, 14, 14, { fill: l[0], rx: 3 }) + T(270 + i * 250, 524, l[1], { size: 12, anchor: "start", fill: C.slate, weight: 700, nowrap: true }); });
    b += T(550, 550, "GEA IRM — inter-agency Information Exchange Architecture on GDX (CoM Resolution 18/2010)", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, 560, b, "GEA information exchange architecture (GDX)");
  };

  /* ---------------- GEA ARM — Application Reference Architecture (ARM Fig. 1) ---------------- */
  D["gea-arm"] = function () {
    var d = defs(), W = 1160, H = 620, b = d.html;
    var M = 0, WA = 1, A = 2;
    var cols = [C.m, C.teal, C.navy];
    function row(y, h, label, groups, fill) {
      b += R(20, y, 1120, h, { fill: fill, rx: 12 });
      b += T(110, y + h / 2, label, { size: 12.5, weight: 800, fill: C.deep, vcenter: true, width: 170, lh: 14 });
      var x = 200;
      groups.forEach(function (g) {
        var items = g.items, gw = g.w;
        if (g.title) { b += R(x, y + 6, gw, h - 12, { fill: "rgba(255,255,255,.6)", rx: 10, stroke: C.line }); b += T(x + 10, y + 22, g.title, { size: 10.5, mono: true, weight: 700, fill: C.slate, anchor: "start", nowrap: true }); }
        var top = g.title ? y + 30 : y + 10, ih = g.title ? h - 40 : h - 20, per = g.perRow || items.length, rows = Math.ceil(items.length / per), bh = (ih - (rows - 1) * 6) / rows, bw = (gw - 16 - (per - 1) * 6) / per;
        items.forEach(function (it, k) {
          var bx = x + 8 + (k % per) * (bw + 6), by = top + Math.floor(k / per) * (bh + 6);
          b += R(bx, by, bw, bh, { fill: cols[it[1]], rx: 8 });
          b += T(bx + bw / 2, by + bh / 2, it[0], { size: 10.5, weight: 700, fill: "#fff", vcenter: true, width: bw - 6, lh: 12 });
          if (it[2]) b += '<text x="' + (bx + bw - 9) + '" y="' + (by + 13) + '" font-size="12" fill="#E9C56B" text-anchor="middle">★</text>';
        });
        x += gw + 10;
      });
    }
    row(20, 70, "Systems of engagement", [{ w: 930, items: [["Mobile One", WA], ["gov.qa", WA], ["Agency websites", A], ["Agency mobile apps", A], ["Agency kiosk apps", A], ["Analytical dashboards", WA]] }], C.blush);
    row(100, 90, "Services", [{ w: 600, title: "Process services", items: [["e-2-e journey processes", WA], ["Choreography processes", A], ["Orchestrated processes", A]] }, { w: 320, title: "Business services", items: [["Business APIs", A], ["Analytics APIs", WA]] }], C.blush);
    row(200, 110, "Service enablement platform services", [{ w: 930, perRow: 6, items: [["Microservices platform", M], ["Mobile foundation", M], ["PaaS runtimes", M], ["Orchestration / BPM", M], ["Event hub", M], ["Rules engine", M], ["Web content mgmt", M], ["DevOps", M], ["Analytical tools", M], ["Blockchain runtimes", M], ["AI services", M], ["CRM", M, 1]] }], "#EEF3FA");
    row(320, 100, "Integration & data", [{ w: 330, title: "Application integration (GDX)", items: [["Enterprise service bus", M, 1], ["Registry", M, 1], ["API management", M]] }, { w: 220, title: "Data integration", items: [["ETL / batch", M], ["Data quality", M]] }, { w: 360, title: "Data stores", items: [["Data lake", M], ["Data warehouse", M], ["Master data repository", M]] }], "#EEF3FA");
    row(430, 110, "Shared applications & services", [{ w: 580, title: "Infrastructure applications & platforms", perRow: 5, items: [["Payment gateway", M, 1], ["SMS gateway", M, 1], ["Geo-spatial engine", M, 1], ["Doc. mgmt", M, 1], ["Case mgmt", M], ["Open data platform", M], ["National auth.", M, 1], ["Certificate authority", M, 1], ["Social sentiment", M], ["Directory services", M]] }, { w: 340, title: "Business applications", perRow: 3, items: [["Strategy & portfolio", M], ["HR", M, 1], ["Finance", M, 1], ["Procurement", M], ["e-Correspondence", M, 1]] }], "#EEF3FA");
    row(550, 50, "Systems of records", [{ w: 930, items: [["Legacy systems", A], ["COTS solutions", A], ["Legacy data stores", A]] }], "#F1F2F4");
    [[C.m, "WoG"], [C.teal, "WoG / agency"], [C.navy, "Agency"]].forEach(function (l, i) { b += R(200 + i * 160, 606, 12, 12, { fill: l[0], rx: 3 }) + T(218 + i * 160, 617, l[1], { size: 11.5, anchor: "start", fill: C.slate, weight: 700, nowrap: true }); });
    b += '<text x="690" y="618" font-size="13" fill="#C9A23F">★</text>' + T(706, 617, "Existing shared service", { size: 11.5, anchor: "start", fill: C.slate, weight: 700, nowrap: true });
    return svg(W, 630, b, "GEA application reference architecture");
  };

  /* ---------------- GEA TRM — Infrastructure Reference Architecture (TRM Fig. 1) ---------------- */
  D["gea-trm"] = function () {
    var d = defs(), W = 1000, H = 470, b = d.html;
    var rows = [["Applications, PaaS services", [], "#EEF3FA"],
      ["Cloud — PaaS foundation", [["Cloud controller", 0], ["Service broker", 0], ["Containers", 0], ["Container orchestrator", 0]], "#F4FAF8"],
      ["Cloud — Infrastructure as a Service", [["SD compute", 1], ["SD storage", 1], ["SD networking", 0], ["Backup as a service", 0], ["DR as a service", 0]], "#F4FAF8"],
      ["Facilities", [["Government Data Center", 1], ["Government Contact Center", 1]], "#F4FAF8"],
      ["Connectivity", [["Government Network", 1], ["Edge networks", 0], ["Edge routers", 0]], "#F4FAF8"]];
    rows.forEach(function (r, i) {
      var y = 20 + i * 78;
      b += R(20, y, 820, 68, { fill: r[2], rx: 12 });
      b += T(130, y + 34, r[0], { size: 13, weight: 800, fill: "#0B5F4F", vcenter: true, width: 200, lh: 15 });
      var n = r[1].length; if (!n) { b += T(540, y + 34, "Consumers — agency applications and PaaS services use the layers below", { size: 12.5, fill: C.slate, vcenter: true, nowrap: true }); return; }
      var w = (580 - (n - 1) * 8) / n;
      r[1].forEach(function (c, k) { var x = 250 + k * (w + 8); b += R(x, y + 14, w, 40, { fill: c[1] ? C.navy : C.m, rx: 20 }) + T(x + w / 2, y + 34, c[0], { size: 11.5, weight: 700, fill: "#fff", vcenter: true, width: w - 8, lh: 13 }); });
    });
    b += R(860, 98, 120, 302, { fill: C.teal, rx: 12 });
    b += '<text transform="translate(926 250) rotate(-90)" text-anchor="middle" font-family="' + F + '" font-size="14" font-weight="800" fill="#fff">Government ICT Framework Agreement</text>';
    [[C.navy, "Existing WoG service"], [C.m, "Potential / future WoG service"]].forEach(function (l, i) { b += R(250 + i * 250, 420, 14, 14, { fill: l[0], rx: 3 }) + T(270 + i * 250, 432, l[1], { size: 12, anchor: "start", fill: C.slate, weight: 700, nowrap: true }); });
    b += T(500, 460, "GEA TRM — Infrastructure Reference Architecture (MoTC shared infrastructure)", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "GEA infrastructure reference architecture");
  };

  /* ---------------- GEA Security Management — NIA policy domains ---------------- */
  D["gea-nia"] = function () {
    var d = defs(), W = 1100, H = 470, b = d.html;
    var doms = [["AM", "Access control"], ["AC", "Audit & certification"], ["BC", "Business continuity"], ["CM", "Change management"], ["CS", "Communications security"], ["CY", "Cryptographic security"], ["DL", "Data labeling"], ["DR", "Data retention & archival"], ["DC", "Documentation"], ["GS", "Gateway security"], ["IG", "Governance structure"], ["IM", "Incident management"], ["IE", "Information exchange"], ["SM", "Logging, auditing & monitoring"], ["MS", "Media security"], ["NS", "Network security"], ["PS", "Personnel security"], ["PH", "Physical security"], ["OS", "Portable device & off-site"], ["PR", "Product security"], ["RM", "Risk management"], ["SA", "Security awareness"], ["SS", "Software security"], ["SU", "System usage security"], ["TM", "Third-party security"], ["VL", "Virtualization"]];
    b += R(20, 20, 1060, 60, { fill: C.ink, rx: 14 }) + T(550, 46, "Qatar National Information Assurance (NIA) Policy — Q-CERT", { size: 17, weight: 800, fill: "#fff", nowrap: true }) + T(550, 66, "Mandate for all agency security policies · lower-level policies: cloud security, BYOD · ISMS in every agency", { size: 12, fill: C.gold2, nowrap: true });
    doms.forEach(function (x, i) {
      var c = i % 7, r = Math.floor(i / 7), bx = 20 + c * 152, by = 98 + r * 78;
      b += R(bx, by, 142, 66, { fill: i === 21 ? C.m : "#fff", rx: 10, stroke: i === 21 ? C.m : C.line });
      b += T(bx + 14, by + 24, x[0], { size: 15, mono: true, weight: 800, fill: i === 21 ? C.gold2 : C.m, anchor: "start", nowrap: true });
      b += T(bx + 14, by + 46, x[1], { size: 11.5, weight: 700, fill: i === 21 ? "#fff" : C.text, anchor: "start", width: 122, lh: 13 });
    });
    b += T(550, 430, "26 NIA security domains as listed in GEA Security Management — Security Awareness [SA] is the one this programme supports", { size: 12.5, fill: C.slate, weight: 700 });
    b += T(550, 452, "GTA is ISO/IEC 27001 certified (current-state report, 2025)", { size: 12, fill: C.muted });
    return svg(W, H, b, "NIA policy security domains");
  };

  /* ---------------- GEA Service Management — ITIL v3 + COBIT ---------------- */
  D["gea-itsm"] = function () {
    var d = defs(), W = 1100, H = 450, b = d.html;
    var g = [["Continual service improvement", ["Service measurement", "Service reporting", "Service improvement"], C.ink],
      ["Service strategy", ["Demand management", "Strategy generation", "Service portfolio mgmt"], C.deep],
      ["Service design", ["Service catalogue mgmt", "Service level mgmt", "Capacity mgmt", "Availability mgmt", "Service continuity mgmt", "Information security mgmt", "Supplier mgmt"], C.m],
      ["Service transition", ["Transition planning & support", "Change mgmt", "Service asset & configuration", "Release & deployment", "Validation & testing", "Evaluation", "Knowledge mgmt"], C.m2],
      ["Service operation", ["Event mgmt", "Incident mgmt", "Request fulfilment", "Problem mgmt", "Access mgmt", "Operation mgmt"], C.teal]];
    var w = 206, gap = 9;
    g.forEach(function (c, i) {
      var x = 20 + i * (w + gap);
      b += R(x, 20, w, 54, { fill: c[2], rx: 12 }) + T(x + w / 2, 47, c[0], { size: 13, weight: 800, fill: "#fff", vcenter: true, width: w - 16, lh: 15 });
      c[1].forEach(function (p, k) { b += R(x, 84 + k * 40, w, 34, { fill: "#fff", rx: 8, stroke: C.line }) + T(x + w / 2, 101 + k * 40, p, { size: 11.5, weight: 700, fill: C.text, vcenter: true, nowrap: true }); });
    });
    b += R(20, 376, 1060, 34, { fill: C.goldSoft, rx: 10 }) + T(550, 393, "Service desk (function) — Qatar Government Contact Center = level 1 for the public · agency service desk for internal IT", { size: 12, weight: 700, fill: "#5D5130", vcenter: true, nowrap: true });
    b += T(550, 436, "GEA Service Management — based on ITIL v3, aligned with COBIT 5 · governance processes (left two) and lifecycle operational processes", { size: 12.5, fill: C.slate, weight: 700 });
    return svg(W, H, b, "GEA service management processes");
  };


  /* ---------------- GEA governance bodies + checkpoints (GEA Governance Model, Fig. 2) ---------------- */
  D["governance-flow"] = function () {
    var d = defs(), W = 1160, H = 560, b = d.html;
    b += R(20, 20, 1120, 200, { fill: "#FBF7F9", rx: 16, stroke: C.line });
    b += tagLabel(40, 46, "Whole-of-government level · EA focus · upstream");
    b += R(40, 60, 330, 66, { fill: C.ink, rx: 12 }) + T(205, 86, "QDG Steering Committee", { size: 15, weight: 800, fill: "#fff", nowrap: true }) + T(205, 108, "ICT Governance Board · high-impact exceptions", { size: 11.5, fill: C.gold2, nowrap: true });
    b += R(40, 140, 330, 66, { fill: C.deep, rx: 12 }) + T(205, 166, "Architecture Review Board (WoG)", { size: 15, weight: 800, fill: "#fff", nowrap: true }) + T(205, 188, "maintains & publishes GEA · medium-impact exceptions", { size: 11.5, fill: C.gold2, nowrap: true });
    b += L(205, 126, 205, 138, { stroke: C.gold, sw: 2, arrow: d.arrow });
    b += R(400, 60, 720, 146, { fill: "#fff", rx: 12, stroke: C.blush2 });
    b += T(420, 86, "GEA reference models & guidance", { size: 14, weight: 800, fill: C.deep, anchor: "start", nowrap: true });
    ["BRM · IRM · ARM · TRM — taxonomies, reference architectures, standards", "Security Management (NIA) · Service Management (ITIL v3 + COBIT 5)", "Self-assessment template · EA maturity model 0–5 · ArchiMate 3.0 / Archi", "Tender compliance statement for every ICT RFP"].forEach(function (s, i) { b += T(420, 112 + i * 22, "• " + s, { size: 12.5, fill: C.text, anchor: "start", nowrap: true }); });
    b += '<line x1="20" y1="236" x2="1140" y2="236" stroke="' + C.rose + '" stroke-width="1.5" stroke-dasharray="6 5"/>';
    b += R(20, 252, 1120, 280, { fill: "#F4FAF8", rx: 16, stroke: C.line });
    b += tagLabel(420, 278, "Agency level (GTA) · compliance focus · downstream", C.teal);
    b += R(40, 292, 330, 66, { fill: C.teal, rx: 12 }) + T(205, 318, "Technical Review Board", { size: 15, weight: 800, fill: "#fff", nowrap: true }) + T(205, 340, "GEA compliance · low-impact exceptions", { size: 11.5, fill: "rgba(255,255,255,.85)", nowrap: true });
    b += L(205, 208, 205, 288, { stroke: C.m, sw: 2, arrow: d.arrow });
    b += P("M 215 288 L 215 210", { stroke: C.teal, sw: 2, arrow: d.arrow });
    b += R(226, 228, 160, 40, { fill: "#fff", rx: 8, stroke: C.line }) + T(306, 242, "guidance ↓", { size: 10.5, mono: true, fill: C.m, nowrap: true }) + T(306, 258, "compliance · exceptions ↑", { size: 10.5, mono: true, fill: C.teal, nowrap: true });
    b += R(40, 372, 330, 66, { fill: C.navy, rx: 12 }) + T(205, 398, "Design Authority (per solution)", { size: 15, weight: 800, fill: "#fff", nowrap: true }) + T(205, 420, "project lead architect + agency EA", { size: 11.5, fill: "rgba(255,255,255,.85)", nowrap: true });
    b += L(205, 358, 205, 370, { stroke: C.teal, sw: 2 });
    b += R(40, 452, 330, 60, { fill: "#fff", rx: 12, stroke: C.line }) + T(205, 476, "Projects", { size: 14, weight: 800, fill: C.deep, nowrap: true }) + T(205, 496, "> 500K need IT procurement committee approval", { size: 11, fill: C.slate, nowrap: true });
    b += L(205, 438, 205, 450, { stroke: C.navy, sw: 2 });
    // checkpoints
    b += T(760, 300, "TRB checkpoint reviews in the service delivery method", { size: 14, weight: 800, fill: "#0B5F4F", nowrap: true });
    ["Discovery", "Alpha", "Beta", "Live"].forEach(function (c, i) {
      var x = 420 + i * 175;
      b += R(x, 318, 160, 54, { fill: [C.ink, C.deep, C.m, C.teal][i], rx: 27 }) + T(x + 80, 345, c, { size: 15, weight: 800, fill: "#fff", vcenter: true, nowrap: true });
      if (i < 3) b += L(x + 162, 345, x + 173, 345, { stroke: C.gold, sw: 2.4, arrow: d.arrow });
    });
    b += T(760, 400, "At each checkpoint the Design Authority demonstrates:", { size: 13, weight: 800, fill: C.text, nowrap: true });
    ["alignment to GEA", "shared services leveraged", "cross-agency information assets leveraged", "compliance to standards"].forEach(function (s, i) { b += pill(420 + (i % 2) * 350, 418 + Math.floor(i / 2) * 42, 330, 32, s, "#fff", C.deep, 12.5); });
    b += R(420, 418, 0, 0);
    b += T(580, 550, "GEA Governance Model (MoTC) — bodies, decision rights and checkpoints; GTA has no EA Office yet (current-state report, 2025)", { size: 12, fill: C.slate, weight: 700 });
    return svg(W, H, b, "GEA governance bodies and checkpoints");
  };

  /* ---------------- Traceability along the GEA metamodel ---------------- */
  D["traceability-chain"] = function () {
    var d = defs(), W = 1100, H = 320, b = d.html;
    var ch = [["Goal · BRM", "Enhance taxpayer services & satisfaction", C.ink], ["KPI · BRM", "Customer usage — % returns filed digitally", C.deep], ["Service · BRM 14.1", "File a corporate income tax return", C.m], ["Channel", "Dhareeba portal · G2B taxpayer", C.m2], ["Info · IRM", "Tax return · taxpayer · assessment (1.02.02.03 Tax)", "#9C2C55"], ["App · ARM", "Dhareeba (SAP TRM) · payment gateway", C.navy], ["Infra · TRM", "Azure primary / DR landing zones", "#5E6573"]];
    var w = 140, gap = 14;
    ch.forEach(function (c, i) {
      var x = 14 + i * (w + gap);
      b += R(x, 50, w, 180, { fill: c[2], rx: 16, filter: d.shadow });
      b += T(x + 12, 76, c[0].toUpperCase(), { size: 9.5, mono: true, weight: 700, fill: C.gold2, anchor: "start", width: w - 16, ls: 1, lh: 12 });
      b += T(x + 12, 134, c[1], { size: 13.5, weight: 800, fill: "#fff", anchor: "start", width: w - 20, lh: 17 });
      if (i < 6) b += L(x + w + 1, 140, x + w + gap - 1, 140, { stroke: C.gold, sw: 2, arrow: d.arrow });
    });
    b += P("M 1060 236 C 1060 272, 60 272, 60 236", { stroke: C.teal, sw: 1.6, dash: "5 5", arrow: d.arrow });
    b += T(550, 302, "Impact analysis runs right-to-left: change a hosting region → which services, KPIs and goals are affected?", { size: 12.5, fill: C.slate, weight: 700 });
    b += tagLabel(14, 30, "One traceability thread through the GEA metamodel (GTA example)");
    return svg(W, H, b, "Traceability through the GEA metamodel");
  };

  /* ---------------- GEA EA Maturity Model (EAMM) 0–5 ---------------- */
  D["maturity-model"] = function (o) {
    o = o || {};
    var d = defs(), W = 1100, H = 440, b = d.html;
    var lv = [["0", "None", "No enterprise architecture"], ["1", "Initial", "Informal EA process underway"], ["2", "Under development", "Baseline & target identified, TRM & standards profile"], ["3", "Defined", "Reference models, catalogues, gap analysis, Architecture Board operational"], ["4", "Managed", "Measured EA, repository, governance of all IT investment"], ["5", "Optimized", "Continuous improvement, EA value in every IT decision"]];
    var cur = o.current === undefined ? 1 : o.current, tgt = o.target || 3;
    lv.forEach(function (l, i) {
      var x = 20 + i * 178, h = 110 + i * 44, y = 370 - h;
      var f = i <= cur ? C.m : (i <= tgt ? C.blush2 : "#F3F1F2"), light = i <= cur;
      b += R(x, y, 166, h, { fill: f, rx: 14, stroke: i === tgt ? C.gold : "none", sw: 2.5, dash: i === tgt ? "6 4" : "" });
      b += T(x + 16, y + 34, l[0], { size: 28, weight: 800, fill: light ? C.gold2 : C.m, anchor: "start", mono: true, nowrap: true });
      b += T(x + 16, y + 62, l[1], { size: 16, weight: 800, fill: light ? "#fff" : C.deep, anchor: "start", nowrap: true });
      b += T(x + 16, y + 84, l[2], { size: 11.5, fill: light ? "rgba(255,255,255,.85)" : C.slate, anchor: "start", width: 140, lh: 14 });
    });
    b += pill(20, 390, 200, 26, "Indicative GTA position", C.m, "#fff", 11.5);
    b += R(236, 390, 150, 26, { fill: "#fff", rx: 13, stroke: C.gold, dash: "6 4", sw: 2 }) + T(311, 403, "Next target", { size: 11.5, weight: 700, fill: C.deep, vcenter: true, nowrap: true });
    b += T(740, 404, "GEA EA Maturity Model (adapted from US DoC ACMM) — 7 characteristics scored per level", { size: 11.5, fill: C.slate, vcenter: true, nowrap: true });
    return svg(W, H, b, "GEA EA maturity model");
  };


  /* =================== C4 model (optional reading) =================== */
  var C4K = {
    person: { fill: C.ink, text: "#fff", meta: "Person" },
    system: { fill: C.m, text: "#fff", meta: "Software System" },
    ext: { fill: "#8C93A0", text: "#fff", meta: "Software System" },
    container: { fill: C.m2, text: "#fff", meta: "Container" },
    db: { fill: C.m2, text: "#fff", meta: "Container" },
    queue: { fill: C.m2, text: "#fff", meta: "Container" },
    component: { fill: "#D88AA6", text: C.ink, meta: "Component" },
    extc: { fill: "#B7BCC5", text: C.text, meta: "Container" }
  };
  function c4(x, y, w, h, kind, name, tech, desc, o) {
    o = o || {}; var k = C4K[kind] || C4K.system, b = "", cx = x + w / 2, fill = o.fill || k.fill;
    if (kind === "person") {
      b += '<circle cx="' + cx + '" cy="' + (y - 4) + '" r="17" fill="' + fill + '" stroke="#fff" stroke-width="2"/>';
      b += R(x, y + 8, w, h - 8, { rx: 22, fill: fill });
      y += 6;
    } else if (kind === "db") {
      var e = 9;
      b += '<path d="M' + x + " " + (y + e) + " A" + w / 2 + " " + e + " 0 0 1 " + (x + w) + " " + (y + e) + " V" + (y + h - e) + " A" + w / 2 + " " + e + " 0 0 1 " + x + " " + (y + h - e) + ' Z" fill="' + fill + '"/>';
      b += '<ellipse cx="' + cx + '" cy="' + (y + e) + '" rx="' + w / 2 + '" ry="' + e + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.4"/>';
      y += 8;
    } else if (kind === "queue") {
      var r = 12;
      b += '<path d="M' + (x + r) + " " + y + " H" + (x + w - r) + " A" + r + " " + h / 2 + " 0 0 1 " + (x + w - r) + " " + (y + h) + " H" + (x + r) + " A" + r + " " + h / 2 + " 0 0 1 " + (x + r) + " " + y + ' Z" fill="' + fill + '"/>';
      b += '<ellipse cx="' + (x + w - r) + '" cy="' + (y + h / 2) + '" rx="' + r + '" ry="' + h / 2 + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.4"/>';
    } else {
      b += R(x, y, w, h, { rx: 8, fill: fill, stroke: o.dash ? C.gold : null, dash: o.dash ? "6 4" : null, sw: 2 });
    }
    var tc = k.text, ty = y + 18;
    b += T(cx, ty, name, { size: o.ns || 13, weight: 800, fill: tc, width: w - 14, lh: 15 });
    var nl = wrap(name, Math.max(4, Math.floor((w - 14) / ((o.ns || 13) * 0.52)))).length;
    ty += (nl - 1) * 15 + 15;
    b += T(cx, ty, "[" + k.meta + (tech ? ": " + tech : "") + "]", { size: 10, fill: tc, opacity: 0.85, width: w - 10, lh: 12 });
    if (desc) b += T(cx, ty + 16, desc, { size: 10.5, fill: tc, width: w - 16, lh: 13, opacity: 0.95 });
    return b;
  }
  function rel(x1, y1, x2, y2, label, tech, o) {
    o = o || {};
    var b = L(x1, y1, x2, y2, { stroke: o.stroke || C.slate, sw: 1.4, dash: o.dash || "6 4", arrow: o.arrow });
    if (label) {
      var lx = o.lx === undefined ? (x1 + x2) / 2 : o.lx, ly = o.ly === undefined ? (y1 + y2) / 2 : o.ly, wd = o.lw || 150, an = o.anchor || "middle";
      var lines = wrap(label, Math.floor(wd / 5.6)), hh = lines.length * 13 + (tech ? 13 : 0) + 6;
      var bx = an === "middle" ? lx - wd / 2 : an === "start" ? lx - 3 : lx - wd + 3;
      if (!o.nobg) b += R(bx, ly - 11, wd, hh, { rx: 4, fill: "#fff", opacity: 0.92 });
      b += T(lx, ly, label, { size: 10.5, fill: o.color || C.ink, width: wd, lh: 13, weight: 700, anchor: an });
      if (tech) b += T(lx, ly + lines.length * 13, "[" + tech + "]", { size: 9.5, fill: C.slate, anchor: an, nowrap: true });
    }
    return b;
  }
  function boundary(x, y, w, h, name, kind) {
    return R(x, y, w, h, { rx: 10, fill: "none", stroke: C.slate, dash: "7 5", sw: 1.4 }) + T(x + 12, y + h - 22, name, { size: 12.5, weight: 800, fill: C.ink, anchor: "start", nowrap: true }) + T(x + 12, y + h - 9, "[" + kind + "]", { size: 10, fill: C.slate, anchor: "start", nowrap: true });
  }
  function node(x, y, w, h, name, tech) {
    return R(x, y, w, h, { rx: 10, fill: "rgba(255,255,255,.6)", stroke: C.ink, sw: 1.3 }) + T(x + 12, y + 18, name, { size: 12, weight: 800, fill: C.ink, anchor: "start", nowrap: true }) + (tech ? T(x + 12, y + 32, "[Deployment Node" + (tech ? ": " + tech : "") + "]", { size: 9.5, fill: C.slate, anchor: "start", nowrap: true }) : "");
  }
  function c4title(t, sub) { return T(24, 30, t, { size: 15, weight: 800, fill: C.ink, anchor: "start", nowrap: true }) + (sub ? T(24, 48, sub, { size: 11.5, fill: C.slate, anchor: "start", nowrap: true }) : ""); }
  function c4legend(x, y, kinds) {
    var b = "", cx = x;
    kinds.forEach(function (k) {
      var kk = C4K[k[0]];
      b += R(cx, y - 10, 14, 14, { rx: k[0] === "person" ? 7 : 3, fill: k[2] || kk.fill }) + T(cx + 20, y + 1, k[1], { size: 11, fill: C.slate, anchor: "start", nowrap: true });
      cx += 34 + k[1].length * 6.1;
    });
    b += L(cx, y - 3, cx + 34, y - 3, { stroke: C.slate, dash: "6 4", sw: 1.4 }) + T(cx + 40, y + 1, "Relationship (label = intent, [technology])", { size: 11, fill: C.slate, anchor: "start", nowrap: true });
    return b;
  }

  D["c4-zoom"] = function () {
    var W = 1000, H = 400, d = defs(), b = d.html;
    var lv = [
      ["Level 1", "System Context", "The system in scope, its users and the systems it depends on", "Everyone — business and IT", "Recommended"],
      ["Level 2", "Container", "Applications and data stores that make up the system, with technology choices", "Architects and developers", "Recommended"],
      ["Level 3", "Component", "Major building blocks inside one container and their responsibilities", "Developers of that container", "Only if it adds value"],
      ["Level 4", "Code", "Classes, tables or functions — usually generated from code by tools", "Developers", "Rarely; generate it"]
    ];
    lv.forEach(function (l, i) {
      var x = 20 + i * 245, y = 30, w = 220;
      b += R(x, y, w, 340, { fill: "#fff", stroke: C.line, rx: 14, filter: d.shadow });
      b += R(x, y, w, 6, { rx: 3, fill: i < 2 ? C.m : i === 2 ? C.rose : C.muted });
      b += tagLabel(x + 16, y + 30, l[0]);
      b += T(x + 16, y + 54, l[1], { size: 18, weight: 800, fill: C.ink, anchor: "start", nowrap: true });
      var gx = x + 20, gy = y + 74, gw = w - 40;
      b += R(gx, gy, gw, 120, { rx: 10, fill: C.blush });
      if (i === 0) { b += '<circle cx="' + (gx + 30) + '" cy="' + (gy + 34) + '" r="9" fill="' + C.ink + '"/>' + R(gx + 14, gy + 44, 32, 22, { rx: 8, fill: C.ink }) + R(gx + 64, gy + 40, 60, 40, { rx: 6, fill: C.m }) + R(gx + 140, gy + 14, 34, 28, { rx: 5, fill: C.muted }) + R(gx + 140, gy + 78, 34, 28, { rx: 5, fill: C.muted }) + L(gx + 46, gy + 56, gx + 64, gy + 58, { stroke: C.slate, sw: 1.2, dash: "3 3" }) + L(gx + 124, gy + 52, gx + 140, gy + 30, { stroke: C.slate, sw: 1.2, dash: "3 3" }) + L(gx + 124, gy + 68, gx + 140, gy + 90, { stroke: C.slate, sw: 1.2, dash: "3 3" }); }
      if (i === 1) { b += R(gx + 8, gy + 8, gw - 16, 104, { rx: 8, fill: "none", stroke: C.slate, dash: "4 3" }) + R(gx + 18, gy + 18, 60, 30, { rx: 5, fill: C.m2 }) + R(gx + 100, gy + 18, 60, 30, { rx: 5, fill: C.m2 }) + R(gx + 59, gy + 66, 60, 32, { rx: 5, fill: C.m2 }) + '<ellipse cx="' + (gx + 89) + '" cy="' + (gy + 70) + '" rx="30" ry="5" fill="none" stroke="rgba(255,255,255,.6)"/>'; }
      if (i === 2) { b += R(gx + 8, gy + 8, gw - 16, 104, { rx: 8, fill: "none", stroke: C.slate, dash: "4 3" }); [[18, 18], [100, 18], [18, 64], [100, 64]].forEach(function (p) { b += R(gx + p[0], gy + p[1], 62, 30, { rx: 5, fill: "#D88AA6" }); }); }
      if (i === 3) { [[14, 12], [96, 12], [14, 66], [96, 66]].forEach(function (p) { b += R(gx + p[0], gy + p[1], 70, 42, { rx: 2, fill: "#fff", stroke: C.slate, sw: 1 }) + L(gx + p[0], gy + p[1] + 13, gx + p[0] + 70, gy + p[1] + 13, { stroke: C.slate, sw: 1 }); }); }
      b += T(x + 16, y + 218, l[2], { size: 12.5, fill: C.text, anchor: "start", width: w - 32, lh: 16 });
      b += T(x + 16, y + 284, "Audience", { size: 10, mono: true, fill: C.muted, anchor: "start", nowrap: true, ls: 1.2 });
      b += T(x + 16, y + 300, l[3], { size: 12, weight: 700, fill: C.deep, anchor: "start", width: w - 32, lh: 15 });
      b += pill(x + 16, y + 314 - 2, Math.min(w - 32, l[4].length * 7 + 22), 22, l[4], i < 2 ? C.teal : i === 2 ? C.gold : C.muted, "#fff", 11);
      if (i < 3) b += T(x + w + 12, y + 130, "›", { size: 30, weight: 800, fill: C.gold2 });
    });
    b += T(500, 392, "Each level zooms into one element of the level above — like zooming a map from country to street.", { size: 11.5, fill: C.slate, nowrap: true });
    return svg(W, H, b, "C4 model zoom levels");
  };

  D["c4-context-gta"] = function () {
    var W = 1000, H = 560, d = defs(), b = d.html, A = d.arrowGray;
    b += c4title("System Context diagram — Dhareeba (illustrative)", "Level 1 · scope: the core tax system, its users and the systems it depends on");
    b += c4(130, 92, 190, 82, "person", "Taxpayer", "", "A business or individual registered with GTA");
    b += c4(405, 92, 190, 82, "person", "Tax agent", "", "Files and manages on behalf of taxpayers");
    b += c4(680, 92, 190, 82, "person", "GTA tax officer", "", "Reviews, assesses and audits");
    b += c4(380, 260, 240, 116, "system", "Dhareeba", "SAP TRM", "Registration, returns, assessments, payments and refunds for all taxes");
    b += c4(30, 262, 200, 92, "ext", "National Authentication (NAS)", "WoG", "Single sign-on for citizens and businesses");
    b += c4(30, 420, 200, 92, "ext", "Payment gateway", "", "Card and bank payments");
    b += c4(770, 262, 200, 92, "ext", "Tabadol", "NewGen", "International exchange (FATCA, CRS)");
    b += c4(770, 420, 200, 92, "ext", "Ministry of Interior", "via GDX", "Identity and residency data");
    b += c4(400, 440, 200, 80, "ext", "Email & SMS gateway", "", "Outbound notifications");
    b += rel(225, 178, 430, 258, "Registers, files and pays using", "HTTPS · portal & app", { arrow: A, lx: 300, ly: 214, lw: 150 });
    b += rel(500, 178, 500, 258, "Files on behalf of clients using", "HTTPS", { arrow: A, lx: 507, ly: 212, lw: 130, anchor: "start" });
    b += rel(775, 178, 570, 258, "Assesses and audits using", "", { arrow: A, lx: 712, ly: 214, lw: 140 });
    b += rel(380, 300, 232, 300, "Signs users in via", "federated SSO", { arrow: A, lx: 306, ly: 280, lw: 120 });
    b += rel(400, 376, 232, 452, "Collects payments via", "", { arrow: A, lx: 310, ly: 408, lw: 110 });
    b += rel(620, 300, 768, 300, "Planned: shares exchange data with", "", { arrow: A, stroke: C.gold, lx: 694, ly: 278, lw: 140, color: C.amber });
    b += rel(600, 376, 768, 452, "Exchanges data with", "GDX", { arrow: A, lx: 690, ly: 406, lw: 110 });
    b += rel(500, 376, 500, 438, "Sends notifications using", "", { arrow: A, lx: 507, ly: 410, lw: 130, anchor: "start" });
    b += c4legend(24, 545, [["person", "Person"], ["system", "System in scope"], ["ext", "External system"]]);
    return svg(W, H, b, "C4 system context diagram for Dhareeba");
  };

  D["c4-container-gta"] = function () {
    var W = 1000, H = 660, d = defs(), b = d.html, A = d.arrowGray;
    b += c4title("Container diagram — Tax Objections service (illustrative new GTA system)", "Level 2 · scope: one software system, the containers inside it and their technology choices");
    b += c4(215, 74, 180, 72, "person", "Taxpayer", "", "");
    b += c4(615, 74, 180, 72, "person", "Objections officer", "", "");
    b += boundary(190, 170, 640, 420, "Tax Objections service", "Software System");
    b += c4(215, 200, 180, 100, "container", "Taxpayer web app", "Single-page app", "Submit and track objections; upload evidence");
    b += c4(615, 200, 180, 100, "container", "Officer workbench", "Web app", "Triage, review and decide objections");
    b += c4(405, 330, 200, 100, "container", "Objections API", "REST API", "Business rules, case handling and integration");
    b += c4(215, 460, 180, 92, "db", "Objections database", "Relational DB", "Cases, decisions, audit trail");
    b += c4(425, 492, 160, 62, "queue", "objection-events", "Topic", "");
    b += c4(615, 460, 180, 92, "container", "Notification worker", "Background service", "Sends acknowledgements and decisions");
    b += c4(10, 210, 128, 84, "ext", "NAS", "WoG", "Sign-in");
    b += c4(846, 338, 148, 84, "ext", "Dhareeba", "SAP TRM", "");
    b += c4(850, 466, 140, 84, "ext", "Email & SMS gateway", "", "");
    b += rel(305, 150, 305, 198, "Submits objections using", "HTTPS", { arrow: A, lx: 312, ly: 168, lw: 140, anchor: "start" });
    b += rel(705, 150, 705, 198, "Reviews objections using", "HTTPS", { arrow: A, lx: 712, ly: 168, lw: 140, anchor: "start" });
    b += rel(215, 252, 140, 252, "Signs in via", "", { arrow: A, lx: 177, ly: 276, lw: 66 });
    b += rel(330, 302, 430, 330, "Calls", "JSON/HTTPS", { arrow: A, lx: 350, ly: 322, lw: 50 });
    b += rel(680, 302, 580, 330, "Calls", "JSON/HTTPS", { arrow: A, lx: 660, ly: 322, lw: 50 });
    b += rel(605, 380, 848, 380, "Reads assessment & deadline from", "API gateway", { arrow: A, lx: 728, ly: 398, lw: 150 });
    b += rel(430, 432, 330, 462, "Reads and writes", "SQL", { arrow: A, lx: 352, ly: 440, lw: 90 });
    b += rel(505, 432, 505, 490, "Publishes ObjectionSubmitted to", "", { arrow: A, lx: 513, ly: 448, lw: 96, anchor: "start" });
    b += rel(615, 523, 588, 523, "Consumes", "", { arrow: A, lx: 600, ly: 572, lw: 60 });
    b += rel(797, 506, 848, 506, "Sends via", "", { arrow: A, lx: 822, ly: 488, lw: 56 });
    b += c4legend(24, 640, [["person", "Person"], ["container", "Container"], ["ext", "External system"]]);
    return svg(W, H, b, "C4 container diagram");
  };

  D["c4-component-gta"] = function () {
    var W = 1000, H = 680, d = defs(), b = d.html, A = d.arrowGray;
    b += c4title("Component diagram — Objections API (illustrative)", "Level 3 · scope: one container; components run in the same process and are not separately deployable");
    b += c4(200, 66, 190, 70, "extc", "Taxpayer web app", "Single-page app", "");
    b += c4(610, 66, 190, 70, "extc", "Officer workbench", "Web app", "");
    b += boundary(110, 160, 780, 380, "Objections API", "Container: REST API");
    b += c4(390, 186, 220, 82, "component", "Objections controller", "REST controller", "Validates requests, maps DTOs");
    b += c4(125, 306, 205, 82, "component", "Eligibility rules", "Rules", "Deadlines, grounds, standing");
    b += c4(395, 306, 210, 82, "component", "Case service", "Domain service", "Opens, assigns and decides cases");
    b += c4(670, 306, 205, 82, "component", "Dhareeba adapter", "Anti-corruption layer", "Translates SAP TRM data to case terms");
    b += c4(265, 420, 210, 76, "component", "Case repository", "Data access", "");
    b += c4(525, 420, 210, 76, "component", "Event publisher", "Messaging", "");
    b += c4(270, 580, 200, 76, "db", "Objections database", "Relational DB", "");
    b += c4(540, 590, 180, 60, "queue", "objection-events", "Topic", "");
    b += c4(780, 580, 200, 76, "ext", "Dhareeba", "SAP TRM", "");
    b += rel(295, 138, 440, 184, "Calls", "JSON/HTTPS", { arrow: A, lx: 350, ly: 160, lw: 54 });
    b += rel(705, 138, 560, 184, "Calls", "JSON/HTTPS", { arrow: A, lx: 650, ly: 160, lw: 54 });
    b += rel(500, 270, 500, 304, "Uses", "", { arrow: A, lx: 507, ly: 290, lw: 40, anchor: "start" });
    b += rel(395, 347, 332, 347, "Checks", "", { arrow: A, lx: 363, ly: 333, lw: 50 });
    b += rel(605, 347, 668, 347, "Gets data via", "", { arrow: A, lx: 636, ly: 326, lw: 58 });
    b += rel(450, 390, 380, 418, "Persists via", "", { arrow: A, lx: 400, ly: 405, lw: 60 });
    b += rel(550, 390, 620, 418, "Raises events via", "", { arrow: A, lx: 610, ly: 403, lw: 80 });
    b += rel(370, 498, 370, 578, "Reads/writes", "SQL", { arrow: A, lx: 378, ly: 556, lw: 70, anchor: "start" });
    b += rel(630, 498, 630, 588, "Publishes to", "", { arrow: A, lx: 638, ly: 560, lw: 70, anchor: "start" });
    b += rel(800, 390, 860, 578, "Reads from", "API gateway", { arrow: A, lx: 862, ly: 470, lw: 70, anchor: "start" });
    return svg(W, H, b, "C4 component diagram");
  };

  D["c4-dynamic-gta"] = function () {
    var W = 1000, H = 440, d = defs(), b = d.html, A = d.arrowGray;
    b += c4title("Dynamic diagram — submitting an objection (illustrative)", "Numbered interactions for one use case; same elements as the static diagrams");
    b += c4(20, 186, 140, 72, "person", "Taxpayer", "", "");
    b += c4(210, 182, 150, 84, "container", "Taxpayer web app", "SPA", "");
    b += c4(430, 182, 160, 84, "container", "Objections API", "REST API", "");
    b += c4(660, 68, 160, 78, "ext", "Dhareeba", "SAP TRM", "");
    b += c4(430, 320, 160, 84, "db", "Objections database", "Relational DB", "");
    b += c4(665, 196, 150, 58, "queue", "objection-events", "Topic", "");
    b += c4(660, 320, 160, 84, "container", "Notification worker", "Service", "");
    b += c4(860, 320, 130, 84, "ext", "Email & SMS gateway", "", "");
    var steps = [
      [160, 226, 208, 226, "1", "Submits objection form", 184, 268],
      [362, 226, 428, 226, "2", "POST /objections", 395, 206],
      [590, 196, 660, 120, "3", "Checks assessment & deadline", 592, 148],
      [510, 268, 510, 318, "4", "Stores case", 518, 296],
      [592, 226, 663, 226, "5", "Publishes ObjectionSubmitted", 628, 270],
      [740, 318, 740, 256, "6", "Consumes event", 748, 290],
      [822, 362, 858, 362, "7", "Sends acknowledgement", 840, 420]
    ];
    steps.forEach(function (s) {
      b += L(s[0], s[1], s[2], s[3], { stroke: C.slate, sw: 1.4, dash: "6 4", arrow: A });
      var mx = (s[0] + s[2]) / 2, my = (s[1] + s[3]) / 2;
      b += '<circle cx="' + mx + '" cy="' + my + '" r="10" fill="' + C.gold + '"/>' + T(mx, my + 4, s[4], { size: 11, weight: 800, fill: "#fff" });
      b += T(s[6], s[7], s[5], { size: 10.5, weight: 700, fill: C.ink, width: 120, lh: 13, anchor: s[0] === s[2] ? "start" : "middle" });
    });
    return svg(W, H, b, "C4 dynamic diagram");
  };

  D["c4-deployment-gta"] = function () {
    var W = 1000, H = 560, d = defs(), b = d.html, A = d.arrowGray;
    b += c4title("Deployment diagram — Tax Objections service, production (illustrative)", "Container instances mapped to deployment nodes; hosting pattern follows GTA's baseline (Azure primary + DR region)");
    b += node(20, 74, 210, 140, "Taxpayer device", "Web browser");
    b += c4(40, 120, 170, 76, "container", "Taxpayer web app", "SPA", "");
    b += node(20, 250, 210, 140, "GTA building", "Workstation");
    b += c4(40, 296, 170, 76, "container", "Officer workbench", "Web app", "");
    b += node(260, 66, 490, 470, "Microsoft Azure — primary region", "Cloud region");
    b += node(280, 112, 220, 230, "Container platform", "Managed runtime");
    b += c4(296, 158, 188, 76, "container", "Objections API", "REST API", "");
    b += c4(296, 250, 188, 76, "container", "Notification worker", "Service", "");
    b += node(520, 112, 214, 120, "Managed database", "PaaS");
    b += c4(540, 152, 174, 66, "db", "Objections database", "", "");
    b += node(520, 246, 214, 100, "Managed message broker", "PaaS");
    b += c4(545, 290, 164, 46, "queue", "objection-events", "Topic", "", { ns: 12 });
    b += node(280, 372, 454, 146, "SAP landscape", "IaaS");
    b += c4(390, 420, 230, 80, "ext", "Dhareeba", "SAP TRM", "Software system instance");
    b += node(780, 112, 200, 160, "Microsoft Azure — DR region", "Cloud region");
    b += c4(800, 170, 160, 70, "db", "Database replica", "", "");
    b += rel(210, 160, 294, 192, "HTTPS", "Internet", { arrow: A, lx: 252, ly: 150, lw: 60 });
    b += rel(210, 336, 294, 214, "HTTPS", "Gov. Network", { arrow: A, lx: 246, ly: 268, lw: 72 });
    b += rel(484, 196, 538, 186, "", "", { arrow: A });
    b += rel(484, 288, 543, 312, "", "", { arrow: A });
    b += rel(390, 236, 470, 418, "API gateway", "", { arrow: A, lx: 430, ly: 352, lw: 80, nobg: false });
    b += rel(716, 186, 798, 206, "Replicates to", "async", { arrow: A, lx: 757, ly: 166, lw: 70 });
    b += c4legend(24, 548, [["container", "Container instance"], ["ext", "Software system instance"]]);
    return svg(W, H, b, "C4 deployment diagram");
  };

  window.EA_DIAGRAMS = {
    list: Object.keys(D),
    render: function (id, opts) { return D[id] ? D[id](opts || {}) : ""; },
    C: C
  };
})();
