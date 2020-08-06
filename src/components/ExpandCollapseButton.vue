<template>
  <RoundButton
    :icon="icon"
    :color="circleColor"
  />
</template>

<script>
import RoundButton from './RoundButton.vue';

export default {
  name: 'ExpandCollapseButton',
  components: {
    RoundButton,
  },
  props: {
    direction: {
      type: String,
      required: false,
      default: 'right',
      validator(value) {
        return ['left', 'right'].includes(value);
      },
    },
    arrowColor: {
      type: String,
      required: false,
      default: '#000000',
    },
    circleColor: {
      type: String,
      required: false,
      default: '#ffffff',
    },
  },
  data() {
    return {
      icon: '',
    };
  },
  mounted() {
    this.icon = `<svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 44 44"
      preserveAspectRatio="none"
      style="enable-background:new 0 0 44 44;"
      xml:space="preserve"
    >`;
    if (this.direction === 'right') {
      this.icon += `<g transform="translate(203.342 98.727) rotate(180)" >
        <g>
          <path
            fill="${this.arrowColor}"
            d="M185.55,87.68c-0.51,0-1.02-0.2-1.41-0.59l-8.41-8.41c-0.78-0.78-0.78-2.05,0-2.83c0.78-0.78,2.05-0.78,2.83,0l8.41,8.41c0.78,0.78,0.78,2.05,0,2.83C186.57,87.49,186.06,87.68,185.55,87.68z"
          />
        </g>
        <g>
          <path
            fill="${this.arrowColor}"
            d="M177.14,79.13c-0.51,0-1.02-0.2-1.41-0.59c-0.78-0.78-0.78-2.05,0-2.83l8.41-8.41c0.78-0.78,2.05-0.78,2.83,0c0.78,0.78,0.78,2.05,0,2.83l-8.41,8.41C178.16,78.94,177.65,79.13,177.14,79.13z"
          />
        </g>
      </g>
      </svg>`;
    } else {
      this.icon += `<g transform="translate(203.342 98.727) rotate(180)" >
        <g>
          <path
            fill="${this.arrowColor}"
            d="M179.34,66.73c0.51,0,1.02,0.2,1.41,0.59l8.41,8.41c0.78,0.78,0.78,2.05,0,2.83c-0.78,0.78-2.05,0.78-2.83,0l-8.41-8.41c-0.78-0.78-0.78-2.05,0-2.83C178.32,66.92,178.83,66.73,179.34,66.73z"
          />
        </g>
        <g>
          <path
            fill="${this.arrowColor}"
            d="M187.75,75.28c0.51,0,1.02,0.2,1.41,0.59c0.78,0.78,0.78,2.05,0,2.83l-8.41,8.41c-0.78,0.78-2.05,0.78-2.83,0c-0.78-0.78-0.78-2.05,0-2.83l8.41-8.41C186.73,75.47,187.24,75.28,187.75,75.28z"
          />
        </g>
      </g>
      </svg>`;
    }
  },
};
</script>
