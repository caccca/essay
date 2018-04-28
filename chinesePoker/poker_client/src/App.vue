<template>
    <div id="app">
        <div id="desktop">
            <div id="me">
                <div class="inner">
                    <div class="user">
                        <img src="./assets/avatar.jpg" alt="" class="avatar">
                        <div class="info">
                            <div class="name">hehe</div>
                        </div>
                    </div>
                    <div class="cards">
                        <card :num="item" :clickAble="true" v-for="item in cards"></card>
                    </div>
                    <div class="operations">
                        <button class="btn pass" @click="pass">不要</button>
                        <button class="btn play" @click="play">出牌</button>
                        <button class="btn sort" @click="sort">排序</button>
                    </div>
                    <div class="played-cards">
                        <card :num="item" v-for="item in playedCards"></card>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Card from './components/Card.vue';
    import config from './config/index'


    export default {
        components: {Card},
        data () {
            return {
                websocket: null,
                state: 0,
            }
        },
        created () {
            this.init();
        },
        methods: {
            pass () {
                this.$store.commit('clearActiveCards');
            },
            play () {

            },
            sort () {
                // 大小排序
                //
            },
            init () {
                const ws = new WebSocket(config.url);
                ws.onopen = function (ev) {

                };
                ws.onmessage = function (ev) {


                };
                ws.onclose = function (ev) {

                };
                ws.onerror = function (ev) {

                }
            }
        }
    }
</script>