import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Mouse
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Model
let object;

// Controls
let controls;

// Model selector
let objToRender = 'plane';

// Loader
const loader = new GLTFLoader();

// Load model
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Camera position
camera.position.z = objToRender === "plane" ? 25 : 500;

// Lights
const topLight = new THREE.DirectionalLight(0xffffff, 2);
topLight.position.set(1000, 1000, 0);
scene.add(topLight);

const topLight1 = new THREE.DirectionalLight(0xffffff, 2);
topLight1.position.set(0, 1000, 1000);
scene.add(topLight1);

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

// Controls
if (objToRender === "plane") {
  controls = new OrbitControls(camera, renderer.domElement);

  // 🔥 SPEED
  controls.rotateSpeed = 2.5;
  controls.zoomSpeed = 2;
  controls.panSpeed = 2;

  // 🔥 SMOOTH MOVEMENT
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 🔥 LIMITS (optional but useful)
  controls.minDistance = 5;
  controls.maxDistance = 100;
}

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (controls) controls.update(); // 🔥 IMPORTANT

  if (object && objToRender === "eye") {
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  renderer.render(scene, camera);
}

// Resize
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Start
animate();
