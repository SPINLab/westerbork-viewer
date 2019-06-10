<template>
  <div
    class="menu-item"
    id="point-cloud-selector"
    v-show="pointClouds.length > 0"
  >
    <h4>POINT CLOUDS</h4>
    <ul class="menu-list" ref="selection">
      <li v-for="pc in pointClouds" :key="pc.uuid" class="list-item">
        <label>
          <input
            type="checkbox"
            :id="pc.name.toLowerCase() + '-switch'"
            :value="pc"
            v-model="selectedPointClouds"
            @change="onChange"
          />
          <span v-show="selectedPointClouds.includes(pc)" class="selected">{{
            pc.name
          }}</span>
          <span v-show="!selectedPointClouds.includes(pc)">{{ pc.name }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SettingsMenuPointClouds",
  props: {
    pointClouds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedPointClouds: []
    };
  },
  watch: {
    pointClouds: function(pointClouds) {
      for (const pc of pointClouds) {
        if (pc.visible && !this.selectedPointClouds.includes(pc)) {
          this.selectedPointClouds = [...this.selectedPointClouds, pc];
        }
      }
    }
  },
  methods: {
    onChange(e) {
      if (e.target.checked) {
        e.target._value.visible = true;
      } else {
        e.target._value.visible = false;
      }
    }
  }
};
</script>

<style scoped>
h4 {
  margin: 0.5rem 0;
}

.menu-list {
  list-style-type: none;
  margin-left: -2.4rem;
  margin-top: 0;
}

.list-item {
  margin-bottom: 0.2rem;
}
.list-item label {
  color: #737373;
  cursor: pointer;
  width: fit-content;
}

input {
  display: none;
}

.selected {
  color: #e5e5e5 !important;
}
</style>
