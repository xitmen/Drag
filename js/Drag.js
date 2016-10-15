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
    this.targetOurMarin = {};
    this.impactData = [];
    this.curElemPos = {};
    this.movePos = {x:0,y:0};
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
        for( var i = 0; i < _self.config.data.length; i++ ){
            _self.dragData.push( _self.htmlMode.call( _self.config.mode, _self.config.data[i]  ) );
        }
        _self.config.con.html( _self.dragData.join('') );
        var list = _self.config.con.find( '.'+_self.config.elemClass );
        $.each( list, function(){
            var _me = $(this),
                mL = parseInt(_me.css('marginLeft')),
                mT = parseInt(_me.css('marginTop')),
                pos = _me.offset(),
                w = _me.outerWidth(),
                h = _me.outerHeight();
            _self.impactData.push({l:pos.left + mL, t: pos.top + mT,r: pos.left + w, b: pos.top + h });
        });
        console.log( this.impactData );
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
        this.targetOurMarin = {l:parseInt(this.target.css('marginLeft')), t:parseInt(this.target.css('marginTop')) };
        this.pos = { x: elemPos.left, y : elemPos.top };
        this.curElemPos = {x:evnetPos.x - this.pos.x, y: evnetPos.y - this.pos.y };
        this.clone = $(this.config.clone);
        this.target.replaceWith( this.clone );
        this.body.append( this.target );
        this.target.css({
            position:'absolute',
            left: evnetPos.x - this.curElemPos.x - this.targetOurMarin.l,
            top: evnetPos.y -  this.curElemPos.y - this.targetOurMarin.t
        })
        $(document).on({
            mousemove :function( e ){
                _self.dragMove( e );
            },
            mouseup : function(){
                _self.dragEnd( e );
            }
        })
    },
    dragMove: function( e ){
        var time = new Date().getTime() - this.curTime;
        this.movePos = {x: e.pageX - this.curElemPos.x  - this.targetOurMarin.l , y: e.pageY - this.curElemPos.y - this.targetOurMarin.t };
        if( this.begin ){
            this.begin = false;
        }else{
            var offset = {};
            if(  this.config.type == 1  ){
                offset = {left: this.movePos.x};
            }else if( this.config.type == 2 ){
                offset = {top: this.movePos.y};
            }else{
                offset = {top: this.movePos.y,left: this.movePos.x};
                if( this.config.type == 4 ){
                    //判断是否碰撞
                }
            }
            this.target.css(offset);
        }
    },
    dragEnd: function( e ){
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
            _self.impact();
        })
    },
    impact: function(  ){
        var _self = this;
        console.log( _self.movePos );
        $.each( _self.impactData, function( n, obj ){
            if( _self.movePos.x >= obj.l && _self.movePos.x < obj.r && _self.movePos.y >= obj.t && _self.movePos.y < obj.b ){
                console.log( n  );
            }
        })
    }
};
