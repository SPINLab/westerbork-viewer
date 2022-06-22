<template>
  <transition name="fade">
    <div v-if="welcomeModalOpen">
      <div class="fade" @click="hide"></div>
      <section ref="modal" class="modal">
        <h2>
          <HomeIcon class="home-icon" />
          <span>Welkom! Wat wilt u doen?</span>
        </h2>
        <ul>
          <li>
            <div class="button-container">
              <button type="button" @click="showIntroductionVideo">
                Speel introductie opnieuw
              </button>
            </div>
          </li>
          <li>
            <div class="button-container">
              <button type="button" @click="showPointCloudViewer">
                Vrij verkennen
              </button>
            </div>
          </li>
          <li>
            <div>
              <div
                class="button-container active-marker"
                :class="{ active: selectedTour === 0 }"
              >
                <button type="button" @click="showTour(0)">
                  Tour: Commandant Gemmeker en de woning
                </button>
              </div>
              <p>
                Anton Gemmeker was commandant van Kamp Westerbork onder de
                nazis. Hij woonde in het huis met zijn maîtresse.
              </p>
            </div>
          </li>
          <li>
            <div>
              <div
                class="button-container active-marker"
                :class="{ active: selectedTour === 1 }"
              >
                <button type="button" @click="showTour(1)">
                  Tour: Onderzoek en vondsten
                </button>
              </div>
              <p>
                Verken de sporen die verschillende periodes en bewoners hebben
                achtergelaten
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

import HomeIcon from '../icons/HomeIcon.vue';

export default {
  name: 'WelcomeModal',
  components: { HomeIcon },
  data() {
    return {
      initChoiceMade: false,
    };
  },
  computed: {
    ...mapState(['welcomeModalOpen', 'selectedTour']),
  },
  methods: {
    hide() {
      if (this.initChoiceMade) {
        this.$store.dispatch('setWelcomeModalOpen', false);
      }
    },
    showIntroductionVideo() {
      this.$store.dispatch('setWelcomeModalOpen', false);
      this.$store.dispatch('setIntroductionOpen', true);
    },
    showPointCloudViewer() {
      this.initChoiceMade = true;
      this.$store.dispatch('setSelectedTour', null);
      this.$store.dispatch('setTourOpen', false);
      this.$store.dispatch('setWelcomeModalOpen', false);
      this.$store.dispatch('setRenderPointCloud', true);
    },
    showTour(index) {
      this.initChoiceMade = true;
      this.$store.dispatch('setSelectedTour', index);
      this.$store.dispatch('setTourOpen', true);
      this.$store.dispatch('setWelcomeModalOpen', false);
      this.$store.dispatch('setRenderPointCloud', false);
    },
  },
};
</script>

<style scoped>
.fade {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(30rem, 80vw, 54rem);
  background-color: var(--background);
  border-radius: 12px;
  padding: 2rem;
  box-sizing: border-box;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

h2 {
  font-size: 2.2rem;
  font-variation-settings: 'wght' 500;
  color: var(--accent-dark);
  display: flex;
  margin: 0;
  align-items: center;
}
h2 span {
  margin-left: 1.2rem;
}
.home-icon {
  height: 2.2rem;
  width: 2.2rem;
  stroke-width: 0.05rem;
  stroke: var(--accent-dark);
  fill: var(--accent-dark);
}

ul {
  display: flex;
  flex-wrap: wrap;
  margin-top: 3rem;
  gap: 1.5rem;
}

li {
  width: 23rem;
}

button {
  font-size: 1.5rem;
  font-variation-settings: 'wght' 500;
  border-left: 4px solid var(--grey);
  padding-left: 0.5rem;
  margin: 0.4rem;
}
.button-container {
  border: 4px solid transparent;
}
.active-marker::before {
  content: '';
  display: block;
  height: 1.2rem;
}
.active {
  border: 4px solid var(--accent);
}
.active::before {
  content: 'Nu actief';
  display: block;
  height: 1.2rem;
  color: var(--accent);
  font-variation-settings: 'wght' 600;
  font-size: 1.1rem;
  padding-left: calc(0.9rem + 4px);
}

p {
  font-family: var(--sans-serif);
  padding-left: calc(0.5rem + 4px);
  padding-right: 3rem;
  font-variation-settings: 'wght' 500;
  font-size: 1.1rem;
  margin: 0;
  margin-top: 1rem;
}

@media (hover: hover) {
  button:hover {
    color: var(--accent-dark);
    border-color: var(--accent-dark);
  }
}
</style>
