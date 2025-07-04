<?php

use yii\helpers\Json;
use gxcok\admin\widgets\MeTable;
use gxcok\admin\helpers\Helper;

// 定义标题和面包屑信息
$this->title = '管理员日程安排';
$url         = Helper::getAssetUrl();
$depends     = ['depends' => 'gxcok\admin\web\AdminAsset'];

$this->registerCssFile($url . '/css/jquery-ui.custom.min.css', $depends);
$this->registerCssFile($url . '/css/bootstrap-editable.css', $depends);
$this->registerCssFile($url . '/css/bootstrap-datetimepicker.css', $depends);
$this->registerJsFile($url . '/js/jquery-ui.custom.min.js', $depends);
$this->registerJsFile($url . '/js/jquery.ui.touch-punch.min.js', $depends);
$this->registerJsFile($url . '/js/x-editable/bootstrap-editable.min.js', $depends);
$this->registerJsFile($url . '/js/x-editable/ace-editable.min.js', $depends);
$this->registerJsFile($url . '/js/date-time/moment.min.js', $depends);
$this->registerJsFile($url . '/js/date-time/bootstrap-datetimepicker.min.js', $depends);

?>
<?= MeTable::widget() ?>
<?php $this->beginBlock('javascript') ?>
    <script type="text/javascript">
        var aAdmins = <?=Json::encode($admins)?>,
            aStatus = <?=Json::encode($status)?>,
            aTimeStatus = <?=Json::encode($timeStatus)?>,
            aColors = <?=Json::encode($statusColors)?>,
            aTimeColors = <?=Json::encode($timeColors)?>;
        aAdmins['0'] = '待定';

        var m = mt({
            title: "管理员日程安排",
            editable: {},
            editableMode: "inline",
            number: false,
//        oEditFormParams: {				// 编辑表单配置
//            bMultiCols: true,          // 是否多列
//            iColsLength: 2,             // 几列
//            aCols: [2, 4],              // label 和 input 栅格化设置
//            sModalClass: "",			// 弹出模块框配置
//            sModalDialogClass: ""		// 弹出模块的class
//        },
//        oViewTable: {                   // 查看详情配置信息
//            bMultiCols: true,
//            iColsLength: 2
//        }
            table: {
                columns: [
                    {
                        title: "id ",
                        data: "id",
                        edit: {type: "hidden"},
                        search: {type: "text"},
                        defaultOrder: "desc"
                    },
                    {
                        title: "事件标题",
                        data: "title",
                        editable: {
                            type: "text",
                            validate: function (x) {
                                if (x.length > 100 || x.length < 2) return "长度必须为2到50字符";
                            }
                        },
                        edit: {type: "text", required: true, rangeLength: "[2, 100]"},
                        search: {name: "title"},
                        sortable: false
                    },
                    {
                        title: "事件描述",
                        data: "desc",
                        edit: {type: "textarea", rows: 5, required: true, rangeLength: "[2, 255]"},
                        sortable: false
                    },
                    {
                        title: "开始时间",
                        data: "start_at",
                        edit: {type: "dateTime", class: "time-format", required: true},
                        createdCell: MeTables.dateTimeString
                    },
                    {
                        title: "结束时间",
                        data: "end_at",
                        edit: {type: "dateTime", class: "time-format m-time", required: true},
                        createdCell: MeTables.dateTimeString
                    },
                    {
                        title: "日程状态",
                        data: "status",
                        value: aStatus,
                        edit: {type: "radio", default: 0, required: true, number: true},
                        search: {type: "select"},
                        sortable: false,
                        editable: {
                            type: "select"
                        },
                        createdCell: function (td, data) {
                            $(td).html(MeTables.valuesString(aStatus, aColors, data));
                        }
                    },
                    {
                        title: "时间状态",
                        data: "time_status",
                        value: aTimeStatus,
                        edit: {type: "radio", default: 1, required: true, number: true},
                        search: {type: "select"},
                        sortable: false,
                        createdCell: function (td, data) {
                            $(td).html(MeTables.valuesString(aTimeStatus, aTimeColors, data));
                        }
                    },
                    {
                        title: "处理人",
                        data: "admin_id",
                        value: aAdmins,
                        edit: {type: "select", "required": true, "number": true},
                        search: {type: "select"},
                        render: function (data) {
                            return $.getValue(aAdmins, data, data);
                        },
                        sortable: false
                    },
                    {
                        title: "创建时间",
                        data: "created_at",
                        createdCell: MeTables.dateTimeString
                    },
                    {
                        title: "添加用户",
                        data: "created_id",
                        sortable: false,
                        render: function (data) {
                            return $.getValue(aAdmins, data, data);
                        }
                    },
                    {
                        title: "修改时间",
                        data: "updated_at",
                        createdCell: MeTables.dateTimeString
                    },
                    {
                        title: "修改用户",
                        data: "updated_id",
                        sortable: false,
                        render: function (data) {
                            return $.getValue(aAdmins, data, data);
                        }
                    }
                ]
            }
        });

        $(function () {
            m.init();
            // 时间选项
            $('.datetime-picker').datetimepicker({
                format: 'YYYY-MM-DD H:mm:ss'
            });
        });
    </script>
<?php $this->endBlock() ?>