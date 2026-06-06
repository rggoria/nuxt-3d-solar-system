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
    2000,
  );

  camera.position.set(0, 5, 15);

  // Setup Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Setup Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Setup Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // Setup Background
  scene.background = new THREE.Color("#000000");

  // Setup Stars
  const skyTexture = new THREE.TextureLoader().load("/textures/stars.jpg");
  scene.background = skyTexture;

  // Setup Sky Dome
  const skyGeometry = new THREE.SphereGeometry(500, 64, 64);

  const skyMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  // Texture Loader
  const loader = new THREE.TextureLoader();

  // Create Planet
  function createPlanet(size: number, texturePath: string, distance: number) {
    const geometry = new THREE.SphereGeometry(size, 64, 64);

    const material = new THREE.MeshStandardMaterial({
      map: loader.load(texturePath),
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    return { mesh, distance };
  }

  // Setup Sun
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load("/textures/sun.jpg"),
    }),
  );

  scene.add(sun);

  // Setup Planets
  const earth = createPlanet(0.6, "/textures/earth.jpg", 5);
  const mars = createPlanet(0.4, "/textures/mars.jpg", 7);
  const venus = createPlanet(0.5, "/textures/venus.jpg", 9);
  const jupiter = createPlanet(1.2, "/textures/jupiter.jpg", 12);
  const saturn = createPlanet(1.1, "/textures/saturn.jpg", 15);
  const uranus = createPlanet(0.9, "/textures/uranus.jpg", 18);

  // Setup Saturn Ring
  const ringGeometry = new THREE.RingGeometry(1.6, 2.4, 64);
  const ringTexture = loader.load("/textures/saturn_ring.png");

  const ringMaterial = new THREE.MeshBasicMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    transparent: true,
  });

  const saturnRing = new THREE.Mesh(ringGeometry, ringMaterial);
  const saturnGroup = new THREE.Group();
  saturnGroup.add(saturn.mesh);
  saturnGroup.add(saturnRing);

  scene.add(saturnGroup);
  saturnRing.rotation.x = Math.PI / 2.2;

  // Setup Clock
  const clock = new THREE.Clock();

  // Handle Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  const animate = () => {
    const time = clock.getElapsedTime();

    // Sun rotation
    sun.rotation.y += 0.001;

    // Earth orbit
    earth.mesh.position.x = Math.cos(time) * earth.distance;
    earth.mesh.position.z = Math.sin(time) * earth.distance;
    earth.mesh.rotation.y += 0.01;

    // Mars orbit
    mars.mesh.position.x = Math.cos(time * 0.8) * mars.distance;
    mars.mesh.position.z = Math.sin(time * 0.8) * mars.distance;

    // Venus orbit
    venus.mesh.position.x = Math.cos(time * 1.2) * venus.distance;
    venus.mesh.position.z = Math.sin(time * 1.2) * venus.distance;

    // Jupiter orbit
    jupiter.mesh.position.x = Math.cos(time * 0.4) * jupiter.distance;
    jupiter.mesh.position.z = Math.sin(time * 0.4) * jupiter.distance;

    // Saturn orbit (Group)
    saturnGroup.position.x = Math.cos(time * 0.3) * saturn.distance;
    saturnGroup.position.z = Math.sin(time * 0.3) * saturn.distance;

    // Uranus orbit
    uranus.mesh.position.x = Math.cos(time * 0.25) * uranus.distance;
    uranus.mesh.position.z = Math.sin(time * 0.25) * uranus.distance;

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
});
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-[calc(100vh-64px)]" />
</template>
