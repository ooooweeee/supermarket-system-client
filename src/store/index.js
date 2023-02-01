import { createStore } from 'vuex';

export default createStore({
  state: {
    userId: ''
  },
  getters: {
    getUserId(state) {
      return state.userId;
    }
  },
  mutations: {
    setUserId(state, arg) {
      state.userId = arg;
    }
  },
  actions: {},
  modules: {}
});
