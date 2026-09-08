/* ==========================================================================
   THAMCO360 — Main Interactive Engine
   ========================================================================== */

/* Shared motion guard. Read once, used by every module below, so the whole
   page agrees on whether it is allowed to animate. */
const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;

/* A 360 sphere only ever shows about a 75-degree slice, so a phone was
   downloading a 2400px equirectangular frame to display roughly 270px of it.
   Unsplash resizes on its own CDN via the w parameter, so ask for what the
   device can actually resolve. Anything not served by Unsplash (our own
   WebP exports) is returned untouched. */
function panoTextureURL(url) {
  if (!/images\.unsplash\.com/.test(url)) return url;
  const w = window.innerWidth < 768 ? 1440 : window.innerWidth < 1200 ? 1800 : 2400;
  return url.replace(/([?&]w=)\d+/, `$1${w}`);
}

/* Drives a render loop only while its canvas is actually on screen and the
   tab is in front.
   
   Seven WebGL canvases on this page each ran their own unconditional
   requestAnimationFrame loop from load onwards, so a phone sitting on the
   contact form was still rendering five panoramas it could not see. The loop
   is stopped outright rather than skipped inside the callback — a cancelled
   rAF costs nothing, whereas an early-returning one still wakes the frame. */
function renderWhileVisible(el, frame, rootMargin = '200px 0px') {
  let onScreen = false;
  let running = false;
  let rafId = 0;

  const tick = () => {
    frame();
    rafId = requestAnimationFrame(tick);
  };

  const sync = () => {
    const should = onScreen && !document.hidden;
    if (should && !running) {
      running = true;
      rafId = requestAnimationFrame(tick);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  };

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  }, { rootMargin }).observe(el);

  document.addEventListener('visibilitychange', sync);
  sync();
}

document.addEventListener('DOMContentLoaded', () => {
  // The <head> optimistically marks the document motion-ready so the hero
  // never flashes its final state before the intro timeline takes over. If
  // GSAP did not actually arrive, that promise cannot be kept — drop the
  // class immediately so the hero copy is visible rather than stranded at
  // opacity 0.
  if (!window.gsap) document.documentElement.classList.remove('motion-ready');

  // Initialize Lenis Smooth Scroll
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.15,
      // expo-out: fast commit, long glide — reads as weight rather than lag.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      // Native momentum on touch. Virtualised touch scrolling fights the
      // hero's drag-to-look panorama and mis-reports position to the pinned
      // ScrollTriggers on iOS, so the phone keeps the platform scroller.
      smoothTouch: false
    });

    if (window.gsap && window.ScrollTrigger) {
      // Lenis virtualizes scroll rather than driving native scrollTop, so
      // ScrollTrigger (used below for the hero room driver and the service
      // tour pins) needs to be told explicitly when Lenis moves the page —
      // without this, pinned sections desync from the actual scroll position.
      lenis.on('scroll', ScrollTrigger.update);

      // Drive Lenis from GSAP's ticker instead of a second requestAnimationFrame
      // loop. One loop means scroll position and every scrubbed tween are
      // computed in the same frame — two loops let them land a frame apart,
      // which is exactly the jitter that shows up on parallax. lagSmoothing(0)
      // stops GSAP from fast-forwarding after a background-tab stall, which
      // would otherwise snap the parallax on return.
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }

    // Route in-page anchors through Lenis so the jump inherits the same
    // easing as a wheel scroll instead of teleporting.
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -90, duration: 1.4 });
      });
    });
  } catch (e) {
    console.log('Lenis fallback');
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  // Initialize Modules
  initBackgroundShader();
  initHeroVirtualTour();
  initCinematicTextReveals();
  initBeforeAfterSlider();
  initContactForm();
  initLiveScrollObserver();
  initCursorReticle();
  initMagneticButtons();
  initServiceTours();
  initServicePinning();
  initHookReveal();
  initHeroIntro();
  initParallax();
  initJourney();

  // ScrollTrigger caches pin start/end pixel ranges at creation time.
  // This page has several lazy-loaded images (industries grid, property
  // showcase) that resize the document after that, which leaves pins
  // (hero room driver, service tours, hook) releasing too early. Refresh
  // once everything — including images — has actually finished loading.
  if (window.ScrollTrigger) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});

/* ── 1. Live Header Scroll Indicator & Header Transparency ── */
function initLiveScrollObserver() {
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

}

/* ── 2. Cinematic Scroll Reveals ── */
function initCinematicTextReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

/* ── 3. Ambient Shader Canvas Background ── */
function initBackgroundShader() {
  const canvas = document.getElementById('shaderCanvas');
  if (!canvas) return;

  // Purely decorative: a full-viewport WebGL surface sitting behind the page
  // under a 12px blur. On a phone it competes for the GPU with the panorama
  // the visitor is actually looking at, and the blur means almost none of its
  // detail survives to be seen. It is also one of seven WebGL contexts, and
  // mobile browsers cap how many a page may hold at once.
  if (IS_TOUCH || window.innerWidth < 768 || PREFERS_REDUCED) {
    canvas.remove();
    return;
  }

  const gl = canvas.getContext('webgl');
  if (!gl) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  const vs = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fs = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      float d = length(st - vec2(0.5));
      vec3 col1 = vec3(0.98, 0.96, 0.93);
      vec3 col2 = vec3(0.85, 0.65, 0.30);
      vec3 col3 = vec3(0.93, 0.80, 0.55);

      float wave = sin(st.x * 6.0 + u_time * 0.8) * cos(st.y * 6.0 + u_time * 0.8);
      vec3 finalCol = mix(col1, col2, wave * 0.3 + 0.3);
      finalCol = mix(finalCol, col3, (1.0 - d) * 0.25);

      gl_FragColor = vec4(finalCol, 1.0);
    }
  `;

  function createShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, createShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, createShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1,
  ]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(prog, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const resLoc = gl.getUniformLocation(prog, 'u_resolution');
  const timeLoc = gl.getUniformLocation(prog, 'u_time');

  let startTime = performance.now();
  renderWhileVisible(canvas, () => {
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, (performance.now() - startTime) * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  });
}

/* ── 4. Hero 360° Panorama Virtual Tour Engine ── */
function initHeroVirtualTour() {
  const canvas = document.getElementById('tourCanvas');
  if (!canvas) return;

  const roomData = [
    { name: 'Grand Living Room', floor: 'Ground Floor', texture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85' },
    { name: 'Gourmet Kitchen', floor: 'Ground Floor', texture: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=85' },
    { name: 'Master Suite', floor: 'Upper Floor', texture: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=85' },
    { name: 'Spa Bathroom', floor: 'Upper Floor', texture: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=2400&q=85' },
    { name: 'Skyline Terrace', floor: 'Rooftop', texture: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=85' }
  ];

  let currentRoomIdx = 0;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 0.1);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // A full-screen sphere at DPR 2 on a phone is a ~1.6M-pixel target every
  // frame for an image that is soft to begin with. 1.5 is indistinguishable
  // here and costs 44% fewer pixels.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_TOUCH ? 1.5 : 2));

  // Equirectangular Sphere
  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);

  const textureLoader = new THREE.TextureLoader();

  // Built on first use, not all five up front. The banner only reveals one
  // room every five seconds, so eagerly loading the set meant a visitor who
  // scrolled past the hero in three seconds still paid for five
  // equirectangular frames to look at one.
  const materials = [];
  function materialFor(idx) {
    if (!materials[idx]) {
      const tex = textureLoader.load(panoTextureURL(roomData[idx].texture));
      materials[idx] = new THREE.MeshBasicMaterial({ map: tex });
    }
    return materials[idx];
  }

  // Warm the room the banner is about to reveal, so the swap is never
  // waiting on a download while staying off the critical path for the first
  // paint. Called after each switch rather than before.
  function warmNextRoom(idx) {
    materialFor((idx + 1) % roomData.length);
  }

  const sphere = new THREE.Mesh(geometry, materialFor(0));
  scene.add(sphere);

  // Drag & Inertia state
  let isUserInteracting = false;
  let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
  let lon = 0, onPointerDownLon = 0;
  let lat = 0, onPointerDownLat = 0;
  let phi = 0, theta = 0;
  let autoRotate = true;

  // touch-action: pan-y (CSS) already hands vertical touch drags back
  // to native scroll, but pointerType is checked here too as a second
  // layer: on a full-viewport canvas like this one, any gap between
  // the two would mean a visitor can't scroll the page at all on
  // mobile, so look-around dragging is mouse/pen only. Touch still
  // gets the ambient auto-rotate + auto-cycling room banner.
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    isUserInteracting = true;
    onPointerDownPointerX = e.clientX;
    onPointerDownPointerY = e.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isUserInteracting) return;
    lon = (onPointerDownPointerX - e.clientX) * 0.1 + onPointerDownLon;
    lat = (e.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
  });

  window.addEventListener('pointerup', () => { isUserInteracting = false; });

  // silent=true (the auto-cycle banner) skips the "GROUND FLOOR / Grand
  // Living Room" title card entirely and just crossfades the canvas
  // straight to the next room — reads as continuous live movement
  // rather than a slideshow. Manual floor-nav clicks still get the
  // card, since naming the room someone explicitly picked is useful.
  // One caller: the auto-cycling banner. The silent flag, the room-name label
  // and the floorplan node highlighting all existed for the manual tour panel,
  // which was never reachable and has been removed.
  function switchRoom(idx) {
    if (idx === currentRoomIdx) return;

    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    setTimeout(() => {
      sphere.material = materialFor(idx);
      currentRoomIdx = idx;
      warmNextRoom(idx);
      restartRoomBanner();
      canvas.style.opacity = '1';
    }, 600);
  }

  // Render Loop — stops once the hero has scrolled away. It is the one
  // panorama that must exist at load, but it does not have to keep drawing
  // for the rest of the page.
  function animate() {
    if (autoRotate && !isUserInteracting) lon += 0.05;

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.target = new THREE.Vector3(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta)
    );

    camera.lookAt(camera.target);
    renderer.render(scene, camera);
  }
  renderWhileVisible(canvas, animate, '0px');

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Moving banner: auto-cycle through every room (Living Room, Kitchen,
  // Terrace, etc.) right in the hero, on a timer — no scroll required.
  // Replaces the old scroll-jacked pin, which reserved a large dead
  // scroll range and read as a blank/stuck page rather than a tour.
  // Pauses while the visitor is actively dragging to look around, and
  // restarts its countdown whenever a room changes for any reason
  // (auto or a manual floor-nav click) so the two never fight.
  const ROOM_BANNER_INTERVAL_MS = 5000;
  let roomBannerTimer = null;

  function restartRoomBanner() {
    if (roomBannerTimer) clearInterval(roomBannerTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    roomBannerTimer = setInterval(() => {
      if (isUserInteracting) return;
      switchRoom((currentRoomIdx + 1) % roomData.length);
    }, ROOM_BANNER_INTERVAL_MS);
  }

  restartRoomBanner();
}

/* ── 5. Before / After Interactive Slider ── */
function initBeforeAfterSlider() {
  const container = document.getElementById('baContainer');
  const after = document.getElementById('baAfter');
  const handle = document.getElementById('baHandle');
  if (!container || !after || !handle) return;

  let isDragging = false;

  function setPos(x) {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    posX = Math.max(0, Math.min(posX, rect.width));
    const pct = (posX / rect.width) * 100;
    after.style.width = `${pct}%`;
    handle.style.left = `${pct}%`;
  }

  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    setPos(e.clientX);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    setPos(e.clientX);
  });

  window.addEventListener('pointerup', () => { isDragging = false; });
}

/* ── 9. Cursor Reticle ── */
function initCursorReticle() {
  // Overlay only — never hides the native cursor, so tour-canvas grab,
  // the before/after handle and the FOV slider keep working normally.
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  (function raf() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(raf);
  })();

  const hoverSelector = 'a, button, input, select, textarea, .price-card';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(hoverSelector)) ring.classList.add('hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(hoverSelector)) ring.classList.remove('hover');
  });

  window.addEventListener('pointerdown', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ── 10. Magnetic Buttons — pull toward the cursor within their own bounds ── */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const strength = 0.35;

  document.querySelectorAll('.magnetic').forEach((el) => {
    const useGsap = !!window.gsap;
    const setX = useGsap ? gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }) : null;
    const setY = useGsap ? gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }) : null;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const moveX = (e.clientX - rect.left - rect.width / 2) * strength;
      const moveY = (e.clientY - rect.top - rect.height / 2) * strength;
      if (useGsap) {
        setX(moveX);
        setY(moveY);
      } else {
        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      if (useGsap) {
        setX(0);
        setY(0);
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    });
  });
}

/* ── 11. Reusable Mini 360° Panorama (Services page, one per industry) ── */
/* Drives every drag-to-look panorama on the page. The selector is the
   data attribute rather than .service-tour-canvas so a standalone viewer can
   opt in without inheriting the service blocks' pinned scroll behaviour —
   initServicePinning() scopes itself to .service-block, so only those get
   their pan driven by scroll. */
function initServiceTours() {
  // Nothing here is built at load. Five of these canvases sit far below the
  // fold, and eagerly constructing them meant five WebGL contexts and five
  // multi-hundred-KB equirectangular textures on a phone before the visitor
  // had scrolled past the hero. Each one is now built when it comes within a
  // screen's reach, which is early enough that it is always ready by the time
  // it is looked at.
  //
  // initServicePinning() already reaches for canvas.panoramaAPI optionally,
  // so a canvas that has not been built yet simply has no pan to drive.
  document.querySelectorAll('canvas[data-panorama]').forEach((canvas) => {
    if (!canvas.dataset.panorama || !window.THREE) return;

    let built = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || built) return;
      built = true;
      io.disconnect();
      buildPanorama(canvas);
    }, { rootMargin: '100% 0px' });
    io.observe(canvas);
  });
}

function buildPanorama(canvas) {
  {
    const url = panoTextureURL(canvas.dataset.panorama);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_TOUCH ? 1.5 : 2));

    const geometry = new THREE.SphereGeometry(500, 48, 32);
    geometry.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader().load(url);
    const sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    scene.add(sphere);

    let isDragging = false, autoRotate = true;
    let startX = 0, startY = 0, lon = 180, startLon = 0, lat = 0, startLat = 0;
    let lastScrollProgress = 0;

    // Exposed so initServicePinning() can drive this same panorama's pan
    // from the pinned scroll progress, without either module reaching
    // into the other's closure state directly.
    canvas.panoramaAPI = {
      setAutoRotate(v) { autoRotate = v; },
      setScrollProgress(p) {
        lon += (p - lastScrollProgress) * 260;
        lastScrollProgress = p;
      },
    };

    // Touch is excluded by default for the same reason as the hero canvas —
    // without it, swiping to scroll past one of these panoramas gets captured
    // as a look-around drag instead. touch-action: pan-y (CSS) is the first
    // layer; this is the second.
    //
    // A viewer that opts in with data-touch-pan gets touch as well, but only
    // on the horizontal axis: pan-y means the browser keeps vertical gestures
    // for scrolling and only hands us the sideways ones, so looking around
    // and scrolling the page never compete for the same swipe.
    const touchPan = canvas.hasAttribute('data-touch-pan');
    let touchDrag = false;

    canvas.addEventListener('pointerdown', (e) => {
      touchDrag = e.pointerType === 'touch';
      if (touchDrag && !touchPan) return;
      isDragging = true;
      autoRotate = false;
      startX = e.clientX; startY = e.clientY;
      startLon = lon; startLat = lat;
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      lon = (startX - e.clientX) * 0.15 + startLon;
      if (!touchDrag) lat = (e.clientY - startY) * 0.15 + startLat;
    });
    window.addEventListener('pointerup', () => { isDragging = false; });

    // Retire the "drag to look around" prompt the moment it has been obeyed.
    // The flag goes on the frame, not the canvas, so the CSS can reach the
    // hint as a descendant rather than an adjacent sibling — three.js owns
    // the canvas element, and a sibling selector makes the styling hostage
    // to DOM order inside a container it controls.
    canvas.addEventListener('pointerdown', () => {
      if (!isDragging) return;
      canvas.closest('.pano-frame')?.classList.add('is-explored');
    });

    function animate() {
      if (autoRotate) lon += 0.035;
      lat = Math.max(-75, Math.min(75, lat));
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      camera.target = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    }
    renderWhileVisible(canvas, animate, '0px');

    const observer = new ResizeObserver(() => {
      if (!canvas.clientWidth || !canvas.clientHeight) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    observer.observe(canvas);
  }
}

/* ── 12. Service Section Scroll-Pin — hold the tour, then release ──
   Each service block pins in place for one viewport height of extra
   scroll: the panorama pans through it in sync with the scrub, then
   once that allotment is used up the section unpins and normal page
   scroll carries on to the next one. Desktop only — stacking a scroll
   hijack on top of native touch-scroll gestures is exactly the kind of
   thing that feels broken on a phone, so touch devices just keep plain
   drag-to-look-around with no pinning. */
function initServicePinning() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.service-block').forEach((block) => {
    const canvas = block.querySelector('.service-tour-canvas');
    if (!canvas) return;

    ScrollTrigger.create({
      trigger: block,
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => canvas.panoramaAPI?.setScrollProgress(self.progress),
      onEnter: () => canvas.panoramaAPI?.setAutoRotate(false),
      onEnterBack: () => canvas.panoramaAPI?.setAutoRotate(false),
      onLeave: () => canvas.panoramaAPI?.setAutoRotate(true),
      onLeaveBack: () => canvas.panoramaAPI?.setAutoRotate(true),
    });
  });
}

/* ── 13. Hook Section — pinned word-by-word reveal into Services ──
   Pins for the section's full scroll distance and staggers each word
   in on its own slice of that scroll, ending on the CTA into
   services.html. Falls back to a plain static (fully visible, unpinned)
   section when GSAP/ScrollTrigger is unavailable, on touch devices, or
   under prefers-reduced-motion — same guard pattern as
   initServicePinning(), since pinning is a desktop enhancement, not a
   requirement for the content to be readable. */
function initHookReveal() {
  const section = document.getElementById('hook');
  if (!section) return;

  const words = section.querySelectorAll('.hook-words .hook-word');
  const taglineWords = section.querySelectorAll('.hook-tagline .hook-tagline-word');
  const paras = section.querySelectorAll('.hook-body .hook-para');

  if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(words, { opacity: 0.14, y: '0.4em' });
  gsap.set(taglineWords, { opacity: 0, y: '0.5em' });
  gsap.set(paras, { opacity: 0, y: 18 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      pin: '.hook-pin',
    }
  });

  // One line per scroll beat. Each line resolves as a whole rather than word
  // by word: the statement lands, holds, and only then does the tagline
  // answer it. A per-word stagger spread the sentence across a third of the
  // scrub, so the visitor was reading it a word at a time and no single
  // moment belonged to the finished line.
  //
  // Durations are relative, not absolute — ScrollTrigger's scrub normalises
  // the whole timeline across the section's scroll distance, so these numbers
  // set the proportion of the scroll each beat owns.
  tl.to(words, {
    opacity: 1,
    y: 0,
    ease: 'power2.out',
    duration: 1,
  });

  tl.to({}, { duration: 1 }); // the statement holds on its own

  tl.to(taglineWords, {
    opacity: 1,
    y: 0,
    ease: 'power2.out',
    duration: 1,
  });

  tl.to({}, { duration: 1 }); // and so does the tagline, before the body

  // Whole paragraphs, not per-word. At reading size a word-by-word stagger
  // reads as a stutter rather than as choreography, and the two display lines
  // above have already earned that treatment — repeating it here would flatten
  // the distinction between the statement and its explanation.
  tl.to(paras, {
    opacity: 1,
    y: 0,
    ease: 'power2.out',
    duration: 1,
    stagger: 0.35,
  });

  tl.to({}, { duration: 0.8 }); // let the finished block sit before releasing
}

/* ── 8. Inquiry Form — one-click submit via /api/contact ──
   Posts straight to the serverless endpoint so the enquiry lands in
   thamco360@gmail.com without the visitor ever leaving the page or
   touching their own mail client. */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn = document.getElementById('contactSubmitBtn');
  const status = document.getElementById('contactStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Every field the form actually collects. propertySize, floors, rooms and
    // service were missing here while /api/contact was already reading them
    // and printing them into the enquiry email — so those four lines arrived
    // as "—" on every single lead, however carefully the visitor filled them
    // in. The API is the contract; this now matches it.
    const payload = {
      name: document.getElementById('contactName').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      propertyType: document.getElementById('contactType').value,
      propertySize: document.getElementById('contactSize').value,
      floors: document.getElementById('contactFloors').value.trim(),
      rooms: document.getElementById('contactRooms').value.trim(),
      service: document.getElementById('contactService').value,
      message: document.getElementById('contactMsg').value.trim(),
      company: document.getElementById('contactCompany').value, // honeypot
    };

    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try WhatsApp instead.');

      status.className = 'form-status success';
      status.textContent = "Thanks — we've got your enquiry and will be in touch shortly.";
      form.reset();
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = err.message || 'Could not send right now. Please try WhatsApp instead.';
    } finally {
      btn.disabled = false;
    }
  });
}

/* ── 13. Hero Intro Timeline ──
   The one piece of choreography the visitor is guaranteed to see, so it is
   hand-built rather than handed to the generic .reveal-up observer:

     eyebrow  → fades up first, establishing the top-left origin of the F
     H1 lines → rise out of their masks on a 0.09s stagger, so the eye is
                pulled left-to-right down the stack rather than shown a
                block of type all at once
     lead/quote/CTA → follow on the same rail, each a touch later, which is
                what makes the column read top-down instead of as one flash

   Everything is offset against a small lead-in so the panorama behind has a
   beat to settle before type lands on it. */
function initHeroIntro() {
  const root = document.documentElement;
  const overlay = document.getElementById('heroOverlay');
  if (!overlay) return;

  const clear = () => root.classList.remove('motion-ready');

  // No GSAP, or the visitor asked for less motion: show the final state.
  if (!window.gsap || PREFERS_REDUCED) { clear(); return; }

  // Failsafe for the one thing that actually matters: the timeline never
  // starting at all (a throw during setup, GSAP present but broken). It is
  // cancelled on the first rendered frame — once GSAP is demonstrably
  // driving the timeline, opacity is guaranteed to reach 1, so there is no
  // need to race the timeline's own duration. Waiting for onComplete instead
  // made this a coin flip: the run lands around 2.2s on a cold load, against
  // a 2.5s timer.
  const failsafe = setTimeout(clear, 4000);

  const lines = overlay.querySelectorAll('.h1-line-i');
  const label = overlay.querySelector('.pre-label');
  const lead = overlay.querySelector('.hero-p');
  const quote = overlay.querySelector('.hero-quote');
  const btns = overlay.querySelector('.hero-btns');
  const cue = overlay.querySelector('.scroll-cue');

  const tl = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onStart: () => clearTimeout(failsafe),
    onComplete: () => {
      clearTimeout(failsafe);
      // The class only ever existed to stop a pre-intro flash. Drop it now
      // that the intro is over, so the stylesheet's opacity:0 rule is not
      // left hanging over the hero for the rest of the session.
      clear();
      // Hand the promoted layers back once they have stopped moving —
      // leaving will-change on permanently keeps the memory pinned.
      gsap.set([lines, label, lead, quote, btns, cue].filter(Boolean), { clearProps: 'willChange' });
    }
  });

  if (label) {
    tl.fromTo(label, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 0.15);
  }

  if (lines.length) {
    tl.fromTo(lines,
      { opacity: 0, yPercent: 108 },
      { opacity: 1, yPercent: 0, duration: 1.25, stagger: 0.09 },
      0.28);
  }

  [[lead, 0.66], [quote, 0.78], [btns, 0.9]].forEach(([el, at]) => {
    if (el) tl.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1 }, at);
  });

  if (cue) {
    tl.fromTo(cue, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 1.15);
  }
}

/* ── 14. Parallax ──
   Two layers of depth, both scrubbed off the same Lenis-driven ScrollTrigger
   so they stay in lockstep with the smooth scroll:

     a) the hero column, which drifts up slower than the page and dims as it
        leaves — the panorama behind it therefore appears to sit further back
     b) any [data-parallax] element, where the attribute value is the share
        of its own height it should travel over the scroll past it

   Skipped entirely on coarse pointers: sustained transform scrubbing on a
   mobile GPU costs more than the effect returns, and mobile browsers already
   move the URL bar under the finger, which fights it. */
function initParallax() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (PREFERS_REDUCED) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // (a) Hero column depth.
  const heroInner = document.getElementById('heroParallax');
  const heroSection = document.getElementById('virtual-tour');
  if (heroInner && heroSection) {
    gsap.to(heroInner, {
      yPercent: -16,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });
  }

  // (b) Generic depth layers.
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax);
    if (!depth) return;

    // Travel is centred on the element (-half → +half) so it sits in its
    // designed position when it is level with the middle of the viewport,
    // rather than starting displaced.
    const travel = depth * 100;
    gsap.fromTo(el,
      { yPercent: -travel / 2 },
      {
        yPercent: travel / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.parallax-frame') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6
        }
      });
  });
}


/* ── 15. The Journey ──
   Draws the five-stage capture-to-experience diagram as the section scrolls
   through. Three things move together:

     the rail  — scrubbed, so its fill tracks scroll position directly and
                 reverses cleanly if the visitor scrolls back up
     the steps — a one-shot rise as the row enters view
     the icons — each SVG path drawn on from zero length, which is why the
                 icons are inline markup rather than <img>

   The whole thing is progressive enhancement: the diagram is fully legible
   with no JS at all, so every failure path here simply leaves it static. */
function initJourney() {
  const journey = document.getElementById('journey');
  if (!journey) return;

  const steps = [...journey.querySelectorAll('.journey-step')];
  const fill = document.getElementById('journeyRailFill');
  if (!steps.length) return;

  // Reduced motion, or no GSAP: light every stage and fill the rail, so the
  // finished state is what gets shown rather than a half-drawn diagram.
  if (!window.gsap || !window.ScrollTrigger || PREFERS_REDUCED) {
    steps.forEach(s => s.classList.add('is-lit'));
    if (fill) fill.style.transform = 'scaleX(1)';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Prime every stroke to zero length. getTotalLength() covers <path>; the
  // primitives (circle/ellipse/rect/line) do not implement it, so they fall
  // back to their own geometry. Anything that cannot be measured is left
  // alone and simply appears without a draw-on.
  const strokes = [];
  journey.querySelectorAll('.journey-icon svg > *').forEach(el => {
    let len = 0;
    if (typeof el.getTotalLength === 'function') {
      try { len = el.getTotalLength(); } catch (e) { len = 0; }
    }
    if (!len) {
      const r = parseFloat(el.getAttribute('r'));
      const rx = parseFloat(el.getAttribute('rx'));
      const ry = parseFloat(el.getAttribute('ry'));
      const w = parseFloat(el.getAttribute('width'));
      const h = parseFloat(el.getAttribute('height'));
      if (r) len = 2 * Math.PI * r;
      else if (rx && ry) len = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
      else if (w && h) len = 2 * (w + h);
    }
    if (!len) return;
    // A dashed seam carries its own stroke-dasharray for looks; overwriting
    // it with the draw-on pattern would turn it solid.
    if (el.getAttribute('stroke-dasharray')) return;
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    strokes.push({ el, len });
  });

  gsap.set(steps, { opacity: 0, y: 26 });

  // Steps and their strokes: one pass, as the row arrives.
  ScrollTrigger.create({
    trigger: journey,
    start: 'top 82%',
    once: true,
    onEnter: () => {
      gsap.to(steps, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.13
      });
      gsap.to(strokes.map(s => s.el), {
        strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: 0.035, delay: 0.15,
        onComplete: () => gsap.set(strokes.map(s => s.el), { clearProps: 'strokeDasharray,strokeDashoffset' })
      });
    }
  });

  // Rail: scrubbed across the row, lighting each stage as it passes.
  if (fill) {
    ScrollTrigger.create({
      trigger: journey,
      start: 'top 70%',
      end: 'bottom 65%',
      scrub: 0.5,
      onUpdate: (self) => {
        gsap.set(fill, { scaleX: self.progress });
        const reached = Math.round(self.progress * steps.length);
        steps.forEach((step, i) => step.classList.toggle('is-lit', i < reached));
      }
    });
  }
}
