<template>
  <svg
    id="Layer_1"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 53.5 70.2"
    style="enable-background: new 0 0 53.5 70.2;"
    xml:space="preserve"
  >
    <path
      :fill="color"
      d="M36.4,21.5l-17.5-0.1l0,0c-1.1,0-2,0.9-2,2s0.9,2,2,2l17.5,0.1l0,0c1.1,0,2-0.9,2-2S37.6,21.5,36.4,21.5z M41.5,13.5l-22.7-0.1c-1.1,0-2,0.9-2,2s0.9,2,2,2l22.7,0.1l0,0c1.1,0,2-0.9,2-2C43.6,14.4,42.7,13.5,41.5,13.5z M53.5,2v66.2c0,1.1-0.9,2-2,2h-5H6.9c-3.6,0-6.6-2.8-6.9-6.4l0,0c0,0,0-0.2,0-0.3s0-0.2,0-0.3V7c0-3.9,3.1-7,7-7l0,0h44.4C52.6,0,53.5,0.9,53.5,2L53.5,2L53.5,2zM4,57.6c0.9-0.4,1.9-0.6,2.9-0.7h1v-53h-1C5.3,3.9,4,5.2,4,6.8l0,0L4,57.6z M49.4,61H6.9c-1.4-0.2-2.8,0.8-2.9,2.3c-0.1,1.5,0.8,2.8,2.3,2.9c0.2,0,0.4,0,0.7,0h42.4V61z M49.4,4.1H12v53h37.3v-53H49.4z"
    />
  </svg>
</template>

<script>
export default {
  name: 'NarrativeSelectorIcon',
  props: {
    color: {
      type: String,
      required: true,
    },
  },
};
</script>
