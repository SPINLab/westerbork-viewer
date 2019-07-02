<template>
  <div class="introduction-container">
    <transition name="fade">
      <TheGrid v-show="step !== 1 && step < 5" ref="grid" :color="gridColor" />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 0"
        title="Introductie en historische context"
        :content="histIntroContent"
        position="center"
      />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 2"
        title="Intro Scan Data"
        :content="dataIntroContent"
        position="right"
      />
    </transition>
    <transition name="fade">
      <NavigationButton
        v-if="[0, 2].includes(step)"
        class="next-button center"
        title="Ga verder"
        @click.native="next"
      />
    </transition>
    <transition name="fade">
      <NarrativeCardSelector
        v-if="step === 3"
        :narratives="narratives"
        @narrative-picked="pickNarrative"
      />
    </transition>
    <transition name="fade">
      <div v-if="[0, 2, 3].includes(step)" class="fade"></div>
    </transition>
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
      histIntroContent: `Toen in 1933 Adolf Hitler in Duitsland aan de macht kwam, begon de jacht op politieke tegenstanders. Voor de Joden werd het leven steeds moeilijker: stap voor stap werden zij geïsoleerd. Niet ieder wachtte af en vluchtte naar het buitenland, zoals naar Nederland. Vooral na de eerste openlijke vervolging van de Joden, de Reichskristallnacht op 9 november 1938, kwam een grote stroom vluchtelingen naar ons land. Met de Nederlandse gastvrijheid hield het echter niet over. Tot aan het begin van de oorlog werden 10.000 Duitse vluchtelingen toegelaten, anderen kwamen illegaal het land binnen. De Nederlandse regering was niet van plan voor de opvang van deze mensen geld uit te geven; alle initiatieven waren afkomstig van particulieren. De vluchtelingen gingen van kamp naar kamp, hun koffers moesten constant gepakt staan. De regering zag in dat het zo niet langer kon en meende de oplossing te zien in de bouw van een centraal vluchtelingenkamp op de Veluwe, in de omgeving van Elspeet. Er kwamen protesten van omwonenden en van de ANWB maar doorslaggevend was die van koningin Wilhelmina. Haar secretaris liet minister van Binnenlandse Zaken Van Boeyen weten dat een vluchtelingenkamp dicht bij paleis ‘t Loo de Koninklijke goedkeuring niet kon wegdragen. Het kabinet richtte vervolgens de blik op Drenthe, waar bij Westerbork een flinke lap onontgonnen grond lag. Eenzaam, wild en woest en ledig. Ideaal voor het Centraal Vluchtelingenkamp.`,
      dataIntroContent: `A laser is a device that emits light through a process of optical amplification based on the stimulated emission of electromagnetic radiation. The term “laser” originated as an acronym for “Light Amplification by Stimulated Emission of Radiation”.[1][2] The first laser was built in 1960 by Theodore H. Maiman at Hughes Research Laboratories, based on theoretical work by Charles Hard Townes and Arthur Leonard Schawlow. A laser differs from other sources of light in that it emits light coherently. Spatial coherence allows a laser to be focused to a tight spot, enabling applications such as laser cutting and lithography. Spatial coherence also allows a laser beam to stay narrow over great distances (collimation), enabling applications such as laser pointers and lidar. Lasers can also have high temporal coherence, which allows them to emit light with a very narrow spectrum, i.e., they can emit a single color of light. Alternatively, temporal coherence can be used to produce pulses of light with a broad spectrum but durations as short as a femtosecond (“ultrashort pulses”).`
    };
  },
  methods: {
    next() {
      this.step += 1;
      this.$emit("next-step");

      switch (this.step) {
        case 1:
          this.flyToHouse();
          break;
        case 2:
          this.gridColor = "#FFD27C";
          break;
        case 3:
          this.$viewer.pathControls.setPath(pathHouse);
          this.$viewer.setMoveSpeed(2);
          this.$viewer.pathControls.position = 0;
          this.$viewer.pathControls.lockViewToPath = "moving";
          this.$viewer.pathControls.userInputCancels = true;
          break;
        case 4:
          this.$refs.grid.$el.style = "z-index: 3;";
          this.gridColor = "#000000";
          tour.on("complete", () => {
            this.$refs.grid.$el.style = "z-index: unset;";
            this.next();
          });
          tour.start();
          break;
        case 5:
          this.$emit("start-progression");
          break;
        default:
          break;
      }
    },
    flyToHouse() {
      this.$viewer.pathControls.lockViewToPath = "always";
      this.$viewer.pathControls.userInputCancels = false;
      this.$viewer.pathControls.moveTo(0.97, 13000, () => {
        this.$viewer.pathControls.moveTo(1, 8000, () => {
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
      });
    },
    pickNarrative(narrative) {
      this.next();
      this.$emit("narrative-picked", narrative);
    }
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
