<template>
  <div id="app">
    <div id="desktop">
      {{ $store.getters.activeCards }}
      <div id="me">
        <div class="inner">
          <div class="user">
            <img src="./assets/avatar.jpg" alt="" class="avatar">
            <div class="info">
              <div class="name">hehe</div>
            </div>
          </div>
          <div class="cards">
            <card :num="item" :clickable="true" v-for="item in cards" @add="add" @remove="remove"></card>
          </div>
          <div class="operations">
            <button class="btn pass" @click="pass">不要</button>
            <button class="btn play" @click="play">出牌</button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
  import Card from './components/Card.vue';


  export default {
    components: { Card },
    data () {
      return {
        cards: [],
        activeCards: [],
      }
    },
    mounted () {
      for (var i = 0; i < 17; i++) {
        this.cards.push(i * 3 + 1);
      }
    },
    methods: {
      pass () {
        this.$store.clear();
      },
      play () {

      }
    }
  }
</script>