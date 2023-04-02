$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    initEditor()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('sb')
                }
                var h = template('tpl-cate', res)
                $('[name=cate_id]').html(h)
                form.render()

            }
        })
    }
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options)
    })

    var art_state = '已发布'
    $('#btnSave2').on('click',function() {
        art_state = '草稿'
    })

    $('#form-pub').on('submit',function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state',art_state)
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function(blob) {      
            fd.append('cover_img',blob)
            publishArticle(fd)
        })
    })
   function publishArticle(fd) {
       $.ajax({
           method:'post',
           url:'/my/article/add',
           data:fd,
           contentType:false,
           processData:false,
           success:function(res) {
               if(res.status !== 0) {
                   return layer.msg('sb')
               }
               location.href = '/article/art_list.html'
           }
       })
   }

})