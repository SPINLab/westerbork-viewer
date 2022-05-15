<template>
  <div class="introduction-container">
    <transition name="fade">
      <TheGrid
        v-show="step !== 2 && step !== 3 && step < 9"
        ref="grid"
        :color="gridColor"
      />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 0"
        :title="$t(intros[0].heading)"
        :content="$t(intros[0].text)"
        position="center"
      />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 1"
        :title="intros[1][`heading_${language}`]"
        :content="intros[1][`summary_${language}`]"
        position="center"
      />
    </transition>
    <transition name="fade">
      <div v-if="step === 2" class="hint-text">
        {{ $t('lookAroundHint') }}
      </div>
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 4"
        :title="intros[2][`heading_${language}`]"
        :content="intros[2][`summary_${language}`]"
        position="right"
      />
    </transition>
    <transition name="fade">
      <IntroductionCard
        v-if="step === 5"
        :title="intros[3][`heading_${language}`]"
        :content="intros[3][`summary_${language}`]"
        position="right"
      />
    </transition>
    <transition name="fade">
      <div class="next-buttons">
        <NavigationButton
          v-if="[0, 1, 2, 4, 5].includes(step)"
          class="next-button center"
          :title="$t('continue')"
          @click.native="next"
        />
        <AltNavigationButton
          v-if="step === 0 && $i18n.locale === 'nl'"
          class="next-button center"
          title="or go further in English"
          @click.native="switchLang"
        />
        <AltNavigationButton
          v-if="step === 0 && $i18n.locale === 'en'"
          class="next-button center"
          title="of ga verder in Nederlands"
          @click.native="switchLang"
        />
      </div>
    </transition>
    <transition name="fade">
      <NarrativeCardSelector v-if="step === 6" />
    </transition>
    <transition name="fade">
      <NarrativeIntroCard v-if="step === 7" />
    </transition>
    <transition name="fade">
      <div v-show="[0, 1, 2, 4, 5, 6, 7].includes(step)" class="fade" />
    </transition>
    <AppTour ref="tour" />
    <NavigationButton
      v-if="step < 6"
      class="skip-button"
      :title="$t('skipIntroText')"
      @click.native="skip"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import TheGrid from './TheGrid.vue';
import IntroductionCard from './IntroductionCard.vue';
import NavigationButton from './NavigationButton.vue';
import AltNavigationButton from './AltNavigationButton.vue';
import NarrativeCardSelector from './NarrativeCardSelector.vue';
import NarrativeIntroCard from './NarrativeIntroCard.vue';
import AppTour from './AppTour.vue';
import { pointClouds } from './PotreeViewer.vue';
import { EventBus } from '../event-bus';

const { Potree } = window;

export default {
  name: 'TheIntroduction',
  components: {
    TheGrid,
    IntroductionCard,
    NavigationButton,
    AltNavigationButton,
    NarrativeCardSelector,
    NarrativeIntroCard,
    AppTour,
  },
  data() {
    return {
      gridColor: '#000000',
      intros: [
        {
          heading: 'appIntroHeading',
          text: this.onPremiseMode ? 'appIntroTextShort' : 'appIntroText',
        },
      ],
    };
  },
  computed: {
    ...mapState(['onPremiseMode', 'step', 'narratives']),
    ...mapGetters(['narrative']),
    language() {
      return this.$i18n.locale === 'nl' ? 'dutch' : 'english';
    },
  },
  watch: {
    step() {
      this.doStep();
    },
  },
  mounted() {
    this.getIntroTexts();
  },
  methods: {
    next() {
      this.$store.dispatch('nextStep');
    },
    doStep() {
      switch (this.step) {
        case 2:
          this.$viewer.controls.lockPosition = true;
          break;
        case 3:
          this.$viewer.controls.lockPosition = false;
          this.flyToHouse();
          break;
        case 4:
          this.$viewer.scene.annotations.children = [];
          this.gridColor = '#FFD27C';
          break;
        case 6:
          this.setStartPositionAndControls();
          if (this.onPremiseMode) {
            this.$store.dispatch('setNarrative', this.narratives[0].id);
            this.$store.dispatch('nextStep');
          }
          break;
        case 8:
          this.$refs.grid.$el.style = 'z-index: 3;';
          this.gridColor = '#000000';
          this.$refs.tour.tour.on('complete', () => {
            this.$store.dispatch('nextStep');
          });
          this.$nextTick(() => {
            this.$refs.tour.tour.start();
          });
          break;
        case 9:
          this.$refs.grid.$el.style = 'z-index: unset;';
          break;
        default:
          break;
      }
    },
    switchLang() {
      this.$i18n.locale = this.$i18n.locale === 'nl' ? 'en' : 'nl';
    },
    flyToHouse() {
      this.$viewer.controls.lockViewToPath = 'always';
      this.$viewer.controls.userInputCancels = false;
      this.$viewer.controls.moveTo(1, 20000, () => {
        const surroundingsPointCloud = this.$viewer.scene.pointclouds.find(
          (v) => v.name === pointClouds.surroundings,
        );
        const t = setInterval(() => {
          surroundingsPointCloud.material.size -= 0.005;
          if (surroundingsPointCloud.material.size < 0.002) {
            clearInterval(t);
            EventBus.$emit('set-point-cloud-visibility', {
              pointcloud: pointClouds.surroundings,
              visible: false,
            });
            surroundingsPointCloud.material.size = 0.65;
            this.$viewer.controls.lockViewToPath = 'moving';
            this.$store.dispatch('nextStep');
          }
        }, 8);
      });
    },
    async getIntroTexts() {
      const response = await fetch(
        'https://data.campscapes.org/api/1.1/tables/introduction_texts/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5',
      );
      const json = await response.json();
      const { data } = json;
      let introTexts = data.filter(
        (v) => v.order_in_app !== null && v.order_in_app !== 0,
      );
      introTexts = introTexts.sort((a, b) => a.order_in_app - b.order_in_app);

      introTexts.forEach((intro) => {
        intro.summary_dutch = intro.summary_dutch.replace(
          /(?:\r\n|\r|\n)/g,
          '<br>',
        );
        intro.summary_english = intro.summary_english.replace(
          /(?:\r\n|\r|\n)/g,
          '<br>',
        );
      });

      this.intros = [...this.intros, ...introTexts];
    },
    setStartPositionAndControls() {
      // TODO: disable double click to move
      this.$viewer.setControls(new Potree.FirstPersonControls(this.$viewer));
      this.$viewer.setMoveSpeed(0);
      this.$viewer.controls.rotationSpeed = 100;
      this.$viewer.scene.view.yaw = 1.485;
      this.$viewer.scene.view.pitch = 0;
      this.$store.dispatch('setWaypoint', 'outside');
    },
    skip() {
      if (this.$viewer.controls.tweens[0]) {
        this.$viewer.controls.tweens[0].stop();
      }
      EventBus.$emit('set-point-cloud-visibility', {
        pointcloud: pointClouds.surroundings,
        visible: false,
      });
      this.$viewer.scene.annotations.children = [];
      this.setStartPositionAndControls();
      this.$store.dispatch('setStep', 6);
      if (this.onPremiseMode) {
        this.$store.dispatch('setNarrative', this.narratives[0].id);
        this.$store.dispatch('nextStep');
      }
    },
  },
};
</script>

<style scoped>
.card {
  z-index: 1;
}

.next-buttons {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.next-button {
  padding: 1rem 3rem;
  margin-top: 1rem;
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

.hint-text {
  position: absolute;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background-color: #454545;
  color: #fff;
  border-radius: 8rem;
  padding: 1rem;
  opacity: 0.8;
}
</style>
