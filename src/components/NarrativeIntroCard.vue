<template>
  <div class="narrative-card">
    <h3>{{ narrative.question }}</h3>
    <NavigationButton :title="$t('continue')" @click.native="nextStep" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavigationButton from './NavigationButton.vue';

export default {
  name: 'NarrativeCard',
  components: {
    NavigationButton,
  },
  computed: {
    ...mapGetters(['narrative']),
  },
  methods: {
    nextStep() {
      this.$store.dispatch('nextStep');
    },
  },
};
</script>

<style scoped>
.narrative-card {
  position: absolute;
  top: 50%;
  right: 4%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem 0rem 3rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 30rem;
  background-image: url('../assets/background_images/whitepaper.png');
  color: #212121;
  width: 16rem;
}

h3 {
  color: #393939;
  text-decoration: underline #90909086;
  margin-top: 2rem;
  font-size: 1.375rem;
}

button {
  transform: translateY(1.8rem);
  padding: 1.2rem 1.6rem;
}
</style>
