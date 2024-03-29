<template>
  <transition name="fade">
    <div v-if="welcomeModalOpen">
      <div class="background"></div>
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
          <li v-for="tour in tours" :key="tour.id">
            <div>
              <div
                class="button-container active-marker"
                :class="{ active: tourId === tour.id }"
              >
                <button type="button" @click="showTour(tour.id)">
                  Tour: {{ tour.name_nl }}
                </button>
              </div>
              <p>{{ tour.summary_nl }}</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

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
    ...mapState(['welcomeModalOpen', 'tourId']),
    ...mapGetters(['tours']),
  },
  methods: {
    hide() {
      if (this.initChoiceMade) {
        this.$store.dispatch('setWelcomeModalOpen', false);
      }
    },
    showIntroductionVideo() {
      window.location.reload();
    },
    showPointCloudViewer() {
      this.initChoiceMade = true;
      this.$store.dispatch('setTourId', null);
      this.$store.dispatch('setWaypointId', 5);
      this.$nextTick(() => {
        this.$store.dispatch('setTourOpen', false);
        this.$store.dispatch('setWelcomeModalOpen', false);
        this.$store.dispatch('setRenderPointCloud', true);
      });
    },
    showTour(id) {
      this.initChoiceMade = true;
      this.$store.dispatch('setTourId', id);
      this.$store.dispatch('setTourOpen', true);
      this.$store.dispatch('setMediaOpen', true);
      this.$store.dispatch('setWelcomeModalOpen', false);
      this.$store.dispatch('setRenderPointCloud', false);
    },
  },
};
</script>

<style scoped>
.background {
  z-index: 1;
  position: absolute;
  inset: 0;
  background-image: url('../assets/images/outside.jpg');
  background-size: cover;
}
.fade {
  z-index: 2;
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
}

.modal {
  z-index: 3;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(30rem, 80vw, 60rem);
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
  width: calc(50% - 1.5rem);
}

button {
  font-size: 1.5rem;
  font-variation-settings: 'wght' 500;
  border-left: 3px solid var(--grey);
  padding-left: 0.6rem;
}
.button-container {
  border: 3px solid transparent;
  padding: 0.6rem;
  border-radius: 6px;
}
.active-marker::before {
  content: '';
  display: block;
  height: 1.8rem;
}
.active {
  border: 3px solid var(--accent);
}
.active::before {
  content: 'Nu actief';
  display: block;
  height: 1rem;
  color: var(--accent);
  font-variation-settings: 'wght' 600;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
}

p {
  font-family: var(--sans-serif);
  padding-left: calc(0.6rem + 6px);
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
