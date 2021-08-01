import Video from './Video.vue';

export default {
  title: 'Video',
  component: Video,
};

export const Default = () => ({
  components: { Video },
  template: '<Video />',
});
