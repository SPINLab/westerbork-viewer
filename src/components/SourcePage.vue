<template>
  <article class="page-closed">
    <CloseButton id="close-button" iconColor="#333333" @click.native="close" />
    <div class="content">
      <div class="media-container" v-html="media"></div>
      <section class="text-container">
        <h2>
          {{
            `${narrative.toUpperCase()} > ${room.toUpperCase()} > ${layer.toUpperCase()}`
          }}
        </h2>
        <div class="text" v-html="content"></div>
      </section>
    </div>
  </article>
</template>

<script>
import CloseButton from "./CloseButton";

export default {
  name: "SourcePage",
  components: {
    CloseButton
  },
  props: {
    narrative: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    },
    layer: {
      type: String,
      required: true
    },
    media: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      this.$el.classList.remove("page-open");
      this.$el.classList.add("page-closed");
    },
    open() {
      this.$el.classList.remove("page-closed");
      this.$el.classList.add("page-open");
    }
  }
};
</script>

<style scoped>
article {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(69, 69, 69, 0.95);
  color: #ffffff;
  overflow: auto;
  z-index: 9;
  display: flex;
  justify-content: center;
}

h2 {
  font-size: 1.125rem;
}

#close-button {
  position: absolute;
  top: 2rem;
  right: 3rem;
}

.content {
  max-width: 97.625rem;
  width: 90%;
  padding: 1rem;
  display: flex;
}

.page-open {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.1s ease-out;
}

.page-closed {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.1s, opacity 0.1s ease-out;
}

.media-container {
  padding: 3rem;
  width: 70%;
}

article >>> .media-container img {
  width: 100%;
}

article >>> .media-container video {
  width: 100%;
}

.text-container {
  padding: 3rem 0;
  width: 30%;
  line-height: 1.6rem;
}
</style>
