<template>
  <div id="video-container" ref="videoContainer">
    <!-- <div id="overlay"></div> -->
    <video id="video" class="video-js vjs-theme"></video>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import videojs from 'video.js';
import 'videojs-youtube';
import debounce from 'lodash-es/debounce';
import 'video.js/dist/video-js.css';

export default defineComponent({
  name: 'Videojs',
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({
        sources: [
          {
            src: null,
            type: null,
            // src: 'https://www.youtube.com/watch?v=UN3uF3990Q0',
            // type: 'video/youtube',
          },
        ],
      }),
    },
  },
  emits: ['mounted', 'play', 'pause', 'seeking', 'timeupdate'],
  setup(props, { emit }) {
    let player;
    const videoContainer = ref(null);
    const seekingDebounce = debounce(emit, 50, { maxWait: 100 });
    const timeUpdateDebounce = debounce(emit, 25, { maxWait: 50 });

    const setUpPlayer = () => {
      player = videojs('video', {
        techOrder: ['html5', 'youtube'],
        muted: true,
        fluid: true,
        controls: true,
        playsinline: true,
        preload: 'auto',
        ...props.data,
      });

      emit('mounted', player);

      player.on('play', () => {
        emit('play', player);
      });

      player.on('pause', () => {
        emit('pause', player);
      });
      player.on('seeking', () => {
        if (player.scrubbing_ && player.hasStarted_) {
          seekingDebounce('seeking', player);
        }
      });

      player.on('timeupdate', () => {
        if (player.hasStarted_) {
          timeUpdateDebounce('timeupdate', player);
        }
      });
    };

    onMounted(setUpPlayer);

    onBeforeUnmount(() => {
      player.dispose();
    });

    return {
      player,
      videoContainer,
    };
  },
});
</script>

<style lang="scss">
#video-container {
  width: 100%;
  position: relative;
  // padding-bottom: 56.25%; /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */

  #overlay {
    z-index: 1;
    background-color: rgba(255, 0, 0, 0.2);
    height: 100%;
    width: 100%;
    position: absolute;
    pointer-events: none;
  }
}
#video {
  position: relative;
}

.vjs-theme {
  --vjs-theme--primary: #6fb04e;
  --vjs-theme--secondary: #fff;

  overflow: hidden;
}

.vjs-theme {
  .vjs-progress-control {
    font-size: 20px;
  }
  .vjs-volume-control:hover .vjs-mouse-display {
    display: none;
  }

  .vjs-current-time.vjs-time-control.vjs-control,
  .vjs-time-control.vjs-time-divider,
  .vjs-duration.vjs-time-control.vjs-control {
    display: block;
    padding: 0;
    margin: 0;
  }

  .vjs-current-time.vjs-time-control.vjs-control {
    margin-left: 0.5em;
  }

  .vjs-time-control.vjs-time-divider {
    width: 1em;
    min-width: 1em;
  }

  // div.vjs-control-bar
  //   > div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button.vjs-hover
  //   > div
  //   > ul {
  //   left: -20px;
  // }

  .vjs-fullscreen-control.vjs-control.vjs-button {
    order: 100;
  }

  .vjs-picture-in-picture-control.vjs-control.vjs-button {
    order: 99;

    &.vjs-disabled {
      display: none;
    }
  }
}

/* Big play Button */
.vjs-theme .vjs-big-play-button {
  width: 1.2em;
  height: 1.2em;
  background: none;
  background-repeat: no-repeat;
  background-position: center;
  // background: inline-image("/icons/play-btn.svg", fill=#fff);
  border: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--vjs-theme--secondary);
  line-height: 0px;
  font-size: 6em;
  border-radius: 100%;

  &:hover {
    color: var(--vjs-theme--primary);
  }
}

.vjs-theme .vjs-modal-dialog .vjs-modal-dialog-content,
.video-js .vjs-modal-dialog,
.vjs-button > .vjs-icon-placeholder:before,
.video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vjs-theme.vjs-paused .vjs-big-play-button {
  display: block !important;
}

/* Control Bar */
.vjs-theme .vjs-control:not(.vjs-disabled, .vjs-time-control):hover {
  color: var(--vjs-theme--primary);
  text-shadow: var(--vjs-theme--secondary) 1px 0 10px;
}

.vjs-theme .vjs-time-tooltip {
  top: -3em;
}

.vjs-theme .vjs-control-bar {
  padding-left: 1em;
  padding-right: 1em;
  // background: none;
  background: rgba(0, 0, 0, 0.15);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
}

/* Play Button */
.vjs-theme .vjs-play-control {
  font-size: 0.8em;
}

.vjs-theme .vjs-play-control .vjs-icon-placeholder:before {
  background-color: var(--vjs-theme--secondary);
  height: 1.5em;
  width: 1.5em;
  // margin-top: 0.2em;
  border-radius: 1em;
  color: var(--vjs-theme--primary);
}

.vjs-theme .vjs-play-control:hover .vjs-icon-placeholder:before {
  background-color: var(--vjs-theme--primary);
  color: var(--vjs-theme--secondary);
}

/* Volume stuff */
.vjs-theme .vjs-mute-control {
  display: none;
}

.vjs-theme .vjs-volume-panel {
  margin-left: 0.5em;
  margin-right: 0.5em;
  padding-top: 0.3em;
}

.vjs-theme .vjs-volume-panel,
.vjs-theme .vjs-volume-panel:hover,
.vjs-theme .vjs-volume-panel:hover .vjs-volume-control.vjs-volume-horizontal,
.vjs-theme .vjs-volume-panel:active .vjs-volume-control.vjs-volume-horizontal,
.vjs-theme .vjs-volume-panel.vjs-volume-panel-horizontal:hover,
.vjs-theme .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active,
.vjs-theme .vjs-volume-bar.vjs-slider-horizontal {
  width: 3em;
}

.vjs-theme .vjs-volume-level::before {
  font-size: 1em;
}

.vjs-theme .vjs-volume-panel .vjs-volume-control {
  opacity: 1;
  width: 100%;
  height: 100%;
}

.vjs-theme .vjs-volume-bar {
  background-color: transparent;
  margin: 0;
}

.vjs-theme .vjs-slider-horizontal .vjs-volume-level {
  height: 100%;
}

.vjs-theme .vjs-volume-bar.vjs-slider-horizontal {
  margin-top: 0;
  margin-bottom: 0;
  height: 100%;
}

.vjs-theme .vjs-volume-bar::before {
  content: '';
  z-index: 0;
  width: 0;
  height: 0;
  position: absolute;
  top: 0px;
  left: 0;

  border-style: solid;
  border-width: 0 0 2em 3em;
  // border-color: transparent transparent var(--vjs-theme--primary) transparent;
  border-color: transparent transparent rgba(115, 133, 159, 0.75);
}

.vjs-theme .vjs-volume-level {
  overflow: hidden;
  background-color: transparent;
}

.vjs-theme .vjs-volume-level::before {
  content: '';
  z-index: 1;
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;

  border-style: solid;
  border-width: 0 0 2em 3em;
  border-color: transparent transparent var(--vjs-theme--secondary) transparent;
}

/* Progress Bar */

.vjs-theme .vjs-progress-control:hover .vjs-progress-holder {
  font-size: 1em;
}

.vjs-theme .vjs-play-progress::before {
  display: none;
}

.vjs-theme .vjs-progress-holder {
  border-radius: 0.2em;
  height: 0.5em;
  margin: 0;
}

.vjs-theme .vjs-play-progress,
.vjs-theme .vjs-load-progress,
.vjs-theme .vjs-load-progress div {
  border-radius: 0.2em;
}
</style>
