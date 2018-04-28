import Vue from 'vue'
import Vuex from 'vuex'
import {LOGIN, CALL_LAND_LORD, CONNECT, PLAY, DEAL} from './mutation-types'
import error_types from './error-types'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        players: [

        ],
        // 游戏
        game: {
            id: null,
            state: 0
        },
        // 出牌次序
        index: null,
        // 我 选中的牌组
        activeCards: [],
        // 上一轮打出的牌组
        playedCards: [],
        // 我的牌
        myCards: [],
        // 上一轮出牌的玩家, 对应index
        previousPlayer: null,

    },
    getters: {
        activeCards (s) {
            return s.activeCards
        }
    },
    mutations: {
        clearActiveCards (s) {
            s.activeCards = []
        },
        toggleActiveCard (s, n) {
            let index = s.activeCards.indexOf(n);
            if (index !== -1) {
                s.activeCards.splice(index, 1);
            } else {
                s.activeCards.push(n)
            }
        }
    },

})