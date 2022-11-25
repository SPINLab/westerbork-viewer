<template>
  <transition name="fade">
    <div v-if="introductionOpen" class="introduction-video">
      <button type="button" @click="next">Ga verder</button>
      <video autoplay muted loop>
        <source
          src="https://data.campscapes.org/storage/uploads/00000000370.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'IntroductionVideo',
  computed: {
    ...mapState(['introductionOpen']),
  },
  methods: {
    next() {
      this.$store.dispatch('setWelcomeModalOpen', true);
      this.$store.dispatch('setIntroductionOpen', false);
    },
  },
};
</script>

<style scoped>
.introduction-video {
  position: absolute;
  inset: 0;
  background-color: var(--grey-dark);
}

.introduction-video button {
  z-index: 1;
  position: absolute;
  top: 4rem;
  right: 4rem;
  background-color: var(--grey-dark);
  color: var(--white);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 2rem;
  font-variation-settings: 'wght' 500;
  border: 2px solid var(--white);
}

video {
  width: 100vw;
  height: 100vh;
}
</style>
