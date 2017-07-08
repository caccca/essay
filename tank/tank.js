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
	/*
	1. 创建地图
	2. 创建障碍物
	3. 
	*/
	$.fn.tank = function(config){
		var opt = $.extend({
			width: '800',
			height: '600',
			// 游戏主区域
			container: {
				tag: 'div',
				css: {
					display: 'block',
					position: 'absolute',
					left: 0,
					top: 0,
					'z-index': 999,
					width: '800px',
					height: '600px',
					border: '1px solid #999'
				},
				id: 'tank-container',
				class: 'tank-container'
			},
			// 控制面板
			ctrl: {
				tag: 'div',
				css: {
				},
				id: 'tank-control',
				class: 'tank-control'
			},
			// 按钮css
			btnCss: {
				'font-size': '16px',
				padding: '5px 10px',
				background: '#fff',
				'color': '#000',

			},
			// 开始按钮
			startBtn: {
				tag: 'button',
				css: this.btnCss,
				id: 'tank-startBtn',
				class: 'tank-startBtn',
				html: '游戏开始'
			},
			
			gameArea: {
				tag: 'div',

			}
		}, config);

		$(this).css('position', 'relative');
		// 外部容器
		var container = newTag(opt.container).appendTo($(this));

		// 视图部件
		var ctrl; // 控制面板区
		var startBtn; // 开始按钮
		var gameArea; // 游戏视图区域


		var enemys = []; // 敌方坦克
		var hero; // 我方坦克

		var game = {
			run: function(){
				// 1. 创建控制面板
				ctrl = newTag(opt.ctrl).appendTo(container);
				// 2. 构建开始按钮
				startBtn = newTag(opt.startBtn).appendTo(ctrl);
				// 3. 构建游戏视图
				gameArea = newTag(opt.gameArea);

				startBtn.click(function(){
					ctrl.remove();
					game.start();
				});
			},
			start: function(){
				// 开始游戏
				// 1. 初始化
				// 2. 

			}
		}

		game.run();
	}
})(jQuery);