<template>
  <div class="narrative-card">
    <h3>{{ cardHeading }}</h3>
    <div class="narrative-text" v-html="cardText"></div>
    <NavigationButton :title="$t('continue')" @click.native="nextStep" />
  </div>
</template>

<script>
import NavigationButton from "./NavigationButton";

export default {
  name: "NarrativeCard",
  components: {
    NavigationButton
  },
  props: {
    narrativeIntro: {
      type: Object,
      required: true
    }
  },
  methods: {
    nextStep() {
      this.$emit("next-step");
    }
  },
  computed: {
    cardHeading: function() {
      return this.$i18n.locale === "nl"
        ? this.narrativeIntro.heading_dutch.toUpperCase()
        : this.narrativeIntro.heading_english.toUpperCase();
    },
    cardText: function() {
      return this.$i18n.locale === "nl"
        ? this.narrativeIntro.summary_dutch
        : this.narrativeIntro.summaryenglish;
    }
  }
};
</script>

<style scoped>
.narrative-card {
  position: absolute;
  top: 50%;
  right: 4%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem 0rem 3rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 30rem;
  background-image: url("../assets/background_images/whitepaper.png");
  color: #212121;
  width: 16rem;
}

h3 {
  color: #393939;
  text-decoration: underline #90909086;
  margin-top: 2rem;
  font-size: 1.375rem;
}

.narrative-text {
  overflow-y: scroll;
  color: #212121;
  line-height: 1.4rem;
}

button {
  transform: translateY(1.8rem);
  padding: 1.2rem 1.6rem;
}
</style>
