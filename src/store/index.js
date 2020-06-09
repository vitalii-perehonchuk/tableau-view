import { Vue } from 'vue-property-decorator';
import Vuex, { Store } from 'vuex';
import tableau from './tableau';

Vue.use(Vuex);

export default new Store({
  getters: {
    error(state) {
      return state.tableau.error;
    },
    isLoading(state) {
      return state.tableau.isLoading;
    },
  },
  modules: { tableau },
  mutations: {
    setError(state, error) {
      Vue.set(state, 'error', error);
    },
    setLoading(state, value) {
      Vue.set(state, 'isLoading', value);
    },
  },
  strict: process.env.NODE_ENV !== 'production',
});
