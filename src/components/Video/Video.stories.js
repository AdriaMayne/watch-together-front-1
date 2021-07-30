import Video from "./Video.vue";

export default {
  title: "Video",
  component: Video,
};

export const Primary = () => ({
  components: { Video },
  template: "<Video />",
});
