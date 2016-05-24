$(function() {
    var slideWidth = $('.slide-wrap').width();
    var speed = 0.15625;                            // 滑动切换slide的距离
    var cx = 0;                                     // wrap位置
    var index = 0;                                  // 索引
    var wrap = $('.slide-wrap')[0];
    var slideItemCount = $('.slide-item').length;
    var change = false;
    var nav = $('.nav-container li');
    var isStart = false;
    $.touch.bind($('.slide-wrap'), {
        start: function(params) {
            isStart = true;
        },
        move: function(params) {
            if(isStart) {
                var offx = cx + params.x;
                var self = this;
                duration(wrap, 0);
                transform(wrap, offx);
            }
        },
        end: function(params) {
            var offx = params.x;
            isStart = false;
            change = Math.abs(offx) > slideWidth * speed;

            // 设置过度时间为 350ms
            duration(wrap, 350);

            if(offx < 0 && change) {          // 向左负数
                next();
            } else if(offx > 0 && change) {
                prev();
            } else {
                reset();
            }
            offx = 0;
        },
        preventDefault: true,
        stopPropagation: true
    });
    // 重置位置为索引处
    function reset() {
        var offx = index * slideWidth;
        transform(wrap, cx);
    }
    // 向右切换，上一个slide
    function prev() {
        if(index == 0) {
            reset();
            return;
        }
        index --;
        cx += slideWidth;
        setNav();
        transform(wrap, cx);
    }
    // 向左切换，下一个slide
    function next() {
        if(index >= slideItemCount - 1) {
            reset();
            return;
        }
        index ++;
        cx -= slideWidth;
        setNav();
        transform(wrap, cx);
    }
    /**
    * 设置元素过度时间
    * elem              需要过度的元素
    * num               过度时间，毫秒
    */
    function duration(elem, num) {
        elem.style.transitionDuration = num + "ms";
    }
    /**
    * 设置元素平移位置
    * elem              平移元素
    * num               移动距离
    */
    function transform(elem, num) {
        elem.style.transform = 'translate3d(' + num + 'px, 0px, 0px)';
    }
    function setNav() {
        nav.removeClass('current');
        nav.eq(index).addClass('current');
    }

});































//
