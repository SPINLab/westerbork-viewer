<template>
  <div />
</template>

<script>
import Shepherd from 'shepherd.js';

export default {
  name: 'NavigationOnboarding',
  data() {
    return {
      onboarding: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.createOnboarding();
      this.onboarding.start();
    }, 300);
    this.$watch('$i18n.locale', () => {
      this.createOnboarding();
    });
  },
  methods: {
    clearOnboarding() {
      while (this.$el.firstChild) {
        this.$el.firstChild.remove();
      }
    },
    createOnboarding() {
      this.clearOnboarding();
      this.onboarding = new Shepherd.Tour({ modalContainer: this.$el });

      this.onboarding.addStep({
        text: 'Tap en veeg in het scherm om te draaien en van plek naar plek te navigeren.',
        buttons: [
          {
            text: 'Ok, volgende', // 'Ok. Is er ook een kaart?'
            action: this.onboarding.next,
          },
        ],
        attachTo: {
          element: '.onboarding-center-location',
          on: 'bottom',
        },
        arrow: false,
      });

      // this.onboarding.addStep({
      //   text: 'In de plattegrond zie je waar je bent.',
      //   buttons: [
      //     {
      //       text: 'Bijna klaar',
      //       action: this.onboarding.next,
      //     },
      //   ],
      //   attachTo: {
      //     element: '#mini-map',
      //     on: 'right',
      //   },
      // });

      this.onboarding.addStep({
        text: 'Hier vind je hulp en meer informatie.',
        buttons: [
          {
            text: 'Ok, waar begin ik?',
            action: this.onboarding.complete,
          },
        ],
        attachTo: {
          element: '.help-menu',
          on: 'left',
        },
        beforeShowPromise() {
          return new Promise((resolve) => {
            setTimeout(() => {
              const menuButton = document.querySelector('.menu-button');
              menuButton.click();
              setTimeout(resolve, 300);
            }, 100);
          });
        },
      });

      this.onboarding.on('complete', () => {
        this.$store.dispatch('setNavigationOnboardingOpen', false);
      });
    },
  },
};
</script>

<style>
@import '~shepherd.js/dist/css/shepherd.css';

.shepherd-element:focus,
.shepherd-content:focus,
.shepherd-text:focus {
  outline: none;
}

.shepherd-element {
  background-color: #0a2424 !important;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  z-index: 2;
}
.shepherd-element-attached-left .shepherd-arrow {
  border-right-color: #0a2424 !important;
}
.shepherd-element-attached-right .shepherd-arrow {
  border-left-color: #0a2424 !important;
}
.shepherd-element-attached-top .shepherd-arrow {
  border-bottom-color: #0a2424 !important;
}
.shepherd-element-attached-bottom .shepherd-arrow {
  border-top-color: #0a2424 !important;
}
.shepherd-arrow:before {
  background: #0a2424;
}

.shepherd-text {
  font-size: 1.5rem;
  color: #fff;
}

.shepherd-footer {
  justify-content: center;
  margin-block: 1rem;
}

.shepherd-footer .shepherd-button {
  background: #0a2424;
  border: 2px solid #00e3e3;
  border-radius: 20rem;
  font-size: 1.5rem;
  color: #fff;
}

@media (hover: hover) {
  .shepherd-footer .shepherd-button:not(:disabled):hover {
    background: #144a4a;
  }
}
</style>
