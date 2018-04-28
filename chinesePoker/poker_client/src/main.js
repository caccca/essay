import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import "./assets/scss/app.scss";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		activeCards: [],
	},
	mutations: {
		add (state, num) {
			if (state.activeCards.indexOf(num) === -1) {
				state.activeCards.push(num);
			}
		},
		remove (state, num) {
			var index = state.activeCards.indexOf(num);
			if (index !== -1) {
				state.splice(index, 1);
			}
		},
		clear (state) {
			state.activeCards = [];
		},
		
	},
	getters: {
		activeCards (state) {
			return state.activeCards;
		},
		has (state, num) {
			return state.activeCards.indexOf(num) !== -1;
		}
	}
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
