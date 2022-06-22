import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const testTours = [
  {
    name: 'Tour 1: Het huis onder commandant Gemmeker',
    steps: [
      {
        title: 'Lorem ipsum dolor sit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: {
          file: {
            data: {
              type: 'image/jpeg',
              url: 'storage/uploads/00000000346.jpg',
            },
          },
          caption: 'Lorem ipsum dolor sit amet',
        },
        waypoint: 0,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: {
          file: {
            data: {
              type: 'video/mp4',
              url: 'storage/uploads/00000000115.mp4',
            },
          },
          caption: 'Lorem ipsum dolor sit amet',
        },
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
      {
        title: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
        content:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint hic inventore ratione quod nobis facilis quo. Magni eveniet, eos suscipit quidem, at illo harum asperiores eaque non facilis maiores cumque?',
        media: '',
        waypoint: 1,
      },
    ],
  },
  {
    name: 'Tour 2: Onderzoek en herinnering',
    steps: [],
  },
];

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    onPremiseMode: process.env.VUE_APP_MODE === 'onpremise',
    touchDevice: matchMedia('(hover: none)').matches,
    selectedTour: null,
    tours: testTours,
    tourStep: 0,
    tourOpen: true,
    mediaOpen: true,
    welcomeModalOpen: false,
    introductionOpen: true,
    navigationOnboardingOpen: false,
    room: 'outside',
    waypoint: 0,
    renderPointCloud: false,
    graphics: 'medium',
    numPoints: process.env.VUE_APP_MODE ? 200000 : 200000,
  },
  mutations: {
    setRoom(state, value) {
      state.room = value;
    },
    setWaypoint(state, value) {
      state.waypoint = value;
    },
    setRenderPointCloud(state, value) {
      state.renderPointCloud = value;
    },
    setGraphics(state, value) {
      state.graphics = value;
    },
    setNumPoints(state, value) {
      state.numPoints = value;
    },
    setTourOpen(state, value) {
      state.tourOpen = value;
    },
    setMediaOpen(state, value) {
      state.mediaOpen = value;
    },
    setWelcomeModalOpen(state, value) {
      state.welcomeModalOpen = value;
    },
    setIntroductionOpen(state, value) {
      state.introductionOpen = value;
    },
    setNavigationOnboardingOpen(state, value) {
      state.navigationOnboardingOpen = value;
    },
    setSelectedTour(state, value) {
      state.selectedTour = value;
    },
    setTourStep(state, value) {
      state.tourStep = value;
    },
    nextTourStep(state) {
      if (state.tourStep < state.tours[state.selectedTour].steps.length - 1) {
        state.tourStep += 1;
      }
    },
    previousTourStep(state) {
      if (state.tourStep >= 1) {
        state.tourStep -= 1;
      }
    },
  },
  actions: {
    setRoom({ commit }, value) {
      commit('setRoom', value);
    },
    setWaypoint({ commit }, value) {
      commit('setWaypoint', value);
    },
    setRenderPointCloud({ commit }, value) {
      commit('setRenderPointCloud', value);
    },
    setGraphics({ commit }, value) {
      commit('setGraphics', value);
    },
    setNumPoints({ commit }, value) {
      commit('setNumPoints', value);
    },
    setMediaOpen({ commit }, value) {
      commit('setMediaOpen', value);
    },
    setTourOpen({ commit }, value) {
      commit('setTourOpen', value);
    },
    setWelcomeModalOpen({ commit }, value) {
      commit('setWelcomeModalOpen', value);
    },
    setIntroductionOpen({ commit }, value) {
      commit('setIntroductionOpen', value);
    },
    setNavigationOnboardingOpen({ commit }, value) {
      commit('setNavigationOnboardingOpen', value);
    },
    setSelectedTour({ commit }, value) {
      commit('setSelectedTour', value);
    },
    setTourStep({ commit }, value) {
      commit('setTourStep', value);
    },
    nextTourStep({ commit }) {
      commit('nextTourStep');
    },
    previousTourStep({ commit }) {
      commit('previousTourStep');
    },
  },
  getters: {
    tour: (state) => state.tours[state.selectedTour] ?? { name: '', steps: [] },
    currentTourStep: (state, getters) => getters.tour.steps?.[state.tourStep],
  },
});
