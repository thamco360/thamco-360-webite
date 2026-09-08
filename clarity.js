/* Microsoft Clarity — project yf8jqawpr3
 *
 * Clarity ships as an inline <script> snippet, but this site sends a strict
 * Content-Security-Policy with no 'unsafe-inline' in script-src, so pasting it
 * into the page would have been blocked outright and silently: Clarity would
 * simply have recorded nothing. Kept as a separate file it is served from
 * 'self' and runs normally.
 *
 * vercel.json is updated alongside this to allow https://*.clarity.ms in
 * script-src and the Clarity/Bing collection endpoints in connect-src. The
 * wildcard is load-bearing: this loader fetches www.clarity.ms/tag/<id>, which
 * in turn pulls the real library from scripts.clarity.ms — a different
 * subdomain. Allowing only www.clarity.ms let the first request through and
 * blocked the second, so Clarity appeared to load and recorded nothing.
 *
 * Loaded with defer so it never competes with first paint.
 */
(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "yf8jqawpr3");
