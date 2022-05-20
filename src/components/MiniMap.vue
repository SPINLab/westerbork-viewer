<template>
  <div
    id="mini-map"
    :class="{
      'mini-map-expand': minimapExpanded,
      'mini-map-collapse': !minimapExpanded,
    }"
  >
    <canvas id="mini-map-canvas" ref="canvas" />
    <ExpandCollapseButton
      v-show="minimapExpanded"
      id="mini-map-collapse-button"
      class="expand-collapse-button"
      direction="left"
      arrow-color="#333333"
      @click.native="toggleMinimap"
    />
    <ExpandCollapseButton
      v-show="!minimapExpanded"
      id="mini-map-expand-button"
      class="expand-collapse-button"
      direction="right"
      arrow-color="#333333"
      @click.native="toggleMinimap"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

import ExpandCollapseButton from './ExpandCollapseButton.vue';
import waypoints from '../data/waypoints';
import rooms from '../data/rooms';
import roomGeometries from '../data/roomGeometries';

const vector = (p1, p2) => ({
  x: p2.x - p1.x,
  y: p2.y - p1.y,
});

const dot = (u, v) => u.x * v.x + u.y * v.y;

const pointInRectangle = (m, r) => {
  const AB = vector(r.A, r.B);
  const AM = vector(r.A, m);
  const BC = vector(r.B, r.C);
  const BM = vector(r.B, m);
  const dotABAM = dot(AB, AM);
  const dotABAB = dot(AB, AB);
  const dotBCBM = dot(BC, BM);
  const dotBCBC = dot(BC, BC);
  return (
    dotABAM >= 0 && dotABAM <= dotABAB && dotBCBM >= 0 && dotBCBM <= dotBCBC
  );
};

const computeDistancePointToLine = (x, y, x1, y1, x2, y2) =>
  Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
  Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

const floorMapExtentRD = {
  0: {
    A: { x: 236792.67, y: 548502.48 },
    B: { x: 236800.15, y: 548508.43 },
    C: { x: 236794.2, y: 548515.92 },
    D: { x: 236786.71, y: 548509.97 },
  },
  1: {
    A: { x: 236789.04, y: 548496.16 },
    B: { x: 236804.06, y: 548507.5 },
    C: { x: 236792.51, y: 548522.59 },
    D: { x: 236777.48, y: 548511.24 },
  },
  2: {
    A: { x: 236789.76, y: 548496.46 },
    B: { x: 236803.54, y: 548506.93 },
    C: { x: 236792.99, y: 548520.81 },
    D: { x: 236779.27, y: 548510.34 },
  },
  3: {
    A: { x: 236789.76, y: 548496.46 },
    B: { x: 236803.54, y: 548506.93 },
    C: { x: 236792.99, y: 548520.81 },
    D: { x: 236779.27, y: 548510.34 },
  },
};

const floorHeights = [15.92, 18.87, 21.82];

const xAxesFloors = {};
Object.keys(floorMapExtentRD).forEach((floor) => {
  const coords = floorMapExtentRD[floor];
  xAxesFloors[floor] = {
    x1: coords.A.x,
    y1: coords.A.y,
    x2: coords.B.x,
    y2: coords.B.y,
  };
});

const yAxesFloors = {};
Object.keys(floorMapExtentRD).forEach((floor) => {
  const coords = floorMapExtentRD[floor];
  yAxesFloors[floor] = {
    x1: coords.A.x,
    y1: coords.A.y,
    x2: coords.D.x,
    y2: coords.D.y,
  };
});

const xAxesLengths = {};
Object.keys(xAxesFloors).forEach((floor) => {
  const xAxis = xAxesFloors[floor];
  const distance = Math.hypot(xAxis.x1 - xAxis.x2, xAxis.y1 - xAxis.y2);
  xAxesLengths[floor] = distance;
});

const yAxesLengths = {};
Object.keys(yAxesFloors).forEach((floor) => {
  const yAxis = yAxesFloors[floor];
  const distance = Math.hypot(yAxis.x1 - yAxis.x2, yAxis.y1 - yAxis.y2);
  yAxesLengths[floor] = distance;
});

const floorAngles = {};
Object.keys(xAxesFloors).forEach((floor) => {
  const xAxis = xAxesFloors[floor];
  const dy = Math.abs(xAxis.y1 - xAxis.y2);
  const dx = Math.abs(xAxis.x1 - xAxis.x2);
  const angle = Math.atan(dy / dx);
  floorAngles[floor] = angle;
});

// https://www.algorithms-and-technologies.com/point_in_polygon/javascript
function pointInPolygon(polygon, point) {
  let odd = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; i += 1) {
    if (
      polygon[i][1] > point[1] !== polygon[j][1] > point[1] &&
      point[0] <
        ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1])) /
          (polygon[j][1] - polygon[i][1]) +
          polygon[i][0]
    ) {
      odd = !odd;
    }
    j = i;
  }
  return odd;
}

export default {
  name: 'MiniMap',
  components: {
    ExpandCollapseButton,
  },
  data() {
    return {
      currentFloor: 1,
      minimapExpanded: false,
      updateInterval: null,
      canvasContext: null,
      hoveredWaypoint: null,
      hoveredRoom: null,
    };
  },
  created() {
    this.debouncedOnHover = debounce(this.onHover, 5);
  },
  mounted() {
    this.canvasContext = this.$refs.canvas.getContext('2d');
    this.canvasContext.fillStyle = '#fff';
    this.updateFloor(true);
    this.updateCanvas(this.canvasContext);
    this.$refs.canvas.addEventListener('mousemove', this.debouncedOnHover);
    this.$refs.canvas.addEventListener('click', this.onClick);
  },
  beforeDestroy() {
    this.$refs.canvas.removeEventListener('mousemove', this.debouncedOnHover);
    this.$refs.canvas.removeEventListener('click', this.onClick);
  },
  methods: {
    clientToCanvasCoords(clientX, clientY) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    getHoveredWaypoint(clientX, clientY) {
      const { x, y } = this.clientToCanvasCoords(clientX, clientY);

      const waypointEntry = Object.entries(waypoints).find(([, waypoint]) => {
        const { coordinates, room } = waypoint;
        if (rooms[room].floor === this.currentFloor) {
          const relativePosition = this.computeRelativePosition(
            coordinates.x,
            coordinates.y,
            this.currentFloor,
          );
          const canvasPosition = this.computeCanvasPosition(relativePosition);
          if (
            x >= canvasPosition.x - 10 &&
            x <= canvasPosition.x + 10 &&
            y >= canvasPosition.y - 10 &&
            y <= canvasPosition.y + 10
          ) {
            return true;
          }
        }
        return false;
      });

      return waypointEntry && waypointEntry[0]
        ? parseInt(waypointEntry[0], 10)
        : null;
    },
    getHoveredRoom(clientX, clientY) {
      const { x, y } = this.clientToCanvasCoords(clientX, clientY);

      const hoveredRoom = roomGeometries[this.currentFloor]?.features.find(
        (feature) => {
          const { coordinates } = feature.geometry;
          const canvasCoordinates = coordinates[0].map((coordinate) => {
            const relativePosition = this.computeRelativePosition(
              coordinate[0],
              coordinate[1],
              this.currentFloor,
            );
            return Object.values(this.computeCanvasPosition(relativePosition));
          });
          return pointInPolygon(canvasCoordinates, [x, y]);
        },
      );

      return hoveredRoom || null;
    },
    onHover(e) {
      this.hoveredWaypoint = this.getHoveredWaypoint(e.clientX, e.clientY);
      this.hoveredRoom = this.getHoveredRoom(e.clientX, e.clientY);
      if (this.hoveredWaypoint) {
        this.$refs.canvas.style.cursor = 'pointer';
      } else {
        this.$refs.canvas.style.cursor = 'default';
      }
    },
    onClick(e) {
      const clickedWaypoint = this.getHoveredWaypoint(e.clientX, e.clientY);
      if (clickedWaypoint !== null) {
        this.$store.dispatch('setWaypoint', clickedWaypoint);
      }
    },
    computeDeltaX(x, y, floor) {
      const yAxis = yAxesFloors[floor];
      return computeDistancePointToLine(
        x,
        y,
        yAxis.x1,
        yAxis.y1,
        yAxis.x2,
        yAxis.y2,
      );
    },
    computeDeltaY(x, y, floor) {
      const xAxis = xAxesFloors[floor];
      return computeDistancePointToLine(
        x,
        y,
        xAxis.x1,
        xAxis.y1,
        xAxis.x2,
        xAxis.y2,
      );
    },
    computeRelativePosition(sceneX, sceneY, floor) {
      const dx = this.computeDeltaX(sceneX, sceneY, floor);
      const dy = this.computeDeltaY(sceneX, sceneY, floor);
      const posX = dx / xAxesLengths[floor];
      const posY = dy / yAxesLengths[floor];
      return { x: posX, y: posY };
    },
    computeCanvasPosition(relativePosition) {
      const canvasRect = this.$refs.canvas.getBoundingClientRect();
      return {
        x: relativePosition.x * canvasRect.width,
        y: (1 - relativePosition.y) * canvasRect.height,
      };
    },
    positionWithinFloorplan(x, y, floor) {
      const rectangle = floorMapExtentRD[floor];
      return pointInRectangle({ x, y }, rectangle);
    },
    updateFloor(force) {
      const { z } = this.$viewer.scene.view.position;
      let floor;
      if (z < floorHeights[0]) {
        floor = 0;
      } else if (z >= floorHeights[0] && z < floorHeights[1]) {
        floor = 1;
      } else if (z >= floorHeights[1] && z < floorHeights[2]) {
        floor = 2;
      } else {
        floor = 3;
      }
      if (force || floor !== this.currentFloor) {
        this.currentFloor = floor;
        this.$refs.canvas.setAttribute('class', '');
        if (this.currentFloor === 0) {
          this.$refs.canvas.classList.add('basement');
        } else if (this.currentFloor === 1) {
          this.$refs.canvas.classList.add('first-floor');
        } else if (this.currentFloor === 2) {
          this.$refs.canvas.classList.add('second-floor');
        } else {
          this.$refs.canvas.classList.add('attic');
        }
      }
    },
    prepareCanvas(ctx) {
      const positionInfo = this.$refs.canvas.getBoundingClientRect();
      const canvasWidth = positionInfo.width;
      const canvasHeight = positionInfo.height;
      this.$refs.canvas.width = canvasWidth;
      this.$refs.canvas.height = canvasHeight;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    drawWaypoints(ctx) {
      Object.entries(waypoints).forEach(([id, waypoint]) => {
        const { coordinates, room } = waypoint;
        if (rooms[room].floor === this.currentFloor) {
          const relativePosition = this.computeRelativePosition(
            coordinates.x,
            coordinates.y,
            this.currentFloor,
          );
          const canvasPosition = this.computeCanvasPosition(relativePosition);
          let radius = 5;
          if (this.hoveredWaypoint === id) {
            radius = 10;
          } else if (
            this.hoveredRoom &&
            this.hoveredRoom.properties.room === room
          ) {
            radius = 8;
          }
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(
            canvasPosition.x,
            canvasPosition.y,
            radius,
            0,
            2 * Math.PI,
            true,
          );
          ctx.fill();
        }
      });
    },
    drawHoveredRoom(ctx) {
      const { coordinates } = this.hoveredRoom.geometry;
      const canvasCoordinates = coordinates[0].map((coordinate) => {
        const relativePosition = this.computeRelativePosition(
          coordinate[0],
          coordinate[1],
          this.currentFloor,
        );
        return Object.values(this.computeCanvasPosition(relativePosition));
      });
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(canvasCoordinates[0][0], canvasCoordinates[0][1]);
      canvasCoordinates.slice(1).forEach((coordinate) => {
        ctx.lineTo(coordinate[0], coordinate[1]);
      });
      ctx.closePath();
      ctx.fill();

      const x = canvasCoordinates.reduce(
        (avg, values) => avg + values[0] / canvasCoordinates.length,
        0,
      );
      let y =
        canvasCoordinates.reduce(
          (min, values) => Math.min(min, values[1]),
          Infinity,
        ) - 15;
      if (y < 15) {
        y =
          canvasCoordinates.reduce(
            (max, values) => Math.max(max, values[1]),
            0,
          ) + 30;
      }

      ctx.font = '20px CamphorPro-Regular';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText(`${this.$t(this.hoveredRoom.properties.room)}`, x, y);
    },
    drawUserPosition(ctx) {
      const sceneX = this.$viewer.scene.view.position.x;
      const sceneY = this.$viewer.scene.view.position.y;
      if (this.positionWithinFloorplan(sceneX, sceneY, this.currentFloor)) {
        const relativePosition = this.computeRelativePosition(
          sceneX,
          sceneY,
          this.currentFloor,
        );
        const canvasPosition = this.computeCanvasPosition(relativePosition);

        let sceneAngle = Math.atan2(
          this.$viewer.scene.view.direction.y,
          this.$viewer.scene.view.direction.x,
        );
        sceneAngle = sceneAngle < 0 ? sceneAngle + Math.PI * 2 : sceneAngle;
        const angle = sceneAngle - floorAngles[0] + Math.PI / 2;

        ctx.translate(canvasPosition.x, canvasPosition.y);
        ctx.rotate(-angle);

        const triangleSize = this.$refs.canvas.width / 4;
        const grd = ctx.createLinearGradient(0, 0, 0, triangleSize);
        grd.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        grd.addColorStop(0.9, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(triangleSize, triangleSize);
        ctx.lineTo(-triangleSize, triangleSize);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, 2 * Math.PI, true);
        ctx.fill();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    },
    updateCanvas(ctx) {
      this.updateFloor();
      this.prepareCanvas(ctx);
      this.drawWaypoints(ctx);
      if (this.hoveredRoom) {
        this.drawHoveredRoom(ctx);
      }
      this.drawUserPosition(ctx);

      if (this.minimapExpanded) {
        requestAnimationFrame(() => {
          this.updateCanvas(ctx);
        });
      }
    },
    toggleMinimap() {
      this.minimapExpanded = !this.minimapExpanded;
      if (this.minimapExpanded) {
        requestAnimationFrame(() => {
          this.updateCanvas(this.canvasContext);
        });
      }
    },
  },
};
</script>

<style scoped>
#mini-map {
  position: absolute;
  top: 25%;
  transform: translateY(-50%);
  left: 0;
}

#mini-map-canvas {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 50vh;
  width: 50vh;
}

.first-floor {
  background-image: url('../assets/maps/firstfloor.png');
}
.second-floor {
  background-image: url('../assets/maps/secondfloor.png');
}
.basement {
  background-image: url('../assets/maps/basement.png');
}
.attic {
  background-image: url('../assets/maps/attic.png');
}

@keyframes expand-mini-map {
  from {
    transform: translateX(-96%);
  }
  to {
    transform: translateX(-1%);
  }
}

@keyframes collapse-mini-map {
  from {
    transform: translateX(-1%);
  }
  to {
    transform: translateX(-96%);
  }
}

.mini-map-expand {
  animation: expand-mini-map 0.3s ease-out forwards;
}

.mini-map-collapse {
  animation: collapse-mini-map 0.3s ease-out forwards;
}

.expand-collapse-button {
  position: absolute;
  right: -3%;
  bottom: 6%;
}
</style>
