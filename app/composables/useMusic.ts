import { ref } from "vue";

const isPlaying = ref(false);
const audio = ref<HTMLAudioElement | null>(null);

const track = ref({
  src: "",
  title: "",
  artist: "",
});

const playlist = [
  {
    src: "/music/music1.mp3",
    title: "Subspace Daydream",
    artist: "RubyZephyr",
  },
  {
    src: "/music/music2.mp3",
    title: "That Game Arcade Short",
    artist: "moodmode",
  },
];

const currentIndex = ref(0);

export function useMusic() {
  const setTrack = (src: string, title: string, artist: string) => {
    track.value = { src, title, artist };

    if (!audio.value) {
      audio.value = new Audio(src);
      audio.value.loop = true;
      audio.value.volume = 0.4;
    } else {
      audio.value.src = src;
    }
  };

  const setTrackByIndex = (index: number) => {
    currentIndex.value = index;
    const t = playlist[index];
    setTrack(t.src, t.title, t.artist);
  };

  const playMusic = async () => {
    if (!audio.value) return;

    try {
      await audio.value.play();
      isPlaying.value = true;
    } catch (err) {
      console.error("Autoplay blocked:", err);
    }
  };

  const pauseMusic = () => {
    if (!audio.value) return;

    audio.value.pause();
    isPlaying.value = false;
  };

  const toggleMusic = async () => {
    if (isPlaying.value) {
      pauseMusic();
    } else {
      await playMusic();
    }
  };

  const nextTrack = async () => {
    const next = (currentIndex.value + 1) % playlist.length;
    setTrackByIndex(next);

    if (isPlaying.value) {
      await playMusic();
    }
  };

  return {
    isPlaying,
    track,
    playlist,
    setTrack,
    setTrackByIndex,
    nextTrack,
    playMusic,
    pauseMusic,
    toggleMusic,
  };
}
