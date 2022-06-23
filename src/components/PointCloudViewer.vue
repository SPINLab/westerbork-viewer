<template>
  <div class="point-cloud-viewer" :style="cssVariables">
    <transition name="fade">
      <NavigationOnboarding v-if="navigationOnboardingOpen" />
    </transition>
    <div class="point-cloud-viewer-ui">
      <div v-show="!tourOpen" class="top-left">
        <HomeButton
          class="home-button"
          @click.native="showWelcomeModal"
        ></HomeButton>
        <transition name="fade">
          <button
            v-show="waypointHasChapter"
            ref="chapterNotice"
            type="button"
            class="chapter-notice"
            @click="showTour"
          >
            <span class="alert-circle-container">
              <span class="alert-circle"></span>
            </span>
            <span class="alert-text"> Een hoofdstuk beschikbaar </span>
          </button>
        </transition>
      </div>
      <div :class="{ 'top-center': !tourOpen, 'top-left': tourOpen }">
        <h2 class="place-name">{{ placeName }}</h2>
      </div>
      <div class="top-right">
        <MediaPreview v-show="tourOpen && !mediaOpen" class="media-preview" />
        <button class="menu-button" @click="showHelpMenu">?</button>
        <HelpMenu ref="helpMenu" class="help-menu" />
      </div>
      <div class="bottom-left">
        <div class="map-button">M</div>
      </div>
    </div>
    <section
      v-show="hotspotPopupShown"
      ref="hotspotPopup"
      class="hotspot-popup"
    >
      <div class="hotspot-overflow">
        <div class="hotspot-content scrollable">
          <h3 class="hotspot-title">{{ currentHotspot.title_nl }}</h3>
          <p class="hotspot-text">{{ currentHotspot.text_nl }}</p>
        </div>
      </div>
    </section>
    <div v-if="debugMode" class="debug-info">
      <pre style="white-space: nowrap">{{ debugInfo.position }}</pre>
      <pre style="white-space: nowrap">{{ debugInfo.rotation }}</pre>
    </div>
    <div id="potree-viewer" />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import { createPopper } from '@popperjs/core';

import HomeButton from './HomeButton.vue';
import MediaPreview from './MediaPreview.vue';
import HelpMenu from './HelpMenu.vue';
import NavigationOnboarding from './NavigationOnboarding.vue';

const { Potree, THREE, TWEEN } = window;

const POINT_CLOUD = 'Commandantshuis';
const ARROW_DIRECTIONS = {
  value1: 'left',
  value2: 'right',
  value3: 'up',
  value4: 'down',
};

const infoIconSvg = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 45.96 104"
    class="hotspot-icon"
  >
    <path
      d="M44.57,92.77l-1.45,6q-6.54,2.57-10.43,3.93a27.66,27.66,0,0,1-9,1.35q-7.92,0-12.32-3.86a12.53,12.53,0,0,1-4.39-9.81,34.81,34.81,0,0,1,.33-4.72c.22-1.61.58-3.42,1.06-5.45l5.45-19.28q.73-2.77,1.23-5.25a23.2,23.2,0,0,0,.49-4.52c0-2.47-.5-4.18-1.52-5.15s-3-1.45-5.83-1.45a15.14,15.14,0,0,0-4.33.66C2.33,45.61,1.06,46,0,46.42l1.45-5.94Q6.8,38.29,11.7,36.75A30.51,30.51,0,0,1,21,35.19q7.86,0,12.13,3.8a12.6,12.6,0,0,1,4.26,9.87c0,.84-.1,2.31-.3,4.43A30,30,0,0,1,36,59.1L30.53,78.31a53,53,0,0,0-1.19,5.29,28.25,28.25,0,0,0-.53,4.49q0,3.82,1.72,5.21t5.93,1.39A17.06,17.06,0,0,0,40.94,94,24.86,24.86,0,0,0,44.57,92.77ZM46,12.15a11.24,11.24,0,0,1-3.8,8.55A12.92,12.92,0,0,1,33,24.23a13,13,0,0,1-9.18-3.53A11.17,11.17,0,0,1,20,12.15a11.26,11.26,0,0,1,3.83-8.58A13,13,0,0,1,33,0a12.87,12.87,0,0,1,9.14,3.57A11.34,11.34,0,0,1,46,12.15Z"
    />
  </svg>
`;
const crossIconSvg = `<svg
  enable-background="new 0 0 108 108"
  version="1.1"
  viewBox="0 0 108 108"
  xml:space="preserve"
  xmlns="http://www.w3.org/2000/svg"
  class="hotspot-icon cross-icon"
>
  <g id="crosses">
    <line
      style="stroke-linecap: round; stroke-miterlimit: 10"
      x1="4"
      x2="104"
      y1="4"
      y2="104"
    />
    <line
      style="stroke-linecap: round; stroke-miterlimit: 10"
      x1="104"
      x2="4"
      y1="4"
      y2="104"
    />
  </g>
</svg>`;

let hotspotPopper;

export default {
  name: 'PointCloudViewer',
  components: {
    HomeButton,
    MediaPreview,
    HelpMenu,
    NavigationOnboarding,
  },
  data() {
    return {
      onboardingShown: false,
      popperOverflowY: '0px',
      hotspotPopupShown: false,
      currentHotspot: { title: '', text: '' },
      currentHotspotAnnotation: null,
      debugMode: false,
      debugInfo: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          yaw: null,
          pitch: null,
        },
      },
    };
  },
  computed: {
    ...mapState([
      'touchDevice',
      'waypointLabels',
      'hotspots',
      'step',
      'graphics',
      'numPoints',
      'waypoint',
      'tourOpen',
      'mediaOpen',
      'navigationOnboardingOpen',
      'renderPointCloud',
    ]),
    ...mapGetters(['tour', 'selectedWaypoints', 'selectedChapters', 'place']),
    waypointHasChapter() {
      return this.selectedChapters.find(
        (chapter) => chapter.waypoint.data.id === this.waypoint,
      );
    },
    cssVariables() {
      return {
        '--popper-overflow-y': this.popperOverflowY,
      };
    },
    placeName() {
      return this.place?.name_nl || '';
    },
  },
  watch: {
    graphics() {
      this.updateGraphics(this.graphics);
    },
    numPoints() {
      this.updateNumPoints(this.numPoints);
    },
    waypoint() {
      if (this.tourOpen) {
        this.goToWaypoint(this.waypoint, 0);
      } else {
        this.updateWaypoint(this.waypoint);
      }
      this.createAnnotations();
    },
    place() {
      this.createAnnotations();
    },
    renderPointCloud() {
      if (this.renderPointCloud) {
        if (!this.onboardingShown) {
          this.$store.dispatch('setNavigationOnboardingOpen', true);
          this.onboardingShown = true;
        }
        this.resumeRender();
      } else {
        this.pauseRender();
      }
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
    this.initHotspotPopperUpdater();
    this.pauseRender();
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeyDown);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onKeyDown);
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
      this.$viewer.setMoveSpeed(0);
    },
    pauseRender() {
      this.$viewer.renderer.setAnimationLoop(null);
    },
    resumeRender() {
      this.$viewer.renderer.setAnimationLoop(
        this.$viewer.loop.bind(this.$viewer),
      );
    },
    setControls() {
      this.$viewer.setControls(new Potree.FirstPersonControls(this.$viewer));
      this.$viewer.setMoveSpeed(0);
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
      this.createWaypoints();
      this.createHotspots();
    },
    createWaypoints() {
      const waypointLabels = this.waypointLabels[this.waypoint];
      if (waypointLabels?.length) {
        waypointLabels.forEach((label) => {
          const potreeAnnotation = new Potree.Annotation({
            position: label.coordinate,
            title: label.text_nl,
          });
          potreeAnnotation.domElement[0].onclick = () => {
            this.$store.dispatch('setWaypoint', label.waypoint.data.id);
          };
          if (label.arrow_direction) {
            potreeAnnotation.domElement[0].classList.add(
              `arrow-${ARROW_DIRECTIONS[label.arrow_direction]}`,
            );
          }
          potreeAnnotation.elTitle.off();
          potreeAnnotation.domElement.off();
          this.$viewer.scene.annotations.add(potreeAnnotation);
        });
      }
    },
    createHotspots() {
      const hotspotsAtPlace = this.hotspots.filter(
        (hotspot) => hotspot.place.data.id === this.place?.id,
      );
      if (hotspotsAtPlace?.length) {
        hotspotsAtPlace.forEach((hotspot) => {
          const potreeAnnotation = new Potree.Annotation({
            position: hotspot.coordinates,
            title: hotspot.title_nl,
          });
          potreeAnnotation.elTitle.append(infoIconSvg);
          potreeAnnotation.domElement[0].onclick = () => {
            this.toggleHotspot(hotspot, potreeAnnotation);
          };
          potreeAnnotation.elTitle.off();
          potreeAnnotation.domElement.off();
          this.$viewer.scene.annotations.add(potreeAnnotation);
        });
      }
    },
    toggleHotspot(hotspot, annotation) {
      if (this.hotspotPopupShown && this.currentHotspot === hotspot) {
        this.hideHotspotPopup();
      } else {
        this.showHotspotPopup(hotspot, annotation);
      }
    },
    hideHotspotPopup() {
      this.hotspotPopupShown = false;
      if (this.currentAnnotation) {
        this.currentAnnotation.elTitle.empty();
        this.currentAnnotation.elTitle.append(infoIconSvg);
        this.currentAnnotation = null;
      }
      this.currentHotspot = {
        title_en: '',
        title_nl: '',
        text_en: '',
        text_nl: '',
      };
    },
    showHotspotPopup(hotspot, annotation) {
      if (this.hotspotPopupShown) {
        this.currentAnnotation.elTitle.empty();
        this.currentAnnotation.elTitle.append(infoIconSvg);
      }
      this.hotspotPopupShown = true;
      this.currentHotspot = hotspot;
      this.currentAnnotation = annotation;
      annotation.elTitle.empty();
      annotation.elTitle.append(crossIconSvg);

      hotspotPopper = createPopper(
        annotation.domElement[0],
        this.$refs.hotspotPopup,
        {
          placement: 'left',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 40],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                padding: 10,
              },
            },
            {
              name: 'flip',
            },
          ],
        },
      );

      setTimeout(() => {
        this.updateHotspotPopper();
      }, 0);
    },
    initHotspotPopperUpdater() {
      let updateInterval = null;
      this.$viewer.controls.addEventListener('start', () => {
        if (hotspotPopper) {
          updateInterval = setInterval(() => {
            this.updateHotspotPopper();
          }, 10);
        }
      });
      this.$viewer.controls.addEventListener('end', () => {
        if (hotspotPopper && updateInterval) {
          clearInterval(updateInterval);
          updateInterval = null;
        }
      });
    },
    updateHotspotPopper() {
      if (hotspotPopper) {
        hotspotPopper.update();
        this.popperOverflowY = `${hotspotPopper.state.modifiersData.preventOverflow.y}px`;
      }
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
    goToWaypoint(waypointId, duration = 1000) {
      const waypoint = this.selectedWaypoints.find(
        (w) => w.data.id === waypointId,
      );
      const { coordinate: coordinates } = waypoint.data;
      let { place: placeId } = waypoint.data;
      placeId = parseInt(placeId, 10);
      if (coordinates) {
        const { view } = this.$viewer.scene;
        this.hideHotspotPopup();
        if (duration === 0) {
          view.position.set(coordinates[0], coordinates[1], coordinates[2]);
          this.$store.dispatch('setCurrentPlace', placeId);
        } else {
          const position = new THREE.Vector3(
            view.position.x,
            view.position.y,
            view.position.z,
          );
          const targetPosition = new THREE.Vector3(
            coordinates[0],
            coordinates[1],
            coordinates[2],
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
              this.updateHotspotPopper();
            })
            .onComplete(() => {
              if (this.place.id !== placeId) {
                this.$store.dispatch('setCurrentPlace', placeId);
              }
            })
            .start();
        }
      }
    },
    showTour(event) {
      if (this.touchDevice) {
        if (event.target.closest('.alert-circle-container') !== null) {
          const chapterNotice = event.target.closest('.chapter-notice');
          if (chapterNotice) {
            if (!chapterNotice.classList.contains('expanded')) {
              chapterNotice.classList.add('expanded');
              return;
            }
          }
        }
      }
      this.$store.dispatch('setTourOpen', true);
      this.$store.dispatch('setMediaOpen', true);
      this.$store.dispatch('setRenderPointCloud', false);
    },
    onDocumentClick(event) {
      if (
        this.touchDevice &&
        !this.$refs.chapterNotice.contains(event.target)
      ) {
        this.$refs.chapterNotice.classList.remove('expanded');
      }
    },
    onKeyDown(event) {
      if (event.ctrlKey && event.key === 'b') {
        if (this.debugMode) {
          if (this.debugInterval) {
            clearInterval(this.debugInterval);
            this.debugInterval = null;
          }
          this.debugMode = false;
          this.$viewer.setMoveSpeed(0);
        } else {
          this.debugMode = true;
          this.$viewer.setMoveSpeed(1.5);
          this.debugInterval = setInterval(() => {
            const round = (num) =>
              Math.round((num + Number.EPSILON) * 1000) / 1000;
            this.debugInfo.position = {
              x: round(this.$viewer.scene.view.position.x),
              y: round(this.$viewer.scene.view.position.y),
              z: round(this.$viewer.scene.view.position.z),
            };
            // limit yaw between minus pi and pi
            let { yaw } = this.$viewer.scene.view;
            while (yaw > Math.PI) {
              yaw -= 2 * Math.PI;
            }
            while (yaw < -Math.PI) {
              yaw += 2 * Math.PI;
            }
            this.debugInfo.rotation = {
              yaw: round(yaw),
              pitch: round(this.$viewer.scene.view.pitch),
            };
          }, 10);
        }
      }
    },
    showWelcomeModal() {
      this.$store.dispatch('setWelcomeModalOpen', true);
      this.$store.dispatch('setRenderPointCloud', false);
    },
    showHelpMenu() {
      this.$refs.helpMenu.toggle();
    },
  },
};
</script>

<style scoped>
.point-cloud-viewer {
  position: relative;
  height: 100vh;
  background-color: var(--grey-dark);
  color: var(--white);
}

#potree-viewer,
.point-cloud-viewer-ui {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.point-cloud-viewer-ui {
  z-index: 4;
}

.top-left {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 3rem;
}
.home-button {
  pointer-events: auto;
}
.chapter-notice {
  z-index: 1;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 3rem;
  max-width: calc(3rem + 4px);
  border: 2px solid var(--white);
  overflow: hidden;
  background-color: var(--grey-dark);
  transition: max-width 0.4s ease-in-out;
  pointer-events: auto;
}
.chapter-notice.expanded {
  max-width: 80vw;
}
@media (hover: hover) {
  .chapter-notice:hover {
    max-width: 80vw;
  }
}

.alert-circle-container {
  height: 100%;
  width: 3rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.alert-circle {
  width: 1rem;
  height: 1rem;
  border-radius: 10rem;
  border: 2px solid var(--white);
  background-color: var(--accent);
  animation: pulse 2s ease-in-out infinite both;
}
.alert-text {
  white-space: nowrap;
  padding-right: 1rem;
  font-size: 1.5rem;
}

.top-center {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
}
.place-name {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 3rem;
  border: 2px solid var(--white);
  padding-inline: 0.4rem;
  font-size: 1.8rem;
  margin: 0;
  pointer-events: auto;
}

.top-right {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}
.menu-button {
  width: 2rem;
  height: 2rem;
  font-size: 1.2rem;
  border: 2px solid var(--white);
  border-radius: 4px;
  font-variation-settings: 'wght' 600;
  pointer-events: auto;
  text-align: center;
}
.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.help-menu {
  position: absolute;
  right: 0;
  pointer-events: auto;
}

.media-preview {
  pointer-events: auto;
}

.bottom-left {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
}

#potree-viewer {
  z-index: 1;
}

.hotspot-popup {
  position: absolute;
  z-index: 3;
  display: flex;
  max-width: 20rem;
  max-height: 20rem;
  background: var(--background);
  border-radius: 8px;
  color: var(--grey-dark);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --scrollbar-bg-color: var(--background);
}

.hotspot-popup::after {
  content: '';
  position: absolute;
  top: calc(50% - 4px - var(--popper-overflow-y, 0px));
  background-color: var(--white);
  width: 50px;
  height: 3px;
}

.hotspot-popup[data-popper-placement='left']::after {
  right: 0;
  transform: translateX(100%);
}
.hotspot-popup[data-popper-placement='right']::after {
  left: 0;
  transform: translateX(-100%);
}

.hotspot-overflow {
  overflow: hidden;
  border-radius: 8px;
  background: var(--background);
}

.hotspot-content {
  overflow-y: auto;
  padding: 1rem;
  height: 100%;
}

.hotspot-content h3 {
  margin: 0;
  font-size: 1.5rem;
}

.debug-info {
  position: absolute;
  top: 10rem;
  left: 1rem;
  z-index: 10;
  color: black;
  background-color: white;
  font-size: 1.2rem;
  border: 1px solid black;
  border-radius: 4px;
  padding: 1rem;
}
</style>

<style>
#potree_annotation_container {
  z-index: 2 !important;
}

.annotation {
  position: absolute;
  transform: translate(-50%, -30px);
  will-change: left, top;
  opacity: 1 !important;
  pointer-events: auto;
  user-select: none;
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
  filter: drop-shadow(0px 2px 2px #00000029);
}

.annotation-description {
  display: none;
}

.hotspot-icon {
  width: 1.5rem;
  height: 1.5rem;
  fill: var(--white);
  border: 5px solid var(--white);
  border-radius: 50%;
  padding: 0.2rem;
}

.cross-icon {
  stroke: var(--white);
  stroke-width: 1rem;
}
</style>
