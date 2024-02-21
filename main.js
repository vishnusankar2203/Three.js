import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create particles
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 });

// Number of particles
const particleCount = 2000;

// Position attribute for particles
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    // Random positions for particles
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const originalColor = "#F6F1D5";
const moonLightGeometry = new THREE.SphereGeometry(0.5, 62, 62);
const moonMaterial = new THREE.MeshLambertMaterial({ color: originalColor });
const moon = new THREE.Mesh(moonLightGeometry, moonMaterial);
scene.add(moon);

const darkSunColor = "#ad8b0f";
const sunLightGeometry = new THREE.SphereGeometry(0.5, 62, 62);
const sunMaterial = new THREE.MeshLambertMaterial({ color: darkSunColor });
const sun = new THREE.Mesh(sunLightGeometry, sunMaterial);
scene.add(sun);

const moonLight = new THREE.PointLight(0xffffff);
moonLight.position.set(0, 0, 5);
moon.add(moonLight);

const sunLight = new THREE.DirectionalLight(0xFDB813, 1);
sunLight.position.set(2, 2, 5);
sun.add(sunLight);

camera.position.z = 7;

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Disable rotation and pan controls
controls.enableRotate = false;
controls.enablePan = false;

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates to be in the range [-1, 1]
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;

    const mouseXRange = 5;
    const mouseYRange = 5;

    moon.position.x = mouseX * mouseXRange;
    moon.position.y = mouseY * mouseYRange;

    sun.position.x = mouseX * mouseXRange;
    sun.position.y = mouseY * mouseYRange;
   
  

    sunLight.intensity = Math.abs(Math.sin(Date.now() * 0.001)) + 0.5;
    moonLight.intensity = Math.abs(Math.sin(Date.now() * 0.001)) + 0.5;

    
    const time = Date.now() * 0.001;
    const moonRadius = 2;
    moon.position.x = Math.cos(time) * moonRadius;
    moon.position.y = Math.sin(time) * moonRadius;
    moonMaterial.size = 0.02 - Math.abs(Math.sin(time) * 0.01);

    // Adjust particle size based on time for sun
    const sunRadius = 4;
    sun.position.x = Math.cos(time) * sunRadius;
    sun.position.y = Math.sin(time) * sunRadius;
    sunMaterial.size = 0.02 - Math.abs(Math.sin(time) * 0.01);

    // Update controls
    controls.update();

    renderer.render(scene, camera);
}

animate();


