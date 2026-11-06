/* =====================================================================
   EA Awareness Hub — small SVG chart kit (no dependencies)
   Palette validated (4 categorical slots, CVD-safe with labels):
   #A8204F maroon · #138A72 teal · #B8861B ochre · #2F6DB8 blue
   ===================================================================== */
(function () {
  "use strict";
  var CAT = ["#A8204F", "#138A72", "#B8861B", "#2F6DB8"];
  var SEQ = ["#FBF2F5", "#F3D3DE", "#E3A3B8", "#CC6C8E", "#A8204F", "#6E0F33"];
  var INK = "#16181D", SLATE = "#5E6573", MUTED = "#8C93A0", GRID = "#EEEAEC", F = "Tajawal,Segoe UI,Arial,sans-serif";
  var tip;
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function getTip() { if (!tip) { tip = document.createElement("div"); tip.className = "tip"; document.body.appendChild(tip); } return tip; }
  function showTip(e, html) { var t = getTip(); t.innerHTML = html; t.classList.add("on"); var x = e.clientX + 14, y = e.clientY + 14; if (x + 270 > innerWidth) x = e.clientX - 270; t.style.left = x + "px"; t.style.top = y + "px"; }
  function hideTip() { if (tip) tip.classList.remove("on"); }
  function nice(max) { if (max <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log10(max))); var n = max / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
  function fmt(n, d) { return (Math.round(n * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toLocaleString("en-US"); }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (o.size || 11.5) + '" fill="' + (o.fill || MUTED) + '" text-anchor="' + (o.anchor || "middle") + '" font-weight="' + (o.weight || 400) + '">' + esc(s) + "</text>"; }
  function bind(el, sel, fn) { Array.prototype.forEach.call(el.querySelectorAll(sel), function (n) { n.addEventListener("mousemove", function (e) { showTip(e, fn(n)); }); n.addEventListener("mouseleave", hideTip); }); }

  /* Line chart with crosshair. series: [{name, values[], color}] labels: [] */
  function line(el, labels, series, o) {
    o = o || {};
    var W = 760, H = o.height || 260, ml = 40, mr = 16, mt = 14, mb = 30, iw = W - ml - mr, ih = H - mt - mb;
    var max = nice(Math.max.apply(null, series.map(function (s) { return Math.max.apply(null, s.values.concat([1])); })));
    var n = labels.length, x = function (i) { return ml + (n <= 1 ? iw / 2 : i * iw / (n - 1)); }, y = function (v) { return mt + ih - v / max * ih; };
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.label || "line chart") + '">';
    var nT = max % 4 === 0 || max < 4 ? 4 : 5; for (var g = 0; g <= nT; g++) { var gv = max * g / nT; s += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(gv) + '" y2="' + y(gv) + '" stroke="' + GRID + '"/>' + t(ml - 8, y(gv) + 4, fmt(gv), { anchor: "end" }); }
    var step = Math.ceil(n / 8);
    labels.forEach(function (l, i) { if (i % step === 0 || (i === n - 1 && (n - 1) % step > step / 2)) s += t(x(i), H - 8, o.xfmt ? o.xfmt(l) : l); });
    series.forEach(function (se, k) {
      var c = se.color || CAT[k];
      var pts = se.values.map(function (v, i) { return x(i).toFixed(1) + "," + y(v).toFixed(1); });
      if (o.area && k === 0) s += '<path d="M' + x(0) + "," + y(0) + " L" + pts.join(" L") + " L" + x(n - 1) + "," + y(0) + ' Z" fill="' + c + '" opacity=".09"/>';
      s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + c + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"' + (se.dash ? ' stroke-dasharray="5 4"' : "") + "/>";
      var li = n - 1; s += '<circle cx="' + x(li) + '" cy="' + y(se.values[li]) + '" r="4" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
    });
    s += '<line class="xh" x1="0" x2="0" y1="' + mt + '" y2="' + (mt + ih) + '" stroke="' + SLATE + '" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>';
    s += '<rect class="hit" x="' + ml + '" y="' + mt + '" width="' + iw + '" height="' + ih + '" fill="transparent"/></svg>';
    el.innerHTML = s;
    var svg = el.querySelector("svg"), hit = el.querySelector(".hit"), xh = el.querySelector(".xh");
    hit.addEventListener("mousemove", function (e) {
      var r = svg.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * W;
      var i = Math.max(0, Math.min(n - 1, Math.round((px - ml) / iw * (n - 1))));
      xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("opacity", 1);
      showTip(e, "<b>" + esc(o.xfmt ? o.xfmt(labels[i], true) : labels[i]) + "</b>" + series.map(function (se, k) { return '<span style="color:' + (se.color || CAT[k]) + '">●</span> ' + esc(se.name) + ": " + fmt(se.values[i]); }).join("<br>"));
    });
    hit.addEventListener("mouseleave", function () { xh.setAttribute("opacity", 0); hideTip(); });
  }

  /* Horizontal bars. rows: [{label, value, note}] */
  function hbars(el, rows, o) {
    o = o || {};
    var W = 760, bh = o.barH || 22, gap = o.gap || 12, ml = o.ml || 210, mr = 60, H = rows.length * (bh + gap) + 10;
    var max = o.max || nice(Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1])));
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.label || "bar chart") + '">';
    rows.forEach(function (r, i) {
      var y = 5 + i * (bh + gap), w = Math.max(2, r.value / max * (W - ml - mr)), c = r.color || o.color || CAT[0];
      s += t(ml - 12, y + bh / 2 + 4, r.label, { anchor: "end", fill: INK, size: 12.5, weight: 700 });
      s += '<rect x="' + ml + '" y="' + y + '" width="' + (W - ml - mr) + '" height="' + bh + '" rx="4" fill="#F6F3F4"/>';
      s += '<rect class="hb" data-i="' + i + '" x="' + ml + '" y="' + y + '" width="' + w + '" height="' + bh + '" rx="4" fill="' + c + '"/>';
      s += t(ml + w + 8, y + bh / 2 + 4, (o.vfmt ? o.vfmt(r.value) : fmt(r.value)), { anchor: "start", fill: SLATE, size: 12, weight: 700 });
    });
    el.innerHTML = s + "</svg>";
    bind(el, ".hb", function (n) { var r = rows[+n.getAttribute("data-i")]; return "<b>" + esc(r.label) + "</b>" + (o.vfmt ? o.vfmt(r.value) : fmt(r.value)) + (r.note ? "<br>" + esc(r.note) : ""); });
  }

  /* Vertical columns. rows: [{label, value}] */
  function columns(el, rows, o) {
    o = o || {};
    var W = o.width || 760, H = o.height || 240, ml = 40, mr = 10, mt = 20, mb = 30, iw = W - ml - mr, ih = H - mt - mb;
    var max = nice(Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1])));
    var bw = iw / rows.length, s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.label || "column chart") + '">';
    var nT = max % 4 === 0 || max < 4 ? 4 : 5; for (var g = 0; g <= nT; g++) { var gy = mt + ih - ih * g / nT; s += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + gy + '" y2="' + gy + '" stroke="' + GRID + '"/>' + t(ml - 8, gy + 4, fmt(max * g / nT), { anchor: "end" }); }
    rows.forEach(function (r, i) {
      var h = r.value / max * ih, x = ml + i * bw + bw * 0.18, w = bw * 0.64, c = (o.colorFn ? o.colorFn(r, i) : (o.color || CAT[0]));
      s += '<path class="cb" data-i="' + i + '" d="M' + x + "," + (mt + ih) + " v" + (-Math.max(0, h - 4)) + " q0,-4 4,-4 h" + (w - 8) + " q4,0 4,4 v" + Math.max(0, h - 4) + ' z" fill="' + c + '"/>';
      s += t(x + w / 2, H - 9, r.label, { fill: SLATE, size: 12 });
      if (r.value) s += t(x + w / 2, mt + ih - h - 6, fmt(r.value), { fill: INK, size: 12, weight: 700 });
    });
    el.innerHTML = s + "</svg>";
    bind(el, ".cb", function (n) { var r = rows[+n.getAttribute("data-i")]; return "<b>" + esc(o.tipLabel ? o.tipLabel(r) : r.label) + "</b>" + fmt(r.value) + (o.unit ? " " + o.unit : ""); });
  }

  /* Heatmap 7 x 24 */
  function heatmap(el, m, o) {
    o = o || {};
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], W = 760, ml = 44, mt = 6, cw = (W - ml - 6) / 24, ch = 24, H = mt + 7 * (ch + 3) + 26;
    var max = 1; m.forEach(function (r) { r.forEach(function (v) { if (v > max) max = v; }); });
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Login heat map by weekday and hour">';
    m.forEach(function (r, d) {
      s += t(ml - 10, mt + d * (ch + 3) + ch / 2 + 4, days[d], { anchor: "end", fill: SLATE, size: 12, weight: 700 });
      r.forEach(function (v, h) {
        var k = v === 0 ? 0 : Math.min(SEQ.length - 1, 1 + Math.floor(v / max * (SEQ.length - 1.01)));
        s += '<rect class="hm" data-d="' + d + '" data-h="' + h + '" x="' + (ml + h * cw + 1) + '" y="' + (mt + d * (ch + 3)) + '" width="' + (cw - 2) + '" height="' + ch + '" rx="4" fill="' + (v === 0 ? "#F6F3F4" : SEQ[k]) + '"/>';
      });
    });
    for (var h = 0; h < 24; h += 3) s += t(ml + h * cw + cw / 2, H - 6, (h < 10 ? "0" : "") + h + ":00", { size: 11 });
    el.innerHTML = s + "</svg>";
    bind(el, ".hm", function (n) { var d = +n.getAttribute("data-d"), hh = +n.getAttribute("data-h"); return "<b>" + days[d] + " " + (hh < 10 ? "0" : "") + hh + ":00–" + (hh < 9 ? "0" : "") + (hh + 1) + ":00</b>" + fmt(m[d][hh]) + " logins"; });
  }

  /* Funnel as stepped horizontal bars with conversion % */
  function funnel(el, steps) {
    var W = 480, bh = 40, gap = 10, H = steps.length * (bh + gap) + 4, max = steps[0].value || 1;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Completion funnel">';
    steps.forEach(function (st, i) {
      var w = Math.max(6, st.value / max * (W - 186)), x = 126 + (W - 186 - w) / 2, y = i * (bh + gap);
      var shade = ["#6E0F33", "#89143C", "#A8204F", "#C14A72", "#138A72"][i] || CAT[0];
      s += t(118, y + bh / 2 + 4, st.label, { anchor: "end", fill: INK, size: 13, weight: 700 });
      s += '<rect class="fn" data-i="' + i + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + bh + '" rx="8" fill="' + shade + '"/>';
      s += t(x + w / 2, y + bh / 2 + 5, fmt(st.value), { fill: "#fff", size: 14, weight: 800 });
      s += t(W - 52, y + bh / 2 + 5, fmt(st.value / max * 100) + "%", { anchor: "start", fill: SLATE, size: 13, weight: 700 });
    });
    el.innerHTML = s + "</svg>";
    bind(el, ".fn", function (n) { var i = +n.getAttribute("data-i"), st = steps[i]; return "<b>" + esc(st.label) + "</b>" + fmt(st.value) + " people · " + fmt(st.value / max * 100) + "% of enrolled" + (i ? "<br>" + fmt(steps[i - 1].value ? st.value / steps[i - 1].value * 100 : 0) + "% from previous step" : ""); });
  }

  /* Progress ring */
  function ring(pct, color, label) {
    var r = 70, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, pct));
    return '<svg class="ring" viewBox="0 0 170 170"><circle cx="85" cy="85" r="' + r + '" fill="none" stroke="#F1ECEE" stroke-width="14"/>' +
      '<circle cx="85" cy="85" r="' + r + '" fill="none" stroke="' + (color || CAT[0]) + '" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + (c * v / 100) + " " + c + '" transform="rotate(-90 85 85)"/>' +
      '<text x="85" y="92" text-anchor="middle" font-family="' + F + '" font-size="34" font-weight="800" fill="' + INK + '">' + Math.round(v) + '%</text>' +
      (label ? '<text x="85" y="114" text-anchor="middle" font-family="' + F + '" font-size="12" fill="' + MUTED + '">' + esc(label) + "</text>" : "") + "</svg>";
  }

  window.EA_CHARTS = { line: line, hbars: hbars, columns: columns, heatmap: heatmap, funnel: funnel, ring: ring, CAT: CAT, SEQ: SEQ, fmt: fmt };
})();
