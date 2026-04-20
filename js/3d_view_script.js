import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  10000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// 🔥 CONTROALE PRO
controls.rotateSpeed = 3;
controls.zoomSpeed = 12;
controls.panSpeed = 3;

controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 🔥 ZOOM NELIMITAT
controls.minDistance = 0.01;
controls.maxDistance = 10000;

controls.screenSpacePanning = true;

// 🔥 AUTO ROTATE (Sketchfab style)
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;

// 🔥 STOP când userul interacționează
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

    // 🔥 CENTER MODEL
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    object.position.sub(center);

    // 🔥 SCALE MODEL
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 20 / maxDim;
    object.scale.setScalar(scale);

    // 🔥 CAMERA + TARGET FIX
    camera.position.set(0, 0, 30);
    controls.target.set(0, 0, 0);
    controls.update();
  }
);

// Lights
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

  controls.update(); // 🔥 IMPORTANT pentru smooth + auto rotate

  renderer.render(scene, camera);
}

animate();
