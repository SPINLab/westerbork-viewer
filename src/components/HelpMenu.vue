<template>
  <transition name="fade">
    <div v-show="open" class="help-menu">
      <ul>
        <li><button type="button">Hoe navigeer ik?</button></li>
        <li><button type="button">Overzicht periodes en bewoners</button></li>
        <li><button type="button">Over de 3D scan</button></li>
        <li><button type="button">Feedback</button></li>
        <li>
          <button type="button" @click="showAboutPage">Over dit project</button>
        </li>
      </ul>
      <button type="button" class="close-button" @click="toggle">
        <CrossIcon />
      </button>
    </div>
  </transition>
</template>

<script>
import CrossIcon from '../icons/CrossIcon.vue';

export default {
  name: 'HelpMenu',
  components: { CrossIcon },
  data() {
    return {
      open: false,
    };
  },
  created() {
    document.addEventListener('click', this.onDocumentClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    onDocumentClick(event) {
      if (!this.$el.parentElement.contains(event.target)) {
        if (this.open) this.open = false;
      }
    },
    showAboutPage() {
      // this.$store.dispatch()
    },
  },
};
</script>

<style scoped>
.help-menu {
  display: flex;
  width: 20rem;
  background-color: var(--background);
  padding-inline: 1.5rem;
  border-radius: 8px;
  color: var(--text);
}

li {
  font-size: 1.5rem;
  font-variation-settings: 'wght' 500;
  margin-block: 1.5rem;
}

li button {
  text-align: left;
}

.close-button {
  margin-top: 1.5rem;
  height: 2rem;
  width: 2rem;
  stroke: var(--accent-dark);
  stroke-width: 0.8rem;
}

@media (hover: hover) {
  li button:hover {
    color: var(--accent-dark);
  }

  .close-button:hover {
    stroke: var(--accent);
  }
}
</style>
