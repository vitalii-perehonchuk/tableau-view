import axios from 'axios';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import every from 'lodash/every';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import keys from 'lodash/keys';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import pickBy from 'lodash/pickBy';
import split from 'lodash/split';
import startsWith from 'lodash/startsWith';
import uniq from 'lodash/uniq';
import { Vue } from 'vue-property-decorator';

const proxyingServer =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8090';

const FILTER_CHECKERS = {
  createdAt(workbook, value) {
    if (isNil(value)) {
      return true;
    }
    return startsWith(workbook.createdAt, value);
  },
  'owner.fullName': function (workbook, value) {
    if (isNil(value)) {
      return true;
    }
    return get(workbook, 'owner.fullName') === value;
  },
};

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
          url: credentials.url,
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
    createdOptions(state) {
      return uniq(
        map(state.workbooks, (workbook) =>
          format(parseISO(workbook.createdAt), 'yyyy-MM-dd'),
        ),
      );
    },
    owners(state) {
      return uniq(map(state.workbooks, 'owner.fullName'));
    },
    workbooks(state) {
      const filteredWorkbooks = filter(state.workbooks, (workbook) =>
        every(state.activeFilters, (value, criterion) =>
          FILTER_CHECKERS[criterion](workbook, value),
        ),
      );
      const activeSorts = pickBy(state.sortCriteria);
      const activeSortCriteria = keys(activeSorts);
      return orderBy(
        filteredWorkbooks,
        activeSortCriteria,
        map(
          activeSortCriteria,
          (activeSortCriterion) => activeSorts[activeSortCriterion],
        ),
      );
    },
  },
  mutations: {
    saveCredentials(state, { host, siteId, siteName, token, url }) {
      state.host = host;
      state.siteId = siteId;
      state.siteName = siteName;
      state.token = token;
      state.url = url;
    },
    setActiveItem(state, itemId) {
      Vue.set(state, 'activeItemId', itemId);
    },
    setError(state, error) {
      Vue.set(state, 'error', error);
    },
    setFilter(state, { criterion, value }) {
      Vue.set(state.activeFilters, criterion, value);
    },
    setFilterOpen(state, { criterion, value }) {
      Vue.set(state.openFilters, criterion, value);
    },
    setInFocusedMode(state, value) {
      Vue.set(state, 'isInFocusedMode', value);
    },
    setLoading(state, value) {
      Vue.set(state, 'isLoading', value);
    },
    setSortCriterion(state, { sortCriterion, direction }) {
      Vue.set(state.sortCriteria, sortCriterion, direction);
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
    activeFilters: {},
    activeItemId: undefined,
    error: undefined,
    host: undefined,
    isInFocusedMode: false,
    isLoading: false,
    openFilters: {},
    siteId: undefined,
    siteName: undefined,
    sortCriteria: {},
    token: undefined,
    url: undefined,
    usersData: {},
    workbooks: [],
    workbooksData: {},
    workbooksPreviewImages: {},
  }),
};
