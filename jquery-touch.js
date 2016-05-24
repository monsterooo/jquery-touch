/*!
* jQuery Touch Library v0.0.1
* https://github.com/monsterooo/jquery-touch
*
* Released under the MIT license
*
 * Date: 2016-5-24
*/
(function($){
	var touch;
	// 处理兼容性问题
	var compatible = (function(){
		var supportTouch = function() {
			try {
				return !!('ontouchstart' in window);
			} catch(e) {
				return false;
			}
		};
		var st = supportTouch();
		var fixEvent = {
			touchstart: st ? 'touchstart' : 'mousedown',
			touchmove: st ? 'touchmove' : 'mousemove',
			touchend: st ? 'touchend' : 'mouseup'
		}
		return {
			_events: fixEvent,
			touch: st
		}
	})();
	$.touch = touch = {
		version: "0.0.1",
		bind: function(elem, opts) {
			var opts = $.extend({
				// 横 距离 阈值
				horizontalDistanceThreshold: 15,
				// 纵 距离 阈值
				verticalDistanceThreshold: 75,
				// 滚动 抑制 阈值
				scrollSupressionThreshold: 10,
				// x 压制值
				supressX: false,
				// y 压制值
				supressY: false,
				// 持续事件阈值
				durationThreshold: 1000,
				// 终止事件传播
				stopPropagation: false,
				// 阻止默认事件
				preventDefault: false,
				start: false,
				move: false,
				end: false,
				swipe: false
			}, opts, {});
			function touchStart(e) {
				var self = $(this);
				var time = new Date().getTime();
				var touches = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
				var pageX = touches.pageX;
				var pageY = touches.pageY;
				var moveX = touches.pageX;
				var moveY = touches.pageY;
				var xDiff, yDiff, newPageX, newPageY, newTime, initialMove = false, supress = true;;
				// 可手动阻止同一类事件的冒泡行为
                if (opts.stopPropagation) {
                    e.stopImmediatePropagation();
                }
				// 触发开始回调函数参数是绑定的元素
				if($.type(opts.start) == 'function') {
					opts.start({
						target: e,
						x: pageX,
						y: pageY
					});
				}
				function touchMove(e) {
					var tmpTime;
					// 可手动阻止默认事件
					if(opts.preventDefault) {
						e.preventDefault();
					}
					if(!time) {
						return;
					}
					touches = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
					newTime = new Date().getTime();
					newPageX = touches.pageX;
					newPageY = touches.pageY;
					xDiff = newPageX - moveX;
					yDiff = newPageY - moveY;
					tmpTime = new Date().getTime();
					// 不能当成是滑动的条件
					// 1.supress 没有就是不是经过touchStart初始化的事件直接返回
					// 2.有传递suppresX或suppresX的前提下满足下面的条件
					// 3.移动的x差值小于定义的压制值
					// 4.移动的y差值小于定义的压制值
					if(
						supress
						&&
						(
							(opts.suppresX && Math.abs(xDiff) < opts.scrollSupressionThreshold) ||
							(opts.suppresY && Math.abs(yDiff) < opts.scrollSupressionThreshold) ||
							(time && tmpTime - time < 100)	// 1/10 毫秒以下不能作为move
						)
					) {
						return;
					}
					// 在满足是移动条件后的首次移动需要收集必要信息
					if(initialMove) {
						initialMove = false;		// 不会再次重置信息
						supress = false;			// 不会再检查是否是移动事件
						moveX = touches.pageX;		// moveX的值重置为手第一次滑动的x
                        moveY = touches.pageY;		// moveY的值重置为首第一个滑动的y
                        xDiff = newPageX - moveX;	// x差值
                        yDiff = newPageY - moveY	// y差值
					}
					// move配置是函数则执行它，那就是move回调事件了
                    if ($.type(opts.move) == "function") {
                        opts.move({
                            target: e,
                            x: xDiff,
                            y: yDiff
                        });
                    }
				}
				function touchEnd(e) {
					var isSwipe = false;
					self.unbind(compatible._events.touchmove);
					self.unbind(compatible._events.touchend);
					// 开始和移动事件都触发
					if(!time && !newTime) {
						time = newTime = null;
						return;
					}
					// 判断一个事件是否是swipe的阈值
					// 1.他们所touchMove的时间大于durationThreshold
					// 2.移动的x值大于阈值
					// 3.移动的y值小于阈值
					if(
						newTime - time < opts.durationThreshold &&
						Math.abs(pageX - newPageX) > opts.horizontalDistanceThreshold &&
						Math.abs(pageY - newPageY) < opts.verticalDistanceThreshold
					) {
						isSwipe = true;
						// 如果传递了swipe回调，则执行，参数有
						// 1.元素
						// 2.方向
						// 3.x差值
						// 4.y差值
						if($.type(opts.swipe) == 'function') {
							opts.swipe({
								target: e,
								direction: pageX > newPageX ? "left" : "right",
								x: xDiff,
								y: yDiff
							})
						}
					}
					// 如果回调end有传递，则执行，参数有
					// 1.元素
					// 2.是否是swped了
					// 3.x差值
					// 4.y差值
					if($.type(opts.end) == 'function') {
						opts.end({
							target: e,
							swiped: isSwipe,
							x: xDiff,
							y: yDiff
						})
					}
				}
				// 绑定移动事件
				self.bind(compatible._events.touchmove, touchMove);
				self.one(compatible._events.touchend, touchEnd);
			}
			// 给元素绑定touchstart事件
			$(elem).bind(compatible._events.touchstart, touchStart);
		},
		unbind: function(elem) {
			// 暂未实现解绑
		}
	};
})(jQuery);
