<template>
  <transition name="fade">
    <div
      v-show="isOpen"
      class="about-page"
    >
      <div class="content">
        <header>
          <TheLogo
            title-color="#4B4B4B"
            subtitle-color="#4B4B4B"
            line-color="#A8A8A8"
          />
          <NavigationButton
            :title="$t('backButtonText')"
            class="back-button"
            @click.native="close"
          />
        </header>
        <div class="columns">
          <div
            id="about-text-column"
            class="column"
          >
            <section class="about">
              <h3>{{ $t('aboutSubtitle') }}</h3>
              <div v-html="$t('aboutText')" />
              <div style="display: flex; align-items: center; margin-top: 2rem">
                <img
                  :src="require('../assets/logo_partners/eu.png')"
                  alt="EU"
                  style="width: 100%; height: 100%; margin-right: 2rem"
                >
                <p>
                  This project has received funding from the European Union's Horizon 2020 research
                  and innovation programme, the Seventh Framework Programme for research,
                  technological development and demonstration of the Sixth Framework for research
                  and technological development
                </p>
              </div>
            </section>
          </div>
          <div
            id="other-column"
            class="column"
          >
            <section class="team">
              <h3>TEAM</h3>
              <ul>
                <TeamMember
                  name="Jitte Waagen"
                  position="Project Lead"
                  organization="4D Research Lab"
                />
                <TeamMember
                  name="Rob van der Laarse"
                  position="Coordinator"
                  organization="Universiteit van Amsterdam"
                />
                <TeamMember
                  name="Maurice de Kleijn"
                  position="Coordinator"
                  organization="SPINLab"
                />
                <TeamMember
                  name="Bas Kortholt"
                  position="Coordinator"
                  organization="Herinneringscentrum Westerbork"
                />
                <TeamMember
                  name="Dana Dolghin"
                  position="Content"
                  organization="Universiteit van Amsterdam"
                />
                <TeamMember
                  name="Chris Lucas"
                  position="Front-end & Data Processing"
                  organization="SPINLab"
                />
                <TeamMember
                  name="Tijm Lanjouw"
                  position="3D Modeller"
                  organization="4D Research Lab"
                />
                <TeamMember
                  name="Erik van Zummeren"
                  position="Design"
                  organization=" "
                />
                <TeamMember
                  name="Ivan Kisjes"
                  position="Server Management"
                  organization="Create"
                />
              </ul>
            </section>
            <section class="partners">
              <h3>PROJECT PARTNERS</h3>
              <ul>
                <li>
                  <img
                    :src="require('../assets/logo_partners/uva.png')"
                    alt="Universiteit van Amsterdam"
                  >
                </li>
                <li>
                  <img
                    :src="require('../assets/logo_partners/4dresearchlab.png')"
                    alt="4D Research Lab"
                  >
                </li>
                <li>
                  <img
                    :src="require('../assets/logo_partners/vu-spinlab-logo.png')"
                    alt="Universiteit van Amsterdam"
                  >
                </li>
                <li>
                  <img
                    :src="require('../assets/logo_partners/kampwesterbork.png')"
                    alt="Herinneringscentrum Kamp Westerbork"
                  >
                </li>
                <li>
                  <img
                    :src="require('../assets/logo_partners/hera.png')"
                    alt="HERA"
                  >
                </li>
                <li>
                  <img
                    :src="require('../assets/logo_partners/rotary.png')"
                    alt="Rotary"
                  >
                </li>
              </ul>
            </section>
            <section class="software">
              <h3>SOFTWARE</h3>
              <p v-html="$t('softwareText')" />
            </section>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TheLogo from './TheLogo.vue';
import NavigationButton from './NavigationButton.vue';
import TeamMember from './TeamMember.vue';

export default {
  name: 'AboutPage',
  components: {
    TheLogo,
    NavigationButton,
    TeamMember,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    },
  },
};
</script>

<style scoped>
.about-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: #ebebeb;
  color: #4a4a4a;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
}

.content {
  max-width: 97.625rem;
  width: 90vw;
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  padding: 2rem 0;
}

.back-button {
  margin-top: 1rem;
}

.columns {
  display: flex;
}

#about-text-column {
  max-width: 55%;
}

#other-column {
  max-width: 45%;
}

section {
  margin-bottom: 3rem;
}

.about {
  padding-right: 6rem;
}

.team ul {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
}

.team li {
  display: inline-block;
  width: 20rem;
}

.partners ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.partners li {
  padding: 1rem 2rem 1rem 0;
}

.partners li > * {
  max-height: 65px;
}

td {
  margin: 1rem;
}
</style>
