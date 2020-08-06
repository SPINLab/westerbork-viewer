<template>
  <div id="app">
    <div id="top-left-fade" />
    <TheLogo
      title-color="#FFFFFF"
      subtitle-color="#FFFFFF"
      line-color="#FFFFFF"
    />
    <PotreeViewer
      ref="PotreeViewer"
      :graphics="graphics"
      :num-points="points"
      :point-clouds="pointClouds"
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
      <div
        v-if="appMode !== 'onpremise'"
        class="options-buttons"
      >
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
            @graphics-change="onGraphicsChange"
            @points-change="onPointsChange"
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
          v-if="appMode !== 'onpremise'"
          :narrative="narrative"
          :narratives="narratives"
          @narrative-change="changeNarrative"
        />
        <ProgressionBar
          ref="progression"
          @room-change="changeRoom"
        />
        <div id="bottom-fade" />
      </div>

      <InfoBox
        ref="infoBox"
        :house-media="sources.house.media"
        :house-content="sources.house.content"
        :camp-media="sources.camp.media"
        :camp-content="sources.camp.content"
        :memory-media="sources.memory.media"
        :memory-content="sources.memory.content"
        @layer-change="changeLayer"
        @open-source="openSourcePage"
      />

      <MiniMap />

      <SourcePage
        ref="sourcePage"
        :narrative="narrative"
        :room="room"
        :sources="sources"
      />

      <AboutPage
        v-if="appMode !== 'onpremise'"
        ref="aboutPage"
      />

      <NavigationButton
        v-if="appMode === 'onpremise'"
        class="to-start-button"
        :title="$t('toStartText')"
        @click.native="backToStart"
      />

      <LanguageSwitchButton
        v-if="appMode === 'onpremise'"
        id="language-switch"
        @click.native="switchLanguage"
      />
    </div>
  </div>
</template>

<script>
import TheLogo from './components/TheLogo.vue';
import PotreeViewer from './components/PotreeViewer.vue';
import TheIntroduction from './components/TheIntroduction.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import AboutPage from './components/AboutPage.vue';
import OptionsButton from './components/OptionsButton.vue';
import ProgressionBar from './components/ProgressionBar.vue';
import NarrativeSelector from './components/NarrativeSelector.vue';
import InfoBox from './components/InfoBox.vue';
import SourcePage from './components/SourcePage.vue';
import MiniMap from './components/MiniMap.vue';
import NavigationButton from './components/NavigationButton.vue';
import LanguageSwitchButton from './components/LanguageSwitchButton.vue';

const directusRoomNames = {
  outside: 'Buiten',
  hallway: '1_Entrance/hallway',
  diningRoom: '2_Dining room',
  livingRoom: '3_Living room',
  sittingRoom: '4_sitting room',
  conservatory: '5_conservatory',
  kitchen: '6_Kitchen',
  basement: '7_Basement',
  gardenShed: '8_Garden shed',
  bedroomGemmeker: '9_Bedroom Gemmeker',
  bedroomObreen: '10_Bedroom Speck Obreen',
  guestroom1: '11_Guestroom1',
  guestroom2: '12_Guestroom2',
  bedroomHassel: '13_Bedroom Elisabeth Hassel',
  bathroom: '14_Bathroom',
  attic: '15_Attic',
};

export default {
  name: 'App',
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
    SourcePage,
    MiniMap,
    NavigationButton,
    LanguageSwitchButton,
  },
  data() {
    return {
      appMode: process.env.VUE_APP_MODE,
      step: 0,
      pointClouds: [
        { name: 'AHN2', visible: true },
        { name: 'Commandantshuis', visible: true },
      ],
      graphics: process.env.VUE_APP_MODE === 'onpremise' ? 'high' : 'medium',
      points: process.env.VUE_APP_MODE === 'onpremise' ? 7000000 : 5000000,
      narrative: { id: null, title: '', description: '' },
      narratives: [],
      room: 'outside',
      layer: 'house',
      sources: {
        house: {
          media: '',
          content: '',
        },
        camp: {
          media: '',
          content: '',
        },
        memory: {
          media: '',
          content: '',
        },
      },
      sourceData: null,
      narrativesData: null,
    };
  },
  mounted() {
    this.setNarratives();
    this.$watch('$i18n.locale', async () => {
      await this.setNarratives();
      this.parseContents(this.sourceData);
    });
    if (process.env.VUE_APP_MODE === 'onpremise') {
      let lastActivity = new Date().getTime();
      const resetTimer = () => {
        lastActivity = new Date().getTime();
      };
      document.onkeypress = resetTimer;
      document.onmousemove = resetTimer;
      document.onmousedown = resetTimer;
      document.ontouchstart = resetTimer;
      document.onclick = resetTimer;
      document.onscroll = resetTimer;
      document.onkeypress = resetTimer;

      setInterval(() => {
        if (new Date().getTime() - lastActivity >= 120000) {
          window.location.reload();
        }
      }, 1000);
    }
  },
  methods: {
    switchLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'nl' ? 'en' : 'nl';
    },
    onGraphicsChange(graphics) {
      this.graphics = graphics;
    },
    onPointsChange(points) {
      this.points = points;
    },
    nextStep() {
      this.step += 1;
    },
    startProgression() {
      this.$refs.progression.startProgression();
    },
    skipIntro() {
      this.step = 6;
    },
    async setNarratives() {
      if (!this.narrativesData) {
        await this.getNarratives();
      }
      this.narratives = this.narrativesData.map((v) => {
        if (this.$i18n.locale === 'nl') {
          return {
            id: v.sort_number,
            title: v.heading_dutch,
            question: v.question_dutch,
            description: v.summary_dutch,
          };
        }
        return {
          id: v.sort_number,
          title: v.heading_english,
          question: v.question_english,
          description: v.summary_english,
        };
      });
      if (this.narrative.id) {
        this.narrative = this.narratives.find((narrative) => narrative.id === this.narrative.id);
      }
    },
    async getNarratives() {
      const response = await fetch(
        'https://data.campscapes.org/api/1.1/tables/wch_intro_texts_narratives/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5',
      );
      const json = await response.json();
      let { data } = json;
      data = data.filter((v) => v.sort_number !== null);
      data = data.sort((a, b) => a.sort_number - b.sort_number);
      this.narrativesData = data;
    },
    hidePointCloud(pcName) {
      const pc = this.pointClouds.filter((v) => v.name === pcName)[0];
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
    openSourcePage(layer) {
      this.$refs.sourcePage.open(layer);
    },
    async getSourceData() {
      const directusRoomName = directusRoomNames[this.room];
      const response = await fetch(
        `https://data.campscapes.org/api/1.1/tables/source/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5&filters[room.name][eq]=${encodeURIComponent(
          directusRoomName,
        )}&filters[narratives.heading_${this.$i18n.locale === 'nl' ? 'dutch' : 'english'}][eq]=${
          this.narrative.title
        }`,
      );
      const json = await response.json();

      const sourceData = {
        house: [],
        camp: [],
        memory: [],
      };

      json.data.forEach((source) => {
        if (['house', 'camp', 'memory'].includes(source.layer)) {
          sourceData[source.layer].push(source);
        } else {
          console.warn(`Source layer name: '${source.layer}' is not valid.`);
        }
      });

      return sourceData;
    },
    parseSourceData(sourceData) {
      this.parseContents(sourceData);

      this.sources.house.media = this.parseMedia(sourceData.house[0]);
      this.sources.camp.media = this.parseMedia(sourceData.camp[0]);
      this.sources.memory.media = this.parseMedia(sourceData.memory[0]);

      if (
        (sourceData.house.length !== 0
          || sourceData.camp.length !== 0
          || sourceData.memory.length !== 0)
        && !this.$refs.infoBox.visible
        && this.step !== 7
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
      if (!source) {
        return '';
      }

      if (this.$i18n.locale === 'nl') {
        const dutchSource = source.content.data.find(
          (sourceContentData) => sourceContentData.language_code === '2',
        );
        if (dutchSource) {
          return dutchSource.description;
        }
      }

      const englishSource = source.content.data.find(
        (sourceContentData) => sourceContentData.language_code === '1',
      );
      if (englishSource) {
        return englishSource.description;
      }

      return '';
    },
    parseMedia(source) {
      if (!source) return '';

      let html = '';
      if (source.file !== null) {
        if (source.file.data.type === 'video/mp4') {
          html += `
            <video controls>
            <source src="https://data.campscapes.org/${source.file.data.url}" type="video/mp4">
            Your browser does not support the video tag.
            </video>
          `;
        } else if (
          source.file.data.type === 'image/jpeg'
          || source.file.data.type === 'image/png'
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
  background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0) 50%);
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
  .narrative-progression-container {
    flex-wrap: wrap;
  }
}
</style>
