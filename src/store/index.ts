import { Result } from "@/ArticleQualityService.types";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface StoreState {
  results: Array<Result>;
  missingItems: Array<string>;
  unprocessedItems: Array<string>;
  userHasQueried: boolean;
  loading: boolean;
}

export default new Vuex.Store<StoreState>({
  state: {
    results: [],
    missingItems: [],
    unprocessedItems: [],
    userHasQueried: false,
    loading: false
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
    }
  },
  getters: {
    totalAverageScore(state) {
      const total = state.results
        .filter(res => !res.missing)
        .reduce((acc, result) => (acc += result.score), 0);
      const average = total / state.results.filter(res => !res.missing).length;
      return average || 0;
    }
  },
  actions: {},
  modules: {}
});
