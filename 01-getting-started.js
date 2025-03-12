// main three.module.js library
import * as THREE from 'three';  
// addons: OrbitControls (jsm/controls), Stats (jsm/libs), GUI (jsm/libs)
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.backgroundColor = 0xffffff;

// Perspective camera: fov, aspect ratio, near, far
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
camera.position.set(0, 0, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xffffff);
renderer.setSize(500, 500);  // 정사각형으로 설정
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = 'auto';
document.body.appendChild(renderer.domElement);

function onResize() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    renderer.setSize(size, size);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

// Create 4 planes with different colors
const colors = [0x00ff00, 0xff0000, 0x0000ff, 0xffff00];
const planes = [];

for (let i = 0; i < 4; i++) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: colors[i] });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.x = (i % 2) - 0.5;
    plane.position.y = Math.floor(i / 2) - 0.5;
    planes.push(plane);
    scene.add(plane);
}

function animate() {
    requestAnimationFrame(animate);
    const size = Math.min(window.innerWidth, window.innerHeight);
    renderer.setSize(size, size);
    const halfWidth = Math.floor(size / 2);
    const halfHeight = Math.floor(size / 2);

    renderer.setScissorTest(true);

    // 1사분면 (초록)
    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
    renderer.setScissor(halfWidth, halfHeight, halfWidth, halfHeight);
    renderer.setClearColor(0x00ff00);
    renderer.clear();

    // 2사분면 (빨강)
    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    renderer.setScissor(0, halfHeight, halfWidth, halfHeight);
    renderer.setClearColor(0xff0000);
    renderer.clear();

    // 3사분면 (파랑)
    renderer.setViewport(0, 0, halfWidth, halfHeight);
    renderer.setScissor(0, 0, halfWidth, halfHeight);
    renderer.setClearColor(0x0000ff);
    renderer.clear();

    // 4사분면 (노랑)
    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    renderer.setScissor(halfWidth, 0, halfWidth, halfHeight);
    renderer.setClearColor(0xffff00);
    renderer.clear();
}
animate();
