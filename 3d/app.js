// app.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, controls, raycaster, mouse;
let buttons = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // OrbitControls für Carousel
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 1.2;

  // Buttons
  const items = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about" },
    { text: "Projects", link: "/projects" },
    { text: "Newsletter", link: "/newsletter" },
    { text: "Contact", link: "/contact" },
  ];

  const radius = 6;
  const angleStep = (2 * Math.PI) / items.length;

  items.forEach((item, i) => {
    const angle = i * angleStep;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    createButton(item.text, x, y, 0, item.link);
  });

  window.addEventListener("click", onClick, false);
  window.addEventListener("touchend", onClick, false);
  window.addEventListener("resize", onResize, false);
}

function createButton(text, x, y, z, link) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "bold 56px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  });
  const geometry = new THREE.PlaneGeometry(3, 0.9);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  mesh.lookAt(0, 0, 0);
  scene.add(mesh);

  buttons.push({ mesh, link });
}

function onClick(event) {
  if (event.changedTouches && event.changedTouches.length > 0) {
    event.clientX = event.changedTouches[0].clientX;
    event.clientY = event.changedTouches[0].clientY;
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(buttons.map((b) => b.mesh));

  if (intersects.length > 0) {
    const clicked = buttons.find((b) => b.mesh === intersects[0].object);
    if (clicked) {
      window.location.href = clicked.link;
    }
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}