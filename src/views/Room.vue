<template>
  <div class="flex flex-column justify-content-between">
    <div>
      <InputText type="text" v-model="newSrc" />
      <Button
        label="Change src"
        @click="
          () => {
            changeSrc(newSrc);
            emitChangeSrc();
          }
        "
      />
    </div>

    <div class="flex justify-content-center">
      <videojs
        class="video-comp"
        :data="playerOptions"
        @mounted="setMounted"
        @play="playEvent"
        @pause="pauseEvent"
        @seeking="seekingEvent"
        @timeupdate="timeupdateEvent"
      ></videojs>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Videojs from "@/components/Video";
import socket from "@/utils/socket";

import InputText from "primevue/inputtext";
import Button from "primevue/button";

export default defineComponent({
  name: "Room",
  components: {
    Videojs,
    InputText,
    Button,
  },
  setup() {
    const route = useRoute();
    const roomId = route.params.id;
    const newSrc = ref("");
    const playerOptions = reactive({
      sources: [
        {
          src: null,
          type: null,
          // src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          // type: "video/youtube",
        },
      ],
    });
    window.socket = socket;
    socket.emit("join-room", { roomId });

    let player = null;
    const setMounted = (p) => {
      player = p;
      window.player = player;
      player.one("play", () => {
        // console.log("First play");
        socket.emit("syncronice");
      });
    };

    socket.on("changesrc", (data) => {
      console.log("onchangesrc", data);
      changeSrc(data.src);
    });

    socket.emit("syncronice");

    socket.on("syncronice", ({ lastSeeking, playing }) => {
      console.log("Syncronicing!:", lastSeeking, playing);
      try {
        if (lastSeeking) {
          player.tech_["trigger"]("firstplay");
          player.currentTime(lastSeeking);
        }
        if (playing) {
          player.play().catch((e) => {
            console.error("Play catch", e);
          });
        }
      } catch (error) {
        // console.log("Syncronice error", error);
      }
    });

    socket.on("play", () => {
      if (player.paused()) {
        // console.log("Socket onplay");
        player.play();
      }
    });

    // Socket events
    socket.on("play", () => {
      if (player.paused()) {
        // console.log("Socket onplay");
        player.play();
      }
    });

    socket.on("pause", () => {
      if (!player.paused()) {
        // console.log("Socket onpause");
        player.pause();
      }
    });

    socket.on("seeking", (time) => {
      if (!player.scrubbing_) {
        // console.log("Socket onseeking", time);
        player.currentTime(time);
      }
    });

    // Player events
    const playEvent = (player) => {
      console.log("player", player);
      socket.emit("play");
    };

    const pauseEvent = (player) => {
      console.log("player", player);
      socket.emit("pause");
    };

    const seekingEvent = (player) => {
      // console.log("Emit seeking!", player.currentTime());
      socket.volatile.emit("seeking", player.currentTime());
    };

    const timeupdateEvent = (player) => {
      socket.volatile.emit("timeupdate", player.currentTime());
    };

    const changeSrc = (src) => {
      console.log("changeSrc", src);

      playerOptions.sources[0].src = src;
      if (
        playerOptions.sources[0].src &&
        playerOptions.sources[0].src.includes("youtube")
      ) {
        playerOptions.sources[0].type = "video/youtube";
      } else {
        playerOptions.sources[0].type = null;
      }
    };

    const emitChangeSrc = () => {
      socket.emit("changesrc", playerOptions.sources[0].src);
      console.log("Emit changesrc");
    };

    onMounted(() => {
      document.addEventListener(
        "visibilitychange",
        () => {
          if (!document.hidden) {
            console.log("Executing visibilitychange");
            socket.emit("syncronice");
          }
        },
        { once: true }
      );
    });

    return {
      roomId,
      setMounted,
      playEvent,
      pauseEvent,
      seekingEvent,
      timeupdateEvent,
      changeSrc,
      emitChangeSrc,
      playerOptions,
      newSrc,
    };
  },
});
</script>

<style lang="scss" scoped>
$topOffset: 50px;

.video-comp {
  max-width: calc(calc(100vh - #{$topOffset}) / 0.5625);
}
</style>
