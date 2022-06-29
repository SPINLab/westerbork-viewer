<template>
  <div v-if="shown" class="fade" @click="onClickOutside">
    <section ref="dialog" class="dialog">
      <h3>Inactiviteit</h3>
      <p>
        Er is 2 minuten geen activiteit geweest. Over een aantal seconden zal de
        applicatie resetten. Druk op de annuleer knop of buiten dit venster om
        dit te voorkomen.
      </p>
      <p>Reset in {{ timer }} seconden...</p>
      <div class="buttons">
        <button class="button" @click="close">Annuleren</button>
        <button class="button" @click="reset">Nu resetten</button>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ResetDialog',
  data() {
    return {
      initiated: false,
      timer: 10,
      shown: false,
      lastActivity: new Date().getTime(),
    };
  },
  computed: {
    ...mapState(['introductionOpen']),
  },
  watch: {
    introductionOpen() {
      if (!this.initiated) {
        this.initiated = true;
        this.reloadOnInactive();
      }
    },
  },
  methods: {
    reloadOnInactive() {
      document.addEventListener('keydown', this.resetLastActivity);
      document.addEventListener('mousedown', this.resetLastActivity);
      document.addEventListener('touchstart', this.resetLastActivity);
      document.addEventListener('click', this.resetLastActivity);
      document.addEventListener('scroll', this.resetLastActivity);

      setInterval(() => {
        if (new Date().getTime() - this.lastActivity >= 120000) {
          if (!this.shown) {
            this.show();
          }
        }
      }, 1000);
    },
    resetLastActivity() {
      this.lastActivity = new Date().getTime();
    },
    show() {
      this.shown = true;
      this.timer = 10;
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1;
        } else {
          this.reset();
        }
      }, 1000);
    },
    close() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.resetLastActivity();
      this.shown = false;
    },
    reset() {
      window.location.reload();
    },
    onClickOutside(event) {
      if (this.$refs.dialog) {
        if (this.$refs.dialog.contains(event.target)) {
          return;
        }
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.fade {
  z-index: 998;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
}

.dialog {
  z-index: 999;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(20rem, 50vw, 40rem);
  background-color: var(--background);
  border-radius: 12px;
  padding: 2rem;
  box-sizing: border-box;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  font-size: 1.5rem;
}

h3 {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

p {
  font-family: var(--sans-serif);
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

button {
  border: 1px solid var(--grey);
  border-radius: 20rem;
  padding: 0.5rem 1rem;
}

@media (hover: hover) {
  button:hover {
    color: var(--accent-dark);
    border-color: var(--accent-dark);
  }
}
</style>
