<script setup lang="ts">
import { useMusic } from "@/composables/useMusic";

const { isPlaying, toggleMusic } = useMusic();
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-16 z-50">
    <div
      class="h-16 flex items-center justify-between px-4 backdrop-blur-md bg-white/5 border-b border-white/10"
    >
      <h1 class="text-white font-bold tracking-wide">3D Solar System</h1>

      <!-- mute only -->
      <button
        @click="toggleMusic"
        class="text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        <span v-if="isPlaying">🔊</span>
        <span v-else>🔇</span>
      </button>
    </div>
  </div>
</template>
