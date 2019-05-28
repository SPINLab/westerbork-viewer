<template>
  <div id="app">
    <TheLogo titleColor="#FFFFFF" subtitleColor="#FFFFFF" lineColor="#FFFFFF" />
    <PotreeViewer ref="PotreeViewer" />
  </div>
</template>

<script>
import TheLogo from "./components/TheLogo";
import PotreeViewer from "./components/PotreeViewer";

export default {
  name: "app",
  components: {
    TheLogo,
    PotreeViewer,
  }
};
</script>

<style>
@font-face {
  font-family: "CamphorPro-Regular";
  src: url("assets/fonts/CamphorPro-Regular.woff") format("woff");
}

@font-face {
  font-family: "CamphorPro-Italic";
  src: url("assets/fonts/CamphorPro-Italic.woff") format("woff");
}

@font-face {
  font-family: "Flaco-Mono";
  src: url("assets/fonts/Flaco-Mono.woff2") format("woff2"),
    url("assets/fonts/Flaco-Mono.woff") format("woff"),
    url("assets/fonts/Flaco-Mono.ttf") format("truetype"),
    url("assets/fonts/Flaco-Mono.eot") format("eot");
}

html {
  overflow-x: hidden;
}

body {
  font-family: "CamphorPro-Regular", sans-serif;
  margin: 0;
  overflow-x: hidden;
}

h1,
h2,
h3,
h4 {
  font-family: "Flaco-Mono", sans-serif;
}

#app {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#potree-viewer {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<style scoped>
#logo {
  position: absolute;
  top: 1rem;
  left: 3rem;
  z-index: 9;
}
</style>
