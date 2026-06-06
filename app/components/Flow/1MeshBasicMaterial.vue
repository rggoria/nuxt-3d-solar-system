<script setup lang="ts">
import * as THREE from "three";

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
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  const material = new THREE.MeshBasicMaterial({
    color: "#22c55e",
    wireframe: true,
  });

  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);

  // Setup Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Setup Animation
  const animate = () => {
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };

  animate();
});
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-[calc(100vh-64px)]" />
</template>
