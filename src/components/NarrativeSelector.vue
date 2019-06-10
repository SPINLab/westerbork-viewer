<template>
  <div id="narrative-selector">
    <div class="selected-narrative-container">
      <button
        class="narrative-selection-button"
        @click="toggleNarrativeSelection"
      >
        <NarrativeSelectorIcon color="#ffffff" />
      </button>
      <div class="selected-narrative" ref="selectedNarrative">
        <span ref="selectedNarrativeText">
          <b> {{ parseInt(narrative.split(".")[0]) || 0 }} </b>
        </span>
      </div>
    </div>
    <ol class="narrative-selection" ref="narrativeSelection">
      <li
        v-for="(narrative, index) in narratives.slice().reverse()"
        :key="index"
        class="narrative-item narrative-item-hide"
        @click="selectNarrative(narrative, $event)"
      >
        <button>{{ narrative }}</button>
      </li>
    </ol>
  </div>
</template>

<script>
import NarrativeSelectorIcon from "./NarrativeSelectorIcon";

export default {
  name: "NarrativeSelector",
  components: {
    NarrativeSelectorIcon
  },
  data() {
    return {
      narrative: "",
      narratives: [],
      narrativeSelectionOpen: false,
      narrativeSelectionOpening: false
    };
  },
  mounted() {
    // Grab narratives
    fetch(
      `https://data.campscapes.org/api/1.1/tables/wch_intro_texts_narratives/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5`
    )
      .then(response => response.json())
      .then(responseJson => {
        let data = responseJson.data;
        data = data.filter(v => v.sort !== null);
        data = data.sort((a, b) => a.sort > b.sort);
        this.narratives = data.map(v => `${v.sort}. ${v.heading_dutch}`);
      });
  },
  methods: {
    setNarrativeItem(narrativeItem, visible) {
      if (visible) {
        narrativeItem.classList.remove("narrative-item-hide");
        narrativeItem.classList.add("narrative-item-show");
      } else {
        narrativeItem.classList.remove("narrative-item-show");
        narrativeItem.classList.add("narrative-item-hide");
      }
    },
    toggleNarrativeSelection() {
      //   if (
      //     typeof e !== "undefined" &&
      //     introduction.$tours.navTour.currentStep === 3
      //   ) {
      //     introduction.$tours.navTour.nextStep();
      //   }

      this.$refs.narrativeSelection.style.pointerEvents = this
        .narrativeSelectionOpen
        ? "none"
        : "auto";

      if (!this.narrativeSelectionOpening) {
        this.narrativeSelectionOpening = true;
        let i = this.narrativeSelectionOpen ? 0 : this.narratives.length - 1;
        const t = setInterval(() => {
          const narrativeItem = this.$refs.narrativeSelection.children[i];
          this.setNarrativeItem(narrativeItem, !this.narrativeSelectionOpen);
          i = this.narrativeSelectionOpen ? i + 1 : i - 1;
          if (i < 0 || i > this.narratives.length - 1) {
            clearInterval(t);
            this.narrativeSelectionOpen = !this.narrativeSelectionOpen;
            this.narrativeSelectionOpening = false;
          }
        }, 40);
      }
    },
    selectNarrative(narrative, e) {
      //   if (introduction.$tours.navTour.currentStep === 5) {
      //     introduction.$tours.navTour.nextStep();
      //   }

      this.narrative = narrative.split(". ")[1];
      this.toggleNarrativeSelection();

      for (const item of this.$refs.narrativeSelection.children) {
        item.children[0].classList.remove("narrative-item-highlight");
      }
      e.target.classList.add("narrative-item-highlight");

      this.$refs.selectedNarrativeText.classList.add(
        "narrative-icon-grow-shrink"
      );
      setTimeout(() => {
        this.$refs.selectedNarrativeText.classList.remove(
          "narrative-icon-grow-shrink"
        );
      }, 300);
      this.$emit("narrative-change", this.narrative);
    },
    documentClick(e) {
      if (!this.$el.parentElement.contains(e.target)) {
        if (this.narrativeSelectionOpen) {
          this.toggleNarrativeSelection();
        }
      }
    }
  },
  created() {
    document.addEventListener("click", this.documentClick);
  },
  destroyed() {
    document.removeEventListener("click", this.documentClick);
  }
};
</script>

<style scoped>
#narrative-selector {
  width: 10vw;
}

.selected-narrative-container {
  display: flex;
  align-items: center;
  padding: 2rem;
}

.narrative-selection-button {
  position: relative;
  background-color: #454545;
  border-radius: 25rem;
  padding: 2.5rem;
  cursor: pointer;
  border: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.narrative-selection-button svg {
  width: 1.3rem;
  position: absolute;
  top: 33%;
  left: 37%;
}

.narrative-selection-button:focus {
  outline: 0;
  background-color: grey;
}

.selected-narrative {
  position: relative;
  background-color: #f9cd79;
  border-radius: 11rem;
  padding: 1.1rem;
  height: 0.5rem;
  display: flex;
  align-items: center;
  margin-left: -1.1rem;
  font-family: "Flaco-Mono", sans-serif;
  font-size: 0.875rem;
  pointer-events: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.narrative-selection {
  list-style-type: none;
  padding: 0;
  position: absolute;
  bottom: 6.4rem;
  left: 1rem;
}

.narrative-item button {
  background-color: #454545;
  color: #d5d5d5;
  border-radius: 10rem;
  padding: 0.4rem 1rem;
  margin-bottom: 0.6rem;
  width: fit-content;
  cursor: pointer;
  font-family: "Flaco-Mono", sans-serif;
  border: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.narrative-item button:focus {
  outline: 0;
  background-color: grey;
}

.narrative-item-show {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s linear;
}

.narrative-item-hide {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s linear;
}

@keyframes grow-shrink {
  0% {
    transform: scale(1.5);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1.5);
  }
}

.narrative-icon-grow-shrink {
  animation-name: grow-shrink;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.narrative-item-highlight {
  background-color: #f9cd79 !important;
  color: #454545 !important;
}
</style>
