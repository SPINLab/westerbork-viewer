<template>
  <div id="points-settings" class="menu-item">
    <h4>{{ $t('points').toUpperCase() }}</h4>
    <div id="points-slider" class="slider">
      <vue-slider
        ref="pointsSlider"
        :value="numPoints"
        v-bind="pointsOptions"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: 'SettingsMenuPoints',
  components: {
    VueSlider,
  },
  data() {
    return {
      pointsOptions: {
        adsorb: true,
        data: [
          200000, 1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000,
          8000000, 9000000, 10000000,
        ],
        tooltip: 'always',
        tooltipPlacement: 'bottom',
        dotStyle: {
          backgroundColor: '#B5B5B5',
        },
        railStyle: {
          backgroundColor: '#707070',
        },
        processStyle: {
          backgroundColor: '#707070',
        },
        tooltipStyle: {
          color: '#454545',
          backgroundColor: '#B5B5B5',
          borderColor: '#707070',
          fontSize: '0.5625rem',
        },
      },
    };
  },
  computed: {
    ...mapState(['numPoints']),
  },
  methods: {
    onChange(numPoints) {
      this.$store.dispatch('setNumPoints', numPoints);
    },
  },
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
