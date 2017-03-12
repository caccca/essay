(function($, window, document){
	

	// 创建标签方法
	function newTag(config)
	{
		var opt = $.extend({
			class: '',
			id: '',
			tag: 'span',
			type: '',
			html: '',
			css: {},
		}, config);
		var tag = '<'+opt.tag+'>';
		var className = opt.class;
		var css = opt.css;
		var html = opt.html;
		delete(opt.html);
		delete(opt.css);
		delete(opt.class);
		delete(opt.tag);
		return $(tag).addClass(className).css(css).prop(opt).html(html);
	}


	$.fn.sweeper = function (config) {
		var opt = $.extend({
			// 公用样式

			// 状态栏样式
			statusCss: {
				height: '30px',
				padding: '10px',
				background: '#333',
				color: '#fff',
				display: 'bloack',
				'text-align': 'center',
				'line-height': '30px'
			}, 
			statusClass: '',

			// 控制区样式
			gameLevelName: 'sweeper-level',
			resetBtnId: 'sweeper-reset-id',
			selectBtnId: 'sweeper-select-id',
			startBtnId: 'sweeper-game-start',
			buttonCss: {
				padding: '5px 10px',
				'font-size': '16px',
				background: '#fff',
				cursor: 'pointer',
				border: '1px solid #999',
				'margin-right': '5px',
				'vertical-align': 'middle',
			},
			btnClass: '',

			// 雷区样式
			minesAreaId: 'sweeper-mines-id',
			minesAreaClass: '',
			minesAreaCss: {
				width: '100%',
				display: 'block',
				padding: 0,
				margin: 0,
				border: '1px solid #333',
			}, 

			// 地雷样式
			mineCss: {
				display: 'table-cell',
				width: '30px',
				height: '30px',
				border: '1px solid #fff',
				background: '#707070',
				margin: '-1px 0 0 -1px',
				padding: 0,
				cursor: 'pointer',
				'text-align': 'center',
			},
			mineClearCss: {
				background: '#fff',
				border: '1px solid #999',
			},
			mineClass: 'sweeper-mine',
			minIdPrefix: 'sweeper-mine-',

			// gameover 样式
			gameOverTipCss: {
				padding: '10px',
				position: 'absolute',
				left: '40%',
				top: '50%',
				background: '#000',
				color: 'red',
				'font-size': '30px',
				cursor: 'pointer'
			},
			gamewinTipCss: {
				padding: '10px',
				position: 'absolute',
				left: '40%',
				top: '50%',
				background: 'red',
				color: '#fff',
				'font-size': '30px',
				cursor: 'pointer'
			}
		}, config);

		// 视图部件
		var container = this;
		var ctrl; // 控制面板
		var selectBtn; // 等级选择按钮
		var startBtn; // 游戏开始按钮
		var resetBtn; // 游戏重置按钮 
		var minesArea; // 雷区
		var status; // 游戏状态显示区域

		// 模型参数
		var map; // 地图
		var level; // 游戏等级
		var y;  // 雷区高
		var x;  // 雷区宽
		var total; // 地雷数量
		var step; // 

		// 游戏参数
		var gameStatus = {
			'init': '等待游戏开始',
			'start': '游戏开始',
			'running': '游戏进行中',
			'over': '游戏结束',
			'win': '你赢了!',
			'reset': '游戏重置'
		}; // 游戏状态

		var view = {
			// 视图初始化
			init: function(){
				// 1. 创建控制面板
				ctrl = $('<form>');
				// 2. 新建等级选择按钮
				selectBtn = $('<select>').css(opt.buttonCss).prop({'id': opt.selectBtnId, 'name': opt.gameLevelName});
				for(var i = 1; i <=3 ; i++) {
					$('<option>').val(i).html('等级'+i).appendTo(selectBtn);
				}
				// 3. 新建游戏开始按钮
				startBtn = newTag({id: opt.startBtnId, tag: 'button', type: 'submit', html: '游戏开始', css: opt.buttonCss, class: opt.btnClass});
				// 4. 新建游戏重置按钮
				resetBtn = newTag({id: opt.gameResetId, tag: 'button', type: 'reset', html: '重新开始', css: opt.buttonCss, class: opt.btnClass});

				// 5. 构建控制面板
				ctrl.append(selectBtn, startBtn, resetBtn);
				ctrl.appendTo(container);

				// 6. 构建游戏状态显示区域
				status = newTag({tag: 'p', css: opt.statusCss});
				game.setStatus('init');
				status.appendTo(container);

				// 7. 构建地雷区
				minesArea = newTag({tag: 'div', id: opt.minesAreaId, css: opt.minesAreaCss, class: opt.minesAreaClass});
				minesArea.appendTo(container);
			},
			reset: function(){
				// 可以设置等级
				selectBtn.prop('disabled', false);
				startBtn.prop('disabled', false);
				// 清空地雷区域
				minesArea.html('');
				// 重置游戏状态
				game.setStatus('reset');
			},
			over: function(pos){
				$('.'+opt.mineClass).unbind('click').css('cursor', 'default');
				var GameoverTip = newTag({'tag': 'span', css: opt.gameOverTipCss, html: 'Game Over!'}).click(function(){
					$(this).remove();
				}).appendTo(minesArea);
				game.setStatus('over');
			},
			win: function()
			{
				$('.'+opt.mineClass).unbind('click').css('cursor', 'default');
				var GamewinTip = newTag({'tag': 'span', css: opt.gamewinTipCss, html: 'congratulations! You win!!!'}).click(function(){
					$(this).remove();
				}).appendTo(minesArea);
				game.setStatus('win');
			},
			sweeping: function(){
				console.log('view.sweeping', 'view', map);
				for (k in map) {
					var v = map[k];
					if (v >= 10) {
						var ele = $('#' + opt.minIdPrefix + k);
						ele.css(opt.mineClearCss);
						if (v > 10) {
							ele.html(v-10);
						}
					}
				}
			},
			setMinesArea: function(){
				console.log('call view.setMinesArea 设置雷区',x,y);
				var area = newTag({tag: 'div', css: {display: 'table', margin: '0 auto', padding: 0}});
				for (var i = 1; i <= y; i++) {
					var row = newTag({tag: 'div', css: {display: 'table-row', margin: 0, padding: 0}});
					for (var j = 1; j <= x; j++) {
						var n = i*100+j;
						var id = opt.minIdPrefix + n;
						var mine = newTag({id: id,tag: 'span', css: opt.mineCss, class: opt.mineClass}).data('pos', n);
						mine.appendTo(row);
					}
					row.appendTo(area);
				}
				area.appendTo(minesArea);
			}

		}
		var model = {
			reset: function(){
				map = null;
				step = 0;
				level = 1;
				x = 0;
				y = 0;
				total = 0;
			},
			// 模型初始化
			init: function(gameLevel){
				// 初始化参数
				step = 0;
				// 设置等级
				model.setLevel(gameLevel);
				// 初始化地图
				map = new Array();
				for (var i = 1; i <= y; i++) {
					for (var j = 1; j <= x; j++) {
						map[i*100+j] = 0;
					}
				}
				console.log('model.init 初始化模型');
			},
			// 布雷
			layMines: function(pos){
				console.log('model.layMines 布雷');
				var minesArr = new Array();
				var n = total;
				while(n) {
					var area = model.getArea(pos);
					var p = Math.ceil(Math.random()*y) * 100 + Math.ceil(Math.random()*x);
					if (typeof(map[p]) != 'undefined' && map[p] != 9 && $.inArray(p, area) < 0)
					{
						map[p] = 9;
						minesArr.push(p);
						var pArea = model.getArea(p);

						for (k in pArea) {
							var val = pArea[k];
							if (map[val] != 9) {
								map[val] ++;
							}
						}
						n--;
					}
				}
			}, 
			sweeping: function(pos){
				console.log('call model.sweeping','step',step);
				if (step == 0) {
					model.layMines(pos);
				}
				if (map[pos] == 9) {
					game.over(pos);
					return;
				}
				var queue = new Array();
				queue.push(pos);
				
				while(queue.length) {
					var p = queue.pop();
					console.log('map', map, 'p', p);
					// ###
					// #0#
					// ###
					if (map[p] == 0) {
						map[p] += 10;
						var px = p%100;
						var py = Math.floor(p/100);
						for (var i = py -1; i <= py + 1; i++) {
							for (var j = px -1; j <= px + 1; j++) {
								var n = i*100+j;
								console.log('queue', map[n]);
								if (typeof(map[n]) != 'undefined' && map[n] <= 6) {
									queue.push(n);
								}
							}
						}
					} else {

						map[p]+=10;
					}
					step++;
				}
				console.log(step);
			},
			getArea: function(p , callback){
				var area = new Array();
				var px = p%100;
				var py = Math.floor(p/100);
				for (var i = py -1; i <= py + 1; i++) {
					for (var j = px -1; j <= px + 1; j++) {
						var n = i*100+j;
						if (typeof(map[n]) != 'undefined') {
							area.push(n);
						}
					}
				}
				return area;
			},
			setLevel: function(l){
				level = l;

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
				console.log('model.setLevel 设置等级.', '等级:', level, 'x:', x, 'y:', y, 'total', total);
			},
		}
		var game = {
			status: 'init',
		
			// 游戏开始
			run: function(){
				console.log('game running');
				view.init();
				// 监听游戏开始
				ctrl.submit(function(e){
					e.preventDefault();
					console.log('form.submit');
					var l = parseInt(selectBtn.val());
					if ($.inArray(l, [1,2,3]) < 0) {
						alert('游戏等级未设置!');
						return;
					};
					selectBtn.prop('disabled',true);
					startBtn.prop('disabled',true);
					// 游戏开始
					game.start(l);
				});
				// 监听游戏重置
				resetBtn.click(function(){
					if (confirm('重新开始游戏?')) {
						game.reset();
					}
				});
			},
			start : function(l){
				console.log('game start', l);
				// 设置游戏等级
				model.init(l);
				// 设置游戏状态
				game.setStatus('start');
				// 设置地雷区域
				view.setMinesArea();

				// 排雷
				$('.'+opt.mineClass).on('click', game.sweeping);
			}, 
			sweeping: function(){
				var pos = parseInt($(this).data('pos'));
				model.sweeping(pos);
				view.sweeping();
				console.log('win',step, x*y - total);
				if (step >= (x*y - total)) {
					game.win();
				}
			},
			setStatus: function(s){
				game.status = s;
				status.html(gameStatus[s]);
			},
			
			reset: function(){
				model.reset();
				view.reset();
			},
			over: function(pos){
				view.over(pos);
				model.reset();
			},
			win: function(){
				view.win();
				model.reset();
			}
		}
		game.run();
	}

})(jQuery,window, document);
