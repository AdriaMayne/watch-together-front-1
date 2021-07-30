<template>
  <div>
    <h1>What are you doing here?</h1>

    <div class="center">
      <div class="face">
        <div class="top">:</div>
        <div>></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.face {
  user-select: none;
  transform: rotate(90deg);
  font-size: 40em;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .top {
    padding-bottom: 0.1859em;
  }
}
</style>
