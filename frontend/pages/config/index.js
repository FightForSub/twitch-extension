// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/App.vue'
import axios from 'axios'

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

/* eslint-disable no-new */
var vue = new Vue({
  el: '#app',
  render: h => h(App)
});

