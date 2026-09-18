import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { feature } from "topojson-client";
import landTopo from "world-atlas/land-110m.json";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = new THREE.Color(0x6fe3ff);
const DIM = new THREE.Color(0x2a3550);

// [name, lon, lat]. Index 0 is the studio hub; the rest span every continent.
const CITIES = [
  ["Buenos Aires", -58, -34],
  ["Bogotá", -74, 4],
  ["Ciudad de México", -99, 19],
  ["Santiago", -70, -33],
  ["São Paulo", -46, -23],
  ["Madrid", -3, 40],
  ["Londres", 0, 51],
  ["Miami", -80, 26],
  ["Nueva York", -74, 41],
  ["Los Ángeles", -118, 34],
  ["Toronto", -79, 44],
  ["Lima", -77, -12],
  ["Lagos", 3, 6],
  ["El Cairo", 31, 30],
  ["Johannesburgo", 28, -26],
  ["Nairobi", 37, -1],
  ["Dubái", 55, 25],
  ["Mumbai", 73, 19],
  ["Delhi", 77, 28],
  ["Singapur", 104, 1],
  ["Yakarta", 107, -6],
  ["Bangkok", 101, 14],
  ["Hong Kong", 114, 22],
  ["Shanghái", 121, 31],
  ["Tokio", 140, 36],
  ["Seúl", 127, 37],
  ["Sídney", 151, -34],
  ["Melbourne", 145, -38],
  ["Moscú", 37, 56],
  ["Berlín", 13, 52],
  ["Estambul", 29, 41],
  ["Dakar", -17, 15],
  ["Casablanca", -8, 34],
  ["Vancouver", -123, 49],
  ["Auckland", 175, -37],
];

const CONNECTIONS = [
  [0, 4], [0, 3], [0, 1], [0, 11], [0, 5], [0, 8], [0, 7], [0, 12], [0, 14],
  [1, 2], [2, 9], [9, 33], [9, 8], [8, 10], [8, 6], [6, 29], [6, 5], [5, 32],
  [32, 31], [31, 12], [12, 14], [12, 13], [13, 16], [13, 30], [30, 28],
  [28, 29], [16, 17], [17, 18], [17, 19], [19, 20], [19, 21], [21, 22],
  [22, 23], [23, 24], [24, 25], [20, 26], [26, 27], [26, 34], [14, 15],
  [15, 16], [4, 31], [24, 9], [22, 19], [18, 28],
];

// Hubs the AI node talks to; spread across the planet so some are always facing us.
const AI_HUBS = [0, 5, 8, 16, 19, 24, 26, 14];

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function quadPoint(a, c, b, t, out) {
  const u = 1 - t;
  return out.set(
    u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    u * u * a.z + 2 * u * t * c.z + t * t * b.z
  );
}

// Real continents (Natural Earth via world-atlas) painted to an equirectangular
// texture: one map for surface color, one for night-side city lights.
function buildEarthTextures() {
  const W = 2048;
  const H = 1024;
  const project = ([lon, lat]) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];
  const land = feature(landTopo, landTopo.objects.land);

  const tracePath = (ctx) => {
    ctx.beginPath();
    const geoms = land.type === "FeatureCollection" ? land.features.map((f) => f.geometry) : [land.geometry];
    geoms.forEach((g) => {
      const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
      polys.forEach((poly) =>
        poly.forEach((ring) => {
          ring.forEach((pt, i) => {
            const [x, y] = project(pt);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
        })
      );
    });
  };

  const color = document.createElement("canvas");
  color.width = W;
  color.height = H;
  const c = color.getContext("2d");
  const ocean = c.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0, "#050f1d");
  ocean.addColorStop(0.5, "#08182b");
  ocean.addColorStop(1, "#050f1d");
  c.fillStyle = ocean;
  c.fillRect(0, 0, W, H);
  tracePath(c);
  c.fillStyle = "#14283f";
  c.fill("evenodd");
  c.strokeStyle = "rgba(140,220,255,0.28)";
  c.lineWidth = 1.6;
  c.stroke();

  const lights = document.createElement("canvas");
  lights.width = W;
  lights.height = H;
  const l = lights.getContext("2d");
  l.fillStyle = "#000";
  l.fillRect(0, 0, W, H);

  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const m = mask.getContext("2d", { willReadFrequently: true });
  tracePath(m);
  m.fillStyle = "#fff";
  m.fill("evenodd");
  const data = m.getImageData(0, 0, W, H).data;

  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    if (data[(Math.floor(y) * W + Math.floor(x)) * 4] < 128) continue;
    const lat = 90 - (y / H) * 180;
    if (Math.random() > Math.exp(-(((lat - 35) / 28) ** 2)) * 0.9 + 0.06) continue;
    l.fillStyle = `rgba(190,240,255,${0.35 + Math.random() * 0.6})`;
    const s = 0.8 + Math.random() * 1.4;
    l.fillRect(x, y, s, s);
  }
  CITIES.forEach(([, lon, lat]) => {
    const [x, y] = project([lon, lat]);
    const g = l.createRadialGradient(x, y, 0, x, y, 9);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(120,220,255,0)");
    l.fillStyle = g;
    l.fillRect(x - 9, y - 9, 18, 18);
  });

  const mk = (cv) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  return { map: mk(color), emissive: mk(lights) };
}

function buildAiIconTexture() {
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const c = cv.getContext("2d");
  c.beginPath();
  c.arc(128, 128, 116, 0, Math.PI * 2);
  c.fillStyle = "rgba(4,10,20,0.88)";
  c.fill();
  c.lineWidth = 6;
  c.strokeStyle = "#6fe3ff";
  c.stroke();

  const sparkle = (cx, cy, r) => {
    c.beginPath();
    c.moveTo(cx, cy - r);
    c.quadraticCurveTo(cx, cy, cx + r, cy);
    c.quadraticCurveTo(cx, cy, cx, cy + r);
    c.quadraticCurveTo(cx, cy, cx - r, cy);
    c.quadraticCurveTo(cx, cy, cx, cy - r);
    c.closePath();
    c.fill();
  };
  c.fillStyle = "#e8fbff";
  sparkle(116, 108, 58);
  c.fillStyle = "#6fe3ff";
  sparkle(176, 68, 24);
  sparkle(180, 136, 16);
  c.fillStyle = "#e8fbff";
  c.font = "700 44px Inter, system-ui, sans-serif";
  c.textAlign = "center";
  c.fillText("IA", 128, 216);

  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildHaloTexture() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const c = cv.getContext("2d");
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(111,227,255,0.8)");
  g.addColorStop(0.4, "rgba(111,227,255,0.25)");
  g.addColorStop(1, "rgba(111,227,255,0)");
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
}

function buildPlanet(radius) {
  const system = new THREE.Group();
  const planet = new THREE.Group();
  system.add(planet);

  const tex = buildEarthTextures();
  planet.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(radius, 96, 64),
      new THREE.MeshStandardMaterial({
        map: tex.map,
        emissiveMap: tex.emissive,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.7,
        roughness: 0.85,
        metalness: 0,
      })
    )
  );

  const nodePositions = CITIES.map(([, lon, lat]) => latLonToVector3(lat, lon, radius));
  const nodeGeo = new THREE.SphereGeometry(radius * 0.014, 8, 8);
  nodePositions.forEach((pos, i) => {
    const node = new THREE.Mesh(
      nodeGeo,
      new THREE.MeshBasicMaterial({ color: i === 0 ? 0xffffff : ACCENT })
    );
    node.position.copy(pos);
    planet.add(node);
  });

  const pulses = [];
  CONNECTIONS.forEach(([a, b], i) => {
    const start = nodePositions[a];
    const end = nodePositions[b];
    const angle = start.angleTo(end);
    const ctrl = start
      .clone()
      .add(end)
      .normalize()
      .multiplyScalar(radius * (1.08 + (0.9 * angle) / Math.PI));
    const curve = new THREE.QuadraticBezierCurve3(start, ctrl, end);
    planet.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.5 })
      )
    );
    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.016, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    planet.add(pulse);
    pulses.push({ curve, pulse, delay: (i * 0.37) % 3 });
  });

  // AI badge: fixed above the planet (not spinning), wired to hubs on the surface.
  const aiPos = new THREE.Vector3(radius * 0.35, radius * 1.75, radius * 0.7);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: buildHaloTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  halo.position.copy(aiPos);
  halo.scale.setScalar(radius * 1.1);
  system.add(halo);

  const badge = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: buildAiIconTexture(), transparent: true, depthTest: false })
  );
  badge.position.copy(aiPos);
  badge.scale.setScalar(radius * 0.55);
  badge.renderOrder = 10;
  system.add(badge);

  const LINK_PTS = 28;
  const links = AI_HUBS.map((n) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(LINK_PTS * 3), 3));
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ color: 0xbff3ff, transparent: true, opacity: 0.55 })
    );
    line.frustumCulled = false;
    system.add(line);
    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.02, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    system.add(pulse);
    return { node: nodePositions[n], line, pulse, t: 0, visible: false, ctrl: new THREE.Vector3(), end: new THREE.Vector3() };
  });

  return { system, planet, pulses, ai: { pos: aiPos, badge, halo, links, LINK_PTS } };
}

export function initBackground(canvas, { reduceMotion = false } = {}) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const COUNT = 900;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const tmpColor = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 26;
    positions[i3 + 1] = (Math.random() - 0.5) * 16;
    positions[i3 + 2] = (Math.random() - 0.5) * 14;
    tmpColor.copy(DIM).lerp(ACCENT, Math.random() < 0.08 ? 1 : 0);
    colors[i3] = tmpColor.r;
    colors[i3 + 1] = tmpColor.g;
    colors[i3 + 2] = tmpColor.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.75, depthWrite: false })
  );
  scene.add(points);

  scene.add(new THREE.AmbientLight(0x6f8fbf, 0.5));
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.set(-5, 3, 5);
  scene.add(sun);

  const { system, planet, pulses, ai } = buildPlanet(1.9);
  planet.rotation.set(0.4, 0, 0);
  scene.add(system);

  const placeGlobe = () => {
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect < 0.9) system.position.set(0.4, 0.4, -2);
    else system.position.set(Math.min(3.6, 5.13 * aspect - 3.9), -0.2, -2);
  };
  placeGlobe();

  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const center = new THREE.Vector3();

  function updateAiLinks() {
    system.updateMatrixWorld(true);
    system.getWorldPosition(center);
    ai.links.forEach((lk) => {
      tmpA.copy(lk.node).applyMatrix4(planet.matrixWorld);
      const facing = tmpA.clone().sub(center).normalize().dot(tmpB.copy(camera.position).sub(tmpA).normalize());
      lk.visible = facing > 0.05;
      lk.line.visible = lk.visible;
      if (!lk.visible) {
        lk.pulse.material.opacity = 0;
        return;
      }
      lk.end.copy(tmpA).sub(system.position);
      lk.ctrl.copy(ai.pos).add(lk.end).multiplyScalar(0.5).multiplyScalar(1.12);
      const attr = lk.line.geometry.attributes.position;
      for (let i = 0; i < ai.LINK_PTS; i++) {
        quadPoint(ai.pos, lk.ctrl, lk.end, i / (ai.LINK_PTS - 1), tmpB);
        attr.setXYZ(i, tmpB.x, tmpB.y, tmpB.z);
      }
      attr.needsUpdate = true;
      quadPoint(ai.pos, lk.ctrl, lk.end, lk.t, tmpB);
      lk.pulse.position.copy(tmpB);
    });
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    placeGlobe();
  });

  if (reduceMotion) {
    planet.rotation.y = 1.6;
    updateAiLinks();
    renderer.render(scene, camera);
    return;
  }

  pulses.forEach(({ curve, pulse, delay }) => {
    const p = { t: 0 };
    gsap.to(p, {
      t: 1,
      duration: 2.6,
      delay,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        pulse.position.copy(curve.getPointAt(p.t));
        pulse.material.opacity = Math.sin(p.t * Math.PI);
      },
    });
  });

  ai.links.forEach((lk, i) => {
    gsap.to(lk, {
      t: 1,
      duration: 1.6,
      delay: i * 0.45,
      repeat: -1,
      repeatDelay: 1,
      ease: "power1.inOut",
      onUpdate: () => {
        if (lk.visible) lk.pulse.material.opacity = Math.sin(lk.t * Math.PI);
      },
    });
  });
  gsap.to(ai.halo.scale, { x: 2.4, y: 2.4, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut" });

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let scrollProgress = 0;
  ScrollTrigger.create({
    start: 0,
    end: () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
    onUpdate: (self) => {
      scrollProgress = self.progress;
    },
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    points.rotation.y = t * 0.02 + scrollProgress * 0.6;
    points.rotation.x = t * 0.01;
    planet.rotation.y = 1.6 + t * 0.09;

    const bob = Math.sin(t * 0.9) * 0.05;
    ai.badge.position.y = ai.pos.y + bob;
    ai.halo.position.y = ai.pos.y + bob;

    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    updateAiLinks();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
