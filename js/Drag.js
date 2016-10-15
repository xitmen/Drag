/***
 * 拖动组件
 * elemClass .line 需要注册的到事件
 * data:    []   菜单数据
 * type:    1    左右拖动, 2:上下拖动, 3:全方位拖动
 * active:  1    默认交换位置 0:执行其他事件
 ***/

var Drag = function( config ){
    this.config = config;
    this.begin = true;
    this.dragData = [];
    this.target = null;
    this.active = this.config.active || 1;
    this.targetOurMarin = {};
    this.map = { 1:'changePos' },
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
            var obj = $( _self.htmlMode.call( _self.config.mode, _self.config.data[i]  ) );
            obj.index = i;
            _self.dragData.push( obj );
            _self.config.con.append( obj );
        }
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
        this.movePos = {
            x: e.pageX - this.curElemPos.x  - this.targetOurMarin.l ,
            y: e.pageY - this.curElemPos.y - this.targetOurMarin.t,
            w: this.target.outerWidth(),
            h: this.target.outerHeight()
        };
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
            }
            this.target.css(offset);
        }
    },
    dragEnd: function( e ){
        var _self = this;
        this.body.removeClass('no_select');
        $(document).off('mousemove mouseup');
        this.dragData = _self.config.con.find( '.'+_self.config.elemClass );
        var impactData = [];
        $.each( this.dragData, function(){
            var _me = $(this),
                mL = parseInt(_me.css('marginLeft')),
                mT = parseInt(_me.css('marginTop')),
                pos = _me.offset(),
                w = _me.outerWidth(),
                h = _me.outerHeight();
            impactData.push({x:pos.left - mL, y: pos.top - mT,w: w, h: h });
        });
        var index = _self.impact( impactData );
        if( index != null){
            _self[ _self.map[ _self.active ] ]( index );
            _self.endCallBack();
        }else{
            this.target.animate({
                left: this.pos.x,
                top: this.pos.y
            },100,function(){
                _self.clone.replaceWith( _self.target );
                _self.endCallBack();
            })
        }
    },
    impact: function( impactData ){
        var _self = this;
        var index = null;
        $.each( impactData, function( n, obj ){
            if( _self.impactFn( _self.movePos, obj ) ){
                index = n;
            }
        });
        return index;
    },
    impactFn: function( o, d ){
        var px, py;
        px = o.x <= d.x ? d.x : o.x;
        py = o.y <= d.y ? d.y : o.y;
        // 判断点是否都在两个对象中
        if (px >= o.x && px <= o.x + o.w && py >= o.y && py <= o.y + o.h && px >= d.x && px <= d.x + d.w && py >= d.y && py <= d.y + d.h) {
            return true;
        } else {
            return false;
        }
    },
    changePos : function( index ){
        var newIndex = parseInt( $( this.dragData[index] ).attr('new-index') );
        var oldIndex = parseInt( this.target.attr('new-index') );
        if( newIndex > oldIndex ){
            $( this.dragData[index] ).after( this.target );
        }else{
            $( this.dragData[index] ).before( this.target );
        }
    },
    endCallBack: function(){
        this.dragData = this.config.con.find( '.'+this.config.elemClass );
        this.target.removeAttr('style');
        this.clone.remove();
        this.target = null;
        this.begin = true;
        var data = [];
        $.each( this.dragData, function( n ){
            var _me = $( this),
                index = parseInt( _me.attr('index') );
            $(this).attr('new-index',n);
            data.push( { newIndex: n, index: index } )
        } );
        this.config.callBack && this.config.callBack( data );
    }
};
