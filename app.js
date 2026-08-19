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
  } catch (e) {
    console.log('Lenis fallback');
  }

  // Lucide Icons
  if (window.lucide) lucide.createIcons();

  // Initialize Modules
  initBackgroundShader();
  initHeroVirtualTour();
  initCinematicTextReveals();
  initModelViewer();
  initProceduralRoseCore();
  initBeforeAfterSlider();
  initContactForm();
  initLiveScrollObserver();
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
    { id: 'virtual-tour', name: '01 · Hero Virtual Tour' },
    { id: 'process', name: '02 · Spatial Pipeline' },
    { id: 'models', name: '03 · Interactive 3D Preview' },
    { id: 'spatial-tech', name: '04 · 2D to 3D Optical' },
    { id: 'pricing', name: '05 · Pricing Packages' },
    { id: 'contact', name: '06 · Book 3D Scan' }
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
      vec3 col1 = vec3(0.04, 0.02, 0.1);
      vec3 col2 = vec3(0.54, 0.36, 0.96);
      vec3 col3 = vec3(0.02, 0.71, 0.83);

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
      btnAutoRotate.style.color = autoRotate ? '#8b5cf6' : '#fff';
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

  // GSAP ScrollTrigger for room walkthrough transitions
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: '#tourScrollDriver',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const roomCount = roomData.length;
        const targetRoom = Math.min(roomCount - 1, Math.floor(self.progress * roomCount));
        if (targetRoom !== currentRoomIdx) {
          switchRoom(targetRoom);
        }
      }
    });
  }
}

/* ── 5. Interactive 3D Model Mesh Explorer ── */
function initModelViewer() {
  const container = document.getElementById('modelWrapper');
  const canvas = document.getElementById('modelCanvas');
  if (!canvas || !container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(4, 3, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  let controls;
  if (window.THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
  }

  // Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0x8b5cf6, 1.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  // Architectural Villa Placeholder Model
  const villaGroup = new THREE.Group();

  // Base
  const baseGeo = new THREE.BoxGeometry(4, 0.2, 3);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, wireframe: true });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  villaGroup.add(baseMesh);

  // Structure
  const houseGeo = new THREE.BoxGeometry(3, 2, 2);
  const houseMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, wireframe: true });
  const houseMesh = new THREE.Mesh(houseGeo, houseMat);
  houseMesh.position.y = 1.1;
  villaGroup.add(houseMesh);

  scene.add(villaGroup);

  // Toggle buttons
  const btnWireframe = document.getElementById('ctrlWireframe');
  const btnSolid = document.getElementById('ctrlSolid');
  const btnOrbit = document.getElementById('ctrlOrbit');

  if (btnWireframe) {
    btnWireframe.addEventListener('click', () => {
      baseMat.wireframe = true;
      houseMat.wireframe = true;
      btnWireframe.classList.add('active');
      btnSolid.classList.remove('active');
    });
  }

  if (btnSolid) {
    btnSolid.addEventListener('click', () => {
      baseMat.wireframe = false;
      houseMat.wireframe = false;
      btnSolid.classList.add('active');
      btnWireframe.classList.remove('active');
    });
  }

  if (btnOrbit && controls) {
    btnOrbit.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      btnOrbit.classList.toggle('active', controls.autoRotate);
    });
  }

  function render() {
    requestAnimationFrame(render);
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  render();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ── 6. Procedural Spatial Geometry Core (Rose-like Procedural Canvas) ── */
function initProceduralRoseCore() {
  const canvas = document.getElementById('roseCanvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 3.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Procedural Petal Torus Knot / Spiral Mesh
  const geo = new THREE.TorusKnotGeometry(0.8, 0.25, 120, 16);
  const mat = new THREE.MeshNormalMaterial({ wireframe: true });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.015;
    renderer.render(scene, camera);
  }
  animate();
}

/* ── 7. Before / After Interactive Slider ── */
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

/* ── 8. WhatsApp Inquiry Form Handoff ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const type = document.getElementById('contactType').value;
    const msg = document.getElementById('contactMsg').value;

    const text = `Hi Thamco360! I would like to book a 3D Spatial Scan.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Property Type:* ${type}\n*Details:* ${msg}`;
    const url = `https://wa.me/918618271183?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
  });
}
