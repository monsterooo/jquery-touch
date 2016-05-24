## 基于jQuery的轻量级touch事件库 v0.0.1

demo: [photo-slide](http://sandbox.runjs.cn/show/pw5eg8dp)

支持移动端和pc端

* touchstart

* touchmove

* touchend

## 使用方法

```javascript
$.touch.bind($('.td'), {
    start: function(e) {
        //console.log('start', e);
    },
    move: function(e) {
        //console.log('move', e);
    },
    end: function(e) {
        console.log('end', e);
    },
    swipe: function(e) {
        if(e.direction == 'left') {
            console.log('swipte left', e);
        } else if(e.direction == 'right') {
            console.log('swipte right', e);
        }

    }
});
```

## 更新列表

* 2016-5-24 初始化创库可代码，只支持基本的方法，还未实现unbind
