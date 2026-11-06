'use strict';
/** RFC 4180 CSV with spreadsheet formula-injection protection and a UTF-8 BOM (Excel + Arabic). */
function cell(v) {
  if (v === null || v === undefined) return '';
  let s = v instanceof Date ? v.toISOString() : typeof v === 'object' ? JSON.stringify(v) : String(v);
  if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(columns, rows) {
  const lines = [columns.map(cell).join(',')];
  for (const r of rows) lines.push(columns.map((c) => cell(r[c])).join(','));
  return '﻿' + lines.join('\r\n') + '\r\n';
}
module.exports = { toCsv };
