import Shepherd from "shepherd.js";

export const tour = new Shepherd.Tour();

const nextButton = {
  text: "Volgende",
  action: tour.next
};

const skipButton = {
  text: "De uitleg overslaan",
  action: tour.complete
};

tour.addStep("settings-button", {
  attachTo: "#settings-button right",
  text: "Je kan hier klikken om het instellingenmenu to openen.",
  buttons: [skipButton, nextButton]
});

tour.addStep("settings-menu", {
  attachTo: "#settings-menu right",
  text:
    "In dit menu kan je de grapfische instellingen aanpassen, het aantal gevisualiseerde punten kiezen, en de puntenwolken aan- en uitzetten.",
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
    "Hier kan je informatie vinden over de app en de mensen die de app gemaakt hebben.",
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
  text: "Via dit menu kan je de app delen via email, of op social media.",
  buttons: [skipButton, nextButton]
});

tour.addStep("narrative-selector", {
  attachTo: "#narrative-selector top",
  text:
    "Om het huidige narratief te veranderen kan je op deze knop klikken. Dit zal een selectiemenu openen.",
  buttons: [skipButton, nextButton]
});

tour.addStep("narrative-selection", {
  attachTo: ".narrative-selection right",
  text: "In dit menu kan je het narratief kiezen.",
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
    "Deze balk toont de progressie door de tour door het huis. Je kan terug en vooruit verspringen door op de balk bij een kamer te klikken.",
  buttons: [skipButton, nextButton]
});

tour.addStep("expand-info-button", {
  attachTo: "#expand-info-button left",
  text: "Door op deze knop te drukken wordt het informatiepaneel zichtbaar.",
  buttons: [skipButton, nextButton]
});

tour.addStep("info-box", {
  attachTo: "#info-box left",
  text:
    "In dit paneel wordt informatie laten zien die hoort bij de huidige narratief en kamer.",
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
    "Je kan vooruit en achteruit bewegen door te drukken op de ' &uarr; ' (of 'W') en ' &darr; ' (of 'S') knoppen. Je kan rondkijken door de linkermuisknop ingedrukt te houden en de muis te bewegen.",
  buttons: [
    {
      text: "Klaar",
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
