<template>
  <div
    id="graphics-settings"
    class="menu-item"
  >
    <h4>{{ $t('language').toUpperCase() }}</h4>
    <div class="radio-select">
      <label
        class="radio-label"
        :class="{ selected: $i18n.locale === 'nl' }"
      >
        <input
          id="nl"
          class="radio-input"
          type="radio"
          value="nl"
          name="language"
          @change="onChange"
        >
        Nederlands
      </label>
      <label
        class="radio-label"
        :class="{ selected: $i18n.locale === 'en' }"
      >
        <input
          id="en"
          class="radio-input"
          type="radio"
          value="en"
          name="language"
          @change="onChange"
        >
        English
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsMenuLanguage',
  methods: {
    onChange(e) {
      this.$i18n.locale = e.target.value;
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
