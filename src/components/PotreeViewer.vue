<template>
  <div id="potree-viewer"></div>
</template>

<script>
const Potree = window.Potree;

export default {
  name: "PotreeViewer",
  viewer: null,
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
          this.$options.viewer.useEDL = false;
          this.$options.viewer.useHQ = false;
          break;
        case "medium":
          this.$options.viewer.useEDL = true;
          this.$options.viewer.useHQ = false;
          break;
        case "high":
          this.$options.viewer.useEDL = true;
          this.$options.viewer.useHQ = true;
          break;
        default:
          break;
      }
    },
    numPoints: function(value) {
      this.$options.viewer.setPointBudget(value);
    }
  },
  mounted() {
    this.$options.viewer = new Potree.Viewer(this.$el);
    this.$options.viewer.setFOV(80);
    this.$options.viewer.pathControls.loop = false;

    switch (this.graphics) {
      case "low":
        this.$options.viewer.setEDLEnabled(false);
        this.$options.viewer.useHQ = false;
        break;
      case "medium":
        this.$options.viewer.setEDLEnabled(true);
        this.$options.viewer.useHQ = false;
        break;
      case "high":
        this.$options.viewer.setEDLEnabled(true);
        this.$options.viewer.useHQ = true;
        break;
      default:
        break;
    }

    this.$options.viewer.setPointBudget(this.numPoints);

    Potree.loadPointCloud(
      //   "data/ahn2/ept.json",
      "http://localhost:8081/ahn2/ept/ept.json",
      "AHN2",
      e => {
        this.onPointCloudLoaded(e.pointcloud, 0.65);
        this.$options.viewer.fitToScreen();
      }
    );

    Potree.loadPointCloud(
      //   "data/westerbork/ept.json",
      "http://localhost:8081/westerbork-cleaned-entwine/ept.json",
      "Commandantshuis",
      e => {
        this.onPointCloudLoaded(e.pointcloud, 0.65);
        this.$options.viewer.setMoveSpeed(2);
        // viewer.fitToScreen();
      }
    );
  },
  methods: {
    onPointCloudLoaded(pointcloud, size) {
      this.$options.viewer.scene.addPointCloud(pointcloud);

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
