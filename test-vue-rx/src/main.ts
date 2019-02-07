import Vue from 'vue';
import VueRx from 'vue-rx';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(VueRx);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
