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
			clickable: {
				type: Boolean,
				default: false,
			},
		},
		data () {
			return {
				active: false,
			}
		},
		methods: {
			handleClick () {
				if (this.$store.has(this.num)) {
					this.active = false;
					this.addCard(this.num);
				} else {
					this.active = true;
					this.removeCard(this.num);
				}
			}
		},
		computed: {
			pattern () {
				return this.num % 4;
			},
			figure () {
				return Math.floor(this.num / 4) + 1;
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
			...mapGetters({
				hasCard: 'has',
				activeCards: 'activeCards'
			}),
			...mapMutations({
				removeCard: 'remove',
				addCard: 'add',
			})
		},
		render (createElement) {
			var children = this.text === null ? '' : [createElement('div', {class: 'figure'}, this.text)];
			var props = {
				class: {
					card: true,
					spade: this.pattern === 0,
					heart: this.pattern === 1,
					club: this.pattern === 2,
					diamond: this.pattern === 3,
					joker: this.figure === 14,
					active: this.active,
				}
			};
			if (this.clickable) {
				props.on = {
					click: this.handleClick,
				}
			}

			console.log(this.$store.mutations);
			return createElement('div', props, children);
		}
	}
</script>