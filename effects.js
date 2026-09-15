/* ==========================================================================
   THAMCO360 — 3D text & scroll effects for content pages
   (blog, services, locations). Loaded after app.js, which owns Lenis and the
   Lenis → ScrollTrigger bridge; this file only adds choreography.

   Everything here is progressive enhancement: markup is fully readable with
   no JS. The one element that starts hidden (.fx-pending, the page H1) has a
   pure-CSS failsafe that reveals it after 2.8s if this script never runs.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const pending = document.querySelectorAll('.fx-pending');
  const release = () => pending.forEach((el) => el.classList.remove('fx-pending'));

  if (!window.gsap || !window.ScrollTrigger) { release(); return; }
  gsap.registerPlugin(ScrollTrigger);

  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Text splitting ────────────────────────────────────────────────────
     Splits an element's text into word spans (and optionally char spans)
     while keeping it accessible: the element gets an aria-label with its
     original text and the generated spans are aria-hidden, so screen readers
     read one sentence rather than a string of letters. Child elements such
     as .gradient-text are kept whole and animated as a single word, because
     background-clip:text does not survive being cut into transformed spans. */
  function split(el, { chars = false } = {}) {
    if (el.dataset.fxSplit) return el;
    el.dataset.fxSplit = '1';
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());

    const wrapText = (text) => {
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const word = document.createElement('span');
        word.className = 'fx-word';
        word.setAttribute('aria-hidden', 'true');
        if (chars) {
          [...part].forEach((c) => {
            const ch = document.createElement('span');
            ch.className = 'fx-char';
            ch.textContent = c;
            word.appendChild(ch);
          });
        } else {
          word.textContent = part;
        }
        frag.appendChild(word);
      });
      return frag;
    };

    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.replaceWith(wrapText(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.add('fx-word', 'fx-unit');
        node.setAttribute('aria-hidden', 'true');
      }
    });
    return el;
  }

  // One-shot reveal bound to its own trigger. Each element gets an individual
  // ScrollTrigger rather than a ScrollTrigger.batch(): batch defers onEnter to
  // a timed flush, and when Lenis jumps the page (anchor links, immediate
  // scrollTo) that flush could be skipped, leaving cards stuck invisible.
  function revealOnScroll(targets, from, to, start = 'top 88%', triggerEl) {
    const list = gsap.utils.toArray(targets);
    if (!list.length) return;
    gsap.set(list, from);
    ScrollTrigger.create({
      trigger: triggerEl || list[0],
      start,
      once: true,
      onEnter: () => gsap.to(list, { ...to, overwrite: 'auto' }),
    });
  }

  /* ── 1. Page headline: letters flip in on the X axis in 3D ───────────── */
  document.querySelectorAll('.fx-hero-title').forEach((h1) => {
    split(h1, { chars: true });
    const pieces = h1.querySelectorAll('.fx-char, .fx-unit');
    gsap.set(pieces, { rotateX: -100, yPercent: 55, z: -60, opacity: 0, transformOrigin: '50% 50% -24px' });
    h1.classList.remove('fx-pending');
    gsap.to(pieces, {
      rotateX: 0, yPercent: 0, z: 0, opacity: 1,
      duration: 1.15, ease: 'expo.out', stagger: 0.016, delay: 0.1,
    });
  });
  release();

  // Supporting hero copy rises in behind the headline.
  const heroBits = document.querySelectorAll('.fx-hero .crumbs, .fx-hero .section-kicker, .fx-hero .location-lede, .fx-hero .post-meta, .fx-hero .location-cta, .fx-hero .svc-hero-actions');
  if (heroBits.length) {
    gsap.from(heroBits, { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.35 });
  }

  /* ── 2. Hero text tilts toward the pointer (desktop) and with scroll ─── */
  document.querySelectorAll('.fx-hero').forEach((hero) => {
    const target = hero.querySelector('.fx-tilt');
    if (!target) return;
    if (FINE_POINTER) {
      const rx = gsap.quickTo(target, 'rotateX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(target, 'rotateY', { duration: 0.8, ease: 'power3.out' });
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      hero.addEventListener('pointerleave', () => { rx(0); ry(0); });
    }
    // On every device the headline leans back into the page as it scrolls away.
    gsap.to(target, {
      z: -120, opacity: 0.35, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
  });

  /* ── 3. Section headings: words rotate up out of the page ───────────── */
  document.querySelectorAll('.post-body h2, .post-faq > h2, .post-related > h2, .fx-heading, .post-cta h2').forEach((h) => {
    split(h);
    revealOnScroll(
      h.querySelectorAll('.fx-word'),
      { rotateX: -85, y: 28, opacity: 0, transformOrigin: '50% 100%' },
      { rotateX: 0, y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.05 },
      'top 88%',
      h,
    );
  });

  /* ── 4. Images: start tilted back in 3D, flatten and unmask on scroll ── */
  document.querySelectorAll('.fx-img').forEach((img) => {
    gsap.fromTo(img,
      { rotateX: 16, scale: 0.9, y: 50, clipPath: 'inset(10% 6% 10% 6% round 20px)' },
      {
        rotateX: 0, scale: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 20px)', ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'top 45%', scrub: 0.8 },
      });
  });

  /* ── 5. Cards: 3D rise on entry, pointer tilt with a moving glare ────── */
  const cards = gsap.utils.toArray('.blog-card, .svc-card');
  cards.forEach((card, i) => {
    revealOnScroll(
      card,
      { opacity: 0, y: 70, rotateX: -20, transformPerspective: 900 },
      // Cards sharing a row arrive a beat apart rather than all at once.
      { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'expo.out', delay: (i % 3) * 0.1 },
      'top 92%',
    );
  });

  if (FINE_POINTER) {
    cards.forEach((card) => {
      const rx = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 12);
        rx(-(py - 0.5) * 12);
        card.style.setProperty('--gx', `${px * 100}%`);
        card.style.setProperty('--gy', `${py * 100}%`);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ── 6. 3D extruded word band: turns and slides with scroll ─────────── */
  document.querySelectorAll('.fx-band').forEach((band) => {
    const track = band.querySelector('.fx-band-track');
    if (!track) return;
    gsap.fromTo(track,
      { xPercent: 8, rotateX: 38, rotateY: -14 },
      {
        xPercent: -38, rotateX: -12, rotateY: 10, ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      });
    band.querySelectorAll('.fx-band-word').forEach((w, i) => {
      gsap.fromTo(w, { z: -140 - i * 30 }, {
        z: 40, ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'center center', scrub: 1 },
      });
    });
  });

  /* ── 7. Supporting blocks: staggered 3D tilt-up ─────────────────────── */
  // Tilted on the X axis, not Y: a sideways swing pushes the right edge past
  // the viewport before it plays, which is what let these pages scroll sideways.
  document.querySelectorAll('.post-summary, .post-faq .faq-list, .svc-steps, .svc-points').forEach((group) => {
    const items = group.matches('.post-summary') ? group.children : group.querySelectorAll('.faq-item, .svc-step, .svc-point');
    revealOnScroll(
      items,
      { opacity: 0, y: 40, rotateX: -16, transformPerspective: 900, transformOrigin: '50% 0%' },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
      'top 85%',
      group,
    );
  });

  document.querySelectorAll('.post-cta').forEach((cta) => {
    revealOnScroll(
      cta,
      { scale: 0.9, rotateX: 18, opacity: 0, transformPerspective: 1000 },
      { scale: 1, rotateX: 0, opacity: 1, duration: 1.1, ease: 'expo.out' },
      'top 85%',
    );
  });

  // Images and fonts change heights after first layout; re-measure once
  // everything is in so every trigger above fires at the right scroll point.
  window.addEventListener('load', () => ScrollTrigger.refresh());
});
