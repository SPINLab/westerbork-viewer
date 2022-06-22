<template>
  <aside
    :class="{ expanded }"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <nav ref="tourNav" class="scrollable">
      <ol>
        <li class="side-menu-item">
          <div class="side-menu-item-icon home-icon-container">
            <HomeIcon class="home-icon" />
          </div>
          <button
            type="button"
            class="side-menu-item-description tour-title"
            @click="showWelcomeModal"
          >
            {{ tour.name_nl }}
          </button>
        </li>
        <li
          v-for="(someChapter, index) in selectedChapters"
          :id="`chapter-${index}`"
          :key="someChapter.id"
          class="side-menu-item"
          :class="{ active: currentChapterIndex === index }"
        >
          <div class="side-menu-item-icon step-number">{{ index + 1 }}</div>
          <button
            type="button"
            class="side-menu-item-description step-description"
            @click="goToChapter(index)"
          >
            <div class="step-title">
              {{ someChapter.pages.data[0].page_title_nl }}
            </div>
            <div class="step-place">
              {{ getChapterPlace(someChapter) }}
            </div>
          </button>
        </li>
      </ol>
    </nav>
  </aside>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import HomeIcon from '../icons/HomeIcon.vue';
import { useOverflowFade } from '../composables/overflow-fade';

export default {
  name: 'TourSideMenu',
  components: {
    HomeIcon,
  },
  data() {
    return {
      expanded: false,
      timer: null,
    };
  },
  computed: {
    ...mapState(['currentChapterIndex', 'touchDevice', 'places']),
    ...mapGetters(['tour', 'chapter', 'selectedChapters']),
  },
  watch: {
    tour() {
      if (this.checkOverflow) {
        setTimeout(this.checkOverflow, 0);
      }
    },
    chapter(newChapter) {
      const index = this.selectedChapters.indexOf(newChapter);
      const element = document.getElementById(`chapter-${index}`);
      if (element) {
        const clientRect = element.getBoundingClientRect();
        if (
          clientRect.top < clientRect.height ||
          clientRect.bottom > window.innerHeight - clientRect.height
        ) {
          element.offsetParent.scroll({
            top: element.offsetTop - clientRect.height * 2,
            behavior: 'smooth',
          });
        }
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.onDocumentClick);
    this.checkOverflow = useOverflowFade(this.$refs.tourNav, {
      fadeHeight: 200,
    });
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
  },
  methods: {
    showWelcomeModal() {
      this.$store.dispatch('setWelcomeModalOpen', true);
    },
    goToChapter(index) {
      this.$store.dispatch('setCurrentChapterIndex', index);
      document.activeElement.blur();
    },
    onClick() {
      this.expanded = true;
    },
    onMouseEnter() {
      if (!this.touchDevice) {
        this.timer = setTimeout(() => {
          this.expanded = true;
        }, 1000);
      }
    },
    onMouseLeave() {
      if (!this.touchDevice) {
        this.expanded = false;
        if (this.timer !== null) clearTimeout(this.timer);
      }
    },
    onDocumentClick(event) {
      if (!this.$el.contains(event.target) && this.expanded) {
        this.expanded = false;
      }
    },
    getChapterPlace(chapter) {
      const place = this.places.find(
        (p) => p.id === parseInt(chapter.waypoint.data.place, 10),
      );
      return place?.name_nl || '';
    },
  },
};
</script>

<style scoped>
aside {
  background-color: #2b2b2b;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 6rem;
  transition: width 0.3s ease-out;
  overflow: hidden;
}
aside.expanded,
aside:focus-within {
  width: 30rem;
}
aside:not(.expanded) {
  cursor: pointer;
}

nav {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}
aside.expanded nav {
  scrollbar-width: thin;
}
nav::-webkit-scrollbar {
  display: none;
}
aside.expanded nav::-webkit-scrollbar {
  display: unset;
}

ol {
  padding: 0;
  margin: 0;
  margin-left: 1.8rem;
  list-style: none;
}

p {
  margin: 0;
  padding: 0;
}

.side-menu-item {
  display: flex;
  align-items: center;
  gap: 1.8rem;
  width: calc(30rem - 3.6rem);
  margin-block: 1.5rem;
  height: 6rem;
  padding-right: 1.5rem;
  padding-left: 0;
}

.side-menu-item.active .step-number {
  color: var(--white);
  border: 3px solid var(--white);
  background-color: #49cece;
}

.side-menu-item-icon {
  height: 2.2rem;
  width: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
}

.home-icon-container {
  color: var(--white);
  border: 2px solid transparent;
  border-radius: 20rem;
}

.home-icon {
  fill: var(--white);
  stroke: var(--white);
  stroke-width: 0.1rem;
}

.step-number {
  color: var(--grey-light);
  border: 3px solid var(--grey-light);
  border-radius: 20rem;
  font-variation-settings: 'wght' 600;
  font-size: 1.5rem;
}

.side-menu-item-description {
  flex: 1;
  text-align: left;
  font-size: 1.5rem;
  font-variation-settings: 'wght' 600;
}

.tour-title {
  color: var(--background);
  border-left: 3px solid var(--background);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  padding-left: 0.5rem;
  font-size: 1.1rem;
}

.step-description {
  color: var(--grey-light);
}

.side-menu-item.active .step-description {
  padding: 0.2rem 0.4rem;
  border: 3px solid var(--white);
  color: var(--white);
}

.step-title {
  font-variation-settings: 'wght' 600;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
}

.step-place {
  font-size: 1.1rem;
}

@media (hover: hover) {
  .side-menu-item-description:hover {
    color: var(--white);
  }
}
</style>
