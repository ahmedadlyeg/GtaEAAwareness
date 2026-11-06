'use strict';
/** Time-zone helpers (Intl based; Asia/Qatar is UTC+3 without DST). */

const fmtCache = new Map();
function parts(date, tz) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      weekday: 'short',
    });
    fmtCache.set(tz, f);
  }
  const o = {};
  for (const p of f.formatToParts(date)) o[p.type] = p.value;
  return o;
}
const WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** { date: 'YYYY-MM-DD', hour: 0-23, weekday: 0 (Sun) - 6 (Sat) } in tz. */
function localParts(iso, tz) {
  const p = parts(new Date(iso), tz);
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) % 24, weekday: WD[p.weekday] };
}

/** Offset (ms) of tz from UTC at the given instant. */
function tzOffsetMs(date, tz) {
  const p = parts(date, tz);
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** UTC instant of local midnight of a 'YYYY-MM-DD' date in tz. */
function startOfLocalDay(ymd, tz) {
  const [y, m, d] = ymd.split('-').map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d));
  return new Date(guess.getTime() - tzOffsetMs(guess, tz));
}

function addDays(ymd, n) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Local 'YYYY-MM-DD' for an instant. */
function localDate(date, tz) {
  return localParts(date, tz).date;
}

module.exports = { localParts, startOfLocalDay, addDays, localDate, tzOffsetMs };
