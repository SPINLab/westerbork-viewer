<template>
  <div id="progression-bar">
    <VueSlider
      ref="progressionSlider"
      class="slider"
      v-model="step"
      v-bind="options"
      @change="moveToRoom"
    />
    <ol class="labels">
      <li
        v-for="(room, index) of rooms"
        :key="index"
        @click="onLabelClick(room)"
      >
        <div v-show="room == step" class="highlight"></div>
        <br />
        <button v-show="room == step" class="selected">{{ room }}</button>
        <button v-show="room != step">{{ room }}</button>
      </li>
    </ol>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

const rooms = [
  "Outside",
  "Hallway",
  "Dining Room",
  "Anteroom",
  "Sitting Room",
  "Conservatory",
  "Kitchen",
  "Basement",
  "Garden Shed",
  "Bedroom Gemmeker",
  "Bedroom Speck Obreen",
  "Guestroom 1",
  "Guestroom 2",
  "Bedroom Elisabeth Hassel",
  "Bathroom",
  "Attic"
];

const markStyle = {
  width: "1rem",
  height: "1rem",
  backgroundColor: "#C1C1C1",
  display: "block",
  transform: "translate(-0.25rem, -0.25rem)"
};

const marks = rooms.reduce(
  (o, key) => ({ ...o, [key]: { style: markStyle } }),
  {}
);

export default {
  name: "ProgressionBar",
  components: {
    VueSlider
  },
  data() {
    return {
      step: "Outside",
      rooms: rooms,
      enabled: false,
      percentAnimationDuration: 1000,
      options: {
        data: [...rooms, "Attic"],
        tooltip: "none",
        marks: marks,
        lazy: true,
        dotSize: 22,
        dotStyle: {
          backgroundColor: "#FFD27C",
          transform: "translateX(2px)"
        },
        railStyle: {
          backgroundColor: "#E5E5E5",
          height: "0.5rem",
          width: "99.8%"
        },
        processStyle: {
          backgroundColor: "#FFFFFF"
        },
        stepStyle: {
          backgroundColor: "#C1C1C1",
          visibility: "visible",
          width: "0.9375rem",
          height: "0.9375rem",
          transform: "translate(-30%, -30%)",
          cursor: "pointer"
        },
        hideLabel: true
      },
      stepLocations: new Map([
        ["Outside", 0],
        ["Hallway", 0.1029],
        ["Dining Room", 0.1295],
        ["Anteroom", 0.1578],
        ["Sitting Room", 0.1943],
        ["Conservatory", 0.227],
        ["Kitchen", 0.3358],
        ["Basement", 0.385],
        ["Garden Shed", 0.465],
        ["Bedroom Gemmeker", 0.6155],
        ["Bedroom Speck Obreen", 0.68],
        ["Guestroom 1", 0.7376],
        ["Guestroom 2", 0.7877],
        ["Bedroom Elisabeth Hassel", 0.8538],
        ["Bathroom", 0.9167],
        ["Attic", 0.998]
      ]),
      stepEntranceLocations: new Map([
        ["Outside", 0],
        ["Hallway", 0.0878],
        ["Dining Room", 0.1163],
        ["Anteroom", 0.14],
        ["Sitting Room", 0.1668],
        ["Conservatory", 0.2148],
        ["Kitchen", 0.325],
        ["Basement", 0.3774],
        ["Garden Shed", 0.4558],
        ["Bedroom Gemmeker", 0.6043],
        ["Bedroom Speck Obreen", 0.6619],
        ["Guestroom 1", 0.7232],
        ["Guestroom 2", 0.7698],
        ["Bedroom Elisabeth Hassel", 0.839],
        ["Bathroom", 0.9038],
        ["Attic", 0.9847]
      ])
    };
  },
  methods: {
    onLabelClick(room) {
      this.step = room;
      this.moveToRoom();
    },
    startProgression() {
      if (this.enabled === false) {
        setInterval(() => {
          const position = this.$viewer.pathControls.position;
          let step;
          for (let [stepName, stepPosition] of this.stepEntranceLocations) {
            if (position >= stepPosition) {
              step = stepName;
            } else {
              break;
            }
          }
          if (step !== this.step) {
            this.step = step;
            this.$emit("room-change", step);
          }
        }, 10);

        this.enabled = true;
      }
    },
    lockView() {
      this.$viewer.pathControls.lockViewToPath = "always";
      this.$viewer.pathControls.userInputCancels = false;
    },
    unlockView() {
      this.$viewer.pathControls.lockViewToPath = "moving";
      this.$viewer.pathControls.userInputCancels = true;
    },
    moveToRoom() {
      const currentLoc = this.$viewer.pathControls.position;
      const stepLoc = this.stepLocations.get(this.step);
      const percentDistance = Math.abs(currentLoc - stepLoc);

      if (percentDistance < 0.1) {
        const animationDuration =
          percentDistance * 100 * this.percentAnimationDuration;

        this.lockView();
        this.$viewer.pathControls.moveTo(
          stepLoc,
          animationDuration,
          this.unlockView
        );
      } else {
        this.$viewer.renderArea.classList.add("warp");
        setTimeout(() => {
          this.$viewer.pathControls.position = stepLoc;
          this.$emit("room-change", this.step);
          setTimeout(() => {
            this.$viewer.renderArea.classList.remove("warp");
          }, 500);
        }, 500);
      }
    }
  }
};
</script>

<style>
@keyframes fadeOutIn {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.warp {
  animation-name: fadeOutIn;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
</style>

<style scoped>
#progression-bar {
  display: flex;
  flex-direction: column;
  width: 90vw;
}

.labels {
  color: #f0f0f0;
  display: flex;
  list-style-type: none;
  padding: 0 0.1rem;
  margin: -0.3rem 0 0 0;
}

.labels li {
  width: 6.25%;
  border-left: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
}

.labels li button {
  padding: 0 0.2rem;
  border: 0;
  background-color: unset;
  color: unset;
  font-family: "Flaco-Mono", sans-serif;
  font-size: 0.875rem;
  cursor: unset;
  word-break: break-word;
}

.labels li button:focus {
  outline: 0;
  z-index: 5;
  position: relative;
}

.highlight {
  background: linear-gradient(
    to bottom right,
    rgba(255, 210, 124, 0.5),
    rgba(255, 242, 217, 0.05) 60%
  );
  pointer-events: none;
  width: 5.6%;
  height: 100%;
  position: absolute;
  transform: translate(0, -0.4rem);
}

.selected {
  z-index: 5;
  position: relative;
}
</style>
