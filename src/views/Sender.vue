<template>
  <div class="home">
    <button @click="sendData">Send data</button>
  </div>
</template>

<script>
import Peer from "peerjs";

export default {
  name: "Sender",
  components: {},
  data() {
    return {
      conn: null,
    };
  },
  created() {
    // Connects as sender
    const peer = new Peer("sender", {
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

    // to Receiver (It must be up)
    const conn = peer.connect("receiver");

    conn.send({
      test: "Data!",
    });

    this.conn = conn;
  },
  methods: {
    sendData() {
      console.log("Sending data");
      this.conn.send("Data" + new Date());
    },
  },
};
</script>
