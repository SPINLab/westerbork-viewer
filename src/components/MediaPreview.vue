<template>
  <button type="button" @click="showMedia">
    <img
      v-if="isImage"
      :src="dataUrl"
      :alt="currentTourStep.media.file.data.title"
    />
    <video v-if="isVideo" preload="metadata">
      <source :src="`${dataUrl}\#t=0.5`" type="video/mp4" />
    </video>
  </button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MediaPreview',
  computed: {
    ...mapGetters(['currentTourStep']),
    isImage() {
      return (
        this.currentTourStep?.media?.file?.data?.type === 'image/jpeg' ||
        this.currentTourStep?.media?.file?.data?.type === 'image/png'
      );
    },
    isVideo() {
      return this.currentTourStep?.media?.file?.data?.type === 'video/mp4';
    },
    dataUrl() {
      return this.currentTourStep.media.file.data.url
        ? `https://data.campscapes.org/${this.currentTourStep.media.file.data.url}`
        : '';
    },
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
