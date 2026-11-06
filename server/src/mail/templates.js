'use strict';
/**
 * E-mail templates (HTML + plain text), GTA maroon #89143C, bilingual subject lines.
 * Table-based inline-styled HTML for Outlook/Exchange compatibility.
 */
const MAROON = '#89143C';
const ORG_EN = 'General Tax Authority';
const ORG_AR = 'الهيئة العامة للضرائب';
const APP_EN = 'EA Awareness Hub';
const APP_AR = 'منصة التوعية بالبنية المؤسسية';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function fmtLocal(iso, tz) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso)) + ' (Doha)';
  } catch (_) {
    return iso;
  }
}

function layout({ preheader, titleEn, titleAr, bodyHtml, baseUrl }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titleEn)}</title></head>
<body style="margin:0;padding:0;background:#f4f1ee;font-family:Segoe UI,Arial,sans-serif;color:#2b2b2b;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e6dfda;">
  <tr><td style="background:${MAROON};padding:20px 28px;color:#ffffff;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:16px;font-weight:600;">${ORG_EN}<br><span style="font-size:13px;font-weight:400;opacity:.85;">${APP_EN}</span></td>
      <td align="right" dir="rtl" style="font-size:16px;font-weight:600;">${ORG_AR}<br><span style="font-size:13px;font-weight:400;opacity:.85;">${APP_AR}</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:28px;">
    <h1 style="margin:0 0 4px;font-size:20px;color:${MAROON};">${esc(titleEn)}</h1>
    <p dir="rtl" style="margin:0 0 20px;font-size:16px;color:${MAROON};text-align:right;">${esc(titleAr)}</p>
    ${bodyHtml}
  </td></tr>
  <tr><td style="background:#faf7f5;padding:16px 28px;font-size:12px;color:#6b6b6b;border-top:1px solid #eee;">
    This is an automated message from the ${APP_EN} (<a href="${esc(baseUrl)}" style="color:${MAROON};">${esc(baseUrl)}</a>). Do not reply.
    If you did not request it, contact the GTA IT Service Desk.<br>
    <span dir="rtl">هذه رسالة آلية، يرجى عدم الرد عليها. إذا لم تطلبها، يرجى التواصل مع مكتب خدمة تقنية المعلومات.</span>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function codeBlock(code) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;"><tr>
<td style="font-family:Consolas,Menlo,monospace;font-size:32px;letter-spacing:8px;font-weight:700;color:${MAROON};background:#f9eef2;border:1px dashed ${MAROON};border-radius:6px;padding:12px 24px;">${esc(code)}</td>
</tr></table>`;
}

const templates = {
  signup_otp(p, ctx) {
    const subject = `رمز إنشاء الحساب | Your EA Awareness Hub sign-up code`;
    const html = layout({
      preheader: `Your sign-up code expires in ${p.expiresMin} minutes.`,
      titleEn: 'Confirm your GTA email',
      titleAr: 'تأكيد البريد الإلكتروني',
      baseUrl: ctx.baseUrl,
      bodyHtml: `<p style="margin:0 0 8px;">Use this one-time code to confirm your GTA email and create your password for the ${APP_EN}:</p>
${codeBlock(p.code)}
<p style="margin:0 0 8px;">The code expires in <strong>${esc(p.expiresMin)} minutes</strong> and can be used once. After this you will sign in with your GTA email and the password you choose. Never share the code with anyone, including IT staff.</p>
<p dir="rtl" style="margin:16px 0 0;text-align:right;">استخدم الرمز أعلاه لتأكيد بريدك الإلكتروني وإنشاء كلمة المرور. صلاحية الرمز ${esc(p.expiresMin)} دقائق ويُستخدم مرة واحدة فقط. لا تشارك الرمز مع أي شخص.</p>`,
    });
    const text = `${ORG_EN} - ${APP_EN}\n\nYour sign-up code: ${p.code}\nIt expires in ${p.expiresMin} minutes and can be used once. Afterwards sign in with your GTA email and your password. Never share it.\n\nرمز إنشاء الحساب: ${p.code}\nصلاحية الرمز ${p.expiresMin} دقائق.\n`;
    return { subject, html, text };
  },

  reset_otp(p, ctx) {
    const subject = `رمز إعادة تعيين كلمة المرور | Reset your EA Awareness Hub password`;
    const html = layout({
      preheader: `Your password reset code expires in ${p.expiresMin} minutes.`,
      titleEn: 'Reset your password',
      titleAr: 'إعادة تعيين كلمة المرور',
      baseUrl: ctx.baseUrl,
      bodyHtml: `<p style="margin:0 0 8px;">Someone asked to reset the password for your ${APP_EN} account. Use this one-time code to choose a new password:</p>
${codeBlock(p.code)}
<p style="margin:0 0 8px;">The code expires in <strong>${esc(p.expiresMin)} minutes</strong>. If you did not ask for a reset, ignore this e-mail — your password has not changed — and inform the EA team.</p>
<p dir="rtl" style="margin:16px 0 0;text-align:right;">استخدم هذا الرمز لاختيار كلمة مرور جديدة. صلاحية الرمز ${esc(p.expiresMin)} دقائق. إذا لم تطلب ذلك فتجاهل هذه الرسالة.</p>`,
    });
    const text = `${ORG_EN} - ${APP_EN}\n\nYour password reset code: ${p.code}\nIt expires in ${p.expiresMin} minutes. If you did not ask for a reset, ignore this e-mail.\n\nرمز إعادة تعيين كلمة المرور: ${p.code}\n`;
    return { subject, html, text };
  },

  login_otp(p, ctx) {
    const subject = `رمز تسجيل الدخول | Your EA Awareness Hub sign-in code`;
    const html = layout({
      preheader: `Your sign-in code expires in ${p.expiresMin} minutes.`,
      titleEn: 'Sign-in code',
      titleAr: 'رمز تسجيل الدخول',
      baseUrl: ctx.baseUrl,
      bodyHtml: `<p style="margin:0 0 8px;">Use this one-time code to sign in to the ${APP_EN}:</p>
${codeBlock(p.code)}
<p style="margin:0 0 8px;">The code expires in <strong>${esc(p.expiresMin)} minutes</strong> and can be used once. Never share it with anyone, including IT staff.</p>
<p dir="rtl" style="margin:16px 0 0;text-align:right;">استخدم الرمز أعلاه لتسجيل الدخول. صلاحية الرمز ${esc(p.expiresMin)} دقائق ويُستخدم مرة واحدة فقط. لا تشارك الرمز مع أي شخص.</p>`,
    });
    const text = `${ORG_EN} - ${APP_EN}\n\nYour sign-in code: ${p.code}\nIt expires in ${p.expiresMin} minutes and can be used once. Never share it.\n\nرمز تسجيل الدخول: ${p.code}\nصلاحية الرمز ${p.expiresMin} دقائق.\n`;
    return { subject, html, text };
  },

  signoff_otp(p, ctx) {
    const subject = `رمز تأكيد الإقرار | Confirm your EA acknowledgement`;
    const html = layout({
      preheader: `Confirmation code for acknowledgement version ${p.statementVersion}.`,
      titleEn: 'Confirm your acknowledgement',
      titleAr: 'تأكيد الإقرار',
      baseUrl: ctx.baseUrl,
      bodyHtml: `<p style="margin:0 0 8px;">You are signing the EA awareness acknowledgement <strong>version ${esc(p.statementVersion)}</strong>. Enter this code to confirm your signature:</p>
${codeBlock(p.code)}
<p style="margin:0 0 8px;">The code expires in <strong>${esc(p.expiresMin)} minutes</strong>. If you did not start a sign-off, ignore this e-mail and inform the EA team.</p>
<p dir="rtl" style="margin:16px 0 0;text-align:right;">أدخل هذا الرمز لتأكيد توقيعك على إقرار التوعية بالبنية المؤسسية (الإصدار ${esc(p.statementVersion)}). صلاحية الرمز ${esc(p.expiresMin)} دقائق.</p>`,
    });
    const text = `${ORG_EN} - ${APP_EN}\n\nConfirmation code for acknowledgement version ${p.statementVersion}: ${p.code}\nIt expires in ${p.expiresMin} minutes.\n\nرمز تأكيد الإقرار: ${p.code}\n`;
    return { subject, html, text };
  },

  signoff_receipt(p, ctx) {
    const when = fmtLocal(p.signedAt, ctx.timezone);
    const subject = `إيصال الإقرار ${p.receiptId} | EA acknowledgement receipt`;
    const row = (k, v) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap;">${esc(k)}</td><td style="padding:6px 0;font-weight:600;">${esc(v)}</td></tr>`;
    const html = layout({
      preheader: `Receipt ${p.receiptId} - your EA acknowledgement is recorded.`,
      titleEn: 'Acknowledgement recorded',
      titleAr: 'تم تسجيل الإقرار',
      baseUrl: ctx.baseUrl,
      bodyHtml: `<p style="margin:0 0 12px;">Dear ${esc(p.displayName)}, thank you. Your Enterprise Architecture awareness acknowledgement has been recorded.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;font-size:14px;border-left:4px solid ${MAROON};padding-left:12px;">
${row('Receipt ID', p.receiptId)}
${row('Statement', `${p.statementTitle || 'EA Awareness Acknowledgement'} (v${p.statementVersion})`)}
${row('Signed at', when)}
${row('Signed at (UTC)', p.signedAt)}
${row('Statement SHA-256', p.statementSha256)}
</table>
<p style="margin:0 0 8px;font-size:13px;color:#6b6b6b;">Keep this e-mail for your records. The EA team can verify the receipt ID against the audit log.</p>
<p dir="rtl" style="margin:16px 0 0;text-align:right;">شكراً لك. تم تسجيل إقرارك بالاطلاع على برنامج التوعية بالبنية المؤسسية. رقم الإيصال: ${esc(p.receiptId)}</p>`,
    });
    const text = `${ORG_EN} - ${APP_EN}\n\nDear ${p.displayName},\nYour EA awareness acknowledgement has been recorded.\n\nReceipt ID: ${p.receiptId}\nStatement version: ${p.statementVersion}\nSigned at: ${when} / ${p.signedAt} UTC\nStatement SHA-256: ${p.statementSha256}\n\nتم تسجيل الإقرار. رقم الإيصال: ${p.receiptId}\n`;
    return { subject, html, text };
  },

  certificate_issued(p, ctx) {
    const when = fmtLocal(p.issuedAt, ctx.timezone);
    const title = p.title || 'Enterprise Architecture Foundation';
    const subject = `شهادة إتمام البنية المؤسسية | Your ${title} certificate (${p.certificateId})`;
    const verifyUrl = `${ctx.baseUrl}${p.verifyPath || `/api/v1/cert/verify/${p.certificateId}`}`;
    const row = (k, v) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;white-space:nowrap;">${esc(k)}</td><td style="padding:6px 0;font-weight:600;">${esc(v)}</td></tr>`;
    const html = layout({
      preheader: `Congratulations - you are certified in ${title}.`,
      titleEn: 'Certificate of completion',
      titleAr: 'شهادة إتمام',
      baseUrl: ctx.baseUrl,
      bodyHtml: `<p style="margin:0 0 12px;">Dear ${esc(p.displayName)}, congratulations. You have passed the certification exam and the Information Technology Department has granted you the <strong>${esc(title)}</strong> certificate of completion.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;font-size:14px;border-left:4px solid ${MAROON};padding-left:12px;">
${row('Certificate ID', p.certificateId)}
${row('Track', title)}
${row('Exam score', `${p.scorePct}%`)}
${row('Issued', when)}
</table>
<p style="margin:0 0 8px;">View and print your certificate from the Certification page of the ${APP_EN}. Anyone can confirm it is genuine at <a href="${esc(verifyUrl)}" style="color:${MAROON};">${esc(verifyUrl)}</a>.</p>
<p dir="rtl" style="margin:16px 0 0;text-align:right;">تهانينا! لقد اجتزت اختبار الشهادة بنجاح، ومنحتك إدارة تقنية المعلومات شهادة إتمام مسار أساسيات البنية المؤسسية. رقم الشهادة: ${esc(p.certificateId)}</p>`,
    });
    const text = `${ORG_EN} - ${APP_EN}\n\nDear ${p.displayName},\nCongratulations - you are certified in ${title}.\n\nCertificate ID: ${p.certificateId}\nExam score: ${p.scorePct}%\nIssued: ${when}\nVerify: ${verifyUrl}\n\nتهانينا! رقم الشهادة: ${p.certificateId}\n`;
    return { subject, html, text };
  },
};

function render(template, payload, ctx) {
  const fn = templates[template];
  if (!fn) throw new Error(`Unknown e-mail template ${template}`);
  return fn(payload, ctx);
}

module.exports = { render, TEMPLATES: Object.keys(templates) };
