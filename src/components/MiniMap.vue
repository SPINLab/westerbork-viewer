<template>
  <div
    id="mini-map"
    :class="{
      'mini-map-expand': minimapExpanded,
      'mini-map-collapse': !minimapExpanded
    }"
  >
    <canvas ref="canvas" id="mini-map-canvas"> </canvas>
    <ExpandCollapseButton
      id="mini-map-collapse-button"
      class="expand-collapse-button"
      v-show="minimapExpanded"
      direction="left"
      arrowColor="#333333"
      @click.native="toggleMinimap"
    />
    <ExpandCollapseButton
      id="mini-map-expand-button"
      class="expand-collapse-button"
      v-show="!minimapExpanded"
      direction="right"
      arrowColor="#333333"
      @click.native="toggleMinimap"
    />
  </div>
</template>

<script>
import ExpandCollapseButton from "./ExpandCollapseButton";

const vector = (p1, p2) => {
  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y
  };
};

const dot = (u, v) => {
  return u.x * v.x + u.y * v.y;
};

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
    0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC
  );
};

const computeDistancePointToLine = (x, y, x1, y1, x2, y2) => {
  return (
    Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
    Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))
  );
};

const floorMapExtentRD = {
  0: {
    A: { x: 236792.67, y: 548502.48 },
    B: { x: 236800.15, y: 548508.43 },
    C: { x: 236794.2, y: 548515.92 },
    D: { x: 236786.71, y: 548509.97 }
  },
  1: {
    A: { x: 236789.04, y: 548496.16 },
    B: { x: 236804.06, y: 548507.5 },
    C: { x: 236792.51, y: 548522.59 },
    D: { x: 236777.48, y: 548511.24 }
  },
  2: {
    A: { x: 236789.76, y: 548496.46 },
    B: { x: 236803.54, y: 548506.93 },
    C: { x: 236792.99, y: 548520.81 },
    D: { x: 236779.27, y: 548510.34 }
  }
};

const floorHeights = [15.92, 18.87];

const xAxesFloors = {};
for (const floor in floorMapExtentRD) {
  if (floorMapExtentRD.hasOwnProperty(floor)) {
    const coords = floorMapExtentRD[floor];
    xAxesFloors[floor] = {
      x1: coords.A.x,
      y1: coords.A.y,
      x2: coords.B.x,
      y2: coords.B.y
    };
  }
}

const yAxesFloors = {};
for (const floor in floorMapExtentRD) {
  if (floorMapExtentRD.hasOwnProperty(floor)) {
    const coords = floorMapExtentRD[floor];
    yAxesFloors[floor] = {
      x1: coords.A.x,
      y1: coords.A.y,
      x2: coords.D.x,
      y2: coords.D.y
    };
  }
}

const xAxesLengths = {};
for (const floor in xAxesFloors) {
  if (xAxesFloors.hasOwnProperty(floor)) {
    const xAxis = xAxesFloors[floor];
    const distance = Math.hypot(xAxis.x1 - xAxis.x2, xAxis.y1 - xAxis.y2);
    xAxesLengths[floor] = distance;
  }
}

const yAxesLengths = {};
for (const floor in yAxesFloors) {
  if (yAxesFloors.hasOwnProperty(floor)) {
    const yAxis = yAxesFloors[floor];
    const distance = Math.hypot(yAxis.x1 - yAxis.x2, yAxis.y1 - yAxis.y2);
    yAxesLengths[floor] = distance;
  }
}

const floorAngles = {};
for (const floor in xAxesFloors) {
  if (xAxesFloors.hasOwnProperty(floor)) {
    const xAxis = xAxesFloors[floor];
    const dy = Math.abs(xAxis.y1 - xAxis.y2);
    const dx = Math.abs(xAxis.x1 - xAxis.x2);
    const angle = Math.atan(dy / dx);
    floorAngles[floor] = angle;
  }
}

export default {
  name: "MiniMap",
  components: {
    ExpandCollapseButton
  },
  data() {
    return {
      currentFloor: 1,
      minimapExpanded: false
    };
  },
  methods: {
    computeDeltaX(x, y, floor) {
      const yAxis = yAxesFloors[floor];
      return computeDistancePointToLine(
        x,
        y,
        yAxis.x1,
        yAxis.y1,
        yAxis.x2,
        yAxis.y2
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
        xAxis.y2
      );
    },
    computeRelativePosition(sceneX, sceneY, floor) {
      const dx = this.computeDeltaX(sceneX, sceneY, floor);
      const dy = this.computeDeltaY(sceneX, sceneY, floor);
      const posX = dx / xAxesLengths[floor];
      const posY = dy / yAxesLengths[floor];
      return { x: posX, y: posY };
    },
    positionWithinFloorplan(x, y, floor) {
      const rectangle = floorMapExtentRD[floor];
      return pointInRectangle({ x, y }, rectangle);
    },
    updateFloor() {
      const z = this.$viewer.scene.view.position.z;
      let floor;
      if (z < floorHeights[0]) {
        floor = 0;
      } else if (z > floorHeights[1]) {
        floor = 2;
      } else {
        floor = 1;
      }
      if (floor !== this.currentFloor) {
        this.currentFloor = floor;
        this.$refs.canvas.setAttribute("class", "");
        if (this.currentFloor === 0) {
          this.$refs.canvas.classList.add("basement");
        } else if (this.currentFloor === 2) {
          this.$refs.canvas.classList.add("second-floor");
        } else {
          this.$refs.canvas.classList.add("first-floor");
        }
      }
    },
    updateCanvas(ctx) {
      this.updateFloor();

      const positionInfo = this.$refs.canvas.getBoundingClientRect();
      const canvasWidth = positionInfo.width;
      const canvasHeight = positionInfo.height;
      this.$refs.canvas.width = canvasWidth;
      this.$refs.canvas.height = canvasHeight;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const sceneX = this.$viewer.scene.view.position.x;
      const sceneY = this.$viewer.scene.view.position.y;
      if (this.positionWithinFloorplan(sceneX, sceneY, this.currentFloor)) {
        const relativePosition = this.computeRelativePosition(
          sceneX,
          sceneY,
          this.currentFloor
        );
        const convasPositionX = relativePosition.x * canvasWidth;
        const convasPositionY = (1 - relativePosition.y) * canvasHeight;

        let sceneAngle = Math.atan2(
          this.$viewer.scene.view.direction.y,
          this.$viewer.scene.view.direction.x
        );
        sceneAngle = sceneAngle < 0 ? sceneAngle + Math.PI * 2 : sceneAngle;
        const angle = sceneAngle - floorAngles[0] + Math.PI / 2;

        ctx.translate(convasPositionX, convasPositionY);
        ctx.rotate(-angle);

        const triangleSize = canvasWidth / 4;
        const grd = ctx.createLinearGradient(0, 0, 0, triangleSize);
        grd.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        grd.addColorStop(0.9, "rgba(255, 255, 255, 0)");
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
    toggleMinimap() {
      this.minimapExpanded = !this.minimapExpanded;
    }
  },
  mounted() {
    const ctx = this.$refs.canvas.getContext("2d");
    ctx.fillStyle = "#fff";

    setInterval(() => {
      this.updateCanvas(ctx);
    }, 10);
  }
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
  background-image: url("../assets/maps/firstfloor.png");
}
.second-floor {
  background-image: url("../assets/maps/secondfloor.png");
}
.basement {
  background-image: url("../assets/maps/basement.png");
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
