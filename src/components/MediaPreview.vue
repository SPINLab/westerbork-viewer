<template>
  <button type="button" @click="showMedia">
    <img v-if="mediaIsImage" :src="mediaDataUrl" :alt="mediaTitle" />
    <video v-if="mediaIsVideo" preload="metadata">
      <source :src="`${mediaDataUrl}\#t=2`" type="video/mp4" />
    </video>
  </button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MediaPreview',
  computed: {
    ...mapGetters([
      'mediaIsImage',
      'mediaIsVideo',
      'mediaDataUrl',
      'mediaTitle',
    ]),
  },
  methods: {
    showMedia() {
      this.$store.dispatch('setTourOpen', true);
      this.$store.dispatch('setMediaOpen', true);
      this.$store.dispatch('setRenderPointCloud', false);
    },
  },
};
</script>

<style scoped>
button {
  height: 10rem;
  width: 16rem;
  overflow: hidden;
  border: 2px solid var(--white);
  border-radius: 6px;
  background-color: var(--grey-dark);
}

video,
img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

video {
  pointer-events: none;
}
</style>
