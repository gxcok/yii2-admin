<?php
namespace gxcok\admin\controllers;
use common\Lib\Util;
use gxcok\admin\helpers\Helper;
use gxcok\admin\models\Uploads;
use backend\models\CkReport;
use yii\helpers\ArrayHelper;
use Yii;
/**
 * Class UploadsController 上传文件 执行操作控制器
 *
 * @package backend\controllers
 */
class UploadsController extends Controller
{
    /**
     * @var string 定义使用的model
     */
    public $modelClass = 'gxcok\admin\models\Uploads';

    /**
     * 处理新增数据
     *
     * @return mixed|string
     */
    public function actionCreate()
    {
        if (!$data = Yii::$app->request->post()) {
            return $this->error(201);
        }

        // 实例化出查询的model
        /* @var $model \yii\db\ActiveRecord */
        $model = new $this->modelClass();

        // 验证是否定义了创建对象的验证场景
        if (ArrayHelper::getValue($model->scenarios(), 'create')) {
            $model->scenario = 'create';
        }

        // 对model对象各个字段进行赋值
        if (!$model->load($data, '')) {
            return $this->error(205);
        }

        // 判断修改返回数据
        if (!$model->save()) {
            return $this->error(1001, Helper::arrayToString($model->getErrors()));
        }

        return $this->success($model);
    }

    public function actionUpdate()
    {
        // 接收参数判断
        $data = Yii::$app->request->post();

        if (!$model = $this->findOne($data)) {
            return $this->returnJson();
        }

        // 判断是否存在指定的验证场景，有则使用，没有默认
        if (ArrayHelper::getValue($model->scenarios(), 'update')) {
            $model->scenario = 'update';
        }

        // 对model对象各个字段进行赋值
        if (!$model->load($data, '')) {
            return $this->error(205);
        }

        // 修改数据失败
        if (!$model->save()) {
            return $this->error(1003, Helper::arrayToString($model->getErrors()));
        }

        return $this->success($model);
    }

    public function where()
    {
        return [
            /*[['title'], 'like'],*/
            [['title','file_type','type'], '='],
        ];
    }
}
