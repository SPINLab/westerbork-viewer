<template>
  <section>
    <div class="minimize-button-container">
      <button type="button" class="minimize-button" @click="minimize">-</button>
    </div>
    <div class="figure-container">
      <figure :class="{ 'video-figure': mediaIsVideo }">
        <img v-if="mediaIsImage" :src="mediaDataUrl" :alt="mediaTitle" />
        <video v-if="mediaIsVideo" controls>
          <source :src="mediaDataUrl" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <figcaption>{{ caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'TourMedia',
  computed: {
    ...mapState(['media']),
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
        this.$store.dispatch('getMedia', mediaId);
      } else {
        this.$store.dispatch('setMedia', null);
      }
    },
  },
};
</script>

<style scoped>
section {
  background-color: var(--grey-dark);
  padding: 2rem;
}

.minimize-button-container {
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
  padding: 3rem;
}

figure {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 0;
}
figure.video-figure {
  width: 100%;
}

figure >>> video,
figure >>> img {
  max-height: calc(100vh - 14rem);
  height: auto;
  max-width: 100%;
}
figure >>> video {
  width: 100%;
}

figcaption {
  margin-top: 1.5rem;
  color: var(--grey);
  text-align: right;
  font-size: 1.1rem;
}
</style>
