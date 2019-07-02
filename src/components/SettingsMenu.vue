<template>
  <div ref="menu" id="settings-menu" class="menu menu-closed">
    <SettingsMenuGraphics @change="onGraphicsChange" />
    <SettingsMenuPoints @change="onPointsChange" />
    <SettingsMenuPointClouds
      :point-clouds="pointClouds"
      @change="onPointCloudsChange"
    />
  </div>
</template>

<script>
import SettingsMenuGraphics from "./SettingsMenuGraphics";
import SettingsMenuPoints from "./SettingsMenuPoints";
import SettingsMenuPointClouds from "./SettingsMenuPointClouds";

export default {
  name: "SettingsMenu",
  components: {
    SettingsMenuGraphics,
    SettingsMenuPoints,
    SettingsMenuPointClouds
  },
  props: {
    pointClouds: {
      type: Array,
      required: true
    }
  },
  mounted() {
    // this.setGraphics();
    // this.setPointBudget();
    // this.setControls();
  },
  methods: {
    toggleMenu() {
      //     // if (
      //     //   typeof e !== "undefined" &&
      //     //   introduction.$tours.navTour.currentStep === 0
      //     // ) {
      //     //   introduction.$tours.navTour.nextStep();
      //     // }

      if (this.$refs.menu.classList.contains("menu-closed")) {
        this.$refs.menu.classList.remove("menu-closed");
        this.$refs.menu.classList.add("menu-open");
      } else {
        this.$refs.menu.classList.remove("menu-open");
        this.$refs.menu.classList.add("menu-closed");
      }
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
      if (!this.$el.parentElement.contains(e.target)) {
        if (this.$refs.menu.classList.contains("menu-open")) {
          this.$refs.menu.classList.remove("menu-open");
          this.$refs.menu.classList.add("menu-closed");
        }
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

.menu-closed {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.1s, opacity 0.1s ease-out;
}

.menu-open {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.1s ease-out;
}

.menu-item {
  margin-bottom: 1.6rem;
}
</style>
