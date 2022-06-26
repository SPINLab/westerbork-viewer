<template>
  <button type="button" @click="showViewer">
    <img :src="viewerPreview" alt="" />
  </button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ViewerPreview',
  computed: {
    ...mapState(['viewerPreview']),
  },
  methods: {
    showViewer() {
      this.$store.dispatch('setMediaOpen', false);
      this.$store.dispatch('setRenderPointCloud', true);
    },
  },
};
</script>

<style scoped>
button {
  height: 8rem;
  width: 8rem;
  overflow: hidden;
  border: 3px solid var(--white);
  border-radius: 4px;
  background-color: var(--white);
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
