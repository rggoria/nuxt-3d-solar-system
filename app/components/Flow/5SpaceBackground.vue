<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (!canvasRef.value) return;

  // Setup Scene
  const scene = new THREE.Scene();

  // Setup Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );

  camera.position.z = 3;

  // Setup Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Setup Sphere
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // Load Texture
  const textureLoader = new THREE.TextureLoader();

  const earthTexture = textureLoader.load("/textures/earth.jpg");

  // Setup Material
  const material = new THREE.MeshStandardMaterial({
    map: earthTexture,
  });

  // Setup Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Setup Directional Light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);

  // Setup Background Color (space black)
  scene.background = new THREE.Color("#000000");

  // Setup Space Dome
  const skyGeometry = new THREE.SphereGeometry(50, 64, 64);

  const skyMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
  });

  const starTexture = new THREE.TextureLoader().load("/textures/stars.jpg");

  skyMaterial.map = starTexture;

  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  // Setup Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;

  // Setup Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Setup Animation
  const animate = () => {
    sphere.rotation.y += 0.002;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };

  animate();
});
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-[calc(100vh-64px)]" />
</template>
