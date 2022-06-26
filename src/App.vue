<template>
  <main id="app">
    <IntroductionVideo class="introduction-video" />
    <WelcomeModal class="welcome-modal" />
    <TourViewer class="tour-viewer" />
    <PointCloudViewer class="point-cloud-viewer" />
  </main>
</template>

<script>
import IntroductionVideo from './components/IntroductionVideo.vue';
import WelcomeModal from './components/WelcomeModal.vue';
import TourViewer from './components/TourViewer.vue';
import PointCloudViewer from './components/PointCloudViewer.vue';

export default {
  name: 'App',
  components: {
    IntroductionVideo,
    WelcomeModal,
    TourViewer,
    PointCloudViewer,
  },
  mounted() {
    this.$store.dispatch('getChapters');
    this.$store.dispatch('getWaypoints');
    this.$store.dispatch('getPlaces');
    this.$store.dispatch('getWaypointLabels');
    this.$store.dispatch('getHotspots');

    this.$store.dispatch('setRenderPointCloud', true);
    setTimeout(() => {
      this.$store.dispatch('setRenderPointCloud', false);
    }, 0);
  },
};
</script>

<style>
@font-face {
  font-family: 'Source Serif';
  src: url('assets/fonts/SourceSerif4Variable-Roman.ttf')
    format('truetype-variations');
  font-style: normal;
}
@font-face {
  font-family: 'Source Serif';
  src: url('assets/fonts/SourceSerif4Variable-Italic.ttf')
    format('truetype-variations');
  font-style: italic;
}
@font-face {
  font-family: 'Montserrat';
  src: url('assets/fonts/Montserrat-VariableFont_wght.ttf')
    format('truetype-variations');
  font-style: normal;
}
@font-face {
  font-family: 'Montserrat';
  src: url('assets/fonts/Montserrat-Italic-VariableFont_wght.ttf')
    format('truetype-variations');
  font-style: italic;
}

:root {
  --font-serif: 'Source Serif', serif;
  --font-sans-serif: 'Montserrat', sans-serif;
  --accent: #49cece;
  --accent-dark: #0e9c9c;
  /* --background: #f8f1ed; */
  --background: #fff4eb;
  --text: #073333;
  --grey-light: #b2b2b2;
  --grey: #808080;
  --grey-dark: #2b2b2b;
  --grey-background: #c8c4c1;
  --white: #fff;
  --black: #333;
  font-size: 75%;
}

html {
  overflow: hidden;
}

body {
  font-family: var(--font-sans-serif);
  margin: 0;
  overflow: hidden;
  background-color: var(--grey-dark);
}

p {
  font-family: var(--font-serif);
}

ol,
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

button {
  background: unset;
  border: unset;
  cursor: pointer;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
  padding: 0;
  text-align: left;
}

#app {
  position: absolute;
  width: 100vw;
  height: 100vh;
  inset: 0;
  overflow: hidden;
}

@media (hover: hover) {
  .scrollable {
    scrollbar-color: var(--scrollbar-color, #b2b2b2)
      var(--scrollbar-bg-color, #2b2b2b);
    scrollbar-width: thin;
  }
  .scrollable::-webkit-scrollbar {
    width: 0.5rem;
  }
  .scrollable::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color, #b2b2b2);
  }
  .scrollable::-webkit-scrollbar-track {
    background: var(--scrollbar-bg-color, #2b2b2b);
  }
}

.fade-enter-active {
  transition: opacity 0.2s ease-out;
}
.fade-leave-active {
  transition: opacity 0.2s ease-in;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-leave-active,
.slide-enter-active {
  transition: 500ms;
}
.slide-enter {
  transform: translate(110%, 0);
}
.slide-leave-to {
  transform: translate(-110%, 0);
}

@keyframes pulse {
  from {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
  15% {
    transform: scale(1.2);
    animation-timing-function: ease-out;
  }
  30% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
  45% {
    transform: scale(1.2);
    animation-timing-function: ease-out;
  }
  60% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
}
</style>

<style scoped>
#app {
  display: flex;
  overflow: hidden;
}

.introduction-video {
  z-index: 4;
}
.welcome-modal {
  z-index: 3;
}
.tour-viewer {
  z-index: 2;
}
.point-cloud-viewer {
  z-index: 1;
  flex: 1;
}
</style>
