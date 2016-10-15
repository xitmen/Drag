$(function(){
    var callback = function( data ){
        //alert( data );
    };
    var config = {
        con: $('.box'),
        data: [{title:'菜单1',index:0},{title:'菜单2',index:1},{title:'菜单3',index:2},{title:'菜单4',index:3},{title:'菜单5',index:4}],
        mode: '<div class="line" index="@{index}" new-index="@{index}"><i>拖动</i>@{title}</div>',
        clone: '<div class="clone"></div>',
        type: 3,
        active: 1,
        time: 500,
        offset: 15,
        elemClass: 'line',
        callBack: callback
    };
    var drag = new Drag( config );
})