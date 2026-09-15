// Vercel serverless function — POST /api/contact
// Sends the homepage enquiry form straight to thamco360@gmail.com via
// Gmail SMTP, so submitting the form is genuinely one click for the
// visitor (no mailto:, no leaving the page). Credentials come from
// environment variables only — see .env.example — never from this file.

const nodemailer = require('nodemailer');

const MAX_LEN = { name: 100, phone: 30, propertyType: 60, propertySize: 60, floors: 20, rooms: 20, service: 60, message: 2000 };

// The form only ever posts from this site's own pages. Browsers attach an
// Origin header to every cross-site POST, so a request from any other origin
// is refused before any work is done — another site cannot make its visitors'
// browsers submit enquiries here. Vercel preview/branch URLs for this project
// are allowed so the form can be tested before promoting a deploy. A request
// with no Origin at all is not coming from a browser page (curl, scripts); it
// cannot be browser-driven CSRF, and validation plus the rate limit apply.
const ALLOWED_ORIGINS = new Set(['https://www.thamco360.com', 'https://thamco360.com']);
const PREVIEW_ORIGIN = /^https:\/\/thamco-360-webite(?:-[a-z0-9-]+)?\.vercel\.app$/;
const isAllowedOrigin = (origin) => !origin || ALLOWED_ORIGINS.has(origin) || PREVIEW_ORIGIN.test(origin);

// Best-effort only: each serverless instance has its own memory and gets
// recycled/cold-started freely, so this does not enforce a real global
// limit. It just adds friction against a single warm instance being
// hammered in a tight loop — Gmail's own per-account sending cap is the
// actual backstop against sustained abuse.
const recentHits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (recentHits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recentHits.set(ip, hits);
  // Drop idle entries so a long-lived warm instance does not grow the map
  // without bound.
  if (recentHits.size > 5000) {
    for (const [key, times] of recentHits) if (!times.some((t) => now - t < WINDOW_MS)) recentHits.delete(key);
  }
  return hits.length > MAX_PER_WINDOW;
}

function clean(value, maxLen) {
  if (typeof value !== 'string') return '';
  // Strip control/newline characters so nothing here can inject extra
  // email headers or break out of the fields it's placed into.
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen);
}

// One JSON line per outcome, so Vercel's log search can filter by event and
// reason. Deliberately no name, phone or message: enquiries are personal data
// and the logs are not where they belong.
function log(event, detail = {}) {
  console.log(JSON.stringify({ event, ...detail, at: new Date().toISOString() }));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) {
    log('contact.rejected', { reason: 'origin', origin });
    return res.status(403).json({ error: 'Forbidden' });
  }

  // JSON only. A cross-site form or fetch sent as text/plain skips the CORS
  // preflight entirely; requiring application/json forces a preflight, which
  // this endpoint never approves for other origins.
  const contentType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    log('contact.rejected', { reason: 'content-type', contentType });
    return res.status(415).json({ error: 'Unsupported content type.' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    log('contact.rejected', { reason: 'rate-limit' });
    return res.status(429).json({ error: 'Too many requests — please wait a moment and try again.' });
  }

  // Vercel parses JSON bodies lazily and throws on malformed input when
  // req.body is first read; without this the caller got an empty 400.
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    log('contact.rejected', { reason: 'invalid-json' });
    return res.status(400).json({ error: 'Invalid request.' });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    log('contact.rejected', { reason: 'invalid-body' });
    return res.status(400).json({ error: 'Invalid request.' });
  }

  // Honeypot: real visitors never see or fill this field. Bots that
  // blanket-fill every input trip it — pretend success so they move on.
  if (clean(body.company, 100)) {
    log('contact.rejected', { reason: 'honeypot' });
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, MAX_LEN.name);
  const phone = clean(body.phone, MAX_LEN.phone);
  const propertyType = clean(body.propertyType, MAX_LEN.propertyType);
  const propertySize = clean(body.propertySize, MAX_LEN.propertySize);
  const floors = clean(body.floors, MAX_LEN.floors);
  const rooms = clean(body.rooms, MAX_LEN.rooms);
  const service = clean(body.service, MAX_LEN.service);
  const message = clean(body.message, MAX_LEN.message);

  if (!name || !phone) {
    log('contact.rejected', { reason: 'missing-required' });
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error(JSON.stringify({ event: 'contact.misconfigured', missing: [!GMAIL_USER && 'GMAIL_USER', !GMAIL_APP_PASSWORD && 'GMAIL_APP_PASSWORD'].filter(Boolean) }));
    return res.status(500).json({ error: 'Enquiry service is not configured yet — please use WhatsApp instead.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `Thamco360 Website <${GMAIL_USER}>`,
      to: 'thamco360@gmail.com',
      subject: `360° Virtual Tour Enquiry — ${name}`,
      text:
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Property Type: ${propertyType || '—'}\n` +
        `Property Size: ${propertySize || '—'}\n` +
        `Number of Floors: ${floors || '—'}\n` +
        `Number of Rooms / Spaces: ${rooms || '—'}\n` +
        `Required Service: ${service || '—'}\n` +
        `Details: ${message || '—'}`,
    });

    log('contact.sent', { service: service || null, propertyType: propertyType || null });
    return res.status(200).json({ ok: true });
  } catch (err) {
    // The error object goes to the server log only; the visitor gets a
    // generic message with no SMTP or stack detail.
    console.error(JSON.stringify({ event: 'contact.send-failed', code: err && err.code, responseCode: err && err.responseCode, message: err && err.message }));
    return res.status(502).json({ error: 'Could not send right now — please try WhatsApp instead.' });
  }
};
