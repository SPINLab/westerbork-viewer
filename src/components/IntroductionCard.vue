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
    <div class="content" :class="{ 'content-expanded': cardExpanded }">
      <h2>{{ title.toUpperCase() }}</h2>
      <p v-html="content"></p>
      <div v-show="!cardExpanded" class="fade"></div>
    </div>
    <ReadFurtherButton v-show="!cardExpanded" @click.native="expandCard" />
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
      cardExpanded: false
    };
  },
  methods: {
    expandCard() {
      this.cardExpanded = true;
    }
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
  top: 16%;
  padding: 2rem 3rem 0rem 3rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  height: 44%;
  background-image: url("../assets/background_images/whitepaper.png");
  color: #212121;
  width: 33%;
  text-align: center;
}

.card-expanded {
  margin-top: 0;
  height: 70%;
  top: 4%;
}

.content {
  position: relative;
  height: 80%;
  overflow: hidden;
  margin-bottom: 0.1rem;
  padding-bottom: 0.5rem;
}

.content-expanded {
  height: 90%;
  overflow-y: auto;
}

p {
  line-height: 1.8rem;
  font-size: 1.25rem;
  text-align: start;
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
