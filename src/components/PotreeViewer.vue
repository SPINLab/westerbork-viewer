<template>
  <div id="potree-viewer" />
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import { EventBus } from '../event-bus';
import waypoints from '../data/waypoints';

const { Potree, THREE, TWEEN } = window;

const POINT_CLOUD = 'Commandantshuis';

export default {
  name: 'PotreeViewer',
  computed: {
    ...mapState(['step', 'graphics', 'numPoints', 'waypoint', 'room']),
  },
  watch: {
    graphics() {
      this.updateGraphics(this.graphics);
    },
    numPoints() {
      this.updateNumPoints(this.numPoints);
    },
    waypoint() {
      this.goToWaypoint(this.waypoint);
      this.createAnnotations();
    },
  },
  mounted() {
    Vue.prototype.$viewer = new Potree.Viewer(this.$el);
    this.$viewer.setFOV(80);
    this.$viewer.setBackground('skybox');
    this.updateGraphics(this.graphics);
    this.updateNumPoints(this.numPoints);
    this.loadPointCloud();
    this.setControls();
    this.initAnnotations();
    EventBus.$on('set-point-cloud-visibility', this.setPointCloudVisibility);
  },
  destroyed() {
    EventBus.$off('set-point-cloud-visibility', this.setPointCloudVisibility);
  },
  methods: {
    loadPointCloud() {
      Potree.loadPointCloud(
        `https://data.campscapes.org/westerbork/pointclouds/${POINT_CLOUD.toLowerCase()}/ept.json`,
        POINT_CLOUD,
        (event) => {
          this.onPointCloudLoaded(event.pointcloud, 0.65);
        },
      );
    },
    onPointCloudLoaded(pointcloud, size) {
      this.$viewer.scene.addPointCloud(pointcloud);
      const { material } = pointcloud;
      material.size = size;
      material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    },
    setControls() {
      this.$viewer.setControls(new Potree.FirstPersonControls(this.$viewer));
      this.$viewer.setMoveSpeed(1);
      this.$viewer.controls.rotationSpeed = 100;
      this.$viewer.controls.zoomToLocation = () => true;
      this.$viewer.scene.view.position.set(236807.535, 548506.569, 18);
      this.$viewer.scene.view.yaw = 1.485;
      this.$viewer.scene.view.pitch = 0;
    },
    initAnnotations() {
      this.createAnnotations();
      this.$watch('$i18n.locale', () => {
        this.createAnnotations();
      });
    },
    createAnnotations() {
      this.$viewer.scene.annotations.children = [];
      const waypoint = waypoints[this.waypoint];
      if (waypoint?.annotations?.length) {
        waypoint.annotations.forEach((annotation) => {
          const potreeAnnotation = new Potree.Annotation({
            position: annotation.coordinates,
            title: this.$t(annotation.name),
          });
          potreeAnnotation.domElement[0].onclick = () => {
            this.$store.dispatch('setWaypoint', annotation.waypoint);
          };
          if (annotation.arrow) {
            potreeAnnotation.domElement[0].classList.add(
              `arrow-${annotation.arrow}`,
            );
          }
          potreeAnnotation.elTitle.off();
          potreeAnnotation.domElement.off();
          this.$viewer.scene.annotations.add(potreeAnnotation);
        });
      }
    },
    setPointCloudVisibility({ pointcloud, visible }) {
      const potreePointCloud = this.$viewer.scene.pointclouds.find(
        (p) => p.name === pointcloud,
      );
      if (potreePointCloud) potreePointCloud.visible = visible;
    },
    updateGraphics(graphics) {
      switch (graphics) {
        case 'low':
          this.$viewer.useEDL = false;
          this.$viewer.useHQ = false;
          break;
        case 'medium':
          this.$viewer.useEDL = true;
          this.$viewer.useHQ = false;
          break;
        case 'high':
          this.$viewer.useEDL = true;
          this.$viewer.useHQ = true;
          break;
        default:
          break;
      }
    },
    updateNumPoints(numPoints) {
      this.$viewer.setPointBudget(numPoints);
    },
    goToWaypoint(waypoint, duration = 1000) {
      return new Promise((resolve) => {
        const { coordinates, room } = waypoints[waypoint];
        if (coordinates) {
          const { view } = this.$viewer.scene;

          if (duration === 0) {
            view.position.set(coordinates.x, coordinates.y, coordinates.z);
            this.$store.dispatch('setRoom', room);
            resolve();
          } else {
            const position = new THREE.Vector3(
              view.position.x,
              view.position.y,
              view.position.z,
            );
            const targetPosition = new THREE.Vector3(
              coordinates.x,
              coordinates.y,
              coordinates.z,
            );
            const direction = new THREE.Vector3(
              view.direction.x,
              view.direction.y,
              view.direction.z,
            );
            const targetDirection = new THREE.Vector3()
              .subVectors(targetPosition, view.position)
              .normalize();

            const value = { x: 0 };
            new TWEEN.Tween(value)
              .to({ x: 1 }, duration)
              .easing(TWEEN.Easing.Quartic.InOut)
              .onUpdate(() => {
                const t = value.x;

                const pos = new THREE.Vector3(
                  (1 - t) * position.x + t * targetPosition.x,
                  (1 - t) * position.y + t * targetPosition.y,
                  (1 - t) * position.z + t * targetPosition.z,
                );

                if (t < 0.5) {
                  const target = new THREE.Vector3(
                    (1 - t * 2) * direction.x + t * 2 * targetDirection.x,
                    (1 - t * 2) * direction.y + t * 2 * targetDirection.y,
                    (1 - t * 2) * direction.z + t * 2 * targetDirection.z,
                  );
                  view.direction = target;
                }
                view.position.copy(pos);
              })
              .onComplete(() => {
                if (this.room !== room) {
                  this.$store.dispatch('setRoom', room);
                }
                resolve();
              })
              .start();
          }
        }
      });
    },
  },
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
  pointer-events: auto;
}

.annotation:hover {
  cursor: pointer;
}

.annotation::after {
  content: '';
  position: absolute;
}

.annotation.arrow-left::after {
  top: 50%;
  left: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid #fff;
  transform: translate(-100%, -50%);
}
.annotation.arrow-right::after {
  top: 50%;
  right: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid #fff;
  transform: translate(100%, -50%);
}
.annotation.arrow-top::after {
  top: 0;
  left: 50%;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #fff;
  transform: translate(-50%, -100%);
}
.annotation.arrow-bottom::after {
  bottom: 0;
  left: 50%;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
  transform: translate(-50%, 100%);
}

.annotation-titlebar {
  padding: 1px 8px;
  color: #fff;
  font-size: 1.2rem;
  font-family: Flaco-Mono, sans-serif;
}

.annotation-description {
  display: none;
}
</style>
