<template>
  <section
    class="card"
    :class="{
      'card-expanded': cardExpanded,
      left: position === 'left',
      center: position === 'center',
      right: position === 'right'
    }"
  >
    <div
      ref="content"
      class="content"
      :class="{ 'content-expanded': cardExpanded }"
    >
      <h2>{{ title.toUpperCase() }}</h2>
      <p v-html="content"></p>
      <div v-show="!cardExpanded && contentOverflown" class="fade"></div>
    </div>
    <ReadFurtherButton
      v-show="!cardExpanded && contentOverflown"
      @click.native="expandCard"
    />
  </section>
</template>

<script>
import ReadFurtherButton from "./ReadFurtherButton";

export default {
  name: "IntroductionHistorical",
  components: {
    ReadFurtherButton
  },
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: false,
      default: "center",
      validator: function(value) {
        return ["left", "center", "right"].includes(value);
      }
    }
  },
  data() {
    return {
      cardExpanded: false,
      contentOverflown: false
    };
  },
  methods: {
    expandCard() {
      this.cardExpanded = true;
    },
    isContentOverflown() {
      this.contentOverflown =
        this.$refs.content.scrollHeight > this.$refs.content.clientHeight + 36;
    }
  },
  mounted() {
    this.contentOverflown =
      this.$refs.content.scrollHeight > this.$refs.content.clientHeight + 36;
    window.addEventListener("resize", this.isContentOverflown);
  },
  destroyed() {
    window.removeEventListener("resize", this.isContentOverflown);
  }
};
</script>

<style scoped>
.left {
  left: 0;
}
.center {
  left: 50%;
  transform: translateX(-50%);
}
.right {
  right: 0;
}

.card {
  position: absolute;
  top: 10%;
  padding: 2rem 3rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  height: fit-content;
  background-image: url("../assets/background_images/whitepaper.png");
  color: #212121;
  width: 33%;
  text-align: center;
}

.card-expanded {
  margin-top: 0;
}

.content {
  position: relative;
  max-height: 45vh;
  overflow: hidden;
  margin-bottom: 0.1rem;
  padding-bottom: 1rem;
}

.content-expanded {
  max-height: 60vh;
  overflow-y: auto;
}

p {
  line-height: 1.8rem;
  font-size: 1.25rem;
  text-align: start;
}

.read-further-button {
  margin-bottom: 2rem;
}

.fade {
  pointer-events: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5rem;
  background: linear-gradient(
    to top,
    rgba(235, 235, 235, 1) 5%,
    rgba(235, 235, 235, 0)
  );
}
</style>
