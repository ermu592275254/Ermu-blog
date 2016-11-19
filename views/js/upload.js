var files,
    inputId = 'fileInput',
    showBoxId = 'imgDiv',
    canvasDivId = 'canvasDiv',
    html='',
    canvasDiv = document.getElementById(canvasDivId);
function onChange() { //input框值改变就获取

    files = document.getElementById(inputId).files;
    files = filter(files);
    $('#fileName').html('');
    for(var i = 0;i < files.length; i++){
        $('#fileName').append((i+1)+':'+files[i].name+'<br>');
    }
}
function showImg(files){ //显示图片
    var html = '';
    var imgBox = document.getElementById(showBoxId);
    imgBox.innerHTML = '';
    canvasDiv.innerHTML = '';
    for(var i = 0;i < files.length;i++){
        html += '<p>优化前：'+(files[i].size/1000)+'K</p>'+
            '<img id="img'+i+'" src="'+window.URL.createObjectURL(files[i])+'" width="600" height="400">'
    }
    imgBox.innerHTML = html;
    read(files);
}
function compress(img,quality){ //压缩图片
    if(!quality){
        var quality = 1;
    }
    html = '<p id="p'+img.name+'"></p>'+
        '<canvas id="canvas'+img.name+'"></canvas>';
    $('#'+canvasDivId).append(html);
    var initSize = img.src.length;
    //宽高需要做限制
    var scale = img.width>600?img.width/600:1;
    var width = img.width > 600 ? 600 : img.width;
    var height = img.height/scale;
    var canvas = document.getElementById('canvas'+img.name);
    var ctx = canvas.getContext('2d');
    var tCanvas = document.getElementById('tCanvas');
    var tctx = tCanvas.getContext('2d');
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000)>1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    }else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;

    //铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

//            计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

        tCanvas.width = nw;
        tCanvas.height = nh;

        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);//这一步将瓦片画在ctx上
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }

    //进行最小压缩   压缩是针对canvas画出来的图片进行压缩
    var ndata = canvas.toDataURL('image/jpeg', quality);

    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = 0; // 隐藏掉tCanvas
    return ndata;
}
function read(files){ //读取图片
    var index = 0;
    for(var i = 0;i< files.length;i++){
        var file = files[i];
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.src = e.target.result;
            img.name = 'img'+index;
            index++;
            var data = compress(img);
            //console.log(data);
             upload(data,img.name);
        };
        reader.readAsDataURL(file);
    }
}
function filter(files) { //过滤上传的文件
    var arrFiles = [];
    for (var i = 0, file; file = files[i]; i++) {
        if (file.type.indexOf("image") == 0) {
            if (file.size >= 5120000) {
                alert('您这张"'+ file.name +'"图片大小过大，应小于500k');
            } else {
                arrFiles.push(file);
            }
        } else {
            alert('文件"' + file.name + '"不是图片。');
        }
    }
    return arrFiles;
}
function upload(basestr,imgName) {
    var text = window.atob(basestr.split(",")[1]); // 将数据解码
    var type = basestr.split(",")[0].match(/:(.*?);/)[1];
    var buffer = new ArrayBuffer(text.length);//ArrayBuffer的用途是呈现通用、固定长度的二进制数据
    var ubuffer = new Uint8Array(buffer);//（无符号8位整数）Uint8Array是TypedArray提供的9种类型的视图之一
    var pecent = 0 , loop = null;

    for (var i = 0; i < text.length; i++) {
        ubuffer[i] = text.charCodeAt(i); //返回指定位置的字符的 Unicode 编码
    }
    document.getElementById('p'+imgName).innerHTML = '优化后：'+(ubuffer.length / 1000) + 'K';
    var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder; // BlobBuilder 包含有只读原始数据的类文件对象 火狐已经废弃
    var blob;

    if (Builder) {   // Builder已经被弃用了 这个判断并没有什么意义了，但仍然保留，方便以后巩固知识
        var builder = new Builder();
        builder.append(buffer);
        blob = builder.getBlob(type);
    } else {
        blob = new window.Blob([buffer], {type: type}); // blob和blobBuilder差不多 因为是只读的所以不能写入任何东西  这里相当于又转成了file
    }
    var xhr = new XMLHttpRequest();
    var formdata = new FormData();
    formdata.append('imagefile', blob);
    xhr.open('post', '/upload');

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert('上传成功!');
            $('#fileName').append((i+1)+':'+JSON.parse(xhr.responseText).message+'<br>');
            clearInterval(loop);

            //当收到该消息时上传完毕
                $('li').find(".progress span").animate({'width': "100%"}, pecent < 95 ? 200 : 0, function () {
                    $(this).html(JSON.parse(xhr.responseText).message);
                });

        }
    };

    //数据发送进度，前50%展示该进度
    xhr.upload.addEventListener('progress', function (e) {
        if (loop) return;

        pecent = ~~(100 * e.loaded / e.total) / 2;
            $('li').find(".progress span").css('width', pecent + "%");

        if (pecent == 50) {
            mockProgress();
        }
        console.log(pecent);
    }, false);

    //数据后50%用模拟进度
    function mockProgress() {
        if (loop) return;

        loop = setInterval(function () {
            pecent++;
                $('li').find(".progress span").css('width', pecent + "%");

            if (pecent == 99) {
                clearInterval(loop);
            }
        }, 100)
    }
    xhr.send(formdata);
}