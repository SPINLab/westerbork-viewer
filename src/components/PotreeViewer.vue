<template>
  <div id="potree-viewer" />
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import { EventBus } from '../event-bus';
import pathOverview from '../data/path';
import waypoints from '../data/waypoints';

const { Potree, THREE, TWEEN } = window;

export const pointClouds = {
  surroundings: 'AHN2',
  house: 'Commandantshuis',
};

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
      if (this.step < 9) {
        this.goToWaypoint(this.waypoint, 0);
      } else {
        this.goToWaypoint(this.waypoint);
      }
    },
  },
  mounted() {
    Vue.prototype.$viewer = new Potree.Viewer(this.$el);
    this.$viewer.setFOV(80);
    this.$viewer.setBackground('skybox');
    this.updateGraphics(this.graphics);
    this.updateNumPoints(this.numPoints);
    this.loadPointClouds();
    this.setIntroPathControls();
    this.initAnnotations();
    EventBus.$on('set-point-cloud-visibility', this.setPointCloudVisibility);
  },
  destroyed() {
    EventBus.$off('set-point-cloud-visibility', this.setPointCloudVisibility);
  },
  methods: {
    loadPointClouds() {
      Object.values(pointClouds).forEach((pointCloudName) => {
        Potree.loadPointCloud(
          `https://data.campscapes.org/westerbork/pointclouds/${pointCloudName.toLowerCase()}/ept.json`,
          pointCloudName,
          (event) => {
            this.onPointCloudLoaded(event.pointcloud, 0.65);
          },
        );
      });
    },
    onPointCloudLoaded(pointcloud, size) {
      this.$viewer.scene.addPointCloud(pointcloud);

      const { material } = pointcloud;
      material.size = size;
      material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

      if (pointcloud.name === 'AHN2') {
        const { offset } = pointcloud.pcoGeometry;
        const { center } = pointcloud.boundingSphere;
        const bbox = pointcloud.boundingBox;

        const lengthX = bbox.max.x + offset.x - (bbox.min.x + offset.x);
        const lengthY = bbox.max.y + offset.y - (bbox.min.y + offset.y);

        const meshGeometry = new THREE.PlaneGeometry(lengthX, lengthY);
        const meshMaterial = new THREE.MeshBasicMaterial({
          color: 0x4b433b,
          side: THREE.DoubleSide,
        });
        const meshPlane = new THREE.Mesh(meshGeometry, meshMaterial);

        meshPlane.position.set(center.x + offset.x, center.y + offset.y, 0);

        this.$viewer.scene.scene.add(meshPlane);
      }
    },
    setIntroPathControls() {
      const controls = new Potree.PathControls(this.$viewer);
      this.$viewer.setControls(controls);
      this.$viewer.setMoveSpeed(2);
      this.$viewer.controls.setPath(pathOverview);
      this.$viewer.controls.rotationSpeed = 50;
      this.$viewer.controls.position = 0.2;
      this.$viewer.controls.loop = false;
      this.$viewer.controls.lockViewToPath = 'moving';
      this.$viewer.scene.view.direction =
        this.$viewer.controls.path.getTangentAt(this.$viewer.controls.position);
    },
    initAnnotations() {
      this.createAnnotations();
      this.$watch('$i18n.locale', () => {
        this.createAnnotations();
      });
    },
    createAnnotations() {
      this.$viewer.scene.annotations.children = [];
      this.$viewer.scene.addAnnotation([236790, 548513, 69], {
        title: this.$t('commanderHouse'),
      });
      this.$viewer.scene.addAnnotation([237079, 548442, 69], {
        title: this.$t('campTerrain'),
      });
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
  content: '';
  position: absolute;
  left: 50%;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #ffd27c;
  transform: translateX(-50%);
}
</style>
