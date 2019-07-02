<template>
  <div id="potree-viewer"></div>
</template>

<script>
import Vue from "vue";

import { pathOverview } from "./path";

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
    },
    pointClouds: {
      type: Array,
      required: true
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
    },
    pointClouds: {
      handler: function(pointClouds) {
        for (const pc of pointClouds) {
          const pcPotree = this.$viewer.scene.pointclouds.filter(
            v => v.name === pc.name
          )[0];
          if (pcPotree) pcPotree.visible = pc.visible;
        }
      },
      deep: true
    }
  },
  mounted() {
    Vue.prototype.$viewer = new Potree.Viewer(this.$el);
    this.$viewer.setFOV(80);

    switch (this.graphics) {
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

    this.$viewer.setPointBudget(this.numPoints);

    for (const pc of this.pointClouds) {
      Potree.loadPointCloud(
        // `data/${pc.name.toLowerCase()}/ept.json`,
        `http://localhost:8081/${pc.name.toLowerCase()}/ept.json`,
        pc.name,
        e => {
          this.onPointCloudLoaded(e.pointcloud, 0.65);
        }
      );
    }

    this.$viewer.setNavigationMode(Potree.PathControls);
    this.$viewer.setMoveSpeed(2);
    this.$viewer.pathControls.setPath(pathOverview);
    this.$viewer.pathControls.position = 0;
    this.$viewer.pathControls.loop = false;
    this.$viewer.pathControls.lockViewToPath = "moving";
    this.$viewer.scene.view.direction = this.$viewer.pathControls.path.getTangentAt(
      this.$viewer.pathControls.position
    );
  },
  methods: {
    onPointCloudLoaded(pointcloud, size) {
      this.$viewer.scene.addPointCloud(pointcloud);

      const material = pointcloud.material;
      material.size = size;
      material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
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
