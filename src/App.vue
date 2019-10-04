<template>
  <div id="app">
    <div id="top-left-fade"></div>
    <TheLogo titleColor="#FFFFFF" subtitleColor="#FFFFFF" lineColor="#FFFFFF" />
    <PotreeViewer
      ref="PotreeViewer"
      :graphics="graphics"
      :num-points="points"
      :pointClouds="pointClouds"
    />

    <TheIntroduction
      :narratives="narratives"
      @next-step="nextStep"
      @hide-point-cloud="hidePointCloud"
      @narrative-picked="changeNarrative"
      @start-progression="startProgression"
    />

    <div v-show="step >= 4">
      <div class="options-buttons">
        <div class="settings-menu-container">
          <OptionsButton
            id="settings-button"
            title="Instellingen"
            icon="settings"
            @click.native="toggleSettingsMenu"
          />
          <SettingsMenu
            id="settings-menu"
            ref="settingsMenu"
            :graphics="graphics"
            :points="points"
            :point-clouds="pointClouds"
            @graphics-change="onGraphicsChange"
            @points-change="onPointsChange"
            @point-clouds-change="onPointCloudsChange"
          />
        </div>
        <OptionsButton
          id="about-page-button"
          title="Over ons"
          icon="about"
          @click.native="openAboutPage"
        />
        <!-- <div class="share-menu-container">
          <OptionsButton
            id="share-button"
            title="Delen"
            icon="share"
            @click.native="toggleShareMenu"
          />
          <ShareMenu ref="shareMenu" />
        </div> -->
        </div>

      <div class="narrative-progression-container">
        <NarrativeSelector
          :narrative="narrative"
          :narratives="narratives"
          @narrative-change="changeNarrative"
        />
        <ProgressionBar ref="progression" @room-change="changeRoom" />
        <div id="bottom-fade"></div>
      </div>

      <InfoBox
        ref="infoBox"
        :houseMedia="sourceData.house.media"
        :houseContent="sourceData.house.content"
        :campMedia="sourceData.camp.media"
        :campContent="sourceData.camp.content"
        :memoryMedia="sourceData.memory.media"
        :memoryContent="sourceData.memory.content"
        @layer-change="changeLayer"
        @open-source="openSourcePage"
      />

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
  </div>
</template>

<script>
import TheLogo from "./components/TheLogo";
import PotreeViewer from "./components/PotreeViewer";
import TheIntroduction from "./components/TheIntroduction";
import SettingsMenu from "./components/SettingsMenu";
import AboutPage from "./components/AboutPage";
// import ShareMenu from "./components/ShareMenu";
import OptionsButton from "./components/OptionsButton";
import ProgressionBar from "./components/ProgressionBar";
import NarrativeSelector from "./components/NarrativeSelector";
import InfoBox from "./components/InfoBox";
import SourcePage from "./components/SourcePage";

const directusRoomNames = {
  Buiten: "",
  Hal: "1_Entrance/hallway",
  Eetkamer: "2_Dining room",
  Woonkamer: "3_Living room",
  Zitkamer: "4_sitting room",
  Serre: "5_conservatory",
  Keuken: "6_Kitchen",
  Kelder: "7_Basement",
  Tuinhuis: "8_Garden shed",
  "Slaapkamer Gemmeker": "9_Bedroom Gemmeker",
  "Slaapkamer Speck Obreen": "10_Bedroom Speck Obreen",
  "Logeerkamer 1": "11_Guestroom1",
  "Logeerkamer 2": "12_Guestroom2",
  "Slaapkamer Elisabeth Hassel": "13_Bedroom Elisabeth Hassel",
  Badkamer: "14_Bathroom",
  Zolder: "15_Attic"
};

export default {
  name: "app",
  components: {
    TheLogo,
    PotreeViewer,
    TheIntroduction,
    SettingsMenu,
    AboutPage,
    // ShareMenu,
    OptionsButton,
    ProgressionBar,
    NarrativeSelector,
    InfoBox,
    SourcePage
  },
  data() {
    return {
      step: 0,
      pointClouds: [
        { name: "AHN2", visible: true },
        { name: "Commandantshuis", visible: true }
      ],
      graphics: "medium",
      points: 4000000,
      narrative: { id: 0, title: "", description: "" },
      narratives: [],
      room: "Buiten",
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
  mounted() {
    this.getNarratives();
  },
  methods: {
    onGraphicsChange(graphics) {
      this.graphics = graphics;
    },
    onPointsChange(points) {
      this.points = points;
    },
    onPointCloudsChange(pointClouds) {
      this.pointClouds = pointClouds;
    },
    nextStep() {
      this.step += 1;
    },
    startProgression() {
      this.$refs.progression.startProgression();
    },
    async getNarratives() {
      const response = await fetch(
        `https://data.campscapes.org/api/1.1/tables/wch_intro_texts_narratives/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5`
      );
      const json = await response.json();
      let data = json.data;
      data = data.filter(v => v.sort_number !== null);
      data = data.sort((a, b) => a.sort_number - b.sort_number);
      this.narratives = data.map(v => {
        return {
          id: v.sort_number,
          title: v.heading_dutch,
          description: v.summary_dutch
        };
      });
    },
    hidePointCloud(pcName) {
      const pc = this.pointClouds.filter(v => v.name === pcName)[0];
      if (pc) pc.visible = false;
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
      this.getSourceData();
    },
    changeRoom(room) {
      this.room = room;
      this.getSourceData();
    },
    changeLayer(layer) {
      this.layer = layer;
    },
    openSourcePage() {
      this.$refs.sourcePage.open();
    },
    async getSourceData() {
      const directusRoomName = directusRoomNames[this.room];
      const response = await fetch(
        `https://data.campscapes.org/api/1.1/tables/source/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5&filters[room.name][eq]=${encodeURIComponent(
          directusRoomName
        )}&filters[narratives.heading_dutch][eq]=${this.narrative.title}`
      );
      const json = await response.json();

      const roomSources = {
        house: [],
        camp: [],
        memory: []
      };

      for (let source of json.data) {
        if (["house", "camp", "memory"].includes(source.layer)) {
          roomSources[source.layer].push(source);
        } else {
          console.warn(`Source layer name: '${source.layer}' is not valid.`);
        }
      }

      this.sourceData.house.content = this.parseContent(roomSources.house[0]);
      this.sourceData.house.media = this.parseMedia(roomSources.house[0]);
      this.sourceData.camp.content = this.parseContent(roomSources.camp[0]);
      this.sourceData.camp.media = this.parseMedia(roomSources.camp[0]);
      this.sourceData.memory.content = this.parseContent(roomSources.memory[0]);
      this.sourceData.memory.media = this.parseMedia(roomSources.memory[0]);

      if (
        (roomSources.house.length !== 0 ||
          roomSources.camp.length !== 0 ||
          roomSources.memory.length !== 0) &&
        !this.$refs.infoBox.visible
      ) {
        this.$refs.infoBox.expand();
      }
    },
    parseContent(source) {
      if (!source) return "";

      return source.content.data[0].description;
    },
    parseMedia(source) {
      if (!source) return "";

      let html = "";
      if (source.file !== null) {
        if (source.file.data.type === "video/mp4") {
          html += `
            <video controls>
            <source src="https://data.campscapes.org/${
              source.file.data.url
            }" type="video/mp4">
            Your browser does not support the video tag.
            </video>
          `;
        } else if (source.file.data.type === "image/jpeg") {
          html += `
            <img src="https://data.campscapes.org/${
              source.file.data.url
            }" alt="${source.file.data.title}" >
          `;
        } else {
          console.warn(`File type: '${source.file.data.type}' not recognized.`);
        }
      }
      return html;
    }
  }
};
</script>

<style>
@import url("./components/AppTour/tour.css");

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
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
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

.narrative-progression-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  display: flex;
  align-items: flex-end;
  padding: 0.2rem 0;
}

#bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80%;
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
</style>
