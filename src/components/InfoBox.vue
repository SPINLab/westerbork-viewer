<template>
  <div
    id="info-box"
    :class="{ 'info-box-expand': visible, 'info-box-collapse': !visible }"
  >
    <div class="media-container">
      <transition name="delayed-fade">
        <ZoomButton
          v-show="!cardsExpanded && visible"
          icon-color="#333333"
          @click.native="openSource"
        />
      </transition>
      <transition name="fade">
        <div
          ref="media"
          class="media-container"
        >
          <transition name="fade">
            <div
              v-show="!cardsExpanded && activeLayer === 'house'"
              class="media"
              v-html="houseMedia || ''"
            />
          </transition>
          <transition name="fade">
            <div
              v-show="!cardsExpanded && activeLayer === 'camp'"
              class="media"
              v-html="campMedia"
            />
          </transition>
          <transition name="fade">
            <div
              v-show="!cardsExpanded && activeLayer === 'memory'"
              class="media"
              v-html="memoryMedia"
            />
          </transition>
        </div>
      </transition>
    </div>
    <div class="info-container">
      <div class="expand-collapse-buttons">
        <ExpandCollapseButton
          v-show="!cardsExpanded && !visible"
          id="expand-info-button"
          direction="left"
          arrow-color="#333333"
          @click.native="expand"
        />
        <ExpandCollapseButton
          v-show="!cardsExpanded && visible"
          id="expand-cards-button"
          direction="left"
          arrow-color="#333333"
          @click.native="expand"
        />
        <ExpandCollapseButton
          v-show="visible"
          id="collapse-info-button"
          direction="right"
          arrow-color="#333333"
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
            'card-collapse-1': !cardsCollapsed,
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
            'card-collapse-2': !cardsCollapsed,
          }"
          :style="{
            'z-index': memoryIndex,
            'margin-top': memoryOffset,
            'margin-left': '-0.4rem',
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
import InfoBoxCard from './InfoBoxCard.vue';
import ExpandCollapseButton from './ExpandCollapseButton.vue';
import ZoomButton from './ZoomButton.vue';

export default {
  name: 'InfoBox',
  components: {
    InfoBoxCard,
    ExpandCollapseButton,
    ZoomButton,
  },
  props: {
    houseMedia: {
      type: String,
      required: false,
      default: '',
    },
    houseContent: {
      type: String,
      required: false,
      default: '',
    },
    campMedia: {
      type: String,
      required: false,
      default: '',
    },
    campContent: {
      type: String,
      required: false,
      default: '',
    },
    memoryMedia: {
      type: String,
      required: false,
      default: '',
    },
    memoryContent: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      cardOrder: ['house', 'camp', 'memory'],
      cardsExpanded: false,
      cardsCollapsed: true,
    };
  },
  computed: {
    houseIndex() {
      return 5 - this.cardOrder.indexOf('house');
    },
    campIndex() {
      return 5 - this.cardOrder.indexOf('camp');
    },
    memoryIndex() {
      return 5 - this.cardOrder.indexOf('memory');
    },
    houseOffset() {
      return `${this.cardOrder.indexOf('house') * 1.3 }rem`;
    },
    campOffset() {
      return `${this.cardOrder.indexOf('camp') * 1.3 }rem`;
    },
    memoryOffset() {
      return `${this.cardOrder.indexOf('memory') * 1.3 }rem`;
    },
    activeLayer() {
      return this.cardOrder[0];
    },
  },
  methods: {
    switchCard(card) {
      this.cardOrder.splice(this.cardOrder.indexOf(card), 1);
      this.cardOrder.unshift(card);
      this.$refs[card].flipCard();

      this.$refs.media.children.forEach((element) => {
        const mediaElement = element.children[0];
        if (mediaElement && mediaElement.nodeName === 'VIDEO') {
          mediaElement.pause();
        }
      });

      this.$emit('layer-change', card);
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
      this.$emit('open-source', this.activeLayer);
    },
    onAnimationEnd(e) {
      if (e.target.classList.contains('card-collapse-2')) {
        this.cardsCollapsed = true;
      }
      e.target.classList.remove('card-collapse-1');
      e.target.classList.remove('card-collapse-2');
    },
  },
};
</script>

<style scoped>
#info-box {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rem;
  z-index: 5;
}

#info-box:focus {
  outline: 0;
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

@media only screen and (max-width: 1850px) {
  #expand-cards-button {
    display: none;
  }
}

/* @media only screen and (max-width: 650px) {
  #info-box {
    width: 100vw;
  }

  .media-container {
    width: 100vw;
    height: 50vh;
  }

  .card {
    width: 100vw;
    height: 50vh;
    padding: 0;
  }
} */
</style>
