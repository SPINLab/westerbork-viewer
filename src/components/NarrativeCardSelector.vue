<template>
  <section>
    <h2>Kies een narratief</h2>
    <ol class="narrative-cards">
      <li
        v-for="narrative in narratives"
        :key="narrative.id"
        class="narrative-card-container"
      >
        <NarrativeCard :narrative="narrative" @picked="pickNarrative" />
      </li>
    </ol>
  </section>
</template>

<script>
import NarrativeCard from "./NarrativeCard";

export default {
  name: "NarrativeCardSelector",
  components: {
    NarrativeCard
  },
  props: {
    narratives: {
      type: Array,
      required: true
    }
  },
  methods: {
    pickNarrative(narrative) {
      this.$emit("narrative-picked", narrative);
    }
  }
};
</script>

<style scoped>
section {
  position: relative;
  display: flex;
  height: 100vh;
  align-items: center;
  z-index: 1;
}

h2 {
  font-family: "CamphorPro-Regular", sans-serif;
  font-size: 3.4375rem;
  font-weight: normal;
  color: #ffffff;
  transform: rotate(-90deg);
  margin-right: -1rem;
}

.narrative-cards {
  position: relative;
  display: flex;
  overflow-x: auto;
  overflow-y: visible;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: 100%;
}
</style>
