<template>
  <button type="button" :style="{ width: size, height: size }">
    <HomeIcon class="home-icon" />
  </button>
</template>

<script>
import HomeIcon from '../icons/HomeIcon.vue';

export default {
  name: 'HomeButton',
  components: {
    HomeIcon,
  },
  props: {
    size: {
      type: String,
      default: '2rem',
    },
  },
};
</script>

<style scoped>
.home-icon {
  fill: var(--white);
  stroke: var(--white);
  stroke-width: 0.1rem;
}
</style>
