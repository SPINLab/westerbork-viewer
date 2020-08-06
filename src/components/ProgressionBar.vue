<template>
  <div id="progression-bar">
    <VueSlider
      ref="progressionSlider"
      v-model="step"
      class="slider"
      v-bind="options"
      @change="moveToRoom"
    />
    <ol class="labels">
      <li
        v-for="(room, index) of rooms"
        :key="index"
        @click="onLabelClick(room)"
      >
        <div
          v-show="room == step"
          class="highlight"
        />
        <br>
        <button
          v-show="room == step"
          class="selected"
        >
          <span>{{ $t(room) }}</span>
        </button>
        <button v-show="room != step">
          <span>{{ $t(room) }}</span>
        </button>
      </li>
    </ol>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

const rooms = [
  'outside',
  'hallway',
  'diningRoom',
  'livingRoom',
  'sittingRoom',
  'conservatory',
  'kitchen',
  'basement',
  'gardenShed',
  'bedroomGemmeker',
  'bedroomObreen',
  'guestroom1',
  'guestroom2',
  'bedroomHassel',
  'bathroom',
  'attic',
];

const markStyle = {
  width: '1rem',
  height: '1rem',
  backgroundColor: '#C1C1C1',
  display: 'block',
  transform: 'translate(-0.25rem, -0.25rem)',
};

const marks = rooms.reduce((o, key) => ({ ...o, [key]: { style: markStyle } }), {});

export default {
  name: 'ProgressionBar',
  components: {
    VueSlider,
  },
  data() {
    return {
      step: 'Outside',
      rooms,
      enabled: false,
      percentAnimationDuration: 1000,
      options: {
        data: [...rooms, 'Attic'],
        tooltip: 'none',
        marks,
        lazy: true,
        dotSize: 22,
        dotStyle: {
          backgroundColor: '#FFD27C',
          transform: 'translateX(2px)',
        },
        railStyle: {
          backgroundColor: '#E5E5E5',
          height: '0.5rem',
          width: '99.8%',
        },
        processStyle: {
          backgroundColor: '#FFFFFF',
        },
        stepStyle: {
          backgroundColor: '#C1C1C1',
          visibility: 'visible',
          width: '0.9375rem',
          height: '0.9375rem',
          transform: 'translate(-30%, -30%)',
          cursor: 'pointer',
        },
        hideLabel: true,
      },
      stepLocations: new Map([
        ['outside', 0],
        ['hallway', 0.1029],
        ['diningRoom', 0.1295],
        ['livingRoom', 0.1578],
        ['sittingRoom', 0.1943],
        ['conservatory', 0.227],
        ['kitchen', 0.3358],
        ['basement', 0.385],
        ['gardenShed', 0.465],
        ['bedroomGemmeker', 0.6155],
        ['bedroomObreen', 0.68],
        ['guestroom1', 0.7376],
        ['guestroom2', 0.7877],
        ['bedroomHassel', 0.8538],
        ['bathroom', 0.9167],
        ['attic', 0.998],
      ]),
      stepEntranceLocations: {
        outside: 0,
        hallway: 0.0878,
        diningRoom: 0.1163,
        livingRoom: 0.14,
        sittingRoom: 0.1668,
        conservatory: 0.2148,
        kitchen: 0.325,
        basement: 0.3774,
        gardenShed: 0.4558,
        bedroomGemmeker: 0.6043,
        bedroomObreen: 0.6619,
        guestroom1: 0.7232,
        guestroom2: 0.7698,
        bedroomHassel: 0.839,
        bathroom: 0.9038,
        attic: 0.9847,
      },
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
          const { position } = this.$viewer.pathControls;
          let step;
          const entranceKeys = Object.keys(this.stepEntranceLocations);
          const entranceValues = Object.values(this.stepEntranceLocations);
          for (let i = 0; i < entranceValues.length; i += 1) {
            if (position >= entranceValues[i]) {
              step = entranceKeys[i];
            } else {
              break;
            }
          }

          if (step !== this.step) {
            this.step = step;
            this.$emit('room-change', step);
          }
        }, 10);

        this.enabled = true;
      }
    },
    lockView() {
      this.$viewer.pathControls.lockViewToPath = 'always';
      this.$viewer.pathControls.userInputCancels = false;
    },
    unlockView() {
      this.$viewer.pathControls.lockViewToPath = 'moving';
      this.$viewer.pathControls.userInputCancels = true;
    },
    moveToRoom() {
      const currentLoc = this.$viewer.pathControls.position;
      const stepLoc = this.stepLocations.get(this.step);
      const percentDistance = Math.abs(currentLoc - stepLoc);

      if (percentDistance < 0.1) {
        const animationDuration = percentDistance * 100 * this.percentAnimationDuration;

        this.lockView();
        this.$viewer.pathControls.moveTo(stepLoc, animationDuration, this.unlockView);
      } else {
        this.$viewer.renderArea.classList.add('warp');
        setTimeout(() => {
          this.$viewer.scene.view.direction = this.$viewer.pathControls.path.getTangentAt(stepLoc);
          this.$viewer.pathControls.position = stepLoc;
          this.$emit('room-change', this.step);
          setTimeout(() => {
            this.$viewer.renderArea.classList.remove('warp');
          }, 500);
        }, 500);
      }
    },
  },
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
  margin-left: 2rem;
  pointer-events: auto;
  flex-grow: 1;
}

#progression-bar:focus {
  outline: 0;
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
  position: relative;
}

.labels li button {
  padding: 0 0.2rem;
  border: 0;
  background-color: unset;
  color: unset;
  font-family: 'Flaco-Mono', sans-serif;
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
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0, -0.4rem);
}

.selected {
  z-index: 5;
  position: relative;
}

@media only screen and (max-width: 1400px) {
  #progression-bar {
    width: 100vw;
  }
}

@media only screen and (max-width: 1100px) {
  .labels span {
    display: flex;
    writing-mode: vertical-rl;
    height: 5rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
