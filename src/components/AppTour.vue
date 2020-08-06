<template>
  <div />
</template>

<script>
import Shepherd from 'shepherd.js';

export default {
  name: 'AppTour',
  data() {
    return {
      tour: null,
    };
  },
  mounted() {
    this.createTour();
    this.$watch('$i18n.locale', () => {
      this.createTour();
    });
  },
  methods: {
    clearTour() {
      while (this.$el.firstChild) {
        this.$el.firstChild.remove();
      }
    },
    createTour() {
      this.clearTour();
      this.tour = new Shepherd.Tour({ modalContainer: this.$el });

      const nextButton = {
        text: this.$t('next'),
        action: this.tour.next,
      };

      const skipButton = {
        text: this.$t('skipTour'),
        action: this.tour.complete,
      };

      if (process.env.VUE_APP_MODE !== 'onpremise') {
        this.tour.addStep({
          id: 'settings-button',
          attachTo: { element: '#settings-button', on: 'right' },
          text: this.$t('settingsButtonHint'),
          buttons: [skipButton, nextButton],
        });

        this.tour.addStep({
          id: 'settings-menu',
          attachTo: { element: '#settings-menu', on: 'right' },
          text: this.$t('settingsMenuHint'),
          buttons: [skipButton, nextButton],
          beforeShowPromise() {
            return new Promise((resolve) => {
              const settingsButton = document.getElementById('settings-button');
              settingsButton.click();
              resolve();
            });
          },
        });

        this.tour.addStep({
          id: 'about-page-button',
          attachTo: { element: '#about-page-button', on: 'right' },
          text: this.$t('aboutButtonHint'),
          buttons: [skipButton, nextButton],
          beforeShowPromise() {
            return new Promise((resolve) => {
              const settingsButton = document.getElementById('settings-button');
              settingsButton.click();
              resolve();
            });
          },
        });
      }

      this.tour.addStep({
        id: 'mini-map-expand-button',
        attachTo: { element: '#mini-map-expand-button', on: 'right' },
        text: this.$t('minimapButtonHint'),
        buttons: [skipButton, nextButton],
        beforeShowPromise() {
          return new Promise((resolve) => {
            if (process.env.VUE_APP_MODE === 'onpremise') {
              setTimeout(() => {
                resolve();
              }, 300);
            } else {
              resolve();
            }
          });
        },
      });

      this.tour.addStep({
        id: 'mini-map',
        attachTo: { element: '#mini-map', on: 'right' },
        text: this.$t('minimapHint'),
        buttons: [skipButton, nextButton],
        beforeShowPromise() {
          return new Promise((resolve) => {
            const minimapExpandButton = document.getElementById(
              'mini-map-expand-button',
            );
            minimapExpandButton.click();
            setTimeout(() => {
              resolve();
            }, 300);
          });
        },
      });

      if (process.env.VUE_APP_MODE !== 'onpremise') {
        this.tour.addStep({
          id: 'narrative-selector',
          attachTo: { element: '#narrative-selection-button', on: 'top' },
          text: this.$t('narrativeButtonHint'),
          buttons: [skipButton, nextButton],
          beforeShowPromise() {
            return new Promise((resolve) => {
              const minimapCollapseButton = document.getElementById(
                'mini-map-collapse-button',
              );
              minimapCollapseButton.click();
              resolve();
            });
          },
        });

        this.tour.addStep({
          id: 'narrative-selection',
          attachTo: { element: '.narrative-selection', on: 'right' },
          text: this.$t('narrativeSelectionHint'),
          buttons: [skipButton, nextButton],
          beforeShowPromise() {
            return new Promise((resolve) => {
              const narrativeSelectionButton = document.getElementById(
                'narrative-selection-button',
              );
              narrativeSelectionButton.click();
              resolve();
            });
          },
        });
      }

      this.tour.addStep({
        id: 'progression-bar',
        attachTo: { element: '#progression-bar', on: 'top' },
        text: this.$t('progressBarHint'),
        buttons: [skipButton, nextButton],
        beforeShowPromise() {
          return new Promise((resolve) => {
            if (process.env.VUE_APP_MODE === 'onpremise') {
              const minimapCollapseButton = document.getElementById(
                'mini-map-collapse-button',
              );
              minimapCollapseButton.click();
            }
            resolve();
          });
        },
      });

      this.tour.addStep({
        id: 'expand-info-button',
        attachTo: { element: '#expand-info-button', on: 'left' },
        text: this.$t('expandInfoButtonHint'),
        buttons: [skipButton, nextButton],
      });

      this.tour.addStep({
        id: 'info-box',
        attachTo: { element: '#info-box', on: 'left' },
        text: this.$t('infoBoxHint'),
        buttons: [skipButton, nextButton],
        beforeShowPromise() {
          return new Promise((resolve) => {
            const expandInfoButton = document.getElementById(
              'expand-info-button',
            );
            expandInfoButton.click();
            setTimeout(() => {
              resolve();
            }, 300);
          });
        },
      });

      this.tour.addStep({
        id: 'controls',
        text: this.$t('controlsHint'),
        buttons: [
          {
            text: this.$t('finish'),
            action: this.tour.complete,
          },
        ],
        beforeShowPromise() {
          return new Promise((resolve) => {
            const collapseInfoButton = document.getElementById(
              'collapse-info-button',
            );
            collapseInfoButton.click();
            setTimeout(() => {
              resolve();
            }, 300);
          });
        },
      });
    },
  },
};
</script>

<style>
@import "~shepherd.js/dist/css/shepherd.css";

.shepherd-element:focus,
.shepherd-content:focus,
.shepherd-text:focus {
  outline: none;
}

.shepherd-element {
  background-color: #2b2b2b !important;
}
.shepherd-element-attached-left .shepherd-arrow {
  border-right-color: #2b2b2b !important;
}
.shepherd-element-attached-right .shepherd-arrow {
  border-left-color: #2b2b2b !important;
}
.shepherd-element-attached-top .shepherd-arrow {
  border-bottom-color: #2b2b2b !important;
}
.shepherd-element-attached-bottom .shepherd-arrow {
  border-top-color: #2b2b2b !important;
}

.shepherd-text {
  font-size: 1.1rem;
  line-height: 1.6rem;
  color: #fff;
}

.shepherd-footer .shepherd-button {
  background-color: #ffd27c;
  color: #212121;
  cursor: pointer;
  font-family: "Flaco-Mono", sans-serif;
  border: 0;
  padding: 0.6rem 1rem;
  margin: 0.6rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.shepherd-footer .shepherd-button:not(:disabled):hover {
  background: #ffd27c;
  color: #212121;
}

.shepherd-arrow:before {
  background: #2b2b2b;
}
</style>
