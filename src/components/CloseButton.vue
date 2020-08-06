<template>
  <div>
    <RoundButton
      :icon="icon"
      :color="circleColor"
    />
  </div>
</template>

<script>
import RoundButton from './RoundButton.vue';

export default {
  name: 'CloseButton',
  components: {
    RoundButton,
  },
  props: {
    iconColor: {
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
      icon: `<svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 53.55 53.55"
      style="enable-background:new 0 0 53.55 53.55;"
      xml:space="preserve"
    >
      <g transform="translate(-830.34 -443.038)">
        <g transform="translate(859.34 472.038)">
          <g>
            <path
              fill="${this.iconColor}"
              d="M-2.2-0.2c-0.51,0-1.02-0.19-1.41-0.58l-6.8-6.8c-0.78-0.78-0.78-2.05,0-2.83c0.78-0.78,2.05-0.78,2.83,0l6.8,6.8C0-2.83,0-1.56-0.78-0.78C-1.17-0.39-1.69-0.2-2.2-0.2z"
            />
          </g>
          <g>
            <path
              fill="${this.iconColor}"
              d="M-9,6.72c-0.51,0-1.02-0.2-1.41-0.59c-0.78-0.78-0.78-2.05,0-2.83l6.8-6.8c0.78-0.78,2.05-0.78,2.83,0C0-2.72,0-1.45-0.78-0.67l-6.8,6.8C-7.98,6.52-8.49,6.72-9,6.72z"
            />
          </g>
        </g>
        <g transform="translate(872.79 485.757) rotate(180)">
          <g>
            <path
              fill="${this.iconColor}"
              d="M9,7c0.51,0,1.02,0.2,1.41,0.59l6.8,6.8c0.78,0.78,0.78,2.05,0,2.83c-0.78,0.78-2.05,0.78-2.83,0l-6.8-6.8c-0.78-0.78-0.78-2.05,0-2.83C7.98,7.2,8.49,7,9,7z"
            />
          </g>
          <g>
            <path
              fill="${this.iconColor}"
              d="M15.8,13.92c0.51,0,1.02,0.19,1.41,0.58c0.78,0.78,0.78,2.05,0,2.83l-6.8,6.8c-0.78,0.78-2.05,0.78-2.83,0c-0.78-0.78-0.78-2.05,0-2.83l6.8-6.8C14.78,14.11,15.29,13.92,15.8,13.92z"
            />
          </g>
        </g>
      </g>
    </svg>`,
    };
  },
};
</script>
