/***
 * 拖动组件
 * elemClass .line 需要注册的到事件
 * data:    []   菜单数据
 * type:    1    左右拖动, 2:上下拖动, 3:全方位拖动, 4:归类
 * time:    15   多少时间激活拖动事件
 * offset:  15   达到多少偏移量的时候注册拖动事件
 ***/

var Drag = function( config ){
    this.config = config;
    this.begin = true;
    this.dragData = [];
    this.target = null;
    this.pos = {};
    this.clone = null;
    this.body = $('body');
    this.init();
}


Drag.prototype = {
    htmlMode: function(O){
        var s = this.replace(/\@\{(\w+)\}/g, function(t, _o){
            return O[_o];
        });
        return s;
    },
    init: function(){
        var _self = this;
        for( var i = 0; i < this.config.data.length; i++ ){
            this.dragData.push( this.htmlMode.call( this.config.mode, this.config.data[i]  ) );
        }
        this.config.con.html( this.dragData.join('') );
        $(document).on('mousedown',function( e ){
            var target = $( e.target).hasClass( _self.config.elemClass) ? $( e.target) : $( e.target).parents( '.'+_self.config.elemClass).eq(0);
            _self.offset = e.pageX;
            if( target.get(0) ){
                _self.curTime = new Date().getTime();
                _self.target = target;
                _self.body.addClass('no_select');
                _self.dragBegin( e );
            }
        })
    },
    dragBegin: function( e ){
        var _self = this;
        var evnetPos = {x: e.pageX, y: e.pageY };
        var elemPos = this.target.offset();
        this.pos = { x: elemPos.left, y : elemPos.top };
        this.clone = $(this.config.clone);
        this.target.replaceWith( this.clone );
        this.body.append( this.target );
        this.target.css({
            position:'absolute',
            left: this.pos.x,
            top:  this.pos.y
        })
        $(document).on({
            mousemove :function( e ){
                _self.dragMove( e );
            },
            mouseup : function(){
                _self.dragEnd();
            }
        })
    },
    dragMove: function( e ){
        var time = new Date().getTime() - this.curTime;
        var pos = {x: e.pageX, y: e.pageY };
        if( this.begin ){
            this.begin = false;
        }else{
            var offset = {};
            if(  this.config.type == 1  ){
                offset = {left: pos.x};
            }else if( this.config.type == 2 ){
                offset = {top: pos.y};
            }else{
                offset = {top: pos.y,left: pos.x};
                if( this.config.type == 4 ){
                    //判断是否碰撞
                }
            }
            this.target.css(offset);
        }
    },
    dragEnd: function(){
        var _self = this;
        this.body.removeClass('no_select');
        $(document).off('mousemove mouseup');
        this.target.animate({
            left: this.pos.x,
            top: this.pos.y
        },100,function(){
            _self.clone.replaceWith( _self.target.removeAttr('style') );
            _self.target = null;
            _self.begin = true;
        })
    }
};
