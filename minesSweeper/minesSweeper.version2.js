(function($){
	// 创建html标签方法
	function newTag(config) {
		var opt = $.extend({
			tag: 'span',
			css: {},
			class: '',
			html: '',
			data: {}
		}, config);
		var tag = opt.tag;
		var className = opt.class;
		var css = opt.css;
		var content = opt.html;
		var data = opt.data;
		delete(opt.tag);
		delete(opt.class);
		delete(opt.css);
		delete(opt.html);
		delete(opt.data);
		return $('<'+tag+'>').css(css).addClass(className).data(data).prop(opt).html(content);
	};
	// 扫雷
	$.fn.sweeper = function(config){
		var opt = $.extend({
			// 状态栏配置
			statusView: {
				tag: 'p',
				css: {
					height: '30px',
					padding: '10px',
					background: '#333',
					color: '#fff',
					display: 'block',
					'text-align': 'center',
					'line-height': '30px'
				},
				class: {
					statusClass: ''
				}
			},

			// 控制区配置
			ctrl: {
				tag: 'form',
				css: {
					'text-align': 'center'
				}
			},
			selectBtn: {
				tag: 'select',
				css: {
					padding: '5px 10px',
					'font-size': '16px',
					background: '#fff',
					cursor: 'pointer',
					border: '1px solid #999',
					'margin-right': '5px',
					'vertical-align': 'middle'
				},
				id: 'sweeper-select-id',
				class: '',
				name: 'sweeper-level'
			},
			startBtn: {
				type: 'submit',
				tag: 'button',
				css: {
					padding: '5px 10px',
					'font-size': '16px',
					background: '#fff',
					cursor: 'pointer',
					border: '1px solid #999',
					'margin-right': '5px',
					'vertical-align': 'middle',
				},
				id: 'sweeper-start-id',
				html: '游戏开始'
			},
			resetBtn: {
				type: 'reset',
				tag: 'button',
				css: {
					padding: '5px 10px',
					'font-size': '16px',
					background: '#fff',
					cursor: 'pointer',
					border: '1px solid #999',
					'margin-right': '5px',
					'vertical-align': 'middle',
				},
				id: 'sweeper-reset-id',
				html: '游戏重置'
			},

			// 雷区容器
			minesArea: {
				tag: 'div',
				id: 'sweeper-mines-id',
				class: '',
				css: {
					width: '100%',
					display: 'block',
					padding: 0,
					margin: 0,
					'border-top': '1px solid #333'
				}
			},
			minesTable: {
				tag: 'div',
				css: {
					display: 'table',
					margin: '0 auto'
				},
				id: 'sweeper-mines-table'
			},
			minesRow: {
				tag: 'div',
				css: {
					display: 'table-row'
				},
				class: 'sweeper-mines-row'
			},

			// 地雷样式
			mine: {
				tag: 'div',
				css: {
					display: 'block',
					width: '30px',
					height: '30px',
					'line-height': '30px',
					border: '1px solid #fff',
					background: '#707070',
					margin: '-1px 0 0 -1px',
					padding: 0,
					cursor: 'pointer',
					'text-align': 'center',
                                        float: 'left',
				},
				class: 'sweeper-mine'
			},
			mineClearCss: {
				background: '#fff',
				border: '1px solid #999'
			},
			minIdPrefix: 'sweeper-mine-',

			// gameOver 样式
			gameOverTip: {
				css: {
					display: 'inline-bloc',
					padding: '10px',
					position: 'absolute',
					left: '40%',
					top: '50%',
					background: '#000',
					color: 'red',
					'font-size': '30px',
					cursor: 'pointer'
				},
				tag: 'span',
				html: 'GAME OVER!'

			},
			gameWinTip: {
				css: {
					padding: '10px',
					position: 'absolute',
					left: '40%',
					top: '50%',
					background: 'red',
					color: '#fff',
					'font-size': '30px',
					cursor: 'pointer',
					display: 'inline-bloc'

				},
				tag: 'span',
				html: 'WIN!!!'
			},
			/* 缎带,用来标记地雷 */
			ribbon: {
				tag: 'span',
				css: {
					width: 0,
					'height': '16px',
					'border-left': '8px solid blue',
					'border-right':  '8px solid blue',
					'border-bottom': '5px solid transparent'
				}
			},
			bomb: {
				tag: 'span',
				css: {
					height: 0,
					width: 0,
					'border-width': '0 0 16px 16px',
					'border-style': 'dotted',
					'border-color': 'red',
				}
			},
			bombCss: {
				background: 'red'
			}
		}, config);

		var container = $(this);
		// 视图部件
		var ctrl; // 控制面板
		var startBtn; // 开始按钮
		var resetBtn; // 重置按钮
		var selectBtn; // 游戏等级选择框
		var statusView; // 游戏状态区
		var minesArea; // 雷区外部容器
		var mines; // 雷区

		// 模型参数
		/* @property x int 地雷区x轴 */
		/* @property y int 地雷区y轴 */
		/* @property total int 地雷个数 */
		var x,y,total;
		/* @property map array 地图模型 */
		var map;
		/* @property step int */
		var step;
		/* @property level int 游戏等级 1-3*/
		var level;
		/* @property status string 游戏状态 */
		var status = 'init';
		/* @property statusArr array 游戏状态数组,游戏状态对应提示语句 */
		var statusArr = {
			'init': '等待游戏开始',
			'start': '游戏开始',
			'running': '游戏进行中',
			'over': '游戏结束',
			'win': '你赢了!',
			'reset': '游戏重置'
		}; // 游戏状态

		var view = [];

		var game = {
			run: function(){
				// 初始化视图

				// 1. 构建控制面板
				ctrl = newTag(opt.ctrl);
				// 2. 新建等级选择按钮
				selectBtn = newTag(opt.selectBtn);
				for(var i = 1; i <=3 ; i++) {
					$('<option>').val(i).html('等级'+i).appendTo(selectBtn);
				}
				// 3. 新建游戏开始按钮
				startBtn = newTag(opt.startBtn);
				// 4. 新建游戏重置按钮
				resetBtn = newTag(opt.resetBtn);

				// 5. 构建控制面板
				ctrl.append(selectBtn, startBtn, resetBtn);
				ctrl.appendTo(container);

				// 6. 构建游戏状态显示区域
				statusView = newTag(opt.statusView);
				game.setStatus('init');
				statusView.appendTo(container);

				// 7. 构建地雷区
				minesArea = newTag(opt.minesArea);
				minesArea.appendTo(container);

				// 游戏开始
				ctrl.submit(game.start);
				resetBtn.click(game.reset);

			},
			win: function(){
				game.setStatus('win');
				$('.' + opt.mine.class).unbind('mousedown');
				newTag(opt.gameWinTip).appendTo(mines);
				return false;
			},
			setStatus: function(s){
				status = s;
				statusView.html(statusArr[status]);
			},
			setLevel: function(){
				switch (level) {
					case 2:
						y = 16; x = 16; total=40;
						break;
					case 3:
						y = 16; x = 30; total= 99;
						break;
					default :
						y = 9; x = 9; total= 10;
				}
			},
			over: function(pos){
				game.setStatus('over');
				$('.' + opt.mine.class).unbind('mousedown');
				for(k in map) {
					if (view[k].data('rightClick') != 1) {
						if (map[k] < 10) {
							view[k].css(opt.mineClearCss);
							if (map[k] === 9) {
								view[k].html('*');
							} else if(map[k] != 0) {
								view[k].html(map[k]);
							}
						}
					}
				}
				newTag(opt.gameOverTip).appendTo(mines);
			},
			start: function(e){
				e.preventDefault();
				// 1. 设置游戏状态
				game.setStatus('start');
				// 2. 初始化参数
				game.init();
				// 3. 设置游戏等级
				level = parseInt(selectBtn.val());
				game.setLevel();
				// 4. 禁用游戏等级选择
				selectBtn.prop('disabled', true);
				startBtn.prop('disabled', true);

				// 5. 设置雷区
				mines = newTag(opt.minesTable);

				for (var i = 1; i <= y; i++) {
					var row = newTag(opt.minesRow);
					for (var j = 1; j <= x; j++) {
						var n = i*100 + j;
						map[n] = 0;
						// 构建地雷块
						var mineId = opt.minIdPrefix + n;
						var config = $.extend(opt.mine, {id: mineId, data: {id: n}});
						var mine = newTag(config);
						// 绑定鼠标点击事件
						mine.on('mousedown', game.minesClick);
						view[n] = mine;
						mine.appendTo(row);
					}
					row.appendTo(mines);
				}
				mines.appendTo(minesArea);
			},
			reset: function(e){
				e.preventDefault();

				game.setStatus('reset');
				selectBtn.prop('disabled', false);
				startBtn.prop('disabled',false);
				minesArea.html('');
			},
			minesClick: function(e){ // 扫雷
				e.preventDefault();
				// 禁用浏览器菜单
				$(this).contextmenu(function(){
					return false;
				});
				var ele = $(this);
				var pos = ele.data('id');
				// 单击左键
				if (e.button == 0 && ele.data('rightClick') != 1) {
					if (step == 0) {
						game.layMines(pos); // 布雷
					}
					game.sweeping(pos);// 扫雷
				}
				// 右键添加标记
				else if (e.button == 2 && ele.data('rightClick') != 1) {
					ele.data('rightClick', 1);
					var ribbon = newTag(opt.ribbon);
					ele.html(ribbon);
				}
				// 右键消除标记
				else if (e.button == 2 && ele.data('rightClick') == 1) {
					ele.data('rightClick', 0);
					ele.html('');
				}
			},
			init: function(){
				map = [];
				step = 0;
				x = 0;
				y = 0;
				total = 0;
			},
			layMines: function(pos){

				var area = game.getArea(pos, function(tempPos, arr){
					if (typeof(map[tempPos]) != 'undefined') {
						arr.push(tempPos);
					}
				});
				var t = total;
				console.log(area);
				while(t) {
					var tx = Math.ceil(Math.random()*x);
					var ty = Math.ceil(Math.random()*y);
					var tPos = ty*100+tx;
					if (map[tPos] != 9 && $.inArray(tPos, area) < 0) {
						map[tPos] = 9;

						game.getArea(tPos, function(tempPos, arr){
							if (typeof(map[tempPos]) != 'undefined' && map[tempPos] != 9) {
								map[tempPos]++;
							}
						});
						t--;
					}
				}
			},
			sweeping: function(pos){
				if (map[pos] == 9) {
					game.over();
					view[pos].css(opt.bombCss);
				}
				var queue = [];

				queue.push(pos);
				while (queue.length) {
					var p =  queue.pop();
					ele = view[p];
					if (ele.data('rightClick') != 1) {
						if (map[p] === 0) {
							map[p] += 10;
							view[p].unbind('mousedown');
							ele.css(opt.mineClearCss).html('');
							game.getArea(p, function(tempPos, arr){
								if (typeof(map[tempPos]) != 'undefined' && map[tempPos] <= 6) {
									queue.push(tempPos);
								}
							});
							step++;
						} else if (map[p] <= 6) {
							ele.css(opt.mineClearCss).html(map[p]);
							map[p] += 10;
							view[p].unbind('mousedown');
							step++;
						}
					}
				}
				if (step >= (x*y-total)) {
					game.win();
				}
				console.log('step', step);
			},
			getArea: function(pos, callback){
				var px = pos%100;
				var py = Math.floor(pos/100);
				var res = new Array();
				for (var m = py-1; m <= py + 1; m++){
					for (var n = px-1; n <= px + 1; n++) {
						var tempPos = m*100+n;

						callback(tempPos, res);
					}
				}
				return res;
			}
		};
		game.run();
	}
})(jQuery);
