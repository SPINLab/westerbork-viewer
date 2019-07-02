<template>
  <div
    id="info-box"
    :class="{ 'info-box-expand': visible, 'info-box-collapse': !visible }"
  >
    <div class="media-container">
      <transition name="delayed-fade">
        <ZoomButton
          v-show="!cardsExpanded && visible"
          iconColor="#333333"
          @click.native="openSource"
        />
      </transition>
      <transition name="fade">
        <div class="media-container" ref="media">
          <transition name="fade">
            <div
              v-show="!cardsExpanded && activeLayer === 'house'"
              class="media"
              v-html="houseMedia || ''"
            ></div>
          </transition>
          <transition name="fade">
            <div
              v-show="!cardsExpanded && activeLayer === 'camp'"
              class="media"
              v-html="campMedia"
            ></div>
          </transition>
          <transition name="fade">
            <div
              v-show="!cardsExpanded && activeLayer === 'memory'"
              class="media"
              v-html="memoryMedia"
            ></div>
          </transition>
        </div>
      </transition>
    </div>
    <div class="info-container">
      <div class="expand-collapse-buttons">
        <ExpandCollapseButton
          v-show="!cardsExpanded"
          direction="left"
          arrowColor="#333333"
          @click.native="expand"
        />
        <ExpandCollapseButton
          v-show="visible"
          direction="right"
          arrowColor="#333333"
          @click.native="collapse"
        />
      </div>
      <div class="cards-container">
        <InfoBoxCard
          ref="house"
          layer="house"
          :content="houseContent"
          color="black"
          :active="cardOrder.indexOf('house') === 0"
          :expanded="cardsExpanded"
          :style="{ 'z-index': houseIndex, 'margin-top': houseOffset }"
          @change-card="switchCard"
          @open-source="openSource"
        />
        <InfoBoxCard
          ref="camp"
          layer="camp"
          :content="campContent"
          color="pink"
          :active="cardOrder.indexOf('camp') === 0"
          :expanded="cardsExpanded"
          :class="{
            'card-expand-1': cardsExpanded,
            'card-collapse-1': !cardsCollapsed
          }"
          :style="{ 'z-index': campIndex, 'margin-top': campOffset }"
          @change-card="switchCard"
          @open-source="openSource"
          @animationend.native="onAnimationEnd"
        />
        <InfoBoxCard
          ref="memory"
          layer="memory"
          :content="memoryContent"
          color="white"
          :active="cardOrder.indexOf('memory') === 0"
          :expanded="cardsExpanded"
          :class="{
            'card-expand-2': cardsExpanded,
            'card-collapse-2': !cardsCollapsed
          }"
          :style="{
            'z-index': memoryIndex,
            'margin-top': memoryOffset,
            'margin-left': '-0.4rem'
          }"
          @change-card="switchCard"
          @open-source="openSource"
          @animationend.native="onAnimationEnd"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InfoBoxCard from "./InfoBoxCard";
import ExpandCollapseButton from "./ExpandCollapseButton";
import ZoomButton from "./ZoomButton";

export default {
  name: "InfoBox",
  components: {
    InfoBoxCard,
    ExpandCollapseButton,
    ZoomButton
  },
  props: {
    houseMedia: {
      type: String,
      required: false,
      default: ""
    },
    houseContent: {
      type: String,
      required: false,
      default: ""
    },
    campMedia: {
      type: String,
      required: false,
      default: ""
    },
    campContent: {
      type: String,
      required: false,
      default: ""
    },
    memoryMedia: {
      type: String,
      required: false,
      default: ""
    },
    memoryContent: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      visible: true,
      cardOrder: ["house", "camp", "memory"],
      cardsExpanded: false,
      cardsCollapsed: true
    };
  },
  computed: {
    houseIndex: function() {
      return 5 - this.cardOrder.indexOf("house");
    },
    campIndex: function() {
      return 5 - this.cardOrder.indexOf("camp");
    },
    memoryIndex: function() {
      return 5 - this.cardOrder.indexOf("memory");
    },
    houseOffset: function() {
      return this.cardOrder.indexOf("house") * 1.3 + "rem";
    },
    campOffset: function() {
      return this.cardOrder.indexOf("camp") * 1.3 + "rem";
    },
    memoryOffset: function() {
      return this.cardOrder.indexOf("memory") * 1.3 + "rem";
    },
    activeLayer: function() {
      return this.cardOrder[0];
    }
  },
  methods: {
    switchCard(card) {
      this.cardOrder.splice(this.cardOrder.indexOf(card), 1);
      this.cardOrder.unshift(card);
      this.$refs[card].flipCard();

      for (const element of this.$refs.media.children) {
        const mediaElement = element.children[0];
        if (mediaElement && mediaElement.nodeName === "VIDEO") {
          mediaElement.pause();
        }
      }

      this.$emit("layer-change", card);
    },
    collapse() {
      if (this.cardsExpanded) {
        this.cardsExpanded = false;
        this.cardsCollapsed = false;
      } else {
        this.visible = false;
      }
    },
    expand() {
      if (this.visible) {
        this.cardsExpanded = true;
      } else {
        this.visible = true;
      }
    },
    openSource() {
      this.$emit("open-source");
    },
    onAnimationEnd(e) {
      if (e.target.classList.contains("card-collapse-2")) {
        this.cardsCollapsed = true;
      }
      e.target.classList.remove("card-collapse-1");
      e.target.classList.remove("card-collapse-2");
    }
  }
};
</script>

<style scoped>
#info-box {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rem;
}

@keyframes expand-info-box {
  from {
    transform: translateX(98%);
  }
  to {
    transform: translateX(0%);
  }
}

@keyframes collapse-info-box {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(98%);
  }
}

.info-box-expand {
  animation: expand-info-box 0.3s ease-out forwards;
}

.info-box-collapse {
  animation: collapse-info-box 0.3s ease-out forwards;
}

.info-container {
  position: relative;
  margin-top: -0.4rem;
}

.cards-container {
  position: relative;
  display: flex;
  direction: rtl;
}

.card {
  direction: ltr;
}

@keyframes slide-left-1-card {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-95%);
  }
}

@keyframes slide-left-2-card {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-190%);
  }
}

.card-expand-1 {
  animation: slide-left-1-card 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    forwards;
}

.card-expand-2 {
  animation: slide-left-2-card 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    forwards;
}

@keyframes slide-left-1-card-bck {
  0% {
    transform: translateX(-95%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-left-2-card-bck {
  0% {
    transform: translateX(-190%);
  }
  100% {
    transform: translateX(0);
  }
}

.card-collapse-1 {
  animation: slide-left-1-card-bck 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    none;
}

.card-collapse-2 {
  animation: slide-left-2-card-bck 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    none;
}

.media-container {
  position: relative;
  width: 100%;
  height: 22.6rem;
  border-radius: 5px;
  background-color: #555555;
}

.media-container button {
  position: absolute;
  left: -1rem;
  bottom: 4.4rem;
  z-index: 1;
}

.media {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
}

#info-box >>> .media-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#info-box >>> .media-container video {
  height: 100%;
  width: 100%;
  object-fit: fill;
}

.expand-collapse-buttons {
  position: absolute;
  left: -1rem;
  top: 5rem;
  z-index: 8;
  display: flex;
  flex-direction: column;
}

.expand-collapse-buttons button {
  margin-bottom: 1rem;
}

.delayed-fade-enter-active {
  transition: opacity 0.3s;
  transition-delay: 0.3s;
}
.delayed-fade-enter {
  opacity: 0;
}
</style>
