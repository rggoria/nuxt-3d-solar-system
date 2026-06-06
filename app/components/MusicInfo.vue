<script setup lang="ts">
import { useMusic } from "@/composables/useMusic";

const { track, isPlaying, toggleMusic, nextTrack, playlist, setTrackByIndex } =
  useMusic();
</script>

<template>
  <div
    v-if="track.src"
    class="fixed bottom-4 left-4 bg-black/60 backdrop-blur-md text-white rounded-full px-3 py-2 flex items-center gap-3 shadow-lg"
  >
    <!-- title (small) -->
    <div class="text-xs mr-2">
      <div class="font-semibold leading-tight">
        {{ track.title }}
      </div>
      <br>
      {{ track.artist }}
    </div>

    <!-- controls (compressed row) -->
    <div class="flex items-center gap-2">
      <!-- previous -->
      <button
        class="text-sm hover:scale-110 transition"
        @click="
          setTrackByIndex(
            (playlist.length +
              playlist.findIndex((t) => t.src === track.src) -
              1) %
              playlist.length,
          )
        "
      >
        ⏮
      </button>

      <!-- play/pause -->
      <button class="text-base hover:scale-110 transition" @click="toggleMusic">
        <span v-if="isPlaying">⏸</span>
        <span v-else>▶️</span>
      </button>

      <!-- next -->
      <button class="text-sm hover:scale-110 transition" @click="nextTrack">
        ⏭
      </button>
    </div>
  </div>
</template>
