<template>
  <section>
    <div class="header">
      <div class="tour-tabs">
        <button
          v-for="(someTour, index) in tours"
          :key="someTour.id"
          type="button"
          class="tour-tab"
          :class="{ active: tourId === someTour.id }"
          @click="selectTour(someTour.id)"
        >
          Tour {{ index + 1 }}: {{ someTour.name_nl }}
        </button>
      </div>
      <button type="button" class="close-button" @click="closeTour">
        <CrossIcon class="close-icon" />
      </button>
    </div>
    <transition name="fade">
      <div v-show="showChapter" class="chapter-content">
        <div class="place-tag">{{ placeName }}</div>
        <h2>{{ title }}</h2>
        <p ref="chapterContent" class="scrollable">{{ content }}</p>
        <div class="navigation-buttons">
          <button
            type="button"
            :class="{ hidden: chapterIndex === 0 }"
            @click="previousStep"
          >
            &lt; Vorige
          </button>
          <button
            type="button"
            :class="{ hidden: chapterIndex === tourChapters.length - 1 }"
            @click="nextStep"
          >
            Volgende &gt;
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

import { useOverflowFade } from '../composables/overflow-fade';
import CrossIcon from '../icons/CrossIcon.vue';

export default {
  name: 'TourPage',
  components: {
    CrossIcon,
  },
  computed: {
    ...mapState(['chapterIndex', 'tourId', 'places', 'showChapter']),
    ...mapGetters(['tours', 'tour', 'chapter', 'tourChapters']),
    title() {
      return this.chapter?.pages?.data?.[0]?.page_title_nl || '';
    },
    content() {
      return this.chapter?.pages?.data?.[0]?.page_text_nl || '';
    },
    place() {
      const placeId = parseInt(this.chapter?.waypoint?.data?.place, 10);
      const place = this.places?.find((p) => p.id === placeId);
      return place || { name_en: '', name_nl: '' };
    },
    placeName() {
      return this.place?.name_nl || '';
    },
  },
  watch: {
    content() {
      this.$nextTick(() => {
        this.$refs.chapterContent.scrollTop = 0;
        this.checkOverflow();
      });
    },
    tourId() {
      this.$store.dispatch('setChapterIndex', 0);
    },
  },
  mounted() {
    this.checkOverflow = useOverflowFade(this.$refs.chapterContent);
  },
  methods: {
    ...mapActions({
      previousStep: 'previousChapter',
      nextStep: 'nextChapter',
    }),
    selectTour(id) {
      this.$store.dispatch('setTourId', id);
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
  height: 100vh;
  box-sizing: border-box;
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
  overflow-y: auto;
  padding-right: 1rem;
  white-space: pre-wrap;
  --scrollbar-bg-color: var(--background);
}

.header {
  display: flex;
  width: 100%;
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
.tour-tab.active {
  color: var(--grey);
}

.close-button {
  padding-inline: 1rem;
  margin-left: 1rem;
}

.place-tag {
  display: inline-flex;
  margin-top: 1rem;
  color: var(--grey);
  border: 1px solid var(--grey);
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
  font-variation-settings: 'wght' 600;
  font-size: 1.1rem;
}

.chapter-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid var(--grey);
  margin-top: 2rem;
  padding-top: 1rem;
  padding-inline: 0.5rem;
  font-variation-settings: 'wght' 600;
  font-size: 1.5rem;
  color: var(--grey);
  box-sizing: border-box;
}

@media (hover: hover) {
  .tour-tab:hover {
    color: var(--grey);
  }
  .navigation-buttons button:hover {
    color: var(--accent);
  }
}
</style>
