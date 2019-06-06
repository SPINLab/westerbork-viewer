<template>
  <div
    :class="{
      card: true,
      'card-black': isBlack,
      'card-pink': isPink,
      'card-white': isWhite
    }"
    @animationend="onAnimationEnd"
  >
    <div
      v-if="!expanded"
      :class="{ 'nav-card-buttons': true, deactive: isDeactivated }"
    >
      <button :class="{ active: isHouse }" @click="switchCard('house')">
        HOUSE
      </button>
      <button :class="{ active: isCamp }" @click="switchCard('camp')">
        CAMP
      </button>
      <button :class="{ active: isMemory }" @click="switchCard('memory')">
        MEMORY
      </button>
    </div>
    <div v-if="expanded" class="nav-card-buttons">
      <button v-if="category === 'house'" class="active">
        HOUSE
      </button>
      <button v-if="category === 'camp'" class="active">
        CAMP
      </button>
      <button v-if="category === 'memory'" class="active">
        MEMORY
      </button>
    </div>
    <div class="card-text">
      <div class="content" v-html="content"></div>
      <div
        :class="{
          fade: true,
          'fade-black': isBlack,
          'fade-pink': isPink,
          'fade-white': isWhite
        }"
      ></div>
    </div>
    <button
      v-if="!expanded"
      :class="{ 'read-further-button': true, deactive: isDeactivated }"
    >
      READ FURTHER...
    </button>
    <button v-if="expanded" class="read-further-button">
      READ FURTHER...
    </button>
  </div>
</template>

<script>
export default {
  name: "InfoBoxCard",
  props: {
    category: {
      type: String,
      required: true,
      validator: function(value) {
        return ["house", "camp", "memory"].includes(value);
      }
    },
    content: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true,
      validator: function(value) {
        return ["black", "pink", "white"].includes(value);
      }
    },
    active: {
      type: Boolean,
      required: false,
      default: true
    },
    expanded: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    isBlack: function() {
      return this.color === "black";
    },
    isPink: function() {
      return this.color === "pink";
    },
    isWhite: function() {
      return this.color === "white";
    },
    isHouse: function() {
      return this.category === "house";
    },
    isCamp: function() {
      return this.category === "camp";
    },
    isMemory: function() {
      return this.category === "memory";
    },
    isDeactivated: function() {
      return !this.active;
    }
  },
  methods: {
    switchCard(card) {
      if (card !== this.category) {
        this.$emit("change-card", card);
      }
    },
    flipCard() {
      this.$el.classList.add("flip-card");
    },
    onAnimationEnd() {
      this.$el.classList.remove("flip-card");
    }
  }
};
</script>

<style scoped>
.card {
  position: absolute;
  padding: 5rem 3rem 0rem 3rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  height: 20rem;
  min-width: 34rem;
}

.card-black {
  background-image: url("../assets/background_images/blackpaper.png");
  color: #ffffff;
}
.card-pink {
  background-image: url("../assets/background_images/pinkpaper.png");
  color: #ffffff;
}
.card-white {
  background-image: url("../assets/background_images/whitepaper.png");
  color: #575757;
}

.card .deactive {
  display: none;
}

.nav-card-buttons {
  display: flex;
  position: absolute;
  left: 3rem;
  top: 3rem;
}

.nav-card-buttons button {
  padding: 0.2rem;
  margin: 0 1.6rem 0.4rem 0;
  border: 0;
  background-color: unset;
  cursor: pointer;
  font-family: "Flaco-Mono", sans-serif;
}

/* Card black */
.card-black .nav-card-buttons button {
  border-bottom: 3px solid #919191;
  color: #919191;
}
.card-black .nav-card-buttons button:focus {
  outline: 0;
  color: #c1c1c1;
  border-bottom: 3px solid #c1c1c1;
}
.card-black .nav-card-buttons .active {
  color: #ffffff;
  border-bottom: 3px solid #ffffff;
}

/* Card pink */
.card-pink .nav-card-buttons button {
  border-bottom: 3px solid #6c545f;
  color: #6c545f;
}
.card-pink .nav-card-buttons button:focus {
  outline: 0;
  color: #ebebeb;
  border-bottom: 3px solid #ebebeb;
}
.card-pink .nav-card-buttons .active {
  color: #ffffff;
  border-bottom: 3px solid #ffffff;
}

/* Card white */
.card-white .nav-card-buttons button {
  border-bottom: 3px solid #919191;
  color: #919191;
}
.card-white .nav-card-buttons button:focus {
  outline: 0;
  color: #363636;
  border-bottom: 3px solid #363636;
}
.card-white .nav-card-buttons .active {
  color: #4e4e4e;
  border-bottom: 3px solid #4e4e4e;
}

.card-text {
  position: relative;
}

.content {
  height: 12rem;
  overflow: hidden;
  font-size: 1rem;
  line-height: 1.6rem;
  margin-bottom: 0.6rem;
}

.fade {
  pointer-events: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5rem;
}

.fade-black {
  background: linear-gradient(
    to top,
    rgba(69, 69, 69, 1) 5%,
    rgba(69, 69, 69, 0)
  );
}

.fade-pink {
  background: linear-gradient(
    to top,
    rgba(174, 144, 157, 1) 5%,
    rgba(174, 144, 157, 0)
  );
}

.fade-white {
  background: linear-gradient(
    to top,
    rgba(235, 235, 235, 1) 5%,
    rgba(235, 235, 235, 0)
  );
}

.read-further-button {
  background-color: #6e6e6e;
  border-radius: 10rem;
  border: 0;
  color: #ffffff;
  padding: 0.6rem 2rem;
  font-family: "Flaco-Mono", sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
}

@keyframes flip-card {
  0% {
    transform: translateX(-100%) rotateY(95deg);
    transform-origin: 100% 0%;
  }
  100% {
    transform: translateX(0) rotateY(0);
    transform-origin: 0% 50%;
  }
}

.flip-card {
  animation: flip-card 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}
</style>
