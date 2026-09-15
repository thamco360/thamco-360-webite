// Renders the Bangalore locations section of the blog:
//   /blog/locations/          hub listing every area (Indiranagar included)
//   /blog/locations/<slug>/   one page per area in location-pages.mjs
// Called from build-blog.mjs, which passes in its shared page helpers so these
// pages use the exact same layout, header, footer and analytics snippet.

import { locations, INDIRANAGAR, PRICE_FROM, PRICE_TAGLINE_HTML } from './location-pages.mjs';

export const HUB_PATH = '/blog/locations/';
const bySlugLoc = Object.fromEntries([INDIRANAGAR, ...locations].map((l) => [l.slug, l]));
export const locationPath = (l) => l.path || `${HUB_PATH}${l.slug}/`;
const cardImage = (src) => src.replace(/([?&]w=)\d+/, '$1800');

const priceBanner = () => `<p class="price-banner"><span class="price-banner-dot" aria-hidden="true"></span>${PRICE_TAGLINE_HTML}</p>`;

// Shared questions: asked of every area, answered the same way everywhere.
const commonFaqs = (name) => [
  { q: `Do you shoot 360° virtual tours in ${name}?`, a: `Yes. Thamco360’s scan crew travels to businesses and properties across Bangalore, including ${name}, and deploys within 48 hours of booking. There is no studio to visit — the crew comes to you.` },
  { q: `How much does a 360° virtual tour cost in ${name}?`, a: `Basic Thamco360 packages start from just ₹7,999. The final price depends on the size of the space, the number of scan points and any extras such as a website embed or custom 3D features.` },
];

export function locationSitemapEntries(date) {
  return [
    { loc: HUB_PATH, lastmod: date, changefreq: 'monthly', priority: '0.8' },
    ...locations.map((l) => ({ loc: locationPath(l), lastmod: date, changefreq: 'monthly', priority: '0.8' })),
  ];
}

// "Browse by location" block for the blog index.
export function locationsIndexSection({ esc, ARROW }) {
  const chips = [INDIRANAGAR, ...locations].map((l) => `          <a class="area-chip" href="${locationPath(l)}">${esc(l.name)}</a>`).join('\n');
  return `    <section class="section svc-section blog-locations">
      <div class="inner">
        <div class="section-header-center">
          <p class="section-kicker">Locations</p>
          <h2 class="section-h2 fx-heading">Virtual Tours Across Bangalore</h2>
          <p class="section-p">${PRICE_TAGLINE_HTML}</p>
        </div>
        <nav class="area-chips" aria-label="Bangalore locations">
${chips}
        </nav>
        <div class="home-guides-cta">
          <a href="${HUB_PATH}" class="btn-enter-tour magnetic">
            <span>Browse all locations</span>
            ${ARROW}
          </a>
        </div>
      </div>
    </section>`;
}

export function renderLocationPages(h) {
  const { page, band, card, faqBlock, esc, wa, ARROW, finalCta, PUBLISHER, SITE, BUILD_DATE, bySlug, abs } = h;

  // Fail the build on anything that would ship a broken or over-long page.
  for (const l of locations) {
    if ([...l.title].length > 61) throw new Error(`location ${l.slug}: title is ${[...l.title].length} chars`);
    if ([...l.description].length > 160) throw new Error(`location ${l.slug}: description is ${[...l.description].length} chars`);
    for (const n of l.nearby) if (!bySlugLoc[n]) throw new Error(`location ${l.slug}: unknown nearby area "${n}"`);
    for (const g of [...l.guides, ...l.businesses.map((b) => b.guide)]) if (!bySlug[g]) throw new Error(`location ${l.slug}: unknown guide "${g}"`);
  }

  const locCard = (l, tag = 'h2') => `        <a class="blog-card" href="${locationPath(l)}">
          <span class="blog-card-media"><img src="${esc(cardImage(l.image.src))}" alt="${esc(l.image.alt)}" loading="lazy" decoding="async" width="800" height="533"></span>
          <span class="blog-card-body">
            <span class="blog-card-cat">${esc(l.zone)}</span>
            <${tag} class="blog-card-title">${esc(l.name)}</${tag}>
            <span class="blog-card-excerpt">${esc(l.cardText)}</span>
            <span class="blog-card-meta">Explore ${esc(l.name)} &rarr;</span>
          </span>
        </a>`;

  const breadcrumb = (items) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })),
  });

  // ── Hub ────────────────────────────────────────────────────────────────
  function renderHub() {
    const url = SITE + HUB_PATH;
    const title = 'Bangalore Locations for 360° Virtual Tours | Thamco360';
    const description = '360° virtual tours across Bangalore — Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar and more. Basic packages from just ₹7,999.';
    const all = [INDIRANAGAR, ...locations];

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
          itemListElement: all.map((l, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + locationPath(l), name: `360° virtual tours in ${l.name}` })),
        },
      },
      breadcrumb([['Home', '/'], ['Blog', '/blog/'], ['Locations', HUB_PATH]]),
    ];

    const main = `  <main>
    <section class="section location-hero fx-hero">
      <div class="inner fx-tilt">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><span>Locations</span>
        </nav>
        <p class="section-kicker">Locations · Bangalore</p>
        <h1 class="location-h1 fx-hero-title fx-pending">360° Virtual Tours Across <span class="gradient-text">Bangalore</span></h1>
        <p class="location-lede">Wherever your business is in Bangalore, our scan crew comes to you. Pick your neighbourhood to see how 360° virtual tours help the cafés, clinics, offices, hotels and homes around you.</p>
        ${priceBanner()}
      </div>
    </section>

    <section class="section blog-index">
      <div class="inner">
        <div class="blog-grid">
${all.map((l) => locCard(l)).join('\n')}
        </div>
      </div>
    </section>

${band(['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Hebbal'])}

    <section class="section svc-section">
      <div class="inner post-inner">
        <aside class="post-cta">
          <div>
            <h2>Don’t see your neighbourhood?</h2>
            <p>The crew shoots across Bangalore and its surroundings. Send your location and we will confirm timing and a quote.</p>
          </div>
          <a href="${esc(wa('Hi Thamco360! I would like a 360° virtual tour. My location is: '))}" target="_blank" rel="noopener" class="btn-enter-tour magnetic">
            <span>Ask on WhatsApp</span>
            ${ARROW}
          </a>
        </aside>
      </div>
    </section>

${finalCta}
  </main>`;

    return page({ title, description, path: HUB_PATH, image: `${SITE}/assets/img/stitched-360-streamphony.webp`, imageAlt: 'A 360° panorama captured by Thamco360 in Bengaluru', ogType: 'website', graph, main });
  }

  // ── Area page ──────────────────────────────────────────────────────────
  function renderArea(l) {
    const path = locationPath(l);
    const url = SITE + path;
    const faqs = [...commonFaqs(l.name).slice(0, 1), ...l.faqs, ...commonFaqs(l.name).slice(1)];

    const graph = [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: l.title,
        description: l.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#business` },
        dateModified: BUILD_DATE,
        primaryImageOfPage: { '@type': 'ImageObject', url: abs(l.image.src) },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: `360° Virtual Tours in ${l.name}`,
        serviceType: '360° virtual tour and Google Street View photography',
        provider: PUBLISHER,
        areaServed: { '@type': 'Place', name: `${l.name}, Bengaluru, Karnataka` },
        offers: { '@type': 'Offer', priceCurrency: 'INR', priceSpecification: { '@type': 'PriceSpecification', minPrice: PRICE_FROM, priceCurrency: 'INR' } },
      },
      breadcrumb([['Home', '/'], ['Blog', '/blog/'], ['Locations', HUB_PATH], [l.name, path]]),
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ];

    const sections = l.sections.map((s) => `        <h2 id="${s.id}">${esc(s.h2)}</h2>${s.html}`).join('\n\n');
    const businesses = l.businesses.map((b) => `          <li><a href="/blog/${b.guide}/">${esc(b.label)}</a></li>`).join('\n');
    const nearby = l.nearby.map((n) => `          <a class="area-chip" href="${locationPath(bySlugLoc[n])}">${esc(bySlugLoc[n].name)}</a>`).join('\n');
    const guides = l.guides.map((g) => card(bySlug[g], 'h3')).join('\n');

    const main = `  <main>
    <section class="section location-hero fx-hero">
      <div class="inner fx-tilt">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Blog</a><span aria-hidden="true">/</span><a href="${HUB_PATH}">Locations</a><span aria-hidden="true">/</span><span>${esc(l.name)}</span>
        </nav>
        <p class="section-kicker">${esc(l.zone)}</p>
        <h1 class="location-h1 fx-hero-title fx-pending">360° Virtual Tours in <span class="gradient-text">${esc(l.name)}</span></h1>
        <p class="location-lede">${esc(l.dek)}</p>
        ${priceBanner()}
        <a href="${esc(wa(`Hi Thamco360! I would like to book a 360° virtual tour in ${l.name}.`))}" target="_blank" rel="noopener" class="btn-enter-tour magnetic location-cta">
          <span>Book a shoot in ${esc(l.name)}</span>
          ${ARROW}
        </a>
      </div>
    </section>

    <section class="section svc-section">
      <div class="inner post-inner">
        <figure class="post-figure fx-figure">
          <img class="fx-img" src="${esc(l.image.src)}" alt="${esc(l.image.alt)}" width="1200" height="800" fetchpriority="high">
          <figcaption>${esc(l.image.caption)}</figcaption>
        </figure>
        <div class="post-body">
${sections}

        <h2 id="what-we-capture">What we capture in ${esc(l.name)}</h2>
        <ul class="loc-businesses">
${businesses}
        </ul>
        </div>
      </div>
    </section>

${band([l.name, 'Step inside', 'Book the visit'])}

    <section id="faq" class="section svc-section svc-faq">
      <div class="inner post-inner">
        <div class="post-faq">
          <h2>Frequently asked questions — ${esc(l.name)}</h2>
          <div class="faq-list">
${faqBlock(faqs)}
          </div>
        </div>
        <aside class="post-cta">
          <div>
            <h2>Put your ${esc(l.name)} space online</h2>
            <p>Share your business name and address — we will confirm timing and a quote.</p>
          </div>
          <a href="${esc(wa(`Hi Thamco360! I would like a quote for a 360° virtual tour in ${l.name}.`))}" target="_blank" rel="noopener" class="btn-enter-tour magnetic">
            <span>Get a quote on WhatsApp</span>
            ${ARROW}
          </a>
        </aside>
      </div>
    </section>

    <section class="section svc-section">
      <div class="inner">
        <div class="section-header-center">
          <p class="section-kicker">Nearby</p>
          <h2 class="section-h2 fx-heading">Areas near ${esc(l.name)}</h2>
        </div>
        <nav class="area-chips" aria-label="Areas near ${esc(l.name)}">
${nearby}
          <a class="area-chip" href="${HUB_PATH}">All Bangalore locations</a>
        </nav>

        <div class="section-header-center loc-section-head">
          <p class="section-kicker">Read more</p>
          <h2 class="section-h2 fx-heading">Guides for businesses in ${esc(l.name)}</h2>
        </div>
        <div class="blog-grid blog-grid-compact">
${guides}
        </div>
      </div>
    </section>

${finalCta}
  </main>`;

    return page({ title: l.title, description: l.description, path, image: l.image.src, imageAlt: l.image.alt, ogType: 'website', graph, main });
  }

  return [
    ['blog/locations/index.html', renderHub()],
    ...locations.map((l) => [`blog/locations/${l.slug}/index.html`, renderArea(l)]),
  ];
}
