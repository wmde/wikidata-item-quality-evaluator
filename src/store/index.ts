import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    results: [],
    loading: false,
    error: false
  },
  mutations: {
    updateResults(state, payload) {
      state.results = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    }
  },
  getters: {
    totalAverageScore(state) {
      const total = state.results
        .filter((res: any) => !res.missing)
        .reduce((acc, result: any) => (acc += result.score), 0);
      const average =
        total / state.results.filter((res: any) => !res.missing).length;
      return average || 0;
    },
    missingResults(state) {
      return state.results.filter((res: any) => res.missing);
    },
    validResults(state) {
      return state.results.filter((res: any) => !res.missing);
    }
  },
  actions: {},
  modules: {}
});
