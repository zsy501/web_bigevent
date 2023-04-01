$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname:function(value) {
            if (value.length > 6) {
                return '名称长度必须在1~ 6个字符之间!'
            }
        }
    })
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method:'get',
            url:'/my/userinfo',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('sb')
                }
                console.log(res);
                form.val('formUserInfo',res.data)
            }
         
            
        })
    }
    $('#btnReset').on('click',function(e) {
        e.preventDefault()
        initUserInfo()
    })
    $('.layui-form').on('submit',function(e) {
        e.preventDefault()
        console.log($(this).serialize());
        $.ajax({
            method:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('sb');
                }
                 window.parent.getUserInfo()
               
            }
        })
    })
})