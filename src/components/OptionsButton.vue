<template>
  <button
    class="base-button"
    type="button"
  >
    <SettingsMenuIcon
      v-if="icon === 'settings'"
      color="#ffffff"
    />
    <AboutPageIcon
      v-if="icon === 'about'"
      color="#ffffff"
    />
    <ShareIcon
      v-if="icon === 'share'"
      color="#ffffff"
    />
    <span>{{ title.toUpperCase() }}</span>
  </button>
</template>

<script>
import SettingsMenuIcon from './SettingsMenuIcon.vue';
import AboutPageIcon from './AboutPageIcon.vue';
import ShareIcon from './ShareIcon.vue';

export default {
  name: 'BaseButton',
  components: {
    SettingsMenuIcon,
    AboutPageIcon,
    ShareIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: null,
      validator(value) {
        return ['settings', 'about', 'share', null].includes(value);
      },
    },
  },
};
</script>

<style scoped>
.base-button {
  border: 1px solid #707070;
  padding: 0.2rem 1rem;
  border-radius: 10rem;
  color: #ffffff;
  background-color: #555555;
  cursor: pointer;
  font-family: 'Flaco-Mono', sans-serif;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.base-button:focus {
  outline: 0;
  border: 1px solid whitesmoke;
  background-color: grey;
}

svg {
  width: 0.8rem;
  margin-right: 0.4rem;
}
</style>
