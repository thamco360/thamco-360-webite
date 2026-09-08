/* Microsoft Clarity — project yf8jqawpr3
 *
 * Clarity ships as an inline <script> snippet, but this site sends a strict
 * Content-Security-Policy with no 'unsafe-inline' in script-src, so pasting it
 * into the page would have been blocked outright and silently: Clarity would
 * simply have recorded nothing. Kept as a separate file it is served from
 * 'self' and runs normally.
 *
 * vercel.json is updated alongside this to allow https://www.clarity.ms in
 * script-src (the tag this loader injects) and the Clarity/Bing collection
 * endpoints in connect-src (where the recordings are posted). Without those
 * two the loader would run and every beacon it sent would still be refused.
 *
 * Loaded with defer so it never competes with first paint.
 */
(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "yf8jqawpr3");
