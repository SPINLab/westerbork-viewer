import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const directusRoomNames = {
  outside: 'Buiten',
  hallway: '1_Entrance/hallway',
  diningRoom: '2_Dining room',
  livingRoom: '3_Living room',
  sittingRoom: '4_sitting room',
  conservatory: '5_conservatory',
  kitchen: '6_Kitchen',
  basement: '7_Basement',
  gardenShed: '8_Garden shed',
  bedroomGemmeker: '9_Bedroom Gemmeker',
  bedroomObreen: '10_Bedroom Speck Obreen',
  guestroom1: '11_Guestroom1',
  guestroom2: '12_Guestroom2',
  bedroomHassel: '13_Bedroom Elisabeth Hassel',
  bathroom: '14_Bathroom',
  attic: '15_Attic',
};

function parseContent(source, language) {
  if (!source) {
    return '';
  }

  if (language === 'dutch') {
    const dutchSource = source.content.data.find(
      (sourceContentData) => sourceContentData.language_code === '2',
    );
    if (dutchSource) {
      return dutchSource.description;
    }
  }

  const englishSource = source.content.data.find(
    (sourceContentData) => sourceContentData.language_code === '1',
  );
  if (englishSource) {
    return englishSource.description;
  }

  return '';
}

function parseMedia(source) {
  if (!source) return '';

  let html = '';
  if (source.file !== null) {
    if (source.file.data.type === 'video/mp4') {
      html += `
        <video controls>
        <source src="https://data.campscapes.org/${source.file.data.url}" type="video/mp4">
        Your browser does not support the video tag.
        </video>
      `;
    } else if (
      source.file.data.type === 'image/jpeg' ||
      source.file.data.type === 'image/png'
    ) {
      html += `
        <img src="https://data.campscapes.org/${source.file.data.url}" alt="${source.file.data.title}" >
      `;
    } else {
      console.warn(`File type: '${source.file.data.type}' not recognized.`);
    }
  }
  return html;
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    onPremiseMode: process.env.VUE_APP_MODE === 'onpremise',
    step: 0,
    selectedNarrative: null,
    narratives: [],
    narrativesData: null,
    room: '',
    layer: 'house',
    waypoint: '',
    sources: {
      house: {
        media: '',
        content: '',
      },
      camp: {
        media: '',
        content: '',
      },
      memory: {
        media: '',
        content: '',
      },
    },
    graphics: 'medium',
    numPoints: process.env.VUE_APP_MODE ? 7000000 : 5000000,
  },
  mutations: {
    nextStep(state) {
      state.step += 1;
    },
    setStep(state, value) {
      state.step = value;
    },
    setNarrative(state, value) {
      state.selectedNarrative = value;
    },
    setNarratives(state, value) {
      state.narratives = value;
    },
    setNarrativesData(state, value) {
      state.narrativesData = value;
    },
    setRoom(state, value) {
      state.room = value;
    },
    setLayer(state, value) {
      state.layer = value;
    },
    setWaypoint(state, value) {
      state.waypoint = value;
    },
    setHouseMedia(state, value) {
      state.sources.house.media = value;
    },
    setHouseContent(state, value) {
      state.sources.house.content = value;
    },
    setCampMedia(state, value) {
      state.sources.camp.media = value;
    },
    setCampContent(state, value) {
      state.sources.camp.content = value;
    },
    setMemoryMedia(state, value) {
      state.sources.memory.media = value;
    },
    setMemoryContent(state, value) {
      state.sources.memory.content = value;
    },
    setGraphics(state, value) {
      state.graphics = value;
    },
    setNumPoints(state, value) {
      state.numPoints = value;
    },
  },
  actions: {
    nextStep({ commit }) {
      commit('nextStep');
    },
    setStep({ commit }, value) {
      commit('setStep', value);
    },
    setNarrative({ commit }, value) {
      commit('setNarrative', value);
    },
    async setNarratives({ commit, state, getters, dispatch }, locale) {
      if (!state.narrativesData) {
        await dispatch('getNarratives');
      }
      const narratives = state.narrativesData.map((v) => {
        if (locale === 'nl') {
          return {
            id: v.sort_number,
            title: v.heading_dutch,
            question: v.question_dutch,
            description: v.summary_dutch,
          };
        }
        return {
          id: v.sort_number,
          title: v.heading_english,
          question: v.question_english,
          description: v.summary_english,
        };
      });
      commit('setNarratives', narratives);

      if (getters.narrative?.id) {
        const narrative = state.narratives.find(
          (n) => n.id === getters.narrative.id,
        );
        dispatch('setNarrative', narrative.id || null);
      }
    },
    setRoom({ commit }, value) {
      commit('setRoom', value);
    },
    setLayer({ commit }, value) {
      commit('setLayer', value);
    },
    setWaypoint({ commit }, value) {
      commit('setWaypoint', value);
    },
    setGraphics({ commit }, value) {
      commit('setGraphics', value);
    },
    setNumPoints({ commit }, value) {
      commit('setNumPoints', value);
    },
    async getNarratives({ commit }) {
      const response = await fetch(
        'https://data.campscapes.org/api/1.1/tables/wch_intro_texts_narratives/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5',
      );
      const json = await response.json();
      let { data } = json;
      data = data.filter((v) => v.sort_number !== null);
      data = data.sort((a, b) => a.sort_number - b.sort_number);
      commit('setNarrativesData', data);
    },
    async updateSourceData({ commit, state, getters }, language) {
      if (state.room && getters.narrative) {
        const directusRoomName = directusRoomNames[state.room];
        const response = await fetch(
          `https://data.campscapes.org/api/1.1/tables/source/rows?access_token=kA5o4zmgEZM7mE7jgAATkFUEylN4Rnm5&filters[room.name][eq]=${encodeURIComponent(
            directusRoomName,
          )}&filters[narratives.heading_${language}][eq]=${
            getters.narrative.title
          }`,
        );
        const json = await response.json();

        const sourceData = {
          house: [],
          camp: [],
          memory: [],
        };

        json.data.forEach((source) => {
          if (['house', 'camp', 'memory'].includes(source.layer)) {
            sourceData[source.layer].push(source);
          } else {
            console.warn(`Source layer name: '${source.layer}' is not valid.`);
          }
        });

        commit('setHouseContent', parseContent(sourceData.house[0], language));
        commit('setCampContent', parseContent(sourceData.camp[0], language));
        commit(
          'setMemoryContent',
          parseContent(sourceData.memory[0], language),
        );

        commit('setHouseMedia', parseMedia(sourceData.house[0]));
        commit('setCampMedia', parseMedia(sourceData.camp[0]));
        commit('setMemoryMedia', parseMedia(sourceData.memory[0]));
      }
    },
  },
  getters: {
    narrative: (state) =>
      state.narratives.find(
        (narrative) => narrative.id === state.selectedNarrative,
      ),
    source: (state) => state.sources[state.layer],
    content: (_, getters) => getters.source?.content,
    media: (_, getters) => getters.source?.media,
    houseMedia: (state) => state.sources.house.media,
    houseContent: (state) => state.sources.house.content,
    campMedia: (state) => state.sources.camp.media,
    campContent: (state) => state.sources.camp.content,
    memoryMedia: (state) => state.sources.memory.media,
    memoryContent: (state) => state.sources.memory.content,
  },
});
