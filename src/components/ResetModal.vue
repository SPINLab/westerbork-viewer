<template>
  <div v-if="shown" class="fade" @click="close">
    <section class="modal">
      <h3>Bent u er nog?</h3>
      <p>
        Er is een paar minuten geen activiteit geweest. Raak het scherm aan om
        een reset te voorkomen.
      </p>
      <p>Reset in {{ timer }} seconden...</p>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ResetModal',
  data() {
    return {
      initiated: false,
      timer: 20,
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
      this.timer = 20;
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

.modal {
  z-index: 999;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(20rem, 50vw, 40rem);
  background-color: var(--emerald-dark);
  color: var(--white);
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
</style>
