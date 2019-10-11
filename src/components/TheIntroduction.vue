<template>
  <div class="introduction-container">
    <transition name="fade">
      <TheGrid v-show="step !== 2 && step < 7" ref="grid" :color="gridColor" />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 0"
        :title="intros[0].heading_dutch"
        :content="intros[0].summary_dutch"
        position="center"
      />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 1"
        :title="intros[1].heading_dutch"
        :content="intros[1].summary_dutch"
        position="center"
      />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 3"
        :title="intros[2].heading_dutch"
        :content="intros[2].summary_dutch"
        position="right"
      />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 4"
        :title="intros[3].heading_dutch"
        :content="intros[3].summary_dutch"
        position="right"
      />
    </transition>
    <transition name="fade">
      <NavigationButton
        v-if="[0, 1, 3, 4].includes(step)"
        class="next-button center"
        title="Ga verder"
        @click.native="next"
      />
    </transition>
    <transition name="fade">
      <NarrativeCardSelector
        v-if="step === 5"
        :narratives="narratives"
        @narrative-picked="pickNarrative"
      />
    </transition>
    <transition name="fade">
      <div v-show="[0, 1, 3, 4, 5].includes(step)" class="fade"></div>
    </transition>
    <NavigationButton
      v-if="step < 7"
      class="skip-button"
      title="Sla introductie over"
      @click.native="skip"
    />
  </div>
</template>

<script>
import TheGrid from "./TheGrid";
import IntroductionCard from "./IntroductionCard";
import NavigationButton from "./NavigationButton";
import NarrativeCardSelector from "./NarrativeCardSelector";

import { pathHouse } from "./path";
import { tour } from "./AppTour/tour";

export default {
  name: "TheIntroduction",
  components: {
    TheGrid,
    IntroductionCard,
    NavigationButton,
    NarrativeCardSelector
  },
  props: {
    narratives: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      step: 0,
      gridColor: "#000000",
      intros: [
        {
          heading_dutch: "Campscapes Commander's House app",
          summary_dutch: `Welkom bij de Campscapes Commander's House app. Deze app leid je digitaal rond door het huis van de kampscommandant en geeft je informatie over het kamp en het huis door de jaren heen. <br><br> De app werkt het beste in een moderne browser met GPU hardware acceleratie aangezet. Dit is belangrijk omdat de app 3D data weergeeft en daardoor grafisch vrij zwaar is. Dit staat normaal gesproken standaard bij moderne browsers al aan, maar dit is niet altijd het geval. Bij twijfel zie bijvoorbeeld <a href="https://www.google.com/search?q=chrome+enable+hardware+acceleration" target="_blank">hier voor Chrome</a> of <a href="https://www.google.com/search?q=firefox+enable+hardware+acceleration" target="_blank">hier voor Firefox</a>. De app is ook bruikbaar zonder dit geactiveerd te hebben, maar dan kan de ervaring tegenvallen.`
        }
      ]
    };
  },
  methods: {
    next() {
      this.step += 1;
      this.$emit("next-step");

      switch (this.step) {
        case 2:
          this.flyToHouse();
          break;
        case 3:
          this.gridColor = "#FFD27C";
          break;
        case 5:
          this.$viewer.pathControls.setPath(pathHouse);
          this.$viewer.setMoveSpeed(2);
          this.$viewer.pathControls.position = 0;
          this.$viewer.pathControls.lockViewToPath = "moving";
          this.$viewer.pathControls.userInputCancels = true;
          break;
        case 6:
          this.$refs.grid.$el.style = "z-index: 3;";
          this.gridColor = "#000000";
          tour.on("complete", () => {
            this.next();
          });
          tour.start();
          break;
        case 7:
          this.$refs.grid.$el.style = "z-index: unset;";
          this.$emit("start-progression");
          break;
        default:
          break;
      }
    },
    flyToHouse() {
      this.$viewer.pathControls.lockViewToPath = "always";
      this.$viewer.pathControls.userInputCancels = false;
      this.$viewer.pathControls.moveTo(1, 20000, () => {
        const ahn2pc = this.$viewer.scene.pointclouds.filter(
          v => v.name === "AHN2"
        )[0];
        const t = setInterval(() => {
          ahn2pc.material.size -= 0.005;
          if (ahn2pc.material.size < 0.002) {
            clearInterval(t);
            this.$emit("hide-point-cloud", "AHN2");
            ahn2pc.material.size = 0.65;
            this.$viewer.pathControls.lockViewToPath = "moving";
            this.next();
          }
        }, 8);
      });
    },
    pickNarrative(narrative) {
      this.next();
      this.$emit("narrative-picked", narrative);
    },
    async getIntroTexts() {
      const response = await fetch(
        "https://data.campscapes.org/api/1.1/tables/introduction_texts/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5"
      );
      const json = await response.json();
      let data = json.data;
      data = data.filter(v => v.order_in_app !== null && v.order_in_app !== 0);
      data = data.sort((a, b) => a.order_in_app - b.order_in_app);

      for (const intro of data) {
        intro.summary_dutch = intro.summary_dutch.replace(
          /(?:\r\n|\r|\n)/g,
          "<br>"
        );
      }

      this.intros = [...this.intros, ...data];
    },
    skip() {
      tour.complete();
      if (this.$viewer.pathControls.tweens[0]) {
        this.$viewer.pathControls.tweens[0].stop();
      }
      this.$emit("hide-point-cloud", "AHN2");
      this.$viewer.pathControls.setPath(pathHouse);
      this.$viewer.setMoveSpeed(2);
      this.$viewer.pathControls.position = 0;
      this.$viewer.pathControls.lockViewToPath = "moving";
      this.$viewer.pathControls.userInputCancels = true;
      this.$viewer.scene.view.yaw = 1.485;
      this.$viewer.scene.view.pitch = 0;
      this.step = 7;
      this.$emit("narrative-picked", this.narratives[0]);
      this.$emit("start-progression");
      this.$emit("skip-intro");
    }
  },
  mounted() {
    this.getIntroTexts();
  }
};
</script>

<style scoped>
.card {
  z-index: 1;
}

.next-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10%;
  padding: 1rem 3rem;
  z-index: 1;
}

.skip-button {
  position: absolute;
  right: 2%;
  top: 2%;
  padding: 0.5rem 0.5rem;
  z-index: 3;
  transform: scale(0.7);
}

.fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0) 80%);
  pointer-events: none;
}
</style>
