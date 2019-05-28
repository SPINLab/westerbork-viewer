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
html {
  overflow-x: hidden;
}

body {
  margin: 0;
  overflow-x: hidden;
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
