<template>
  <section>
    <h2>{{ $t('chooseNarrative') }}</h2>
    <ol class="narrative-cards">
      <li
        v-for="narrative in narratives"
        :key="narrative.id"
        class="narrative-card-container"
      >
        <NarrativeCard :narrative="narrative" />
      </li>
    </ol>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import NarrativeCard from './NarrativeCard.vue';

export default {
  name: 'NarrativeCardSelector',
  components: {
    NarrativeCard,
  },
  computed: {
    ...mapState(['narratives']),
  },
};
</script>

<style scoped>
section {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  z-index: 1;
}

h2 {
  font-family: 'CamphorPro-Regular', sans-serif;
  font-size: 3.4375rem;
  font-weight: normal;
  color: #ffffff;
  margin: 1rem;
}

.narrative-cards {
  position: relative;
  display: flex;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
