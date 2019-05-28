<template>
  <div class="menu-item" id="points-settings">
    <h4>POINTS</h4>
    <div class="slider" id="points-slider">
      <vue-slider
        ref="pointsSlider"
        v-model="points"
        v-bind="pointsOptions"
        @change="onChange"
      ></vue-slider>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  name: "SettingsMenuPoints",
  components: {
    VueSlider
  },
  data() {
    return {
      points: 6000000,
      pointsOptions: {
        min: 200000,
        max: 10000000,
        tooltip: "always",
        tooltipPlacement: "bottom",
        // lazy: true,
        dotStyle: {
          backgroundColor: "#B5B5B5"
        },
        railStyle: {
          backgroundColor: "#707070"
        },
        processStyle: {
          backgroundColor: "#707070"
        },
        tooltipStyle: {
          color: "#454545",
          backgroundColor: "#B5B5B5",
          borderColor: "#707070",
          fontSize: "0.5625rem"
        }
      }
    };
  },
  methods: {
    onChange() {
      this.$emit("change", this.points);
    }
  }
};
</script>

<style scoped>
#points-settings {
  margin-bottom: 3rem;
}

h4 {
  margin-bottom: 0.4rem;
}
</style>
