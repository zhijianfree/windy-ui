import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    caseContext: {},
    spaceId: '',
    iterationId: '',
    intervalIds: [],
  },
  mutations: {
    UPDATE_CASE_CONTEXT(state, item) {
      if (!state.caseContext || Object.keys(state.caseContext).length === 0) {
        state.caseContext = {}
      }
      state.caseContext[item.key] = item.value
    },
    UPDATE_SPACE(state, item) {
      state.spaceId = item
    },
    UPDATE_ITERATION(state, item) {
      state.iterationId = item
    },
  },
  actions: {},
  modules: {},
})
