<template>
  <RoundButton
    :icon="icon"
    :color="circleColor"
  />
</template>

<script>
import RoundButton from './RoundButton.vue';

export default {
  name: 'ZoomButton',
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
      viewBox="0 0 44 44"
      style="enable-background:new 0 0 44 44;"
      xml:space="preserve"
    >
      <path
        fill="none"
        d="M19.88,15.25c-3.11,0-5.63,2.53-5.63,5.64s2.53,5.63,5.64,5.63s5.63-2.53,5.63-5.64c0,0,0,0,0,0C25.52,17.77,23,15.25,19.88,15.25z M22.14,22.02h-4.5c-0.62,0-1.13-0.51-1.13-1.13c0-0.62,0.5-1.13,1.13-1.13h4.51c0.62,0,1.13,0.5,1.13,1.13C23.27,21.51,22.77,22.02,22.14,22.02C22.14,22.02,22.14,22.02,22.14,22.02L22.14,22.02z"
      />
      <path
        fill="${this.iconColor}"
        d="M29.51,28.11l-2.98-2.98c2.36-3.68,1.29-8.59-2.39-10.95c-3.68-2.36-8.59-1.29-10.95,2.39s-1.29,8.59,2.39,10.95c2.61,1.67,5.96,1.67,8.56,0l2.98,2.98c0.66,0.66,1.73,0.65,2.39-0.01C30.16,29.83,30.16,28.77,29.51,28.11L29.51,28.11z M19.89,26.52c-3.11,0-5.64-2.52-5.63-5.64s2.52-5.64,5.64-5.64s5.64,2.52,5.64,5.64C25.52,24,23,26.52,19.89,26.52C19.89,26.52,19.89,26.52,19.89,26.52z"
      />
      <path
        fill="${this.iconColor}"
        d="M22.14,19.76h-4.51c-0.62,0-1.13,0.5-1.13,1.13c0,0.62,0.5,1.13,1.13,1.13h4.51c0.62,0,1.13-0.5,1.13-1.13C23.27,20.27,22.77,19.76,22.14,19.76z"
      />
      <path
        fill="none"
        d="M18.76,23.14v-4.51c0-0.62,0.5-1.13,1.13-1.13c0.62,0,1.13,0.5,1.13,1.13v4.51c0,0.62-0.5,1.13-1.13,1.13C19.27,24.27,18.76,23.77,18.76,23.14z"
      />
      <path
        fill="${this.iconColor}"
        d="M21.01,23.14v-4.51c0-0.62-0.5-1.13-1.13-1.13c-0.62,0-1.13,0.5-1.13,1.13v4.51c0,0.62,0.5,1.13,1.13,1.13C20.51,24.27,21.01,23.77,21.01,23.14z"
      />
    </svg>`,
    };
  },
};
</script>
