<?php

use yii\helpers\Url;
use gxcok\admin\widgets\MeTable;
use gxcok\admin\helpers\Helper;

// 定义标题和面包屑信息
$this->title = '上传文件';

$url = Helper::getAssetUrl();
$depends = ['depends' => 'gxcok\admin\web\AdminAsset'];
$this->registerCssFile($url . '/css/dropzone.css', $depends);
$this->registerJsFile($url . '/js/dropzone.min.js', $depends);
$this->registerJsFile($url . '/js/clipboard.min.js', $depends);
?>
<link href="http://<?=$_SERVER["SERVER_NAME"]?>/hivideo/assets/hivideo.css" rel="stylesheet" />
<script src="http://<?=$_SERVER["SERVER_NAME"]?>/hivideo/hivideo.js"></script>
<?= MeTable::widget() ?>
<style>
    .layer-file,.layer-video{float:left;width: 40px;height: 50px;font-size: 0;display: inline-block;line-height:0;margin: 0;padding: 0;
        background-image: url("https://doctorsj-1254410235.cos.ap-beijing.myqcloud.com/index/file-type.png");background-repeat: no-repeat;}
    .file-doc-icon,.file-docx-icon{background-position:0 0;}
    .file-ppt-icon{background-position:-40px 0;}
    .file-pdf-icon{background-position:-80px 0;}
    .file-psd-icon{background-position:-120px 0;}
    .file-xls-icon,.file-xlsx-icon{background-position:0 -50px;}
    .file-zip-icon,.file-rar-icon{background-position:-40px -50px;}
    .file-ai-icon,.layer-video{background-position:-80px -50px;}
    .file-txt-icon,.file-text-icon{background-position:-120px -50px;}
    .layui-icon-play{float:left;margin-top:30px; margin-left:5px;font-size: 28px;font-weight: bold;color:coral;}
</style>
<?php $this->beginBlock('javascript') ?>
    <script type="text/javascript">
        //var type = {'cos':"腾讯云COS",'local':"网站服务器"};
        var type = {'local':"网站服务器"};
        var file_type = {1:"普通文件"};
        var myDropzone = null;
        $.extend(MeTables, {
            /**
             * 定义编辑表单(函数后缀名Create)
             * 使用配置 edit: {"type": "email", "id": "user-email"}
             * edit 里面配置的信息都通过 params 传递给函数
             */
            dropzoneCreate: function () {
                return '<div id="dropzone" class="dropzone"></div><button type="button" id="clipboard" data-clipboard-text="" style="display: none"></button>';
            }
        });
        var m = meTables({
            title: "上传文件",
            number: false,
            table: {
                columns: [
                    {
                        title: "Id",
                        data: "id",
                        defaultOrder: "desc",
                        createdCell: function (td, data) {
                            $(td).html("<div> <button data-id='"+data+"' class='layui-btn layui-btn-sm layui-btn-normal copy-id' title='点击复制ID'>"+data+"<i class='layui-icon layui-icon-link'></i></button></div>");
                        },
                        edit: {type: "hidden"}
                    },
                    {
                        title: "文件标记名",
                        data: "title",
                        edit: {type: "text", rangeLength: "[2, 250]"},
                        sortable: false,
                        search: {type: "text"}
                    },
                    {
                        title: "备注",
                        data: "dec",
                        edit: {type: "text"},
                        sortable: false,
                    },
                    {
                        title: "文件类型",
                        data: "file_type",
                        value: file_type,
                        edit: {type: "select", required: true},
                        createdCell: function (td, data) {
                            $(td).html(file_type[data]);
                        },
                        sortable: false,
                        search: {type: "select"}
                    },
                    {
                        title: "文件存储位置",
                        data: "type",
                        value: type,
                        edit: {type: "select", required: true,id:"select_type"},
                        createdCell: function (td, data) {
                            $(td).html(type[data]);
                        },
                        sortable: false,
                        search: {type: "select"}
                    },
                    {
                        title: "文件访问地址",
                        data: "url",
                        edit: {type: "dropzone"},
                        sortable: false,
                        createdCell: function (td, data) {
                            var html = '';
                            if (data) {
                                try {
                                    data = JSON.parse(data);
                                    for (var i in data) {
                                        var url = data[i];
                                        var point = url.lastIndexOf(".");
                                        var type = url.substr(point);
                                        type.toLowerCase();
                                        if(type==".jpg"||type==".gif"||type==".jpeg"||type==".png") {
                                            html += "<img class='layer-image' src='"+url+"' width='40px' height='50px'> ";
                                        }else if(type==".mp4"){
                                            html += "<div class='layer-video' data-src='"+url+"'><i class='layui-icon layui-icon-play'></i></div> ";
                                        }else{
                                            html += "<div style='width: 40px; height: 50px; display: inline-block'><a target='_blank' class='layer-file file-"+type.substr(1)+"-icon' href='"+url+"'>"+type+"</a></div>";
                                        }
                                    }
                                } catch (e) {
                                }
                            }
                            $(td).html(html);
                        }
                    },
                    {
                        title: "创建时间",
                        data: "created_at",
                        createdCell: MeTables.dateTimeString
                    },
                    {
                        title: "修改时间",
                        data: "updated_at",
                        createdCell: MeTables.dateTimeString
                    }
                ]
            },
            buttons:{
                deleteAll:false,
                updateAll:false,
                export:false,
            },
        });

        var $form = null;
        $.extend(m, {
            // 显示的前置和后置操作
            afterShow: function (data, child) {
                if (!$form) $form = $("#edit-form");
                myDropzone.removeAllFiles();
                $("#dropzone").find("div.dz-image-preview").remove();
                $form.find("input[name='url[]']").remove();
                if (this.action === "update" && data["url"]) {
                    try {
                        var imgs = JSON.parse(data["url"]);
                        for (var i in imgs) {
                            var mockFile = {name: "Filename" + i, size: 12345};
                            myDropzone.emit("addedfile", mockFile);
                            myDropzone.emit("thumbnail", mockFile, imgs[i]);
                            myDropzone.emit("complete", mockFile);
                            addInput(mockFile.name, imgs[i]);
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
                return true;
            }
        });

        function addInput(name, url) {
            //console.log(url)
            $form.append('<input type="hidden" data-name="' + name + '" name="url[]" value="' + url + '">');
        }

        $(function () {
            m.init();
            $('#search-file_type').val('1');
            $("#search-form").submit();

            $form = $("#edit-form");

            // 新版本上传修改
            var csrfParam = $('meta[name=csrf-param]').attr('content') || "_csrf",
                csrfToken = $('meta[name=csrf-token]').attr('content'),
                params = {};
            params[csrfParam] = csrfToken;

            Dropzone.autoDiscover = false;
            var up_url = "/admin/uploads/upload?sField=url&select_type=local";

            $(document).on("change", "#select_type", function () {
                myDropzone.removeAllFiles();
                up_url = "/admin/uploads/upload?sField=url&select_type="+$(this).val();
                //console.log(up_url);
            });

            try {
                myDropzone = new Dropzone("#dropzone", {
                    url: up_url,
                    // The name that will be used to transfer the file
                    paramName: "UploadForm[url]",
                    params: params,
                    maxFilesize: 200, // MB
                    //acceptedFiles: "image/*,application/pdf,.mp4,.xls,.xlsx,.ppt,.ppt",
                    addRemoveLinks: true,
                    dictDefaultMessage:
                        '<span class="bigger-150 bolder"><i class="ace-icon fa fa-caret-right red"></i> 点击上传</span> 或者 \
                        <span class="smaller-80 grey">拖拽</span> <br /> \
                        <i class="upload-icon ace-icon fa fa-cloud-upload blue fa-3x"></i>'
                    ,
                    dictRemoveFile:'移除文件',
                    dictResponseError: '上传文件发生错误!',
                    //change the previewTemplate to use Bootstrap progress bars
                    previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n<div class=\"dz-details\">\n<div class=\"dz-filename\"><span data-dz-name></span></div>\n<div class=\"dz-size\" data-dz-size></div>\n<img data-dz-thumbnail />\n</div>\n<div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n<div class=\"dz-success-mark\"><span></span></div>\n<div class=\"dz-error-mark\"><span></span></div>\n<div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
                    , init: function () {
                        this.on("processing", function(file) {
                            myDropzone.options.url = up_url;
                        });
                        this.on("success", function (file, response) {
                            if (response.code === 0) {
                                addInput(file.name, response.data.sFilePath);
                            } else {
                                this.removeFile(file);
                                layer.msg(response.msg, {icon: 5, time: 1000});
                            }
                        });

                        this.on("removedfile", function (file) {
                            $form.find("input[data-name='" + file.name + "']").remove();
                        })
                    }
                });
            } catch (e) {
                console.error(e);
            }
            function doclipboard(str){
                $('#clipboard').attr("data-clipboard-text",str)
                var clipboard = new ClipboardJS('#clipboard');
                clipboard.on('success', function (e) {
                    layer.msg('复制成功', {icon: 1,time:1000});
                    e.clearSelection();
                });
                $("#clipboard").trigger("click");
            }
            // 图片显示
            $(document).on("click", ".layer-image", function () {
                var url = $(this).prop('src')
                layer.open({
                    type: 1,
                    title: false,
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    content: '<img class="center-block copy-img" src="' + url + '" style="max-height:90%;max-width:90%">'
                });
                doclipboard(url);
            });

            // 复制id
            $(document).on("click", ".copy-id", function () {
                doclipboard($(this).attr('data-id'));
            });

            $(document).on("click", ".layer-video", function () {
                doclipboard(url);
                var url = $(this).attr('data-src');
                layer.open({
                    type: 1,
                    title: false,
                    area: ['600px', '350px'],
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    content: "<video id='my-video' ishivideo='true' autoplay='true' isrotate='false' autoHide='true'><source src='"+url+"' type='video/mp4'></video>"
                });
                hivideo(document.getElementById("my-video"));
            });

            $(document).on("click", ".layer-file", function () {

            });
        });
    </script>
<?php $this->endBlock(); ?>