$(function(){
    var config = {
        con: $('.box'),
        data: [{title:'菜单1',index:1},{title:'菜单2',index:2},{title:'菜单3',index:3},{title:'菜单4',index:4},{title:'菜单5',index:5}],
        mode: '<div class="line" index="@{index}" new-index="@{index}"><i>拖动</i>@{title}</div>',
        clone: '<div class="clone"></div>',
        type: 3,
        time: 500,
        offset: 15,
        elemClass: 'line'
    };

    var drag = new Drag( config );
})