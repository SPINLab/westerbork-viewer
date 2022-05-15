<template>
  <div id="app">
    <div id="top-left-fade" />
    <TheLogo
      title-color="#FFFFFF"
      subtitle-color="#FFFFFF"
      line-color="#FFFFFF"
    />
    <PotreeViewer ref="PotreeViewer" />

    <TheIntroduction />

    <div v-show="step >= 8">
      <div v-if="!onPremiseMode" class="options-buttons">
        <div class="settings-menu-container">
          <OptionsButton
            id="settings-button"
            :title="$t('settings')"
            icon="settings"
            @click.native="toggleSettingsMenu"
          />
          <SettingsMenu id="settings-menu" ref="settingsMenu" />
        </div>
        <OptionsButton
          id="about-page-button"
          :title="$t('about')"
          icon="about"
          @click.native="openAboutPage"
        />
      </div>

      <div class="narrative-container">
        <NarrativeSelector v-if="!onPremiseMode" />
        <div id="bottom-fade" />
      </div>

      <InfoBox ref="infoBox" />

      <MiniMap />

      <SourcePage ref="sourcePage" />

      <AboutPage v-if="!onPremiseMode" ref="aboutPage" />

      <NavigationButton
        v-if="onPremiseMode"
        class="to-start-button"
        :title="$t('toStartText')"
        @click.native="backToStart"
      />

      <LanguageSwitchButton
        v-if="onPremiseMode"
        id="language-switch"
        @click.native="switchLanguage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import TheLogo from './components/TheLogo.vue';
import PotreeViewer from './components/PotreeViewer.vue';
import TheIntroduction from './components/TheIntroduction.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import AboutPage from './components/AboutPage.vue';
import OptionsButton from './components/OptionsButton.vue';
import NarrativeSelector from './components/NarrativeSelector.vue';
import InfoBox from './components/InfoBox.vue';
import SourcePage from './components/SourcePage.vue';
import MiniMap from './components/MiniMap.vue';
import NavigationButton from './components/NavigationButton.vue';
import LanguageSwitchButton from './components/LanguageSwitchButton.vue';

export default {
  name: 'App',
  components: {
    TheLogo,
    PotreeViewer,
    TheIntroduction,
    SettingsMenu,
    AboutPage,
    OptionsButton,
    NarrativeSelector,
    InfoBox,
    SourcePage,
    MiniMap,
    NavigationButton,
    LanguageSwitchButton,
  },
  computed: {
    ...mapState([
      'onPremiseMode',
      'step',
      'selectedNarrative',
      'room',
      'sources',
    ]),
    ...mapGetters(['narrative']),
  },
  watch: {
    async selectedNarrative() {
      this.updateSourceData();
    },
    async room() {
      this.updateSourceData();
    },
  },
  mounted() {
    this.$store.dispatch('setNarratives', this.$i18n.locale);

    this.$watch('$i18n.locale', async () => {
      await this.$store.dispatch('setNarratives', this.$i18n.locale);
      this.updateSourceData();
    });

    if (this.onPremiseMode) {
      let lastActivity = new Date().getTime();
      const resetTimer = () => {
        lastActivity = new Date().getTime();
      };
      document.onkeydown = resetTimer;
      document.onmousemove = resetTimer;
      document.onmousedown = resetTimer;
      document.ontouchstart = resetTimer;
      document.onclick = resetTimer;
      document.onscroll = resetTimer;

      setInterval(() => {
        if (new Date().getTime() - lastActivity >= 120000) {
          this.backToStart();
        }
      }, 1000);
    }
  },
  methods: {
    switchLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'nl' ? 'en' : 'nl';
    },
    toggleSettingsMenu() {
      this.$refs.settingsMenu.toggleMenu();
    },
    openAboutPage() {
      this.$refs.aboutPage.open();
    },
    async updateSourceData() {
      await this.$store.dispatch(
        'updateSourceData',
        this.$i18n.locale === 'nl' ? 'dutch' : 'english',
      );
      if (
        (this.sources.house.content ||
          this.sources.house.media ||
          this.sources.camp.content ||
          this.sources.camp.media ||
          this.sources.memory.content ||
          this.sources.memory.media) &&
        !this.$refs.infoBox.visible &&
        this.step !== 7 &&
        this.step !== 8
      ) {
        this.$refs.infoBox.expand();
      }
    },
    backToStart() {
      window.location.reload();
    },
  },
};
</script>

<style>
@font-face {
  font-family: 'CamphorPro-Regular';
  src: url('assets/fonts/CamphorPro-Regular.woff') format('woff');
}

@font-face {
  font-family: 'CamphorPro-Italic';
  src: url('assets/fonts/CamphorPro-Italic.woff') format('woff');
}

@font-face {
  font-family: 'Flaco-Mono';
  src: url('assets/fonts/Flaco-Mono.woff2') format('woff2'),
    url('assets/fonts/Flaco-Mono.woff') format('woff'),
    url('assets/fonts/Flaco-Mono.ttf') format('truetype'),
    url('assets/fonts/Flaco-Mono.eot') format('eot');
}

html {
  overflow: hidden;
}

body {
  font-family: 'CamphorPro-Regular', sans-serif;
  margin: 0;
  overflow: hidden;
}

h1,
h2,
h3,
h4 {
  font-family: 'Flaco-Mono', sans-serif;
}

#app {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  overflow: hidden;
}

#potree-viewer {
  position: absolute;
  top: 0;
  left: 0;
}

.fade-enter-active {
  transition: opacity 0.2s ease-out;
}
.fade-leave-active {
  transition: opacity 0.2s ease-in;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
#logo {
  position: absolute;
  top: 1rem;
  left: 3rem;
  z-index: 9;
}

#language-switch {
  position: absolute;
  top: 7rem;
  left: 3rem;
  z-index: 2;
}

.options-buttons {
  position: absolute;
  top: 5rem;
  left: 2rem;
  z-index: 2;
}

.options-buttons button {
  margin: 1rem 0;
}

.settings-menu-container {
  display: flex;
  align-items: flex-start;
  max-height: 2.5rem;
}

.share-menu-container {
  display: flex;
  align-items: flex-start;
  transform: translateY(-1rem);
  max-height: 2.5rem;
}

.narrative-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  display: flex;
  align-items: flex-end;
  padding: 0.2rem 0;
  pointer-events: none;
}

#bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 7rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  pointer-events: none;
}

#top-left-fade {
  position: absolute;
  top: 0;
  left: 0;
  width: 30rem;
  height: 20rem;
  background: linear-gradient(
    to bottom right,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0) 50%
  );
  pointer-events: none;
  z-index: 1;
}

.to-start-button {
  position: absolute;
  right: 2%;
  top: 2%;
  padding: 0.5rem 0.5rem;
  z-index: 3;
  transform: scale(0.7);
}

@media only screen and (max-width: 1400px) {
  .narrative-container {
    flex-wrap: wrap;
  }
}
</style>
