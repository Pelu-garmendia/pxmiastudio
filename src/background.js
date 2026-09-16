import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = new THREE.Color(0x6fe3ff);
const DIM = new THREE.Color(0x2a3550);

// Points on the globe's surface, given as [longitude, latitude] in degrees.
// Index 0 is the hub (the studio); the rest are cities it reaches. A denser
// network than a strict hub-and-spoke: a few direct city-to-city links too,
// so it reads as a real network rather than a single star.
const NETWORK_POINTS = [
  { lon: -58, lat: -34 }, // 0 hub: Buenos Aires
  { lon: -74, lat: 4 }, // 1 Bogotá
  { lon: -99, lat: 19 }, // 2 Ciudad de México
  { lon: -70, lat: -33 }, // 3 Santiago
  { lon: -46, lat: -23 }, // 4 São Paulo
  { lon: -3, lat: 40 }, // 5 Madrid
  { lon: 2, lat: 41 }, // 6 Barcelona
  { lon: 0, lat: 51 }, // 7 Londres
  { lon: -80, lat: 26 }, // 8 Miami
  { lon: -74, lat: 41 }, // 9 Nueva York
  { lon: -79, lat: 44 }, // 10 Toronto
];

// Which points connect to which, by index into NETWORK_POINTS.
const CONNECTIONS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 8],
  [0, 9],
  [1, 2],
  [3, 4],
  [5, 6],
  [8, 9],
  [9, 10],
  [9, 7],
];

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildGlobe(radius) {
  const group = new THREE.Group();

  // Wireframe sphere - lat/long grid reads as a globe on its own.
  const sphereGeo = new THREE.SphereGeometry(radius, 24, 18);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x2f4368,
    wireframe: true,
    transparent: true,
    opacity: 0.24,
  });
  group.add(new THREE.Mesh(sphereGeo, sphereMat));

  // A faint solid fill behind the wireframe so the far side of the grid
  // doesn't visually merge with the near side.
  const fillMat = new THREE.MeshBasicMaterial({
    color: 0x05070d,
    transparent: true,
    opacity: 0.55,
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 0.99, 24, 18), fillMat));

  const nodeGeo = new THREE.SphereGeometry(radius * 0.02, 8, 8);
  const nodePositions = NETWORK_POINTS.map((p) => latLonToVector3(p.lat, p.lon, radius));

  nodePositions.forEach((pos, i) => {
    const nodeMat = new THREE.MeshBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: i === 0 ? 0.9 : 0.55,
    });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.copy(pos);
    group.add(node);
  });

  const pulses = [];

  CONNECTIONS.forEach(([a, b], i) => {
    const start = nodePositions[a];
    const end = nodePositions[b];

    // Arc between the two points, lifted above the sphere's surface.
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.3);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
    const arcMat = new THREE.LineBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0.28,
    });
    group.add(new THREE.Line(arcGeo, arcMat));

    // A small traveling pulse that loops along the arc, staggered per route.
    const pulseMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 });
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.018, 6, 6), pulseMat);
    group.add(pulse);
    pulses.push({ curve, pulse, delay: i * 0.45 });
  });

  return { group, pulses };
}

export function initBackground(canvas, { reduceMotion = false } = {}) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Sparse particle field - a subtle drifting grid of points.
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

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // A rotating globe with a small network of connection arcs, tucked toward
  // the back-right so it reads as ambient texture, not a focal illustration.
  const { group: globe, pulses } = buildGlobe(2.8);
  globe.position.set(3.4, -0.2, -4.6);
  globe.rotation.set(0.35, 0, 0.1);
  scene.add(globe);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  if (reduceMotion) {
    // Render a single static frame; no drift, no parallax, no rAF loop.
    renderer.render(scene, camera);
    return;
  }

  // Pulses loop endlessly along their arc - motivated motion (shows the
  // network "connecting"), muted opacity, stopped entirely above under
  // reduced motion.
  pulses.forEach(({ curve, pulse, delay }) => {
    const progress = { t: 0 };
    gsap.to(progress, {
      t: 1,
      duration: 2.6,
      delay,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        pulse.position.copy(curve.getPointAt(progress.t));
        pulse.material.opacity = Math.sin(progress.t * Math.PI) * 0.9;
      },
    });
  });

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let scrollProgress = 0;
  ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - window.innerHeight,
    onUpdate: (self) => {
      scrollProgress = self.progress;
    },
  });

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    points.rotation.y = t * 0.02 + scrollProgress * 0.6;
    points.rotation.x = t * 0.01;

    globe.rotation.y = t * 0.06 + scrollProgress * 0.4;

    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
