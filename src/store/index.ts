import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    results: [],
    missingItems: [],
    unprocessedItems: [],
    userHasQueried: false,
    loading: false,
    error: false
  },
  mutations: {
    updateResults(state, payload) {
      state.results = payload.results;
      state.unprocessedItems = payload.unprocessedItems;
      state.missingItems = payload.missingItems;
      state.userHasQueried = true;
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
    }
  },
  actions: {},
  modules: {}
});
