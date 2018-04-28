<template>
    <div class="card"
         :class="classObj"
         @click="handleClick"
         @mouseenter.shift="handleClick">
        <div class="figure" v-if="this.figure !== 14">{{ text }}</div>
    </div>
</template>
<script>
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		name: 'card',
		props: {
			num: {
				type: Number,
				validator (val) {
					return val >= 0 && val < 54 && (val | 0) === val;
				}
			},
			clickAble: {
				type: Boolean,
				default: false,
			},
		},
		methods: {
			handleClick () {
				if (this.clickAble) {
				    this.toggleActive(this.num)
                }
			},
            ...mapMutations({
                toggleActive: 'toggleActiveCard'
            })
		},
		computed: {
			pattern () {
				return this.num % 4;
			},
            active () {
			    return this.activeCards && this.activeCards.indexOf(this.num) !== -1;
            },
			figure () {
				return Math.floor(this.num / 4) + 1;
			},
            classObj () {
			    return {
                    spade: this.pattern === 0,
                    heart: this.pattern === 1,
                    club: this.pattern === 2,
                    diamond: this.pattern === 3,
                    joker: this.figure === 14,
                    active: this.active,
                }
            },
			text () {
				var str = null;
				switch (this.figure) {
					case 1:
						str = 'A';
						break;
					case 11:
						str = 'J';
						break;
					case 12:
						str = 'Q';
						break;
					case 13:
						str = 'K';
						break;
					case 14:
						str = null;
						break;
					default:
						str = this.figure;
				}
				return str;
			},
			...mapGetters(['activeCards']),

		},

	}
</script>