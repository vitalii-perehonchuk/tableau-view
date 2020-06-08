import { Vue } from 'vue-property-decorator';
import store from './store';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
