import { createStore } from 'vuex';

export default createStore({
  state: {
    userId: '',
    userAuth: []
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getUserAuth(state) {
      return state.userAuth;
    }
  },
  mutations: {
    setUserId(state, arg) {
      state.userId = arg;
    },
    setUserAuth(state, arg) {
      state.userAuth = arg;
    }
  },
  actions: {},
  modules: {}
});
