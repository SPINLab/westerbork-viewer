<template>
  <button type="button" @click="showMedia">
    <img v-if="mediaIsImage" :src="dataUrl" :alt="mediaTitle" />
    <video v-if="mediaIsVideo" preload="metadata">
      <source :src="`${mediaDataUrl}\#t=0.5`" type="video/mp4" />
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
    },
  },
};
</script>

<style scoped>
button {
  height: 5rem;
  width: 5rem;
  overflow: hidden;
  border: 3px solid var(--white);
  border-radius: 4px;
  background-color: var(--white);
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
