(function($){
	$.fn.rain = function(config){
		var opt = $.extend({
			speed: 2000, // 2000毫秒
			size: 2,
			coverId: 'rainer-cover-id',
			fontSize: 20,
			create: 1000, // 每1000ms
		},config);
		var container = this;
		var cover; // 遮罩层

		// 初始化方法
		function init()
		{
			// 设置外部容器
			$(container).css({position: 'relative'});
			// 新建遮罩层
			cover = $('<div>').css({overflow: 'hidden',position: 'absolute', top: 0, left: 0, width: $(container).innerWidth(), height: $(container).innerHeight()}).prop('id', opt.coverId);
			$(container).append(cover);
		}

		function rain()
		{
			var charArr = ['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			for (var i = 0; i < opt.size; i++) {
				// 创建字符雨
				var fontSize = 5 + Math.floor(Math.random()*opt.fontSize);
				var color = '#'+(Math.random()*0xffffff<<0).toString(16);
				var char = charArr[Math.floor(Math.random()*36)];
				var posLeft = Math.floor(Math.random()*$(container).innerWidth());
				var posTop = '-' + fontSize + 'px';
				var drip = $('<span>').css({cursor: 'pointer','font-size': fontSize, color: color, position: 'absolute', top: posTop, left: posLeft}).html(char);
				var speed = 1000 + Math.floor(Math.random()*opt.speed);
				drip.animate({top: $(container).innerHeight()}, speed, 'swing', function(){
					$(this).remove();
				});
				drip.hover(function(){
					drip.css('font-size', 100).html('*');
					$(this).remove();
				});
				$(cover).append(drip);
			}
		}

		init();
		var interval = setInterval(rain, opt.create);
	}
})(jQuery);