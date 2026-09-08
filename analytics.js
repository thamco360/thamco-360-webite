/* Google Analytics 4 — measurement ID G-4G2VQCLZDT
 *
 * Google ships this as an inline <script> next to the gtag.js loader, but this
 * site sends a strict Content-Security-Policy with no 'unsafe-inline' in
 * script-src, so the inline half would be blocked and the property would
 * report nothing. Only the inline half needs extracting — the loader tag stays
 * in the HTML as Google wrote it, because an external src is allowed once
 * googletagmanager.com is whitelisted.
 *
 * Order does not matter between this file and the loader: whichever runs first
 * creates window.dataLayer, and gtag() only ever pushes onto that queue, which
 * gtag.js drains once it arrives.
 *
 * CSP additions in vercel.json that this depends on:
 *   script-src   www.googletagmanager.com          the loader itself
 *   connect-src  *.google-analytics.com,           where hits are posted
 *                *.analytics.google.com,
 *                *.googletagmanager.com,
 *                stats.g.doubleclick.net
 *   img-src      the same hosts                    pixel-transport fallback
 * Miss any one of those and the tag loads while its hits are refused, which
 * looks identical to a working install from the page's side.
 */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'G-4G2VQCLZDT');
