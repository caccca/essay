import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import "./assets/scss/app.scss";
import store from './store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
