<?php

use yii\helpers\Json;
use yii\helpers\ArrayHelper;
use gxcok\admin\models\Auth;
use gxcok\admin\widgets\MeTable;

$array_default_auth = (new Auth())->array_default_auth;
$auth               = Auth::getDataTableAuth(Yii::$app->controller->module->user);
// 定义标题和面包屑信息
$this->title = '导航栏目信息';
?>
<?= MeTable::widget() ?>
<?php $this->beginBlock('javascript') ?>
    <script type="text/javascript">
        var aAdmins = <?=Json::encode($admins)?>,
            aParents = <?= $parents ?>,
            arrStatus = <?=Json::encode(ArrayHelper::getValue(Yii::$app->params, 'status', ['禁用', '启用']))?>;

        // 显示上级分类
        function parentStatus(td, data) {
            $(td).html($.getValue(aParents, data, '顶级分类'));
        }

        $.extend(MeTables, {
            selectOptionsCreate: function (params) {
                return '<select ' + this.handleParams(params) + '><option value="0">顶级分类</option><?=$options?></select>';
            },
            selectOptionsSearchMiddleCreate: function (params) {
                delete params.type;
                params.id = "search-" + params.name;
                return '<label for="' + params.id + '"> ' + params.title + ': <select ' + this.handleParams(params) + '>' +
                    '<option value="All">请选择</option>' +
                    '<option value="0">顶级分类</option>' +
                    '<?=$options?>' +
                    '</select></label>';
            }
        });

        var auth_item = <?=Json::encode($array_default_auth)?>;

        var m = mt({
            title: "导航栏目",
            buttons: <?=Json::encode($auth['buttons'])?>,
            operations: {
                buttons: <?=Json::encode($auth['operations'])?>
            },
            number: false,
            table: {
                columns: [
                    {
                        data: "id",
                        title: "Id",
                        defaultOrder: "desc",
                        edit: {type: "hidden"},
                        search: {type: "text"}
                    },
                    {
                        data: "pid",
                        title: "上级分类",
                        edit: {type: "selectOptions", number: 1, id: "select-options"},
                        search: {type: "selectOptions"},
                        createdCell: parentStatus
                    },
                    {
                        data: "menu_name",
                        title: "栏目名称",
                        edit: {required: 1, rangeLength: "[2, 50]"},
                        search: {name: "menu_name"},
                        sortable: false
                    },
                    {
                        data: "icons",
                        title: "图标",
                        edit: {rangeLength: "[2, 50]", value: "menu-icon fa fa-globe"},
                        sortable: false
                    },
                    {
                        data: "url",
                        title: "访问地址",
                        edit: {rangeLength: "[2, 50]"},
                        search: {name: "url"},
                        sortable: false
                    },
                    {
                        data: "status",
                        title: "状态",
                        value: arrStatus,
                        edit: {type: "radio", "default": 1, required: 1, "number": 1},
                        search: {type: "select"},
                        createdCell: MeTables.statusString,
                        sortable: false
                    },
                    {
                        data: "sort",
                        title: "排序",
                        edit: {type: "text", required: 1, number: 1, "value": 100}
                    },
                    {
                        data: null,
                        defaultContent: "",
                        hide: true,
                        title: "权限",
                        value: auth_item,
                        edit: {
                            type: "checkbox",
                            name: "auth[]",
                            all: true
                        }
                    },
                    // 公共属性字段信息
                    {
                        data: "created_at",
                        title: "创建时间",
                        createdCell: MeTables.dateTimeString
                    },
                    {
                        data: "created_id",
                        title: "创建用户",
                        render: function (data) { return $.getValue(aAdmins, data, data); },
                        sortable: false
                    },
                    {
                        data: "updated_at",
                        title: "修改时间",
                        createdCell: MeTables.dateTimeString
                    },
                    {
                        data: "updated_id",
                        title: "修改用户",
                        render: function (data) { return $.getValue(aAdmins, data, data); },
                        sortable: false
                    }
                ]
            }
        });

        // 添加之前之后处理
        $.extend(m, {
            beforeShow: function () {
                $("#select-options option").prop("disabled", false);
                if (this.action === "update") {
                    $(".div-left-auth").parent().addClass("hide");
                } else {
                    $(".div-left-auth").parent().removeClass("hide");
                }

                return true;
            },

            afterShow: function (data) {
                if (this.action === "update") {
                    // 自己不能选
                    $("#select-options option[value='" + data.id + "']").prop("disabled", true);
                    // 子类不能选
                    $("#select-options option[data-pid='" + data.id + "']").prop("disabled", true).each(function () {
                        $("#select-options option[data-pid='" + $(this).val() + "']").prop("disabled", true)
                    });
                }
                return true;
            }
        });

        // 表单初始化
        $(function () {
            m.init();
        });
    </script>
<?php $this->endBlock(); ?>