<script setup lang="ts">
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ref, onMounted } from "vue";
import SolarLoading from "~/components/SolarLoading.vue";

useHead({
  title: "Nuxt 3D Solar System",
  meta: [
    {
      name: "description",
      content: "Interactive 3D solar system built with Three.js and Nuxt 3",
    },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
});

type PlanetName =
  | "Mercury"
  | "Venus"
  | "Earth"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus";

type SelectedPlanet = { name: string; info: string };

// setup refs (UI state)
const canvasRef = ref<HTMLCanvasElement | null>(null);
const showOrbits = ref(true);
const isPaused = ref(false);
const selectedPlanet = ref<SelectedPlanet | null>(null);
const showHint = ref(true);

// setup manager
const isLoading = ref(true);
const progress = ref(0);
const message = ref("Initializing...");

const manager = new THREE.LoadingManager();

manager.onProgress = (url, loaded, total) => {
  progress.value = Math.round((loaded / total) * 100);
  message.value = `Loading assets... ${loaded}/${total}`;
};

manager.onLoad = () => {
  progress.value = 100;
  message.value = "Done!";
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

// setup planet info
const PLANET_INFO: Record<PlanetName, string> = {
  Mercury:
    "Closest planet to the Sun, with extreme temperature changes between day and night.",
  Venus:
    "The hottest planet in the solar system, with a thick toxic atmosphere and runaway greenhouse effect.",
  Earth:
    "The only known planet that supports life, with abundant water and a breathable atmosphere.",
  Mars: "Known as the Red Planet due to iron-rich dust covering its surface and its desert-like landscape.",
  Jupiter:
    "The largest planet in the solar system, a gas giant with a powerful magnetic field and storm systems.",
  Saturn:
    "Famous for its prominent ring system made of ice and rock particles.",
  Uranus:
    "An ice giant that rotates on its side, giving it extreme seasonal variations.",
};

onMounted(() => {
  if (!canvasRef.value) return;

  // setup scene
  const scene = new THREE.Scene();

  // setup camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  camera.position.set(0, 5, 15);

  // setup renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // setup controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  // setup lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 3, 5);
  scene.add(light);

  // setup textures
  const loader = new THREE.TextureLoader(manager);

  // setup skybox
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(500, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load("/textures/stars.jpg"),
      side: THREE.BackSide,
    }),
  );
  scene.add(sky);

  // setup orbit group
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  const createOrbit = (r: number) => {
    const curve = new THREE.EllipseCurve(0, 0, r, r);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
    const mat = new THREE.LineBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 1,
    });
    const orbit = new THREE.LineLoop(geo, mat);
    orbit.rotation.x = Math.PI / 2;
    orbitGroup.add(orbit);
  };

  // setup planets array
  const planets: { mesh: THREE.Mesh; distance: number; name: PlanetName }[] =
    [];

  const createPlanet = (
    size: number,
    tex: string,
    dist: number,
    name: PlanetName,
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(size, 64, 64),
      new THREE.MeshStandardMaterial({ map: loader.load(tex) }),
    );

    mesh.name = name;
    scene.add(mesh);

    return { mesh, distance: dist, name };
  };

  // setup sun
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 64, 64),
    new THREE.MeshBasicMaterial({ map: loader.load("/textures/sun.jpg") }),
  );
  scene.add(sun);

  // setup planets
  const mercury = createPlanet(0.3, "/textures/mercury.jpg", 4, "Mercury");
  const venus = createPlanet(0.5, "/textures/venus.jpg", 6, "Venus");
  const earth = createPlanet(0.6, "/textures/earth.jpg", 8, "Earth");
  const mars = createPlanet(0.4, "/textures/mars.jpg", 10, "Mars");
  const jupiter = createPlanet(1.2, "/textures/jupiter.jpg", 14, "Jupiter");
  const saturn = createPlanet(1.1, "/textures/saturn.jpg", 18, "Saturn");
  const uranus = createPlanet(0.9, "/textures/uranus.jpg", 22, "Uranus");

  planets.push(mercury, venus, earth, mars, jupiter, saturn, uranus);

  // setup saturn ring
  const saturnGroup = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.6, 2.4, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load("/textures/saturn_ring.png"),
      side: THREE.DoubleSide,
      transparent: true,
    }),
  );

  ring.rotation.x = Math.PI / 2.2;
  saturnGroup.add(saturn.mesh);
  saturnGroup.add(ring);
  scene.add(saturnGroup);

  [4, 6, 8, 10, 14, 18, 22].forEach(createOrbit);

  // setup raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const defaultState = {
    pos: new THREE.Vector3(0, 5, 15),
    fov: 75,
  };

  // setup focus camera
  const focus = (obj: THREE.Object3D) => {
    const target = new THREE.Vector3();
    obj.getWorldPosition(target);

    controls.enabled = false;

    gsap.to(camera.position, {
      x: target.x + 2.5,
      y: target.y + 1.5,
      z: target.z + 5,
      duration: 2,
      ease: "power3.inOut",
    });

    gsap.to(camera, {
      fov: 45,
      duration: 2,
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    gsap.to(controls.target, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 2,
      onUpdate: () => controls.update(),
      onComplete: () => (controls.enabled = true),
    });
  };

  // setup click selection
  window.addEventListener("click", (e: MouseEvent) => {
    if (!isPaused.value) return;

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(
      [sun, saturnGroup, ...planets.map((p) => p.mesh)],
      true,
    ) as THREE.Intersection<THREE.Object3D>[];

    const firstHit = hits[0];
    if (!firstHit) return;

    let obj: THREE.Object3D | null = firstHit.object;

    while (obj) {
      if (obj === sun) {
        selectedPlanet.value = {
          name: "Sun",
          info: "The central star of the solar system, providing light, heat, and the gravitational force that keeps all planets in orbit.",
        };
        showHint.value = false;
        focus(sun);
        return;
      }

      const found = planets.find((p) => p.mesh === obj);

      if (found) {
        selectedPlanet.value = {
          name: found.name,
          info: PLANET_INFO[found.name],
        };
        showHint.value = false;
        focus(found.mesh);
        return;
      }

      obj = obj.parent;
    }
  });

  // setup resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const timer = new THREE.Timer();
  timer.connect(document);

  // setup animation loop
  const animate = () => {
    timer.update();
    const t = timer.getElapsed();

    if (!isPaused.value) {
      mercury.mesh.position.set(
        Math.cos(t * 1.6) * mercury.distance,
        0,
        Math.sin(t * 1.6) * mercury.distance,
      );
      venus.mesh.position.set(
        Math.cos(t * 1.2) * venus.distance,
        0,
        Math.sin(t * 1.2) * venus.distance,
      );
      earth.mesh.position.set(
        Math.cos(t) * earth.distance,
        0,
        Math.sin(t) * earth.distance,
      );
      mars.mesh.position.set(
        Math.cos(t * 0.8) * mars.distance,
        0,
        Math.sin(t * 0.8) * mars.distance,
      );
      jupiter.mesh.position.set(
        Math.cos(t * 0.4) * jupiter.distance,
        0,
        Math.sin(t * 0.4) * jupiter.distance,
      );
      saturnGroup.position.set(
        Math.cos(t * 0.3) * saturn.distance,
        0,
        Math.sin(t * 0.3) * saturn.distance,
      );
      uranus.mesh.position.set(
        Math.cos(t * 0.2) * uranus.distance,
        0,
        Math.sin(t * 0.2) * uranus.distance,
      );
    }

    orbitGroup.visible = showOrbits.value;

    // infinite background
    sky.position.copy(camera.position);

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };

  animate();
});
</script>

<template>
  <div class="relative w-full h-[calc(100vh-64px)]">
    <!-- splash screen -->
    <SolarLoading v-if="isLoading" :progress="progress" :message="message" />

    <!-- setup controls -->
    <div class="absolute top-20 left-4 flex gap-2 z-50">
      <button
        class="px-4 py-2 rounded-lg text-white backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition"
        @click="
          isPaused = !isPaused;
          if (!isPaused) selectedPlanet = null;
        "
      >
        {{ isPaused ? "Resume" : "Pause" }}
      </button>

      <button
        class="px-4 py-2 rounded-lg text-white backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition"
        @click="showOrbits = !showOrbits"
      >
        Orbits
      </button>
    </div>

    <!-- hint -->
    <div v-if="showHint && !isPaused" class="absolute top-35 left-4 z-51">
      <div
        class="max-w-xs text-white px-4 py-3 rounded-xl backdrop-blur-md bg-black/30 border border-white/10 shadow-lg"
      >
        Click Pause, then click any planet
      </div>
    </div>

    <!-- setup planet info panel -->
    <div
      v-if="selectedPlanet"
      class="absolute top-24 right-4 z-50 w-72 p-4 rounded-xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-xl text-white"
    >
      <h1 class="text-xl font-bold">
        {{ selectedPlanet.name }}
      </h1>

      <p class="text-sm text-white/80 mt-2">
        {{ selectedPlanet.info }}
      </p>
    </div>

    <!-- setup hint -->
    <div
      class="absolute top-16 left-4 text-xs text-white px-3 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/10"
    >
      Pause orbit to select planets
    </div>

    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full block" />
  </div>
</template>
