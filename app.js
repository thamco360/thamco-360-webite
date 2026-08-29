/* ==========================================================================
   THAMCO360 — Main Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lenis Smooth Scroll
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis virtualizes scroll rather than driving native scrollTop, so
    // ScrollTrigger (used below for the hero room driver and the service
    // tour pins) needs to be told explicitly when Lenis moves the page —
    // without this, pinned sections desync from the actual scroll position.
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
  } catch (e) {
    console.log('Lenis fallback');
  }

  // Lucide Icons
  if (window.lucide) lucide.createIcons();

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
  const activeTagLabel = document.getElementById('activeTagLabel');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const sections = [
    { id: 'virtual-tour', name: 'Live Tour' },
    { id: 'portfolio', name: 'Portfolio' },
    { id: 'process', name: 'From Capture to Experience' },
    { id: 'services', name: 'Services' },
    { id: 'real-estate', name: 'By Industry' },
    { id: 'contact', name: 'Book Your 360° Tour' }
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const matched = sections.find(s => s.id === entry.target.id);
        if (matched && activeTagLabel) {
          activeTagLabel.textContent = matched.name;
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
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
  function render() {
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, (performance.now() - startTime) * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  render();
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Equirectangular Sphere
  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);

  const textureLoader = new THREE.TextureLoader();
  const materials = roomData.map(room => {
    const tex = textureLoader.load(room.texture);
    return new THREE.MeshBasicMaterial({ map: tex });
  });

  const sphere = new THREE.Mesh(geometry, materials[0]);
  scene.add(sphere);

  // Drag & Inertia state
  let isUserInteracting = false;
  let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
  let lon = 0, onPointerDownLon = 0;
  let lat = 0, onPointerDownLat = 0;
  let phi = 0, theta = 0;
  let autoRotate = true;

  canvas.addEventListener('pointerdown', (e) => {
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

  function switchRoom(idx) {
    if (idx === currentRoomIdx) return;
    const overlay = document.getElementById('roomTransition');
    const rtFloor = document.getElementById('rtFloor');
    const rtName = document.getElementById('rtName');
    const nameEl = document.getElementById('currentRoomName');

    if (overlay) {
      rtFloor.textContent = roomData[idx].floor;
      rtName.textContent = roomData[idx].name;
      overlay.classList.remove('hidden');
      overlay.classList.add('show');

      setTimeout(() => {
        sphere.material = materials[idx];
        currentRoomIdx = idx;
        if (nameEl) nameEl.textContent = roomData[idx].name;

        document.querySelectorAll('.room-node').forEach((node, nIdx) => {
          node.classList.toggle('active', nIdx === idx);
        });

        restartRoomBanner();

        setTimeout(() => {
          overlay.classList.remove('show');
          setTimeout(() => overlay.classList.add('hidden'), 350);
        }, 400);
      }, 350);
    }
  }

  // Room Node Buttons
  document.querySelectorAll('.room-node').forEach((btn, idx) => {
    btn.addEventListener('click', () => switchRoom(idx));
  });

  // Tour UI Mode Toggle
  const btnEnterTour = document.getElementById('btnEnterTour');
  const btnExitTour = document.getElementById('btnExitTour');
  const heroOverlay = document.getElementById('heroOverlay');
  const tourUI = document.getElementById('tourUI');

  if (btnEnterTour) {
    btnEnterTour.addEventListener('click', () => {
      heroOverlay.classList.add('dissolve');
      tourUI.classList.remove('hidden');
    });
  }

  if (btnExitTour) {
    btnExitTour.addEventListener('click', () => {
      heroOverlay.classList.remove('dissolve');
      tourUI.classList.add('hidden');
    });
  }

  // D-Pad Look Controls
  document.querySelectorAll('.look-btn[data-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir;
      if (dir === 'up') lat += 15;
      if (dir === 'down') lat -= 15;
      if (dir === 'left') lon -= 20;
      if (dir === 'right') lon += 20;
    });
  });

  const btnAutoRotate = document.getElementById('btnAutoRotate');
  if (btnAutoRotate) {
    btnAutoRotate.addEventListener('click', () => {
      autoRotate = !autoRotate;
      btnAutoRotate.style.color = autoRotate ? '#c9962f' : '#fff';
    });
  }

  // FOV Slider
  const fovSlider = document.getElementById('fovSlider');
  if (fovSlider) {
    fovSlider.addEventListener('input', (e) => {
      camera.fov = parseFloat(e.target.value);
      camera.updateProjectionMatrix();
    });
  }

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

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

    // Update Compass Needle
    const compassNeedle = document.getElementById('compassNeedle');
    if (compassNeedle) {
      compassNeedle.style.transform = `translate(-50%, -100%) rotate(${lon}deg)`;
    }

    renderer.render(scene, camera);
  }
  animate();

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

  const hoverSelector = 'a, button, input, select, textarea, .room-node, .look-btn, .zoom-btn, .price-card';
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
function initServiceTours() {
  document.querySelectorAll('.service-tour-canvas').forEach((canvas) => {
    const url = canvas.dataset.panorama;
    if (!url || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      autoRotate = false;
      startX = e.clientX; startY = e.clientY;
      startLon = lon; startLat = lat;
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      lon = (startX - e.clientX) * 0.15 + startLon;
      lat = (e.clientY - startY) * 0.15 + startLat;
    });
    window.addEventListener('pointerup', () => { isDragging = false; });

    function animate() {
      requestAnimationFrame(animate);
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
    animate();

    const observer = new ResizeObserver(() => {
      if (!canvas.clientWidth || !canvas.clientHeight) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    observer.observe(canvas);
  });
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

  const words = section.querySelectorAll('.hook-word');
  const cta = section.querySelector('.hook-cta');

  if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(words, { opacity: 0.14, y: '0.4em' });
  gsap.set(cta, { opacity: 0, y: 16 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      pin: '.hook-pin',
    }
  });

  tl.to(words, { opacity: 1, y: 0, stagger: 0.4, ease: 'power2.out' })
    .to(cta, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.2');
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

    const payload = {
      name: document.getElementById('contactName').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      propertyType: document.getElementById('contactType').value,
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
