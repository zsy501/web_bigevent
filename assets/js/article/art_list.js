$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('sb')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('sb')

                }
                console.log(res);
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name=cate_id').html(htmlStr)
                form.render()

            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.status = state
        initTable()
    })

    function renderPage(total,first) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump: function (obj,first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if(!first) {
                initTable()

                }
            }
        });
    }

    $('tbody').on('click','.btn-delete',function(){
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'get',
                url:'/my/article/deletecate/' + id,
                success:function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    if(len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    } )
})