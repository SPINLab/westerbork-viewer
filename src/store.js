import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const TOUR_IDS = [3, 4];

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    onPremiseMode: process.env.VUE_APP_MODE === 'onpremise',
    touchDevice: matchMedia('(hover: none)').matches,
    chapters: [],
    places: [],
    waypointLabels: [],
    hotspots: [],
    tourId: null,
    chapterIndex: null,
    placeId: null,
    waypointId: null,
    media: null,
    tourOpen: true,
    mediaOpen: true,
    welcomeModalOpen: false,
    introductionOpen: true,
    navigationOnboardingOpen: false,
    renderPointCloud: false,
    graphics: 'medium',
    numPoints: process.env.VUE_APP_MODE ? 200000 : 200000,
  },
  mutations: {
    setChapters(state, value) {
      state.chapters = value;
    },
    setPlaces(state, value) {
      state.places = value;
    },
    setWaypointLabels(state, value) {
      state.waypointLabels = value;
    },
    setHotspots(state, value) {
      state.hotspots = value;
    },
    setWaypointId(state, value) {
      state.waypointId = value;
    },
    setTourId(state, value) {
      state.tourId = value;
    },
    setPlaceId(state, value) {
      state.placeId = value;
    },
    setChapterIndex(state, value) {
      state.chapterIndex = value;
    },
    nextChapter(state) {
      state.chapterIndex += 1;
    },
    previousChapter(state) {
      state.chapterIndex -= 1;
    },
    setMedia(state, value) {
      state.media = value;
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
    setRenderPointCloud(state, value) {
      state.renderPointCloud = value;
    },
    setGraphics(state, value) {
      state.graphics = value;
    },
    setNumPoints(state, value) {
      state.numPoints = value;
    },
  },
  actions: {
    async getChapters({ commit }) {
      const response = await fetch(
        'https://data.campscapes.org/api/1.1/tables/wch2_chapters/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5',
      );
      const json = await response.json();
      const chapters = json.data.filter((chapter) =>
        TOUR_IDS.includes(chapter.tour.data.id),
      );
      commit('setChapters', chapters);
    },
    async getPlaces({ commit }) {
      const response = await fetch(
        'https://data.campscapes.org/api/1.1/tables/wch2_places/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5',
      );
      const json = await response.json();
      commit('setPlaces', json.data);
    },
    async getWaypointLabels({ commit }) {
      const response = await fetch(
        'https://data.campscapes.org/api/1.1/tables/wch2_labels/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5',
      );
      const json = await response.json();
      const waypointLabels = json.data.reduce((acc, label) => {
        if (typeof acc[label.waypoint.data.id] === 'undefined') {
          acc[label.waypoint.data.id] = [label];
        } else {
          acc[label.waypoint.data.id].push(label);
        }
        return acc;
      }, {});
      commit('setWaypointLabels', waypointLabels);
    },
    async getHotspots({ commit }) {
      const response = await fetch(
        'https://data.campscapes.org/api/1.1/tables/wch2_hotspots/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5',
      );
      const json = await response.json();
      commit('setHotspots', json.data);
    },
    async getMedia({ commit }, id) {
      const response = await fetch(
        `https://data.campscapes.org/api/1.1/files/${id}?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5`,
      );
      const json = await response.json();
      commit('setMedia', json.data);
    },
    setPlaceId({ commit }, value) {
      commit('setPlaceId', value);
    },
    setWaypointId({ commit }, value) {
      commit('setWaypointId', value);
    },
    setTourId({ commit }, value) {
      commit('setTourId', value);
    },
    setChapterIndex({ commit, getters }, value) {
      commit('setChapterIndex', value);
      const waypointId = getters.chapter.waypoint.data.id;
      commit('setWaypointId', waypointId);
    },
    nextChapter({ commit, state, getters }) {
      if (state.chapterIndex < getters.tourChapters.length - 1) {
        commit('nextChapter');
        const waypointId = getters.chapter.waypoint.data.id;
        commit('setWaypointId', waypointId);
      }
    },
    previousChapter({ commit, state, getters }) {
      if (state.chapterIndex >= 1) {
        commit('previousChapter');
        const waypointId = getters.chapter.waypoint.data.id;
        commit('setWaypointId', waypointId);
      }
    },
    setMedia({ commit }, value) {
      commit('setMedia', value);
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
    setRenderPointCloud({ commit }, value) {
      commit('setRenderPointCloud', value);
    },
    setGraphics({ commit }, value) {
      commit('setGraphics', value);
    },
    setNumPoints({ commit }, value) {
      commit('setNumPoints', value);
    },
  },
  getters: {
    tours: (state) =>
      TOUR_IDS.map(
        (id) =>
          state.chapters.find((chapter) => chapter.tour.data.id === id)?.tour
            .data,
      ).filter(Boolean),
    waypoints: (state) =>
      state.chapters.map((chapter) => chapter.waypoint.data),
    tour: (state, getters) =>
      getters.tours.find((tour) => tour.id === state.tourId) ?? {
        name_en: '',
        name_nl: '',
        summary_en: '',
        summary_nl: '',
      },
    tourChapters: (state) =>
      state.chapters.filter((chapter) => chapter.tour.data.id === state.tourId),
    chapterWaypoints: (_, getters) =>
      getters.tourChapters.map((chapter) => chapter.waypoint),
    chapter: (state, getters) => getters.tourChapters[state.chapterIndex],
    waypoint: (state, getters) =>
      getters.waypoints.find((waypoint) => waypoint.id === state.waypointId),
    chapterAtWaypoint: (state, getters) =>
      getters.tourChapters.find(
        (chapter) => chapter.waypoint.data.id === state.waypointId,
      ),
    place: (state) => state.places.find((place) => place.id === state.placeId),
    placeHotspots: (state) =>
      state.hotspots.filter((hotspot) => hotspot.place.id === state.placeId),
    mediaIsImage: (state) => state.media?.type.startsWith('image'),
    mediaIsVideo: (state) => state.media?.type.startsWith('video'),
    mediaDataUrl: (state) =>
      state.media?.url ? `https://data.campscapes.org/${state.media.url}` : '',
    mediaTitle: (state) => state.media?.title || '',
  },
});
