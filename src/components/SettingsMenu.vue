<template>
  <transition name="fade">
    <div v-show="menuOpen" ref="menu" id="settings-menu" class="menu">
      <SettingsMenuLanguage />
      <SettingsMenuGraphics :graphics="graphics" @change="onGraphicsChange" />
      <SettingsMenuPoints :points="points" @change="onPointsChange" />
      <SettingsMenuPointClouds
        :point-clouds="pointClouds"
        @change="onPointCloudsChange"
      />
    </div>
  </transition>
</template>

<script>
import SettingsMenuGraphics from "./SettingsMenuGraphics";
import SettingsMenuPoints from "./SettingsMenuPoints";
import SettingsMenuPointClouds from "./SettingsMenuPointClouds";
import SettingsMenuLanguage from "./SettingsMenuLanguage";

export default {
  name: "SettingsMenu",
  components: {
    SettingsMenuGraphics,
    SettingsMenuPoints,
    SettingsMenuPointClouds,
    SettingsMenuLanguage
  },
  props: {
    graphics: {
      type: String,
      required: true,
      validator: function(value) {
        return ["low", "medium", "high"].includes(value);
      }
    },
    points: {
      type: Number,
      required: true,
      validator: function(value) {
        return value >= 200000 && value <= 10000000;
      }
    },
    pointClouds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    onGraphicsChange(graphics) {
      this.$emit("graphics-change", graphics);
    },
    onPointsChange(points) {
      this.$emit("points-change", points);
    },
    onPointCloudsChange(pointClouds) {
      this.$emit("point-clouds-change", pointClouds);
    },
    documentClick(e) {
      if (
        !this.$el.parentElement.contains(e.target) &&
        !e.target.classList.contains("shepherd-button") &&
        !e.target.classList.contains("shepherd-modal-target")
      ) {
        if (this.menuOpen) this.menuOpen = false;
      }
    }
  },
  created() {
    document.addEventListener("click", this.documentClick);
  },
  destroyed() {
    document.removeEventListener("click", this.documentClick);
  }
};
</script>

<style scoped>
#settings-menu >>> h4 {
  font-weight: normal;
}

.menu {
  border-radius: 10px;
  background-color: #454545;
  padding: 1rem;
  color: #ffffff;
  margin-left: 20px;
  transform: translateY(2px);
  width: 12rem;
  z-index: 1;
}

.menu:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid #454545;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  left: -20px;
}

.menu:focus {
  outline: 0;
}

.menu-item {
  margin-bottom: 1.6rem;
}
</style>
