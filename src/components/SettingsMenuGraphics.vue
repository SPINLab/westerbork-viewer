<template>
  <div
    id="graphics-settings"
    class="menu-item"
  >
    <h4>GRAPHICS</h4>
    <div class="radio-select">
      <label
        class="radio-label"
        :class="{ selected: graphics === 'low' }"
      >
        <input
          id="low"
          class="radio-input"
          type="radio"
          value="low"
          name="graphics"
          @change="onChange"
        >
        {{ $t('low') }}
      </label>
      <label
        class="radio-label"
        :class="{ selected: graphics === 'medium' }"
      >
        <input
          id="medium"
          class="radio-input"
          type="radio"
          value="medium"
          name="graphics"
          @change="onChange"
        >
        {{ $t('medium') }}
      </label>
      <label
        class="radio-label"
        :class="{ selected: graphics === 'high' }"
      >
        <input
          id="high"
          class="radio-input"
          type="radio"
          value="high"
          name="graphics"
          @change="onChange"
        >
        {{ $t('high') }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsMenuGraphics',
  props: {
    graphics: {
      type: String,
      required: true,
      validator(value) {
        return ['low', 'medium', 'high'].includes(value);
      },
    },
  },
  methods: {
    onChange(e) {
      this.$emit('change', e.target.value);
    },
  },
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
