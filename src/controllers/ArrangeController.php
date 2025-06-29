<?php

namespace gxcok\admin\controllers;

use Yii;
use gxcok\admin\models\Admin;
use gxcok\admin\models\Arrange;
use yii\helpers\ArrayHelper;

/**
 * Class ArrangeController 日程安排控制器
 * @package backend\controllers
 */
class ArrangeController extends Controller
{
    /**
     * @var string 定义使用的model
     */
    public $modelClass = 'gxcok\admin\models\Arrange';

    /**
     * 查询参数配置
     *
     * @return array
     */
    public function where()
    {
        $intUid = (int)ArrayHelper::getValue($this->module, 'userId');
        return [
            // 不是管理员只能看自己的数据
            'where' => $intUid !== Admin::SUPER_ADMIN_ID ? [['or', ['id' => $intUid], ['created_id' => $intUid]]] : [],

            // 字段信息
            [['id', 'status', 'time_status', 'admin_id'], '='],
            ['title', 'like'],
        ];
    }

    /**
     * 首页显示
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index', [
            'admins'       => Admin::getAdmins(),
            'status'       => Arrange::getStatus(),         // 状态
            'timeStatus'   => Arrange::getTimeStatus(),     // 时间状态
            'statusColors' => Arrange::getStatusColors(),   // 状态颜色
            'timeColors'   => Arrange::getTimeColors(),     // 时间状态颜色
        ]);
    }

    /**
     * 管理日程
     * @return string
     */
    public function actionCalendar()
    {
        // 查询没有委派的信息
        $arrArrange = Arrange::find()->where([
            'and',
            ['!=', 'status', Arrange::STATUS_DEFER],
            ['=', 'admin_id', 0],
        ])->orderBy(['time_status' => SORT_DESC])->all();

        // 载入视图
        return $this->render('calendar', [
            'status'       => Arrange::getStatus(),         // 状态
            'timeStatus'   => Arrange::getTimeStatus(),     // 时间状态
            'arrange'      => $arrArrange,                  // 没有委派的事件
            'statusColors' => Arrange::getStatusColors(),   // 状态颜色
            'timeColors'   => Arrange::getTimeColors(),     // 时间状态颜色
        ]);
    }

    /**
     * 查询管理员日程信息
     *
     * @return \yii\web\Response
     */
    public function actionArrange()
    {
        $request = Yii::$app->request;
        // 查询条件
        $where = ['and', ['=', 'admin_id', ArrayHelper::getValue($this->module, 'userId')]];
        if ($strStart = $request->get('start')) {
            $where[] = ['>=', 'created_at', strtotime($strStart)];
        }

        if ($strEnd = $request->get('end')) {
            $where[] = ['<', 'created_at', strtotime($strEnd)];
        }

        // 查询管理员的日程
        if ($arrUserArrange = Arrange::find()->where($where)->asArray()->all()) {
            $arrTmp = [];
            foreach ($arrUserArrange as $value) {
                $arrTmp[] = [
                    'id'          => $value['id'],
                    'title'       => $value['title'],
                    'start'       => date('Y-m-d H:i:s', $value['start_at']),
                    'desc'        => $value['desc'],
                    'status'      => $value['status'],
                    'end'         => date('Y-m-d H:i:s', $value['end_at']),
                    'time_status' => $value['time_status'],
                    'className'   => Arrange::getStatusColors($value['status']),
                ];
            }

            $arrUserArrange = $arrTmp;
        }

        return $this->asJson($arrUserArrange);
    }

    /**
     * 导出数据显示问题(时间问题可以通过Excel自动转换)
     * @return  array
     */
    public function getExportHandleParams()
    {
        $array             = parent::getExportHandleParams();
        $array['start_at'] = $array['end_at'] = $array['created_at'];
        return $array;
    }
}
