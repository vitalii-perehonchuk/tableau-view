import axios from 'axios';
import find from 'lodash/find';
import get from 'lodash/get';
import split from 'lodash/split';
import { Vue } from 'vue-property-decorator';

const proxyingServer =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8090';

export default {
  actions: {
    async fetchWorkbook({ commit, state }, workbookId) {
      commit('setLoading', true);
      try {
        const response = await axios.get(
          `${proxyingServer}/api/3.8/sites/${state.siteId}/workbooks/${workbookId}?fields=_all_`,
          { headers: { 'X-Tableau-Auth': state.token } },
        );
        const responseData = response.data;
        commit('setWorkbookData', responseData.workbook);
      } catch (error) {
        console.error(error);
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },

    async fetchWorkbookPreviewImage({ commit, state }, workbookId) {
      commit('setLoading', true);
      try {
        const response = await axios.get(
          `${proxyingServer}/api/3.8/sites/${state.siteId}/workbooks/${workbookId}/previewImage`,
          {
            headers: { 'X-Tableau-Auth': state.token },
            responseType: 'arraybuffer',
          },
        );
        const imageBase64 = Buffer.from(response.data, 'binary').toString(
          'base64',
        );
        commit('setWorkbookPreviewImage', {
          workbookId: workbookId,
          image: imageBase64,
        });
      } catch (error) {
        console.error(error);
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async fetchWorkbooks({ commit, state }) {
      commit('setLoading', true);
      try {
        const response = await axios.get(
          `${proxyingServer}/api/3.8/sites/${state.siteId}/workbooks?fields=_all_`,
          { headers: { 'X-Tableau-Auth': state.token } },
        );
        const responseData = response.data;
        const workbooks = responseData.workbooks.workbook;
        commit('setWorkbooks', workbooks);
        commit('setActiveItem', get(workbooks, '[0].id'));
      } catch (error) {
        console.error(error);
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
        console.error(error);
        commit('setError', error);
      } finally {
        commit('setLoading', false);
      }
    },
  },
  getters: {
    activeItem(state) {
      if (!state.activeItemId) {
        return undefined;
      }
      return find(state.workbooks, ['id', state.activeItemId]);
    },
  },
  mutations: {
    saveCredentials(state, { host, siteId, siteName, token }) {
      state.host = host;
      state.siteId = siteId;
      state.siteName = siteName;
      state.token = token;
    },
    setActiveItem(state, itemId) {
      Vue.set(state, 'activeItemId', itemId);
    },
    setError(state, error) {
      Vue.set(state, 'error', error);
    },
    setLoading(state, value) {
      Vue.set(state, 'isLoading', value);
    },
    setUserData(state, user) {
      Vue.set(state.usersData, user.id, user);
    },
    setWorkbookData(state, workbook) {
      Vue.set(state.workbooksData, workbook.id, workbook);
    },
    setWorkbookPreviewImage(state, { image, workbookId }) {
      Vue.set(state.workbooksPreviewImages, workbookId, image);
    },
    setWorkbooks(state, workbooks) {
      Vue.set(state, 'workbooks', workbooks);
    },
  },
  namespaced: true,
  state: () => ({
    activeItemId: undefined,
    error: undefined,
    host: undefined,
    isLoading: false,
    siteId: undefined,
    siteName: undefined,
    token: undefined,
    usersData: {},
    workbooks: [],
    workbooksData: {},
    workbooksPreviewImages: {},
  }),
};
