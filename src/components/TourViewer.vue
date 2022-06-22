<template>
  <transition name="fade">
    <div
      v-show="tourOpen"
      class="tour-viewer"
      :class="{ 'half-open': !mediaOpen }"
    >
      <TourSideMenu class="tour-side-menu"></TourSideMenu>
      <article>
        <TourPage class="tour-page"></TourPage>
        <transition name="fade">
          <TourMedia v-show="mediaOpen" class="tour-media"></TourMedia>
        </transition>
      </article>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

import TourSideMenu from './TourSideMenu.vue';
import TourPage from './TourPage.vue';
import TourMedia from './TourMedia.vue';

export default {
  name: 'TourViewer',
  components: {
    TourSideMenu,
    TourPage,
    TourMedia,
  },
  computed: {
    ...mapState(['tourOpen', 'mediaOpen']),
  },
};
</script>

<style scoped>
.tour-viewer {
  position: relative;
  height: 100vh;
  width: 100vw;
}
.tour-viewer.half-open {
  width: auto;
}

.tour-side-menu {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  min-width: 6rem;
}

article {
  display: grid;
  grid-template-columns: minmax(35rem, 45rem) auto;
  height: 100%;
  margin-left: 6rem;
}
</style>
