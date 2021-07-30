<template>
  <div id="video-container" ref="videoContainer">
    <video id="video" class="video-js vjs-theme"></video>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from "vue";
import videojs from "video.js";
import debounce from "lodash-es/debounce";
import "videojs-youtube";
import "video.js/dist/video-js.css";

export default defineComponent({
  name: "Videojs",
  emits: ["mounted", "play", "pause", "seeking", "timeupdate"],
  props: {
    techOrder: {
      type: Array,
      default: () => ["html5", "youtube"],
    },
    muted: {
      type: Boolean,
      default: true,
    },
    fluid: {
      type: Boolean,
      default: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    playsinline: {
      type: Boolean,
      default: true,
    },
    preload: {
      type: String,
      default: "auto",
    },
    youtube: {
      type: Object,
      default: () => ({ ytControls: 0 }),
    },
    sources: {
      type: Array,
      default: () => [{ src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
    },
  },
  setup(props, { emit }) {
    const [firstSource] = props.sources;
    let player;
    const videoContainer = ref(null);
    const seekingDebounce = debounce(emit, 50, { maxWait: 100 });
    const timeupdateDebounce = debounce(emit, 25, { maxWait: 50 });

    watch(
      () => firstSource.src,
      () => {
        player.src(firstSource);
        // Dispose is needed since youtube videos don't change src properly
        player.dispose();
        const videoTag = document.createElement("video");
        videoTag.id = "video";
        videoTag.className = "video-js vjs-theme";
        videoContainer.value.appendChild(videoTag);
        setUpPlayer();
      }
    );

    const setUpPlayer = () => {
      player = videojs("video", {
        techOrder: props.techOrder,
        muted: props.muted,
        fluid: props.fluid,
        controls: props.controls,
        playsinline: props.playsinline,
        preload: props.preload,
        youtube: props.youtube,
        sources: props.sources,
      });

      emit("mounted", player);

      player.on("play", () => {
        emit("play", player);
      });

      player.on("pause", () => {
        emit("pause", player);
      });
      player.on("seeking", () => {
        if (player.scrubbing_ && player.hasStarted_) {
          seekingDebounce("seeking", player);
        }
      });

      player.on("timeupdate", () => {
        if (player.hasStarted_) {
          timeupdateDebounce("timeupdate", player);
        }
      });
    };

    onMounted(setUpPlayer);

    onBeforeUnmount(() => {
      player.dispose();
    });
    return { player, videoContainer };
  },
});
</script>
