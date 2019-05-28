<template>
  <div class="menu-item" id="graphics-settings">
    <h4>GRAPHICS</h4>
    <div ref="selection" class="radio-select">
      <label ref="low" class="radio-label">
        <input
          class="radio-input"
          ref="low"
          type="radio"
          id="low"
          value="low"
          v-model="graphics"
          @change="onChange"
        />
        low
      </label>
      <label ref="medium" class="radio-label selected">
        <input
          class="radio-input"
          type="radio"
          id="medium"
          value="medium"
          v-model="graphics"
          @change="onChange"
        />
        medium
      </label>
      <label ref="high" class="radio-label">
        <input
          class="radio-input"
          type="radio"
          id="high"
          value="high"
          v-model="graphics"
          @change="onChange"
        />
        high
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsMenuGraphics",
  data() {
    return {
      graphics: "medium"
    };
  },
  methods: {
    onChange() {
      const radioButtons = this.$refs.selection.children;
      for (const button of radioButtons) {
        button.classList.remove("selected");
      }
      this.$refs[this.graphics].classList.add("selected");

      this.$emit("change", this.graphics);
    }
  }
};
</script>

<style scoped>
h4 {
  margin: 0.5rem 0;
}

.radio-select {
  display: flex;
  flex-direction: column;
}
.radio-label {
  color: #737373;
  cursor: pointer;
  width: fit-content;
}

.radio-label:hover {
  color: #e5e5e5;
}

.radio-input {
  display: none;
}

.selected {
  color: #e5e5e5;
}
</style>
