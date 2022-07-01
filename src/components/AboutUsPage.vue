<template>
  <transition name="fade">
    <article v-if="aboutUsPageOpen">
      <header>
        <h2>Over dit project</h2>
        <button type="button" class="close-button" @click="close">
          <span>Sluiten</span> <CrossIcon />
        </button>
      </header>
      <div class="two-columns">
        <section class="project-about">
          <p>
            De Commandantswoning is een van de weinige authentieke
            overblijfselen van kamp Westerbork. Het is te fragiel om voor het
            grote publiek open te stellen. Met deze “virtuele versie” van het
            huis probeert het Herinneringscentrum Kamp Westerbork in
            samenwerking met verschillende partners, de geschiedenis van de
            villa en zijn bewoners aan bezoekers over te dragen.
          </p>
          <p>
            In de huidige opstelling die u hier aantreft, kunt u de
            Commandantswoning zowel <strong>Vrij Verkennen</strong>, als het
            achterliggende verhaal van de verschillende vertrekken via twee
            <strong>Tours</strong> bekijken.
          </p>
          <p class="feedback">
            Op zoek naar meer informatie, vragen of opmerkingen? Neem dan
            contact op met het Herinneringscentrum Kamp Westerbork ↓
            <br /><br />
            <a href="mailto:bas@kampwesterbork.nl">bas@kampwesterbork.nl</a>
          </p>
        </section>
        <section class="people-about">
          <div>
            <p>
              <strong>Project coördinatie:</strong>
              Jitte Waagen (4D Research Lab), Sytse Wierenga (Eodyne Systems,
              Future Memory Foundation)
            </p>
            <p>
              <strong>Inhoudelijke ontwikkeling:</strong>
              Bas Kortholt (Herinneringscentrum Kamp Westerbork), Sytse
              Wierenga, Tijm Lanjouw (4D Research Lab)
            </p>
            <p>
              <strong>Ontwerp:</strong>
              Sytse Wierenga, Tijm Lanjouw
            </p>
            <p>
              <strong>Technische ontwikkeling:</strong>
              Chris Lucas, Tijm Lanjouw, Sytse Wierenga, Ivan Kisjes (CREATE)
            </p>
            <p>
              <strong>Advies en coördinatie:</strong>
              Rob van der Laarse (Universiteit van Amsterdam), Paul Verschure
              (Future Memory Foundation, SPECS Lab)
            </p>
            <p>
              Aan een eerdere versie van deze applicatie werkten mee: Dana
              Dolghin (Universiteit van Amsterdam), Erik van Zummeren, Maurice
              de Kleijn (SPINLab, Vrije Universiteit Amsterdam)
            </p>

            <div class="previous-project">
              <p>
                Het huidige project is deels een voortzetting van een initiatief
                ontwikkeld in 2017 onder het Europees research project
                iC-ACCESS, dat ook het online platform Campscapes ontwikkeld
                heeft.
              </p>
              <p>
                https://www.campscapes.org Digitaal platform:
                https://platform.campscapes.org <br /><br />
                Afkorting: iC-ACCESS Looptijd: 01/04/2016 – 31/12/2019 Project
                details: 2016-Uses of the Past /HERA.15.092. REFLECTIVE-1-2014
                (H2020-EU.3.6.)
              </p>
            </div>

            <p class="software">
              <strong>Software:</strong>
              Deze applicatie is gemaakt met
              <a href="https://vuejs.org/">Vue</a> voor de UI en
              <a href="https://potree.github.io/">Potree</a> voor de
              3D-visualisatie.
            </p>
          </div>
        </section>
      </div>
      <section class="logos">
        <ul>
          <li>
            <img
              :src="require('../assets/logo_partners/kampwesterbork.png')"
              alt="Herinneringscentrum Kamp Westerbork"
            />
          </li>
          <li>
            <img
              :src="require('../assets/logo_partners/uva.png')"
              alt="Universiteit van Amsterdam"
            />
          </li>
          <li>
            <img
              :src="require('../assets/logo_partners/4dresearchlab.png')"
              alt="4D Research Lab"
            />
          </li>

          <li>
            <img
              :src="require('../assets/logo_partners/vu-spinlab-logo.png')"
              alt="Vrije Universiteit Amsterdam - SPINLab"
            />
          </li>
          <li>
            <img
              :src="require('../assets/logo_partners/hera.png')"
              alt="HERA"
            />
          </li>
          <li>
            <img
              :src="require('../assets/logo_partners/rotary.png')"
              alt="Rotary"
            />
          </li>
        </ul>
      </section>
    </article>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

import CrossIcon from '../icons/CrossIcon.vue';

export default {
  name: 'AboutUsPage',
  components: {
    CrossIcon,
  },
  computed: {
    ...mapState(['aboutUsPageOpen']),
  },
  methods: {
    close() {
      this.$store.dispatch('setAboutUsPageOpen', false);
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

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: var(--background);
  padding: 3rem;
  gap: 4rem;
  border-radius: 4px;
}

p {
  font-family: var(--sans-serif);
  margin-block: 1rem;
}
p:first-of-type {
  margin-top: 0;
}

.project-about {
  max-width: 55rem;
}
.project-about p {
  font-size: 1.5rem;
}

.people-about {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.people-about div {
  max-width: 50rem;
}
.people-about p {
  font-size: 1.3rem;
}

.feedback {
  margin-top: 4rem;
  font-variation-settings: 'wght' 500;
}

.previous-project {
  margin-top: 4rem;
}

.software {
  margin-top: 4rem;
}

.logos {
  margin-top: 4rem;
}

.logos ul {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  gap: 4rem;
}

.logos img {
  width: 100%;
}
</style>
