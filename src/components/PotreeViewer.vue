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

    this.createAnnotations();
    this.$watch("$i18n.locale", function() {
      this.createAnnotations();
    });
  },
  methods: {
    onPointCloudLoaded(pointcloud, size) {
      this.$viewer.scene.addPointCloud(pointcloud);

      const material = pointcloud.material;
      material.size = size;
      material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    },
    createAnnotations() {
      this.$viewer.scene.annotations.children = [];
      this.$viewer.scene.addAnnotation([236790, 548513, 69], {
        title: this.$t("commanderHouse")
      });
    }
  }
};
</script>

<style>
#potree-viewer {
  width: 100%;
  height: 100%;
}

#potree_annotation_container {
  z-index: 1 !important;
}

.annotation {
  position: absolute;
  transform: translate(-50%, -30px);
  will-change: left, top;
  opacity: 1 !important;
}

.annotation-titlebar {
  opacity: 1;
  margin: auto;
  display: table;
  border-radius: 5rem;
  padding: 1px 8px;
  background-color: #ffd27c;
  color: #212121;
  font-size: 1rem;
  font-family: Flaco-Mono, sans-serif;
  border: 0;
  padding: 0.6rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.annotation-description {
  display: none;
}

.annotation::after {
  content: "";
  position: absolute;
  left: 50%;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #ffd27c;
  transform: translateX(-50%);
}
</style>
