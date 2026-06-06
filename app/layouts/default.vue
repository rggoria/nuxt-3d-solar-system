<script setup lang="ts">
import { onMounted } from "vue";
import { useMusic } from "@/composables/useMusic";

const { setTrackByIndex, playMusic } = useMusic();

onMounted(() => {
  setTrackByIndex(0);

  const startMusic = async () => {
    await playMusic();
  };

  window.addEventListener("pointerdown", startMusic, {
    once: true,
  });
});
</script>

<template>
  <div class="min-h-screen bg-black">
    <Navbar />
    <slot />
  </div>
</template>
