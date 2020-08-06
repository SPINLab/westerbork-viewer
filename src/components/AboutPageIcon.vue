<template>
  <svg
    id="Layer_1"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 51.55 51.55"
    style="enable-background: new 0 0 51.55 51.55;"
    xml:space="preserve"
  >
    <g>
      <path
        :fill="color"
        d="M25.78,51.55C11.56,51.55,0,39.99,0,25.78S11.56,0,25.78,0s25.78,11.56,25.78,25.78S39.99,51.55,25.78,51.55z M25.78,3C13.22,3,3,13.22,3,25.78s10.22,22.78,22.78,22.78s22.78-10.22,22.78-22.78S38.33,3,25.78,3z"
      />
    </g>
    <g>
      <path
        :fill="color"
        d="M18.74,36.24v-3.48h4.86v-7.91h-4.32v-3.48h8.13v11.39h5.4v3.48H18.74z M23.12,19.74v-4.43h4.27v4.43H23.12z"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'AboutPageIcon',
  props: {
    color: {
      type: String,
      required: true,
    },
  },
};
</script>
