import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// 🔥 CONTROALE PRO
controls.rotateSpeed = 3;
controls.zoomSpeed = 6;
controls.panSpeed = 2;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 🔥 ZOOM FIX
controls.minDistance = 1;
controls.maxDistance = 500;

// 🔥 AUTO ROTATE (Sketchfab style)
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;

// 🔥 OPREȘTE ROTIREA CÂND USERUL INTERACȚIONEAZĂ
controls.addEventListener('start', () => {
  controls.autoRotate = false;
});
controls.addEventListener('end', () => {
  controls.autoRotate = true;
});

// Loader
const loader = new GLTFLoader();

loader.load(
  `models/plane/scene.gltf`,
  function (gltf) {
    const object = gltf.scene;
    scene.add(object);

    // 🔥 CENTER + SCALE (FOARTE IMPORTANT)
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    object.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 20 / maxDim;
    object.scale.setScalar(scale);

    // 🔥 camera poziționată corect
    camera.position.set(0, 0, 30);
    controls.target.set(0, 0, 0);
    controls.update();
  }
);

// Lights (clean și eficient)
const light1 = new THREE.DirectionalLight(0xffffff, 2);
light1.position.set(5, 10, 5);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
light2.position.set(-5, 5, -5);
scene.add(light2);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  controls.update(); // 🔥 necesar pentru smooth + autorotate

  renderer.render(scene, camera);
}

animate();
