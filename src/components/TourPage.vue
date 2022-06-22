<template>
  <section>
    <div class="header">
      <div class="tour-tabs">
        <button
          v-for="(someTour, index) in tours"
          :key="index"
          type="button"
          class="tour-tab"
          :class="{ active: selectedTour === index }"
          @click="selectTour(index)"
        >
          {{ $t(someTour.name) }}
        </button>
      </div>
      <button type="button" @click="closeTour">
        <CrossIcon class="close-icon" />
      </button>
    </div>
    <div class="room-tag">{{ $t(room) }}</div>
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <div class="navigation-buttons">
      <button
        type="button"
        :class="{ hidden: tourStep === 0 }"
        @click="previousStep"
      >
        &lt; Vorige
      </button>
      <button
        type="button"
        :class="{ hidden: tourStep === tour.steps.length - 1 }"
        @click="nextStep"
      >
        Volgende &gt;
      </button>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

import CrossIcon from '../icons/CrossIcon.vue';
import waypoints from '../data/waypoints';

export default {
  name: 'TourPage',
  components: {
    CrossIcon,
  },
  computed: {
    ...mapState(['tourStep', 'tours', 'selectedTour']),
    ...mapGetters(['tour', 'currentTourStep']),
    title() {
      return this.currentTourStep?.title || '';
    },
    content() {
      return this.currentTourStep?.content || '';
    },
    room() {
      return this.currentTourStep?.waypoint != null &&
        waypoints[this.currentTourStep.waypoint] != null &&
        waypoints[this.currentTourStep.waypoint].room != null
        ? waypoints[this.currentTourStep.waypoint].room
        : '';
    },
  },
  methods: {
    ...mapActions({
      previousStep: 'previousTourStep',
      nextStep: 'nextTourStep',
    }),
    selectTour(index) {
      this.$store.dispatch('setSelectedTour', index);
    },
    closeTour() {
      this.$store.dispatch('setTourOpen', false);
      this.$store.dispatch('setRenderPointCloud', true);
    },
  },
};
</script>

<style scoped>
section {
  background-color: var(--background);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h2 {
  color: var(--accent);
  font-variation-settings: 'wght' 700;
  padding-block: 0;
  margin-block: 1.5rem;
  font-size: 2.5rem;
}

p {
  margin: 0;
  font-size: 1.5rem;
}

.header {
  display: flex;
}

.close-icon {
  fill: var(--grey-dark);
  stroke: var(--grey-dark);
  stroke-width: 0.8rem;
  height: 1.5rem;
  width: 1.5rem;
}

.hidden {
  visibility: hidden;
}

.tour-tabs {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.tour-tab {
  color: var(--grey-background);
  border-left: 1px solid var(--grey-background);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  padding-left: 0.5rem;
  text-align: left;
  width: calc(50% - 1rem);
  font-variation-settings: 'wght' 600;
  font-size: 1.1rem;
}
.tour-tab.active,
.tour-tab:hover {
  color: var(--grey);
}

.room-tag {
  display: inline-flex;
  margin-top: 1rem;
  color: var(--grey);
  border: 1px solid var(--grey);
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
  font-variation-settings: 'wght' 600;
  font-size: 1.1rem;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid var(--grey);
  margin-top: auto;
  padding-top: 1rem;
  margin-inline: 0.5rem;
  font-variation-settings: 'wght' 600;
  font-size: 1.5rem;
  color: var(--grey);
}
.navigation-buttons button:hover {
  color: var(--accent);
}
</style>
