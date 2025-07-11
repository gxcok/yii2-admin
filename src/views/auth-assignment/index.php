<?php

use yii\helpers\Html;
use yii\helpers\Json;
use gxcok\admin\models\Auth;
use gxcok\admin\widgets\MeTable;
use gxcok\admin\helpers\Helper;

// 获取权限
$auth = Auth::getDataTableAuth(Yii::$app->controller->module->user);

// 定义标题和面包屑信息
$this->title = '角色分配';

$url     = Helper::getAssetUrl();
$depends = ['depends' => 'gxcok\admin\web\AdminAsset'];

$this->registerJsFile($url . '/js/chosen.jquery.min.js', $depends);
$this->registerCssFile($url . '/css/chosen.css', $depends);
?>

    <div class="well">
        <form id="search-form">
            <div class="row">
                <div class="col-xs-6">
                    <div class="form-group">
                        <label for="inputEmail3" class="col-sm-2 control-label">管理员</label>
                        <div class="col-sm-10">
                            <?= Html::dropDownList(
                                'user_id',
                                null,
                                $admins,
                                [
                                    'multiple'         => 'multiple',
                                    'class'            => 'chosen-select tag-input-style',
                                    'data-placeholder' => '请选择管理员',
                                ]
                            ) ?>
                        </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="form-group">
                        <label for="inputEmail3" class="col-sm-2 control-label">分配角色</label>
                        <div class="col-sm-10">
                            <?= Html::dropDownList('item_name', null, $arrRoles, [
                                'multiple'         => 'multiple',
                                'class'            => 'chosen-select tag-input-style',
                                'data-placeholder' => '请选择角色',
                            ]) ?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 pull-right" style="margin-top: 10px;">
                    <div class="pull-right" id="me-table-buttons">
                        <button class="btn btn-info btn-sm">
                            <i class="ace-icon fa fa-search"></i> 搜索
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- 表格数据 -->
<?= MeTable::widget([
    'buttons' => [
        'id' => 'me-buttons',
    ],
]) ?>
<?php $this->beginBlock('javascript') ?>
    <script type="text/javascript">
        var roles = <?=$roles?>,
            aAdmins = <?=Json::encode($admins)?>,
            oButtons = <?=Json::encode($auth['buttons'])?>,
            oOperationsButtons = <?=Json::encode($auth['operations'])?>;
        oButtons.updateAll = null;
        oButtons.deleteAll = null;
        oOperationsButtons.see = null;
        oOperationsButtons.update = null;

        var m = meTables({
            searchType: "top",
            search: {
                render: false
            },
            number: false,
            title: "角色分配",
            checkbox: false,
            buttons: oButtons,
            operations: {
                "width": "auto",
                buttons: oOperationsButtons
            },
            table: {
                order: [],
                columns: [
                    {
                        title: "管理员",
                        data: "user_id",
                        value: aAdmins,
                        edit: {type: "select", required: true},
                        sortable: false,
                        render: function (data) {
                            return $.getValue(aAdmins, data, data);
                        }
                    },
                    {
                        title: "对应角色",
                        data: "item_name",
                        value: roles,
                        edit: {
                            "type": "select",
                            "multiple": true,
                            "id": "select-multiple",
                            "required": true,
                            "class": "tag-input-style width-100 chosen-select",
                            "data-placeholder": "请选择一个角色"
                        },
                        sortable: false,
                        createdCell: function (td, data) {
                            $(td).html($.getValue(roles, data, data));
                        }
                    },
                    {
                        title: "最初分配时间",
                        data: "created_at",
                        createdCell: MeTables.dateTimeString
                    }
                ]
            }
        });

        var $select = null;

        $.extend(m, {
            // 显示的前置和后置操作
            beforeShow: function () {
                $("#select-multiple").val([]).trigger("chosen:updated").next().css({'width': "100%"});
                return true;
            }
        });

        $(function () {
            m.init();

            // 选择表
            $select = $(".chosen-select").chosen({
                allow_single_deselect: false,
                width: "100%"
            });

            $(document).on('reset', "#search-form", function () {
                $select.val([]).trigger("chosen:updated").next().css({'width': "100%"});
            });
        });
    </script>
<?php $this->endBlock(); ?>