import Shepherd from "shepherd.js";

export const tour = new Shepherd.Tour();

const nextButton = {
  text: "Next",
  action: tour.next
};

const skipButton = {
  text: "Skip the tour",
  action: tour.complete
};

tour.addStep("settings-button", {
  attachTo: "#settings-button right",
  text: "You can click here to open the settings menu.",
  buttons: [skipButton, nextButton]
});

tour.addStep("settings-menu", {
  attachTo: "#settings-menu right",
  text:
    "Here you can adjust the graphics settings, the amount of points visualized, and the point clouds shown.",
  buttons: [skipButton, nextButton],
  beforeShowPromise: function() {
    return new Promise(function(resolve) {
      const settingsButton = document.getElementById("settings-button");
      settingsButton.click();
      resolve();
    });
  }
});

tour.addStep("about-page-button", {
  attachTo: "#about-page-button right",
  text:
    "Here you can find information about the app and the people who made it.",
  buttons: [skipButton, nextButton],
  beforeShowPromise: function() {
    return new Promise(function(resolve) {
      const settingsButton = document.getElementById("settings-button");
      settingsButton.click();
      resolve();
    });
  }
});

tour.addStep("share-button", {
  attachTo: "#share-button right",
  text: "Here you can share the app via email, or on social media.",
  buttons: [skipButton, nextButton]
});

tour.addStep("narrative-selector", {
  attachTo: "#narrative-selector top",
  text:
    "To change to current narrative you can click here. This will open a selection menu.",
  buttons: [skipButton, nextButton]
});

tour.addStep("narrative-selection", {
  attachTo: ".narrative-selection right",
  text: "Here you can select another narrative.",
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

tour.addStep("progression-bar", {
  attachTo: "#progression-bar top",
  text:
    "In this slider you can view your progression through the tour of the house. You can skip forwards and backwards by clicking the slider at a room.",
  buttons: [skipButton, nextButton]
});

tour.addStep("expand-info-button", {
  attachTo: "#expand-info-button left",
  text: "You can click here to open the info panel.",
  buttons: [skipButton, nextButton]
});

tour.addStep("info-box", {
  attachTo: "#info-box left",
  text: "Information of the current room will be shown in this panel.",
  buttons: [skipButton, nextButton],
  beforeShowPromise: function() {
    return new Promise(function(resolve) {
      const expandInfoButton = document.getElementById("expand-info-button");
      expandInfoButton.click();
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }
});

tour.addStep("controls", {
  text:
    "You can move forwards and backwards through the tour by using the ' &uarr; ' (or 'W') and ' &darr; ' (or 'S') keys. You can look around by holding the left mouse button and moving the mouse.",
  buttons: [
    {
      text: "Finish",
      action: tour.complete
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
