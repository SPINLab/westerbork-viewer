<template>
  <section>
    <transition name="fade">
      <div v-show="showMedia">
        <div class="header">
          <ViewerPreview></ViewerPreview>
        </div>
        <div class="figure-container">
          <figure :class="{ 'video-figure': mediaIsVideo }">
            <img v-if="mediaIsImage" :src="mediaDataUrl" :alt="mediaTitle" />
            <video v-if="mediaIsVideo" ref="videoElement" controls>
              <source :src="mediaDataUrl" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <figcaption>{{ caption }}</figcaption>
          </figure>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import ViewerPreview from './ViewerPreview.vue';

export default {
  name: 'TourMedia',
  components: {
    ViewerPreview,
  },
  computed: {
    ...mapState(['media', 'mediaOpen', 'showMedia']),
    ...mapGetters([
      'chapter',
      'mediaIsImage',
      'mediaIsVideo',
      'mediaDataUrl',
      'mediaTitle',
    ]),
    caption() {
      return this.media?.caption || '';
    },
  },
  watch: {
    chapter() {
      this.getMedia();
    },
    showMedia() {
      if (this.showMedia) {
        this.$nextTick(() => {
          this.autoplay();
        });
      }
    },
    mediaOpen() {
      this.autoplay();
    },
  },
  mounted() {
    this.getMedia();
  },
  methods: {
    minimize() {
      this.$store.dispatch('setMediaOpen', false);
      this.$store.dispatch('setRenderPointCloud', true);
    },
    getMedia() {
      const mediaId = this.chapter?.pages?.data?.[0]?.media;
      if (mediaId) {
        this.$store.dispatch('setMedia', null);
        this.$store.dispatch('getMedia', mediaId);
      } else {
        this.$store.dispatch('setMedia', null);
      }
    },
    autoplay() {
      if (this.mediaIsVideo) {
        if (this.mediaOpen) {
          this.$refs.videoElement.play();
        } else {
          this.$refs.videoElement.pause();
        }
      }
    },
  },
};
</script>

<style scoped>
section {
  background-color: var(--grey-dark);
  padding: 4rem;
}

.header {
  display: flex;
  justify-content: flex-end;
}

.minimize-button {
  color: var(--white);
  font-size: 6rem;
  display: flex;
  justify-content: center;
  line-height: 0.3;
  width: 2rem;
  height: 2rem;
}

.figure-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 4.4rem;
}

figure {
  display: flex;
  flex-direction: column;
  margin: 0;
  width: 100%;
}
figure.video-figure {
  width: 100%;
}

figure >>> video,
figure >>> img {
  max-height: calc(100vh - 28rem);
  height: auto;
  max-width: 100%;
  object-fit: contain;
}
figure >>> video {
  width: 100%;
}

figcaption {
  margin-top: 0.6rem;
  color: var(--grey);
  text-align: center;
  font-size: 1rem;
}
</style>
