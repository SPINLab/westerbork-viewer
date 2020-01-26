<template>
  <div></div>
</template>

<script>
import Shepherd from "shepherd.js";

export default {
  name: "AppTour",
  data() {
    return {
      tour: null
    };
  },
  mounted() {
    this.createTour();
    this.$watch("$i18n.locale", async function() {
      this.createTour();
    });
  },
  methods: {
    createTour() {
      this.tour = new Shepherd.Tour();

      const nextButton = {
        text: this.$t("next"),
        action: this.tour.next
      };

      const skipButton = {
        text: this.$t("skipTour"),
        action: this.tour.complete
      };

      this.tour.addStep("settings-button", {
        attachTo: "#settings-button right",
        text: this.$t("settingsButtonHint"),
        buttons: [skipButton, nextButton]
      });

      this.tour.addStep("settings-menu", {
        attachTo: "#settings-menu right",
        text: this.$t("settingsMenuHint"),
        buttons: [skipButton, nextButton],
        beforeShowPromise: function() {
          return new Promise(function(resolve) {
            const settingsButton = document.getElementById("settings-button");
            settingsButton.click();
            resolve();
          });
        }
      });

      this.tour.addStep("about-page-button", {
        attachTo: "#about-page-button right",
        text: this.$t("aboutButtonHint"),
        buttons: [skipButton, nextButton],
        beforeShowPromise: function() {
          return new Promise(function(resolve) {
            const settingsButton = document.getElementById("settings-button");
            settingsButton.click();
            resolve();
          });
        }
      });

      this.tour.addStep("narrative-selector", {
        attachTo: "#narrative-selection-button top",
        text: this.$t("narrativeButtonHint"),
        buttons: [skipButton, nextButton]
      });

      this.tour.addStep("narrative-selection", {
        attachTo: ".narrative-selection right",
        text: this.$t("narrativeSelectionHint"),
        buttons: [skipButton, nextButton],
        beforeShowPromise: function() {
          return new Promise(function(resolve) {
            const narrativeSelectionButton = document.getElementById(
              "narrative-selection-button"
            );
            narrativeSelectionButton.click();
            resolve();
          });
        }
      });

      this.tour.addStep("progression-bar", {
        attachTo: "#progression-bar top",
        text: this.$t("progressBarHint"),
        buttons: [skipButton, nextButton]
      });

      this.tour.addStep("expand-info-button", {
        attachTo: "#expand-info-button left",
        text: this.$t("expandInfoButtonHint"),
        buttons: [skipButton, nextButton]
      });

      this.tour.addStep("info-box", {
        attachTo: "#info-box left",
        text: this.$t("infoBoxHint"),
        buttons: [skipButton, nextButton],
        beforeShowPromise: function() {
          return new Promise(function(resolve) {
            const expandInfoButton = document.getElementById(
              "expand-info-button"
            );
            expandInfoButton.click();
            setTimeout(() => {
              resolve();
            }, 300);
          });
        }
      });

      this.tour.addStep("controls", {
        text: this.$t("controlsHint"),
        buttons: [
          {
            text: this.$t("finish"),
            action: this.tour.complete
          }
        ],
        beforeShowPromise: function() {
          return new Promise(function(resolve) {
            const collapseInfoButton = document.getElementById(
              "collapse-info-button"
            );
            collapseInfoButton.click();
            setTimeout(() => {
              resolve();
            }, 300);
          });
        }
      });
    }
  }
};
</script>

<style>
.shepherd-element:focus,
.shepherd-content:focus,
.shepherd-text:focus {
  outline: none;
}

.shepherd-text {
  font-size: 1.1rem;
  line-height: 1.6rem;
}

.shepherd-button {
  background-color: #ffd27c;
  color: #212121;
  cursor: pointer;
  font-family: "Flaco-Mono", sans-serif;
  border: 0;
  padding: 0.6rem 1rem;
  margin: 0.6rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
