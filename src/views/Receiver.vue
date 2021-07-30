<template>
  <div class="about">
    <button @click="sendData">Send data</button>
  </div>
</template>

<script>
import Peer from "peerjs";

export default {
  name: "Receiver",
  components: {},
  data() {
    return {
      conn: null,
    };
  },
  created() {
    // Connects as Receiver
    const peer = new Peer("receiver", {
      host: "localhost",
      port: 9000,
      path: "/",
    });

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log("data", data);
      });
    });

    peer.on("disconnected", () => {
      console.log("disconnected");
    });

    peer.on("error", (err) => {
      console.log("Err", err);
    });
  },
  methods: {
    sendData() {
      console.log("Sending data");
      this.conn.send("Data" + new Date());
    },
  },
};
</script>
