// Generates /blog/index.html, /blog/<slug>/index.html for every post in
// blog-posts.mjs, and rewrites sitemap.xml so it always lists every page.
//
//   node scripts/build-blog.mjs
//
// The output is plain static HTML committed to the repo — Vercel serves it
// with no build step, same as the rest of the site.

import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { posts, BUILD_DATE } from './blog-posts.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.thamco360.com';
const OWN_IMAGE = `${SITE}/assets/img/stitched-360-streamphony.webp`;

// The CSP in vercel.json allows exactly one inline script, by SHA-256 hash.
// Refuse to build if the snippet below has drifted from that hash — a changed
// byte would ship pages whose Analytics is silently blocked.
const GTAG_HASH = 'l8/BnUsO7oPj4J3M8a45Nf8s5uda+TzEhJEVdP9Bc/o=';
const GTAG_BODY = "\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-4G2VQCLZDT');\n";
if (createHash('sha256').update(GTAG_BODY).digest('base64') !== GTAG_HASH) {
  throw new Error('gtag snippet no longer matches the CSP hash in vercel.json');
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ld = (obj) => JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/');
const wa = (text) => `https://wa.me/917090111360?text=${encodeURIComponent(text)}`;
const abs = (url) => (url.startsWith('http') ? url : SITE + url);
const readMins = (post) => {
  const text = [post.dek, ...post.takeaways, ...post.sections.map((s) => s.h2 + ' ' + s.html), ...post.faqs.map((f) => f.q + ' ' + f.a)].join(' ');
  return Math.max(3, Math.round(text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200));
};
const humanDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

// Validate links between posts before writing anything.
for (const p of posts) {
  for (const r of p.related) if (!bySlug[r]) throw new Error(`${p.slug}: related post "${r}" does not exist`);
  for (const [, href] of p.sections.map((s) => s.html).join('').matchAll(/href="\/blog\/([^"/]+)\/"/g)) {
    if (!bySlug[href]) throw new Error(`${p.slug}: links to missing post "${href}"`);
  }
}

const WA_ICON = '<svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>';
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

const PUBLISHER = {
  '@type': 'Organization',
  '@id': `${SITE}/#business`,
  name: 'Thamco360',
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/assets/logo.webp`, width: 150, height: 97 },
};

function header(activePath) {
  const blogCurrent = activePath.startsWith('/blog/') ? ' aria-current="page"' : '';
  return `  <header class="site-header" id="siteHeader">
    <div class="header-inner">
      <a href="/" class="logo">
        <img src="/assets/logo.webp" alt="Thamco360 — 360° Virtual Tours Bengaluru" class="logo-mark" width="150" height="97">
        <span class="visually-hidden">Thamco360 — 360° Tours Bengaluru</span>
      </a>

      <button class="nav-toggle" id="navToggle" type="button"
              aria-label="Open menu" aria-expanded="false" aria-controls="mainNav">
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>

      <nav class="main-nav" id="mainNav" aria-label="Main">
        <a href="/" class="nav-a">Home</a>
        <details class="nav-drop">
          <summary class="nav-a">Services</summary>
          <div class="nav-drop-menu">
            <a href="/#services">360° Virtual Tours</a>
            <a href="/#services">Google Street View Photography</a>
            <a href="/#services">Web 3D Walkthroughs</a>
          </div>
        </details>
        <details class="nav-drop">
          <summary class="nav-a">Locations</summary>
          <div class="nav-drop-menu">
            <a href="/360-virtual-tour-indiranagar-bengaluru/">Indiranagar</a>
          </div>
        </details>
        <a href="/blog/" class="nav-a"${blogCurrent}>Blog</a>
        <a href="/#portfolio" class="nav-a">Portfolio</a>
        <a href="/#contact" class="nav-a">Contact</a>
      </nav>

      <div class="header-actions">
        <a href="${esc(wa('Hi Thamco360! I would like to book a 360° virtual tour shoot.'))}" target="_blank" rel="noopener" class="btn-pill magnetic">
          <span>Book Shoot (+91 70901 11360)</span>
          ${ARROW}
        </a>
      </div>
    </div>
  </header>`;
}

function footer() {
  const guides = posts.slice(0, 5).map((p) => `          <a href="/blog/${p.slug}/">${esc(p.short)}</a>`).join('\n');
  return `  <a href="${esc(wa('Hi Thamco360! I am interested in a 360° virtual tour.'))}" target="_blank" rel="noopener" class="floating-wa" title="Chat on WhatsApp">
    ${WA_ICON}
  </a>

  <footer class="site-footer">
    <div class="inner footer-inner">
      <div class="footer-brand">
        <a href="/" class="logo">
          <img src="/assets/logo.webp" alt="Thamco360 — 360° Photography" class="logo-mark" width="130" height="84">
        </a>
        <p>360° virtual tours &amp; Google Trusted photography for businesses across Bengaluru.</p>
      </div>

      <div class="footer-links">
        <div class="fl-col">
          <h5>Guides</h5>
${guides}
          <a href="/blog/">All guides</a>
        </div>
        <div class="fl-col">
          <h5>Locations</h5>
          <a href="/360-virtual-tour-indiranagar-bengaluru/">Indiranagar</a>
        </div>
        <div class="fl-col">
          <h5>Company</h5>
          <a href="/about.html">About Thamco360</a>
          <a href="/#portfolio">Portfolio</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="inner">
        <span>&copy; 2026 Thamco360 Inc. All Rights Reserved.</span>
        <span><a href="/privacy.html">Privacy</a> &middot; <a href="/privacy.html#terms">Terms</a></span>
      </div>
    </div>
  </footer>

  <!-- Google tag (gtag.js) — G-4G2VQCLZDT. Byte-for-byte identical to the
       other pages: the CSP allows it by SHA-256 hash, so any reformatting of
       the block below blocks the tag. -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4G2VQCLZDT"></script>
  <script>${GTAG_BODY}</script>
  <script defer src="/clarity.js"></script>
  <script defer src="/app.js"></script>`;
}

function page({ title, description, path, image, imageAlt, ogType, graph, main }) {
  const url = SITE + path;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Generated by scripts/build-blog.mjs from scripts/blog-posts.mjs.
       Edit the content file and rebuild; changes made here are overwritten. -->
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="author" content="Thamco360">
  <meta name="geo.region" content="IN-KA">
  <meta name="geo.placename" content="Bengaluru">
  <link rel="canonical" href="${url}">

  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Thamco360">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${esc(abs(image))}">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(abs(image))}">

  <script type="application/ld+json">
${ld({ '@context': 'https://schema.org', '@graph': graph })}
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/styles.css">

  <script defer src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</head>
<body class="tier-full">

  <div class="cursor-dot" id="cursorDot"></div>
  <div class="cursor-ring" id="cursorRing"></div>

  <canvas id="shaderCanvas" class="shader-canvas"></canvas>

${header(path)}

${main}

${footer()}
</body>
</html>
`;
}

function card(p, headingTag = 'h2') {
  return `        <a class="blog-card reveal-up" href="/blog/${p.slug}/">
          <span class="blog-card-media"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy" width="1200" height="800"></span>
          <span class="blog-card-body">
            <span class="blog-card-cat">${esc(p.category)}</span>
            <${headingTag} class="blog-card-title">${esc(p.h1)}</${headingTag}>
            <span class="blog-card-excerpt">${esc(p.description)}</span>
            <span class="blog-card-meta">${readMins(p)} min read</span>
          </span>
        </a>`;
}

function renderPost(p) {
  const path = `/blog/${p.slug}/`;
  const url = SITE + path;
  const mins = readMins(p);

  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: p.h1,
      description: p.description,
      image: [abs(p.image)],
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      inLanguage: 'en-IN',
      articleSection: p.category,
      keywords: p.keywords.join(', '),
      wordCount: mins * 200,
      author: { '@type': 'Organization', name: 'Thamco360', url: `${SITE}/` },
      publisher: PUBLISHER,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      about: { '@type': 'Service', name: '360° Virtual Tour', provider: { '@id': `${SITE}/#business` }, areaServed: { '@type': 'City', name: 'Bengaluru' } },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
        { '@type': 'ListItem', position: 3, name: p.short, item: url },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  const toc = p.sections.map((s) => `            <li><a href="#${s.id}">${esc(s.h2)}</a></li>`).join('\n');
  const body = p.sections.map((s) => `        <h2 id="${s.id}">${esc(s.h2)}</h2>${s.html}`).join('\n\n');
  const faqs = p.faqs.map((f) => `          <div class="faq-item">
            <h3>${esc(f.q)}</h3>
            <p>${esc(f.a)}</p>
          </div>`).join('\n');
  const related = p.related.map((slug) => card(bySlug[slug], 'h3')).join('\n');

  const main = `  <main>
    <article class="post">
      <header class="section post-hero">
        <div class="inner post-inner">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span>${esc(p.short)}</span>
          </nav>
          <p class="section-kicker">${esc(p.category)} · Bengaluru</p>
          <h1 class="location-h1 post-h1">${esc(p.h1)}</h1>
          <p class="location-lede">${esc(p.dek)}</p>
          <p class="post-meta">By Thamco360 · <time datetime="${BUILD_DATE}">${humanDate(BUILD_DATE)}</time> · ${mins} min read</p>
        </div>
      </header>

      <div class="inner post-inner">
        <figure class="post-figure">
          <img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" width="1200" height="800" fetchpriority="high">
          <figcaption>${esc(p.caption)}</figcaption>
        </figure>

        <div class="post-summary">
          <aside class="post-takeaways" aria-label="Key takeaways">
            <h2>Key takeaways</h2>
            <ul>
${p.takeaways.map((t) => `              <li>${esc(t)}</li>`).join('\n')}
            </ul>
          </aside>
          <nav class="post-toc" aria-label="In this guide">
            <h2>In this guide</h2>
            <ol>
${toc}
              <li><a href="#faq">Frequently asked questions</a></li>
            </ol>
          </nav>
        </div>

        <div class="post-body">
${body}
        </div>

        <aside class="post-cta">
          <div>
            <h2>${esc(p.cta.title)}</h2>
            <p>${esc(p.cta.text)}</p>
          </div>
          <a href="${esc(wa(p.cta.wa))}" target="_blank" rel="noopener" class="btn-enter-tour magnetic">
            <span>Get a quote on WhatsApp</span>
            ${ARROW}
          </a>
        </aside>

        <section id="faq" class="post-faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Frequently asked questions</h2>
          <div class="faq-list">
${faqs}
          </div>
        </section>

        <section class="post-related" aria-labelledby="related-title">
          <h2 id="related-title">Related guides</h2>
          <div class="blog-grid blog-grid-compact">
${related}
          </div>
        </section>
      </div>
    </article>

    <section class="final-cta-section">
      <div class="inner">
        <a href="/#portfolio" class="final-cta">
          <span>View Live Sample Tours</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </section>
  </main>`;

  return page({ title: p.title, description: p.description, path, image: p.image, imageAlt: p.imageAlt, ogType: 'article', graph, main });
}

function renderIndex() {
  const path = '/blog/';
  const url = SITE + path;
  const title = '360° Virtual Tour Guides for Bangalore Businesses | Thamco360 Blog';
  const description = 'Guides on how 360° virtual tours and Google Business Profile tours help Bangalore resorts, co-working spaces, restaurants, clinics, real estate, schools, venues and retail.';

  const graph = [
    {
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${SITE}/#website` },
      publisher: PUBLISHER,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/blog/${p.slug}/`, name: p.h1 })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: url },
      ],
    },
  ];

  const main = `  <main>
    <section class="section location-hero">
      <div class="inner">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><span>Blog</span>
        </nav>
        <p class="section-kicker">Guides · Bengaluru</p>
        <h1 class="location-h1">How 360° Virtual Tours Help <span class="gradient-text">Bangalore Businesses</span></h1>
        <p class="location-lede">Practical guides for resorts, co-working spaces, restaurants, clinics, property, schools, venues and retail — and how a tour on your Google Business Profile turns Maps searches into visits.</p>
      </div>
    </section>

    <section class="section blog-index">
      <div class="inner">
        <div class="blog-grid">
${posts.map((p) => card(p)).join('\n')}
        </div>
      </div>
    </section>

    <section class="final-cta-section">
      <div class="inner">
        <a href="/#portfolio" class="final-cta">
          <span>View Live Sample Tours</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </section>
  </main>`;

  return page({ title, description, path, image: OWN_IMAGE, imageAlt: 'A 360° panorama captured by Thamco360 in Bengaluru', ogType: 'website', graph, main });
}

function renderSitemap() {
  const entries = [
    { loc: '/', lastmod: BUILD_DATE, changefreq: 'weekly', priority: '1.0', images: [
      ['/assets/img/stitched-360-streamphony.webp', 'Stitched 360° panorama of Streamphony Live, Bengaluru — Thamco360'],
      ['/assets/img/raw-capture-streamphony.webp', 'Raw dual-fisheye 360° capture before stitching — Thamco360'],
    ] },
    { loc: '/360-virtual-tour-indiranagar-bengaluru/', lastmod: '2026-09-15', changefreq: 'monthly', priority: '0.9' },
    { loc: '/blog/', lastmod: BUILD_DATE, changefreq: 'weekly', priority: '0.8' },
    ...posts.map((p) => ({ loc: `/blog/${p.slug}/`, lastmod: BUILD_DATE, changefreq: 'monthly', priority: '0.7' })),
    { loc: '/about.html', lastmod: '2026-09-09', changefreq: 'monthly', priority: '0.6' },
    { loc: '/privacy.html', lastmod: '2026-09-09', changefreq: 'yearly', priority: '0.3' },
  ];

  const urls = entries.map((e) => {
    const images = (e.images || []).map(([src, t]) => `
    <image:image>
      <image:loc>${SITE}${src}</image:loc>
      <image:title>${esc(t)}</image:title>
    </image:image>`).join('');
    return `  <url>
    <loc>${SITE}${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${images}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/build-blog.mjs — rebuild instead of editing by hand. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
  console.log('wrote', rel);
}

for (const p of posts) write(`blog/${p.slug}/index.html`, renderPost(p));
write('blog/index.html', renderIndex());
write('sitemap.xml', renderSitemap());
