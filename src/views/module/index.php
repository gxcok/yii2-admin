<?php

use yii\helpers\Url;
use yii\helpers\Html;
use gxcok\admin\helpers\Helper;
use gxcok\admin\web\ValidateAsset;

// 定义标题和面包屑信息
$this->title = '代码生成';

// 注入需要的JS
$url     = Helper::getAssetUrl();
$depends = ['depends' => 'gxcok\admin\web\AdminAsset'];

$this->registerJsFile($url . '/js/fuelux/fuelux.spinner.min.js', $depends);
$this->registerJsFile($url . '/js/fuelux/fuelux.wizard.min.js', $depends);
$this->registerJsFile($url . '/js/bootstrap-wysiwyg.min.js', $depends);
$this->registerJsFile($url . '/js/chosen.jquery.min.js', $depends);
$this->registerJsFile($url . '/js/chosen.jquery.min.js', $depends);
$this->registerCssFile($url . '/css/chosen.css', $depends);
ValidateAsset::register($this);
?>
    <div class="widget-box widget-color-blue">
        <div class="widget-header widget-header-blue  widget-header-flat">
            <h4 class="widget-title lighter">代码生成自动向导</h4>
            <div class="widget-toolbar">
                <a data-action="reload" href="#">
                    <i class="ace-icon fa fa-refresh"></i>
                </a>
                <a data-action="collapse" href="#">
                    <i class="ace-icon fa fa-chevron-up"></i>
                </a>
            </div>
        </div>

        <div class="widget-body">
            <div class="widget-main">
                <!-- #section:plugins/fuelux.wizard -->
                <div id="fuelux-wizard" data-target="#step-container">
                    <!-- #section:plugins/fuelux.wizard.steps -->
                    <ul class="wizard-steps">
                        <li data-target="#step1" class="active">
                            <span class="step">1</span>
                            <span class="title">确认表信息</span>
                        </li>
                        <li data-target="#step2">
                            <span class="step">2</span>
                            <span class="title">填写表单信息</span>
                        </li>

                        <li data-target="#step3">
                            <span class="step">3</span>
                            <span class="title">生成模块信息</span>
                        </li>
                    </ul>
                </div>

                <hr/>

                <!-- #section:plugins/fuelux.wizard.container -->
                <div class="step-content pos-rel" id="step-container">
                    <div class="step-pane active" id="step1">
                        <h3 class="lighter block green">请输入以下信息</h3>
                        <form class="form-horizontal" id="sample-form" action="<?= Url::toRoute(['module/create']) ?>">
                            <div class="form-group has-success">
                                <label for="me-title"
                                       class="col-xs-12 col-sm-3 control-label no-padding-right">标题名称</label>
                                <div class="col-xs-12 col-sm-5">
                                <span class="block input-icon input-icon-right">
                                    <input type="text" id="me-title" name="title" required="true" rangelength="[2, 100]"
                                           class="width-100"/>
                                    <i class="ace-icon fa fa-check-circle"></i>
                                </span>
                                </div>
                                <div class="help-block col-xs-12 col-sm-reset inline text-danger">( *
                                    标题、权限、导航都基于该字段生成说明)
                                </div>
                            </div>
                            <?php if(!empty($db)){?>
                                <div class="form-group has-success">
                                    <label for="me-table"
                                           class="col-xs-12 col-sm-3 control-label no-padding-right">数据库名</label>
                                    <div class="col-xs-12 col-sm-5">
                                        <?php array_unshift($db,''); ?>
                                        <input type="hidden" name="select_db" value="<?=$select_db?>">
                                        <?= Html::dropDownList('db', $select_db, $db, [
                                            'id'               => 'select-db',
                                            'class'            => 'chosen-select',
                                            'required'         => true,
                                            'data-placeholder' => '请选择一个数据库',
                                        ]) ?>
                                    </div>
                                    <div class="help-block col-xs-12 col-sm-reset inline text-danger">( * 从选择的数据库中读表)
                                    </div>
                                </div>
                            <?php }?>
                            <div class="form-group has-success">
                                <label for="me-table"
                                       class="col-xs-12 col-sm-3 control-label no-padding-right">数据库表名</label>
                                <div class="col-xs-12 col-sm-5">
                                    <?php array_unshift($tables,''); ?>
                                    <?= Html::dropDownList('table', '', $tables, [
                                        'id'               => 'select-table',
                                        'class'            => 'chosen-select',
                                        'required'         => true,
                                        'data-placeholder' => '请选择一个数据表',
                                    ]) ?>
                                </div>
                                <div class="help-block col-xs-12 col-sm-reset inline text-danger">( * 控制器、模型、权限都基于该字段命名
                                    )
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="step-pane" id="step2">
                        <div>
                            <div class="alert alert-success">
                                <button type="button" class="close" data-dismiss="alert">
                                    <i class="ace-icon fa fa-times"></i>
                                </button>
                                <strong>
                                    <i class="ace-icon fa fa-check"></i>
                                    温馨提醒
                                </strong>
                                请认真填写数据信息
                                <br/>
                            </div>
                            <form class="form-horizontal" action="<?= Url::toRoute(['module/update']) ?>" method="POST">
                                <fieldset id="my-content">
                                </fieldset>
                            </form>
                        </div>
                    </div>

                    <div class="step-pane" id="step3">
                        <div class="alert alert-info">
                            <button type="button" class="close" data-dismiss="alert">×</button>
                            <strong>温馨提醒 ! </strong> 确认生成文件没有问题
                        </div>
                        <form class="form-horizontal produce" action="<?= Url::toRoute('module/produce') ?>"
                              method="POST">
                            <input type="hidden" id="input-primary-key" value="" name="primaryKey"/>
                            <div class="form-group">
                                <label for="input-html"
                                       class="control-label col-xs-12 col-sm-3 no-padding-right">HTML文件</label>
                                <div class="col-xs-12 col-sm-9">
                                    <div class="clearfix">
                                        <input type="text" class="col-xs-12 col-sm-6" id="input-html" name="view"
                                               required="true" rangelength="[2, 200]"/>
                                        <label class="error" style="margin-left:5px;color:red"></label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="input-controller" class="control-label col-xs-12 col-sm-3 no-padding-right">
                                    控制器(Controller)
                                </label>
                                <div class="col-xs-12 col-sm-9">
                                    <div class="clearfix">
                                        <input type="text" class="col-xs-12 col-sm-6" id="input-controller"
                                               name="controller" required="true" rangelength="[2, 200]"/>
                                        <label class="error" style="margin-left:5px;color:red"></label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="input-controller" class="control-label col-xs-12 col-sm-3 no-padding-right">
                                    模型(Model)
                                </label>
                                <div class="col-xs-12 col-sm-9">
                                    <div class="clearfix">
                                        <input type="text" class="col-xs-12 col-sm-6" id="input-model"
                                               name="model" required="true" rangelength="[2, 200]"/>
                                        <label class="error" style="margin-left:5px;color:red"></label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-xs-12 col-sm-3 no-padding-right"> 导航栏目 </label>
                                <div class="col-xs-12 col-sm-9">
                                    &#12288;
                                    <label class="line-height-1 blue">
                                        <input type="radio" value="1" class="ace" name="menu" checked="checked"
                                               number="1" required="1">
                                        <span class="lbl"> 生成 </span>
                                    </label>
                                    &#12288;
                                    <label class="line-height-1 blue">
                                        <input type="radio" value="0" class="ace" name="menu" number="1" required="1">
                                        <span class="lbl"> 不生成 </span>
                                    </label>
                                    <?php if (!$is_application) : ?>
                                        <span style="margin-left:10px">
                                            <input type="text" id="input-menu-name" name="menu_prefix">
                                        </span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-xs-12 col-sm-3 no-padding-right"> 权限操作 </label>
                                <div class="col-xs-12 col-sm-9">
                                    &#12288;
                                    <label class="line-height-1 blue">
                                        <input type="radio" value="1" class="ace" name="auth" checked="checked"
                                               number="1" required="1">
                                        <span class="lbl"> 生成 </span>
                                    </label>
                                    &#12288;
                                    <label class="line-height-1 blue">
                                        <input type="radio" value="0" class="ace" name="auth" number="1" required="1">
                                        <span class="lbl"> 不生成 </span>
                                    </label>
                                    <?php if (!$is_application) : ?>
                                        <span style="margin-left:10px">
                                        <input type="text" name="auth_prefix" id="input-auth-name" value="">
                                    </span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-xs-12 col-sm-3 no-padding-right"> 允许文件覆盖 </label>
                                <div class="col-xs-12 col-sm-9">
                                    &#12288;
                                    <label class="line-height-1 blue">
                                        <input type="radio" value="1" class="ace" checked="checked" name="allow"
                                               number="1" required="1">
                                        <span class="lbl"> 允许 </span>
                                    </label>
                                    &#12288;
                                    <label class="line-height-1 blue">
                                        <input type="radio" value="0" class="ace" name="allow"
                                               number="1" required="1">
                                        <span class="lbl"> 不允许 </span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-xs-12 col-sm-4 col-sm-offset-3">
                                    <label>
                                        <input type="checkbox" class="ace" id="agree" checked name="agree"
                                               required="true">
                                        <span class="lbl"> 同意生成 </span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <hr/>
                <div class="wizard-actions">
                    <button class="btn btn-prev">
                        <i class="ace-icon fa fa-arrow-left"></i>上一步
                    </button>
                    <button class="btn btn-success btn-next" data-last="确认生成">
                        下一步<i class="ace-icon fa fa-arrow-right icon-on-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="hr hr-18 hr-double dotted"></div>
    <div class="alert alert-success isHide">
        <div class="code"></div>
    </div>

<?php $this->beginBlock('javascript') ?>
    <script type="text/javascript">
        var file = null,
            controller = null;
        model = null;
        $(function () {
            // 选择表
            $("#select-db").chosen({allow_single_deselect: true});
            $("#select-table").chosen({allow_single_deselect: true});
            $("#select-db").bind('change',function(){
                console.log($(this).val());
                if($(this).val()!=''){
                    location.href='/admin/module/index?db='+$(this).val();
                }
            });
            $(window)
                .off('resize.chosen')
                .on('resize.chosen', function () {
                    $('#select-db').each(function () {
                        var $this = $(this);
                        $this.next().css({'width': $this.parent().width()});
                    })
                    $('#select-table').each(function () {
                        var $this = $(this);
                        $this.next().css({'width': $this.parent().width()});
                    })
                }).trigger('resize.chosen');


            $('#fuelux-wizard')
                .ace_wizard()
                .on('change', function (e, info) {
                    if (info.direction === 'next') {
                        var f = $('#step' + info.step + ' form');
                        if (f.validate({
                            errorElement: 'div',
                            errorClass: 'help-block',
                            focusInvalid: false,
                            highlight: function (e) {
                                $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
                            },
                            success: function (e) {
                                $(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
                                $(e).remove();
                            }
                        }).form()) {
                            $.ajax({
                                'async': false,
                                'url': f.attr('action'),
                                'data': $('form').serialize(),
                                'type': 'POST',
                                'dataType': 'json'
                            }).done(function (json) {
                                layer.msg(json.msg, {icon: json.code === 0 ? 6 : 5});
                                if (json.code === 0) {
                                    // 第一步提交
                                    if (info.step === 1) {
                                        $('#my-content').html(json.data);
                                    }

                                    // 第二步提交
                                    if (info.step === 2) {
                                        $('.code').html(json.data.html).parent().show();
                                        // HTML
                                        $('#input-html').val(json.data.file[0]);
                                        if (json.data.file[1] == true) {
                                            file = json.data.file[0]
                                            $('#input-html').next().html(' ( * 文件已经存在,需要重新定义文件名 )');
                                        }

                                        // Controller
                                        $('#input-controller').val(json.data.controller[0]);
                                        if (json.data.controller[1] == true) {
                                            controller = json.data.controller[0]
                                            $('#input-controller').next().html(' ( * 文件已经存在,需要重新定义文件名 )');
                                        }

                                        // Model
                                        $('#input-model').val(json.data.model[0]);
                                        if (json.data.model[1] === true) {
                                            model = json.data.model[0];
                                            $('#input-model').next().html(' ( * 文件已经存在,需要重新定义文件名 )');
                                        }

                                        // 当文件存在、不允许覆盖
                                        if (
                                            json.data.file[1] == true ||
                                            json.data.controller[1] == true ||
                                            json.data.model[1] === true
                                        ) {
                                            $("input[name='allow'][value='0']").prop("checked", true);
                                        }

                                        // 主键
                                        $("#input-primary-key").val(json.data.primary_key);
                                        $("#input-auth-name").val(json.data.auth_name);
                                        $("#input-menu-name").val(json.data.menu_name);
                                    }
                                    return true;
                                } else {
                                    event.preventDefault()
                                }
                            });
                        } else {
                            return false;
                        }
                    } else {
                        $('.code').parent().hide();
                    }
                })
                .on('finished', function (e) {
                    // 初始验证
                    if ($('.produce').validate(validatorError).form()) {
                        // 自己验证
                        if (
                            $('input[name=allow]:checked').val() == 1 ||
                            (
                                $('#input-html').val() != file &&
                                $('#input-controller').val() != controller &&
                                $("#input-model").val() != model
                            )
                        ) {
                            $.ajax({
                                url: "<?=Url::toRoute('module/produce')?>",
                                data: $('form').serialize(),
                                dataType: "json",
                                type: "POST"
                            }).done(function (json) {
                                layer.msg(json.msg, {icon: json.code === 0 ? 6 : 5});
                                if (json.code === 0) {
                                    if ($('input[name=menu]:checked').val() == 1)
                                        window.location.href = json.data;
                                    else
                                        window.location.reload();
                                    $('form').each(function () {
                                        this.reset()
                                    });
                                }
                            });
                        } else {
                            layer.msg('文件名存在, 不能执行覆盖操作...');
                        }
                    }
                }).on('stepclick', function (e) {
                //e.preventDefault();//this will prevent clicking and selecting steps
            });

            // 表单编辑的显示与隐藏
            $(document).on('change', '.is-hide', function () {
                if ($(this).val() == 0) {
                    $(this).next('select').hide().next('input').hide();
                } else {
                    $(this).next('select').show().next('input').show();
                }
            });
        });
    </script>
<?php $this->endBlock(); ?>