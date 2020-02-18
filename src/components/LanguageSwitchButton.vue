<template>
  <button>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      width="40"
      height="20"
    >
      <defs>
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <clipPath id="triangle">
          <polygon points="60,0 60,30 0,30" />
        </clipPath>
      </defs>

      <g clip-path="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clip-path="url(#t)"
          stroke="#C8102E"
          stroke-width="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
      </g>

      <g clip-path="url(#triangle)">
        <rect fill="#21468B" width="60" height="30" />
        <rect fill="#FFF" width="60" height="20" />
        <rect fill="#AE1C28" width="60" height="10" />
      </g>
    </svg>
  </button>
</template>

<script>
export default {
  name: "LanguageSwitchButton"
};
</script>

<style scoped>
button {
  background-color: unset;
  border: none;
  padding: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
}
</style>
