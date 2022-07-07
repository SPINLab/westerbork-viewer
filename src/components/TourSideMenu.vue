<template>
  <aside
    :class="{ expanded }"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <nav>
      <ol>
        <li>
          <button
            type="button"
            class="side-menu-item home-item"
            @click="showWelcomeModal"
          >
            <div class="side-menu-item-icon home-icon-container">
              <HomeIcon class="home-icon" />
            </div>
            <div class="side-menu-item-description tour-title">
              Tour {{ tours.indexOf(tour) + 1 }}: {{ tour.name_nl }}
            </div>
          </button>
        </li>
        <div ref="chaptersList" class="chapters-list scrollable">
          <li
            v-for="(someChapter, index) in tourChapters"
            :id="`chapter-${index}`"
            :key="someChapter.id"
          >
            <button
              type="button"
              class="side-menu-item"
              :class="{ active: chapterIndex === index }"
              @click="goToChapter(index)"
            >
              <div class="side-menu-item-icon step-number">{{ index + 1 }}</div>
              <div class="side-menu-item-description step-description">
                <div class="step-title">
                  {{ someChapter.pages.data[0].page_title_nl }}
                </div>
                <div class="step-place">
                  {{ getChapterPlace(someChapter) }}
                </div>
              </div>
            </button>
          </li>
        </div>
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
    ...mapState(['chapterIndex', 'touchDevice', 'places']),
    ...mapGetters(['tours', 'tour', 'chapter', 'tourChapters']),
  },
  watch: {
    tour() {
      if (this.checkOverflow) {
        setTimeout(this.checkOverflow, 0);
      }
    },
    chapter(newChapter) {
      const index = this.tourChapters.indexOf(newChapter);
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
    this.checkOverflow = useOverflowFade(this.$refs.chaptersList, {
      fadeHeight: 200,
    });
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
  },
  methods: {
    showWelcomeModal() {
      if (this.expanded) {
        this.$store.dispatch('setWelcomeModalOpen', true);
      }
    },
    goToChapter(index) {
      if (this.expanded) {
        this.$store.dispatch('setChapterIndex', index);
        document.activeElement.blur();
      }
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
  width: 7.4rem;
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
}

ol {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  margin: 0;
  margin-left: 1.8rem;
  list-style: none;
}

p {
  margin: 0;
  padding: 0;
}

.chapters-list {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

@media (hover: hover) {
  .chapters-list {
    scrollbar-width: none;
  }
  aside.expanded .chapters-list {
    scrollbar-width: thin;
  }
  .chapters-list::-webkit-scrollbar {
    display: none;
  }
  aside.expanded .chapters-list::-webkit-scrollbar {
    display: unset;
  }
}

.side-menu-item {
  display: flex;
  align-items: center;
  gap: 2.2rem;
  width: calc(30rem - 3.6rem);
  margin-block: 1rem;
  height: 8rem;
}

.home-item {
  margin-bottom: 0;
}

.side-menu-item.active .step-number {
  color: var(--white);
  border: 3px solid var(--white);
  background-color: var(--accent-dark);
}

.side-menu-item-icon {
  height: 3rem;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 2rem;
}

.side-menu-item-description {
  flex: 1;
  text-align: left;
  font-size: 1.8rem;
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
  font-size: 1.3rem;
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
  font-size: 1.3rem;
}

@media (hover: hover) {
  .side-menu-item:hover .side-menu-item-description {
    color: var(--white);
  }

  .side-menu-item:hover .step-number {
    background-color: var(--accent);
    color: var(--white);
    border-color: var(--white);
  }
}
</style>
