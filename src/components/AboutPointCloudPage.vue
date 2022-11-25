<template>
  <transition name="fade">
    <article v-if="aboutPointCloudPageOpen">
      <header>
        <h2>De 3D puntenwolk</h2>
        <button type="button" class="close-button" @click="close">
          <span>Sluiten</span> <CrossIcon />
        </button>
      </header>
      <section>
        <div class="point-cloud-about">
          <p>
            De Commandantswoning wordt in deze “virtuele versie” getoond via een
            ‘3D-Puntenwolk’ (‘Point Cloud’). De ‘Puntenwolk’ is in 2017 gemaakt
            met behulp van een 3D laserscanner door het Britse ScanLAB.
          </p>
          <p>
            Bij het maken van een ‘3D-Puntenwolk’ wordt een laserscanner in het
            midden van een ruimte geplaatst. De scanner schiet vervolgens een
            laserstraal om zich heen en vangt de vele reflecties weer op. De
            miljoenen puntjes die hier worden getoond zijn daarmee een
            letterlijke weergave van hoe de scanner de villa heeft ingemeten.
            Aan de cirkels op de vloer kunt u soms zien waar de scanner gestaan
            heeft.
          </p>
          <p>
            De data van het scannen uit 2017, zijn bij het bouwen van deze
            “virtuele versie” van de Commandantswoning ‘digitaal opgeschoond’,
            met elkaar gecombineerd, en zichtbaar gemaakt via het programma
            Potree, een gratis open source omgeving om grote hoeveelheden punten
            data te kunnen weergeven.
          </p>
        </div>
        <div class="point-cloud-images">
          <img
            :src="require('../assets/images/point-cloud-1.png')"
            alt="Puntenwolk 1"
          />
          <img
            :src="require('../assets/images/point-cloud-2.png')"
            alt="Puntenwolk 2"
          />
        </div>
      </section>
    </article>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

import CrossIcon from '../icons/CrossIcon.vue';

export default {
  name: 'AboutPointCloudPage',
  components: {
    CrossIcon,
  },
  computed: {
    ...mapState(['aboutPointCloudPageOpen']),
  },
  methods: {
    close() {
      this.$store.dispatch('setAboutPointCloudPageOpen', false);
    },
  },
};
</script>

<style scoped>
article {
  height: 100vh;
  width: 100vw;
  position: absolute;
  inset: 0;
  background-image: url('../assets/images/trees_bg.jpg');
  background-size: cover;
  padding: 4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

a {
  color: var(--accent-dark);
  font-variation-settings: 'wght' 600;
  text-decoration: none;
}
@media (hover: hover) {
  a:hover {
    text-decoration: underline;
  }
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  color: var(--white);
  font-size: 3rem;
  margin: 0;
}

.close-button {
  display: flex;
  align-items: center;
  font-size: 2rem;
  color: var(--white);
}
.close-button span {
  margin-right: 2rem;
}
.close-button >>> svg {
  stroke: var(--white);
  stroke-width: 1rem;
  height: 3rem;
  width: 3rem;
}

p {
  font-family: var(--sans-serif);
  margin-block: 1rem;
  font-size: 1.5rem;
}
p:first-of-type {
  margin-top: 0;
}

section {
  display: flex;
  gap: 4rem;
  flex: 1;
}

.point-cloud-about {
  background-color: var(--background);
  border-radius: 4px;
  padding: 3rem;
  max-width: 40rem;
}

.point-cloud-images {
  max-height: calc(100vh - 13rem);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  flex: 1;
}
img {
  width: 100%;
  max-height: calc(50% - 2rem);
  object-fit: cover;
  border-radius: 2px;
}
img:first-of-type {
  margin-top: 0;
}
</style>
