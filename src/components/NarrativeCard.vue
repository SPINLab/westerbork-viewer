<template>
  <div class="narrative-card">
    <h3>{{ narrative.title.toUpperCase() }}</h3>
    <div v-html="narrative.description"></div>
    <NavigationButton title="Verder" @click.native="pickNarrative" />
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
    narrative: {
      type: Object,
      required: true
    }
  },
  methods: {
    pickNarrative() {
      this.$emit("picked", this.narrative);
    }
  }
};
</script>

<style scoped>
.narrative-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 3rem 0rem 3rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 30rem;
  background-image: url("../assets/background_images/whitepaper.png");
  color: #212121;
  width: 16rem;
  margin-left: 3rem;
  margin-right: 3rem;
}

h3 {
  color: #393939;
  text-decoration: underline #90909086;
  margin-top: 2rem;
  font-size: 1.375rem;
}

p {
  height: 28rem;
  overflow: hidden;
  color: #212121;
  line-height: 1.6rem;
  font-size: 1.25rem;
}

button {
  transform: translateY(1.8rem);
  padding: 1.2rem 1.6rem;
}
</style>
