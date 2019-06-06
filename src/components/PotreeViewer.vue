<template>
  <div id="potree-viewer"></div>
</template>

<script>
import Vue from "vue";

const Potree = window.Potree;

export default {
  name: "PotreeViewer",
  props: {
    graphics: {
      type: String,
      required: false,
      default: "medium",
      validator: function(value) {
        return ["low", "medium", "high"].includes(value);
      }
    },
    numPoints: {
      type: Number,
      required: false,
      default: 6000000,
      validator: function(value) {
        return value > 0 && value < 50000000;
      }
    }
  },
  watch: {
    graphics: function(value) {
      switch (value) {
        case "low":
          this.$viewer.useEDL = false;
          this.$viewer.useHQ = false;
          break;
        case "medium":
          this.$viewer.useEDL = true;
          this.$viewer.useHQ = false;
          break;
        case "high":
          this.$viewer.useEDL = true;
          this.$viewer.useHQ = true;
          break;
        default:
          break;
      }
    },
    numPoints: function(value) {
      this.$viewer.setPointBudget(value);
    }
  },
  mounted() {
    Vue.prototype.$viewer = new Potree.Viewer(this.$el);
    this.$viewer.setFOV(80);
    this.$viewer.pathControls.loop = false;

    switch (this.graphics) {
      case "low":
        this.$viewer.setEDLEnabled(false);
        this.$viewer.useHQ = false;
        break;
      case "medium":
        this.$viewer.setEDLEnabled(true);
        this.$viewer.useHQ = false;
        break;
      case "high":
        this.$viewer.setEDLEnabled(true);
        this.$viewer.useHQ = true;
        break;
      default:
        break;
    }

    this.$viewer.setPointBudget(this.numPoints);

    Potree.loadPointCloud(
      //   "data/ahn2/ept.json",
      "http://localhost:8081/ahn2/ept/ept.json",
      "AHN2",
      e => {
        this.onPointCloudLoaded(e.pointcloud, 0.65);
        this.$viewer.fitToScreen();
      }
    );

    Potree.loadPointCloud(
      //   "data/westerbork/ept.json",
      "http://localhost:8081/westerbork-cleaned-entwine/ept.json",
      "Commandantshuis",
      e => {
        this.onPointCloudLoaded(e.pointcloud, 0.65);
        this.$viewer.setMoveSpeed(2);
        // viewer.fitToScreen();
      }
    );
  },
  methods: {
    onPointCloudLoaded(pointcloud, size) {
      this.$viewer.scene.addPointCloud(pointcloud);

      const material = pointcloud.material;
      material.size = size;
      material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

      this.$emit("point-cloud-loaded", pointcloud);
    }
  }
};
</script>

<style scoped>
#potree-viewer {
  width: 100%;
  height: 100%;
}
</style>
