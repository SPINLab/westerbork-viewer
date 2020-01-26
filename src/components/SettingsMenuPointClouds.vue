<template>
  <div
    class="menu-item"
    id="point-cloud-selector"
    v-show="pointClouds.length > 0"
  >
    <h4>{{ $t("pointClouds").toUpperCase() }}</h4>
    <ul class="menu-list" ref="selection">
      <li v-for="(pc, index) in pointClouds" :key="index" class="list-item">
        <label>
          <input
            type="checkbox"
            :id="pc.name.toLowerCase() + '-switch'"
            :value="pc.name"
            @change="onChange"
          />
          <span :class="{ selected: pc.visible }">{{ pc.name }}</span>
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
  methods: {
    onChange(e) {
      const pcName = e.target.value;
      const pc = this.pointClouds.filter(v => v.name === pcName)[0];
      if (pc) {
        pc.visible = !pc.visible;
        this.$emit("change", this.pointClouds);
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
