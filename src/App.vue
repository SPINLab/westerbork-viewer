<template>
  <div id="app">
    <TheLogo titleColor="#FFFFFF" subtitleColor="#FFFFFF" lineColor="#FFFFFF" />
    <PotreeViewer
      ref="PotreeViewer"
      :graphics="graphics"
      :num-points="points"
      @point-cloud-loaded="onPointCloudLoaded"
    />
    <div class="options-buttons">
      <div class="settings-menu-container">
        <OptionsButton
          title="SETTINGS"
          icon="settings"
          @click.native="toggleSettingsMenu"
        />
        <SettingsMenu
          ref="settingsMenu"
          :point-clouds="pointClouds"
          @graphics-change="onGraphicsChange"
          @points-change="onPointsChange"
        />
      </div>
      <OptionsButton
        id="about-page-button"
        title="ABOUT"
        icon="about"
        @click.native="openAboutPage"
      />
      <div class="share-menu-container">
        <OptionsButton
          id="share-button"
          title="share"
          icon="share"
          @click.native="toggleShareMenu"
        />
        <ShareMenu ref="shareMenu" />
      </div>
    </div>

    <div ref="narrativeAndProgression" class="narrative-progression-container">
      <NarrativeSelector @narrative-change="changeNarrative" />
      <ProgressionBar @room-change="changeRoom" />
      <div id="bottom-fade" class="fade"></div>
    </div>

    <InfoBox />

    <SourcePage
      ref="sourcePage"
      :narrative="narrative"
      :room="room"
      :layer="layer"
      :media="sourceData[this.layer].media"
      :content="sourceData[this.layer].content"
    />

    <AboutPage ref="aboutPage" />
  </div>
</template>

<script>
import TheLogo from "./components/TheLogo";
import PotreeViewer from "./components/PotreeViewer";
import SettingsMenu from "./components/SettingsMenu";
import AboutPage from "./components/AboutPage";
import ShareMenu from "./components/ShareMenu";
import OptionsButton from "./components/OptionsButton";
import ProgressionBar from "./components/ProgressionBar";
import NarrativeSelector from "./components/NarrativeSelector";
import InfoBox from "./components/InfoBox";
import SourcePage from "./components/SourcePage";

export default {
  name: "app",
  components: {
    TheLogo,
    PotreeViewer,
    SettingsMenu,
    AboutPage,
    ShareMenu,
    OptionsButton,
    ProgressionBar,
    NarrativeSelector,
    InfoBox,
    SourcePage
  },
  data() {
    return {
      pointClouds: [],
      graphics: "medium",
      points: 600000,
      narrative: "",
      room: "Outside",
      layer: "house",
      sourceData: {
        house: {
          media: "",
          content: ""
        },
        camp: {
          media: "",
          content: ""
        },
        memory: {
          media: "",
          content: ""
        }
      }
    };
  },
  methods: {
    onPointCloudLoaded(pointCloud) {
      this.pointClouds = [...this.pointClouds, pointCloud];
    },
    onGraphicsChange(graphics) {
      this.graphics = graphics;
    },
    onPointsChange(points) {
      this.points = points;
    },
    toggleSettingsMenu() {
      this.$refs.settingsMenu.toggleMenu();
    },
    openAboutPage() {
      this.$refs.aboutPage.open();
    },
    toggleShareMenu() {
      this.$refs.shareMenu.toggleMenu();
    },
    changeNarrative(narrative) {
      this.narrative = narrative;
    },
    changeRoom(room) {
      this.room = room;
    },
    openSourcePage() {
      this.$refs.sourcePage.open();
    }
  }
};
</script>

<style>
@font-face {
  font-family: "CamphorPro-Regular";
  src: url("assets/fonts/CamphorPro-Regular.woff") format("woff");
}

@font-face {
  font-family: "CamphorPro-Italic";
  src: url("assets/fonts/CamphorPro-Italic.woff") format("woff");
}

@font-face {
  font-family: "Flaco-Mono";
  src: url("assets/fonts/Flaco-Mono.woff2") format("woff2"),
    url("assets/fonts/Flaco-Mono.woff") format("woff"),
    url("assets/fonts/Flaco-Mono.ttf") format("truetype"),
    url("assets/fonts/Flaco-Mono.eot") format("eot");
}

html {
  overflow: hidden;
}

body {
  font-family: "CamphorPro-Regular", sans-serif;
  margin: 0;
  overflow: hidden;
}

h1,
h2,
h3,
h4 {
  font-family: "Flaco-Mono", sans-serif;
}

#app {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#potree-viewer {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<style scoped>
#logo {
  position: absolute;
  top: 1rem;
  left: 3rem;
  z-index: 9;
}

.options-buttons {
  position: absolute;
  top: 5rem;
  left: 2rem;
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

.narrative-progression-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  display: flex;
  align-items: flex-end;
  padding: 0.2rem 0;
}

.fade {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  pointer-events: none;
}

#bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
}
</style>
