import * as THREE from "three";

const ACCENT = new THREE.Color(0xd9ff4b);
const DIM = new THREE.Color(0x3a3a44);

export function initBackground(canvas) {
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

  // Sparse particle field — a subtle drifting grid of points.
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

  // A few large, low-opacity wireframe icosahedrons drifting in the back.
  const shapes = [];
  const shapeGeo = new THREE.IcosahedronGeometry(2.4, 1);
  for (let i = 0; i < 3; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: i === 0 ? ACCENT : 0x55555f,
      wireframe: true,
      transparent: true,
      opacity: i === 0 ? 0.08 : 0.06,
    });
    const mesh = new THREE.Mesh(shapeGeo, mat);
    mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, -6 - i * 3);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(mesh);
    shapes.push(mesh);
  }

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let scrollProgress = 0;
  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    points.rotation.y = t * 0.02 + scrollProgress * 0.6;
    points.rotation.x = t * 0.01;

    shapes.forEach((mesh, i) => {
      mesh.rotation.x += 0.0006 + i * 0.0002;
      mesh.rotation.y += 0.0009 + i * 0.0002;
    });

    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
