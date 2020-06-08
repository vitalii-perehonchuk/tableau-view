import axios from 'axios';
import split from 'lodash/split';
import { Vue } from 'vue-property-decorator';

const proxyingServer =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8090';

export default {
  actions: {
    async fetchWorkbooks({ commit, state }) {
      commit('setLoading', true);
      try {
        const response = await axios.get(
          `${proxyingServer}/api/3.8/sites/${state.siteId}/workbooks`,
          { headers: { 'X-Tableau-Auth': state.token } },
        );
        const responseData = response.data;
        console.info(responseData);
        commit('setWorkbooks', responseData.workbooks.workbook);
      } catch (error) {
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async signIn({ commit }, credentials) {
      commit('setLoading', true);
      try {
        const urlObject = new URL(credentials.url);
        const siteName = split(urlObject.hash, '/')[2];
        const response = await axios.post(
          `${proxyingServer}/api/3.8/auth/signin`,
          {
            credentials: {
              name: credentials.user,
              password: credentials.password,
              site: {
                contentUrl: siteName,
              },
            },
          },
        );
        const responseData = response.data;
        if (responseData.error) {
          console.error(responseData.error);
          throw new Error(responseData.error.detail);
        }
        commit('saveCredentials', {
          host: urlObject.hostname,
          siteId: responseData.credentials.site.id,
          siteName: siteName,
          token: responseData.credentials.token,
        });
      } catch (error) {
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
  },
  mutations: {
    saveCredentials(state, { host, siteId, siteName, token }) {
      state.host = host;
      state.siteId = siteId;
      state.siteName = siteName;
      state.token = token;
    },
    setError(state, error) {
      Vue.set(state, 'error', error);
    },
    setLoading(state, value) {
      Vue.set(state, 'isLoading', value);
    },
    setWorkbooks(state, workbooks) {
      Vue.set(state, 'workbooks', workbooks);
    },
  },
  namespaced: true,
  state: () => ({
    error: undefined,
    host: undefined,
    isLoading: false,
    siteId: undefined,
    siteName: undefined,
    token: undefined,
    workbooks: [],
  }),
};
