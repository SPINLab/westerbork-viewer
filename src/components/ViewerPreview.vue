<template>
  <button type="button" @click="showViewer">
    <span class="place-label">{{ placeName }}</span>
    <img :src="viewerPreview" alt="Viewer preview" />
  </button>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ViewerPreview',
  computed: {
    ...mapState(['viewerPreview']),
    ...mapGetters(['place']),
    placeName() {
      return this.place?.name_nl || '';
    },
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
  height: 10rem;
  width: 16rem;
  overflow: hidden;
  border: 2px solid var(--white);
  border-radius: 6px;
  background-color: var(--grey-dark);
  position: relative;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.place-label {
  position: absolute;
  top: 0.6rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--white);
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--white);
  border-radius: 2px;
  background-color: var(--grey-dark);
  white-space: nowrap;
  max-width: 100%;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
