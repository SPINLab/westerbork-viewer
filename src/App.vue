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
      @skip-intro="skipIntro"
    />

    <div v-show="step >= 8">
      <div class="options-buttons">
        <div class="settings-menu-container">
          <OptionsButton
            id="settings-button"
            :title="$t('settings')"
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
          :title="$t('about')"
          icon="about"
          @click.native="openAboutPage"
        />
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
        :houseMedia="sources.house.media"
        :houseContent="sources.house.content"
        :campMedia="sources.camp.media"
        :campContent="sources.camp.content"
        :memoryMedia="sources.memory.media"
        :memoryContent="sources.memory.content"
        @layer-change="changeLayer"
        @open-source="openSourcePage"
      />

      <SourcePage
        ref="sourcePage"
        :narrative="narrative"
        :room="room"
        :layer="layer"
        :media="sources[this.layer].media"
        :content="sources[this.layer].content"
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
import OptionsButton from "./components/OptionsButton";
import ProgressionBar from "./components/ProgressionBar";
import NarrativeSelector from "./components/NarrativeSelector";
import InfoBox from "./components/InfoBox";
import SourcePage from "./components/SourcePage";

const directusRoomNames = {
  outside: "",
  hallway: "1_Entrance/hallway",
  diningRoom: "2_Dining room",
  livingRoom: "3_Living room",
  sittingRoom: "4_sitting room",
  conservatory: "5_conservatory",
  kitchen: "6_Kitchen",
  basement: "7_Basement",
  gardenShed: "8_Garden shed",
  bedroomGemmeker: "9_Bedroom Gemmeker",
  bedroomObreen: "10_Bedroom Speck Obreen",
  guestroom1: "11_Guestroom1",
  guestroom2: "12_Guestroom2",
  bedroomHassel: "13_Bedroom Elisabeth Hassel",
  bathroom: "14_Bathroom",
  attic: "15_Attic"
};

export default {
  name: "app",
  components: {
    TheLogo,
    PotreeViewer,
    TheIntroduction,
    SettingsMenu,
    AboutPage,
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
      points: 400000,
      narrative: { id: null, title: "", description: "" },
      narratives: [],
      room: "outside",
      layer: "house",
      sources: {
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
      },
      sourceData: null,
      narrativesData: null
    };
  },
  mounted() {
    this.setNarratives();
    this.$watch("$i18n.locale", async function() {
      await this.setNarratives();
      this.parseContents(this.sourceData);
    });
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
    skipIntro() {
      this.step = 9;
    },
    async setNarratives() {
      if (!this.narrativesData) {
        await this.getNarratives();
      }
      this.narratives = this.narrativesData.map(v => {
        if (this.$i18n.locale === "nl") {
          return {
            id: v.sort_number,
            title: v.heading_dutch,
            question: v.question_dutch,
            description: v.summary_dutch
          };
        } else if (this.$i18n.locale === "en") {
          return {
            id: v.sort_number,
            title: v.heading_english,
            question: v.question_english,
            description: v.summary_english
          };
        }
      });
      if (this.narrative.id) {
        this.narrative = this.narratives.find(
          narrative => narrative.id === this.narrative.id
        );
      }
    },
    async getNarratives() {
      const response = await fetch(
        `https://data.campscapes.org/api/1.1/tables/wch_intro_texts_narratives/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5`
      );
      const json = await response.json();
      let data = json.data;
      data = data.filter(v => v.sort_number !== null);
      data = data.sort((a, b) => a.sort_number - b.sort_number);
      this.narrativesData = data;
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
    async changeNarrative(narrative) {
      this.narrative = narrative;
      this.sourceData = await this.getSourceData();
      this.parseSourceData(this.sourceData);
    },
    async changeRoom(room) {
      this.room = room;
      this.sourceData = await this.getSourceData();
      this.parseSourceData(this.sourceData);
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
        )}&filters[narratives.heading_${
          this.$i18n.locale === "nl" ? "dutch" : "english"
        }][eq]=${this.narrative.title}`
      );
      const json = await response.json();

      const sourceData = {
        house: [],
        camp: [],
        memory: []
      };

      for (let source of json.data) {
        if (["house", "camp", "memory"].includes(source.layer)) {
          sourceData[source.layer].push(source);
        } else {
          console.warn(`Source layer name: '${source.layer}' is not valid.`);
        }
      }

      return sourceData;
    },
    parseSourceData(sourceData) {
      this.parseContents(sourceData);

      this.sources.house.media = this.parseMedia(sourceData.house[0]);
      this.sources.camp.media = this.parseMedia(sourceData.camp[0]);
      this.sources.memory.media = this.parseMedia(sourceData.memory[0]);

      if (
        (sourceData.house.length !== 0 ||
          sourceData.camp.length !== 0 ||
          sourceData.memory.length !== 0) &&
        !this.$refs.infoBox.visible
      ) {
        this.$refs.infoBox.expand();
      }
    },
    parseContents(sourceData) {
      if (sourceData) {
        this.sources.house.content = this.parseContent(sourceData.house[0]);
        this.sources.camp.content = this.parseContent(sourceData.camp[0]);
        this.sources.memory.content = this.parseContent(sourceData.memory[0]);
      }
    },
    parseContent(source) {
      // TODO: english/dutch version?
      return source ? source.content.data[0].description : "";
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
        } else if (
          source.file.data.type === "image/jpeg" ||
          source.file.data.type === "image/png"
        ) {
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
  pointer-events: none;
}

#bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
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

@media only screen and (max-width: 1400px) {
  .narrative-progression-container {
    flex-wrap: wrap;
  }
}
</style>
