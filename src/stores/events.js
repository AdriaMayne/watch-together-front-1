import { defineStore } from 'pinia';

export const useEventsStore = defineStore({
  id: 'events',
  state: () => ({
    canPlay: true,
    canPause: true,
    canSeek: true,
    timeout: null,
  }),
  getters: {
    getCanPlay() {
      return this.canPlay;
    },
  },
  actions: {
    blockPlay() {},
    blockPause() {},
    blockSeek() {},
    // activatePlay() {
    //   activate.bind(this, 'canPlay')();
    // },
    // canActivatePlay() {
    //   this.canPlay = false;

    //   clearTimeout(this.timeout);
    //   this.timeout = setTimeout(() => {
    //     this.canPlay = true;
    //   }, 50);
    // },
  },
});

export default useEventsStore;
