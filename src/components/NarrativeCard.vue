<template>
  <div class="narrative-card">
    <h3>{{ narrative.title.toUpperCase() }}</h3>
    <div class="narrative-text" v-html="narrative.description" />
    <NavigationButton :title="$t('continue')" @click.native="pickNarrative" />
  </div>
</template>

<script>
import NavigationButton from './NavigationButton.vue';

export default {
  name: 'NarrativeCard',
  components: {
    NavigationButton,
  },
  props: {
    narrative: {
      type: Object,
      required: true,
    },
  },
  methods: {
    pickNarrative() {
      this.$store.dispatch('setNarrative', this.narrative.id);
      this.$store.dispatch('nextStep');
    },
  },
};
</script>

<style scoped>
.narrative-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem 0rem 2rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 22rem;
  background-image: url('../assets/background_images/whitepaper.png');
  color: #212121;
  width: 16rem;
  margin: 1rem 1rem 2rem 1rem;
}

h3 {
  color: #393939;
  text-decoration: underline #90909086;
  margin-top: 2rem;
  font-size: 1.375rem;
}

.narrative-text {
  overflow-y: auto;
  color: #212121;
  line-height: 1.4rem;
}

button {
  transform: translateY(1.8rem);
  padding: 1.2rem 1.6rem;
}
</style>
