<script setup lang="ts">
// setup props
defineProps<{
  progress: number;
  message: string;
}>();
</script>

<template>
  <!-- setup loading overlay -->
  <div
    class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black overflow-hidden"
  >
    <!-- setup background -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_60%,#000)]"
    />

    <!-- setup stars -->
    <div
      class="absolute inset-0 opacity-40 bg-[url('/textures/stars.jpg')] bg-cover bg-center animate-pulse"
    />

    <!-- setup solar core -->
    <div class="relative flex items-center justify-center w-64 h-64">
      <!-- setup orbit 1 (outer) -->
      <div
        class="absolute w-56 h-56 rounded-full border border-white/30 animate-spin-slow"
      />

      <!-- setup orbit 2 (inner) -->
      <div
        class="absolute w-40 h-40 rounded-full border border-white/60 animate-spin-reverse"
      />

      <!-- setup sun -->
      <div
        class="w-16 h-16 rounded-full bg-yellow-400 shadow-[0_0_80px_#facc15] animate-pulse"
      />

      <!-- setup planet 1 (outer orbit - CENTER FIXED) -->
      <div
        class="absolute w-56 h-56 animate-orbit flex items-center justify-center"
      >
        <div
          class="absolute -translate-y-1/2 top-0 w-4 h-4 bg-sky-400 rounded-full shadow-[0_0_20px_#38bdf8]"
        />
      </div>

      <!-- setup planet 2 (inner orbit - CENTER FIXED) -->
      <div
        class="absolute w-40 h-40 animate-orbit-slow flex items-center justify-center"
      >
        <div
          class="absolute -translate-y-1/2 top-0 w-3 h-3 bg-red-400 rounded-full shadow-[0_0_20px_#f87171]"
        />
      </div>
    </div>

    <!-- setup title -->
    <h1
      class="mt-10 text-white text-5xl font-black tracking-[0.35em] uppercase animate-fade-in"
    >
      3d Solar System
    </h1>

    <!-- setup subtitle -->
    <p class="mt-3 text-slate-400 animate-fade-in-delay">
      Loading, please wait...
    </p>

    <!-- setup progress -->
    <div class="mt-8 w-80">
      <div class="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-300"
          :style="{ width: progress + '%' }"
        />
      </div>

      <div class="text-center mt-2 text-white text-sm font-semibold">
        {{ progress }}%
      </div>
    </div>

    <!-- setup message -->
    <div class="mt-6 text-cyan-400 text-sm tracking-widest animate-fade-in">
      ● {{ message }}
    </div>
  </div>
</template>

<style scoped>
/* setup slow orbit ring */
.animate-spin-slow {
  animation: spin 12s linear infinite;
}

/* setup reverse orbit ring */
.animate-spin-reverse {
  animation: spin 18s linear infinite reverse;
}

/* setup planet orbit fast */
.animate-orbit {
  animation: orbit 6s linear infinite;
}

/* setup planet orbit slow */
.animate-orbit-slow {
  animation: orbit 10s linear infinite;
}

/* setup orbit path rotation */
@keyframes orbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* setup fade in */
.animate-fade-in {
  animation: fadeIn 1s ease forwards;
}

.animate-fade-in-delay {
  animation: fadeIn 1.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
