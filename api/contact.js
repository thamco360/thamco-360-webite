// Vercel serverless function — POST /api/contact
// Sends the homepage enquiry form straight to thamco360@gmail.com via
// Gmail SMTP, so submitting the form is genuinely one click for the
// visitor (no mailto:, no leaving the page). Credentials come from
// environment variables only — see .env.example — never from this file.

const nodemailer = require('nodemailer');

const MAX_LEN = { name: 100, phone: 30, propertyType: 60, propertySize: 60, floors: 20, rooms: 20, service: 60, message: 2000 };

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
  return hits.length > MAX_PER_WINDOW;
}

function clean(value, maxLen) {
  if (typeof value !== 'string') return '';
  // Strip control/newline characters so nothing here can inject extra
  // email headers or break out of the fields it's placed into.
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment and try again.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: real visitors never see or fill this field. Bots that
  // blanket-fill every input trip it — pretend success so they move on.
  if (clean(body.company, 100)) {
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
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('Missing GMAIL_USER / GMAIL_APP_PASSWORD environment variables');
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
      replyTo: undefined, // the form doesn't collect an email address, only phone
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

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to send enquiry email:', err);
    return res.status(502).json({ error: 'Could not send right now — please try WhatsApp instead.' });
  }
};
