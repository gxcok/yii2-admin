<?php

namespace gxcok\admin\controllers;

use Yii;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\image\drivers\Image;
use gxcok\admin\models\AdminLog;
use gxcok\admin\helpers\Helper;
use gxcok\admin\models\Auth;
use gxcok\admin\models\Admin;
use gxcok\admin\models\China;

/**
 * Class AdminController 后台管理员操作控制器
 * @package backend\controllers
 */
class AdminController extends Controller
{
    /**
     * @var string 定义使用的model
     */
    public $modelClass = 'gxcok\admin\models\Admin';

    /**
     * @var string 定义上传文件的目录
     */
    public $strUploadPath = './uploads/avatars/';

    /**
     * 处理查询条件
     *
     * @return array
     */
    public function where()
    {
        $intUid = (int)ArrayHelper::getValue($this->module, 'userId');
        return [
            // 不是管理员登录的话，只能看到自己添加和自己的数据
            'where' => $intUid !== Admin::SUPER_ADMIN_ID ? [
                ['or', ['id' => $intUid], ['created_id' => $intUid]]
            ] : [],

            // 其他查询字段信息
            [['id', 'status'], '='],
            [['username', 'email'], 'like'],
        ];
    }

    /**
     * 首页显示
     *
     * @return string
     *
     * @throws \yii\base\InvalidConfigException
     */
    public function actionIndex()
    {
        /* @var $admin \yii\web\User */
        $admin = ArrayHelper::getValue($this->module, 'admin');

        // 查询用户数据
        return $this->render('index', [
            'admins'      => Admin::getAdmins(),
            'roles'       => Admin::getArrayRole($admin->id),       // 用户角色
            'status'      => Admin::getArrayStatus(),               // 状态
            'statusColor' => Admin::getStatusColor(),               // 状态对应颜色
            'auth'        => Auth::getDataTableAuth(ArrayHelper::getValue($this->module, 'user')),
            'isSuper'     => $admin->can(Auth::SUPER_ADMIN_NAME),
            'admin'       => ArrayHelper::getValue($this->module, 'admin.identity')
        ]);
    }

    public function afterSearch(&$array)
    {
        /* @var $admin \yii\web\User */
        $admin = ArrayHelper::getValue($this->module, 'admin');
        if ($admin->can(Auth::SUPER_ADMIN_NAME)) {
            foreach ($array as &$user) {
                $user['switch_user_login'] = Helper::getSwitchLoginUrl(
                    $admin->id,
                    $user['id'],
                    [],
                    Url::toRoute('default/switch-login')
                );
            }
        }
    }

    /**
     * 查看个人信息
     *
     * @return string
     */
    public function actionView($id=0)
    {
        $address = Yii::t('admin', 'Select county');
        $admin   = ArrayHelper::getValue($this->module, 'admin.identity');
        $china   = [];
        if ($admin->address) {
            if ($arrAddress = explode(',', $admin->address)) {
                if (isset($arrAddress[2])) {
                    $address = $arrAddress[2];
                }

                // 查询省市信息
                $china = China::find()
                    ->where(['name' => array_slice($arrAddress, 0, 2)])
                    ->orderBy(['pid' => SORT_ASC])
                    ->all();
            }
        }

        // 操作日志
        $logs = AdminLog::find()->where([
            'admin_id' => $admin->id
        ])->orderBy(['id' => SORT_DESC])->limit(100)->asArray()->all();

        // 载入视图文件
        return $this->render('view', compact('admin', 'address', 'china', 'logs'));
    }

    /**
     * 上传文件之后的处理
     *
     * @param string $strFilePath
     * @param string $strField
     *
     * @return bool
     * @throws \yii\base\ErrorException
     * @throws \yii\base\InvalidConfigException
     */
    public function afterUpload($strFilePath, $strField)
    {
        // 不是上传上传头像信息，不处理
        if (!in_array($strField, ['avatar', 'face'])) {
            return $strFilePath;
        }

        // 删除之前的缩略图
        if ($strFace = Yii::$app->request->post('face')) {
            $strFace = dirname($strFace) . '/thumb_' . basename($strFace);
            if (file_exists('.' . $strFace)) @unlink('.' . $strFace);
        }

        /* @var $imageComponent yii\image\ImageDriver */
        $imageComponent = Yii::createObject(['class' => 'yii\image\ImageDriver', 'driver' => 'GD']);
        if (!$imageComponent) {
            return $strFilePath;
        }

        // 处理图片
        $strTmpPath = dirname($strFilePath) . '/thumb_' . basename($strFilePath);

        /* @var $image yii\image\drivers\Kohana_Image_GD */
        $image = $imageComponent->load($strFilePath);
        $image->resize(180, 180, Image::CROP)->save($strTmpPath);
        $image->resize(48, 48, Image::CROP)->save();

        // 管理员页面修改头像
        $admin = ArrayHelper::getValue($this->module, 'admin.identity');
        if ($admin && $strField === 'avatar') {
            // 删除之前的图像信息
            if ($admin->face && file_exists('.' . $admin->face)) {
                @unlink('.' . $admin->face);
                @unlink('.' . dirname($admin->face) . '/thumb_' . basename($admin->face));
            }

            $admin->face = ltrim($strFilePath, '.');
            $admin->save();
            return $strTmpPath;
        }

        return $strFilePath;
    }

    /**
     * 获取地址信息
     *
     * @return \yii\web\Response
     */
    public function actionAddress()
    {
        $request = Yii::$app->request;
        return $this->asJson(
            China::find()
                ->select(['id', 'name as text'])
                ->where([
                    'and',
                    // 父类ID
                    ['=', 'pid', (int)$request->get('iPid', 0)],
                    ['>', 'id', 0]
                ])
                ->andFilterWhere(['like', 'name', $request->get('query')])
                ->asArray()
                ->all()
        );
    }

    /**
     * 导出数据显示处理
     *
     * @return array
     */
    public function getExportHandleParams()
    {
        $array['created_at'] = $array['updated_at'] = function ($value) {
            return date('Y-m-d H:i:s', $value);
        };

        return $array;
    }

    /**
     * 重写批量删除处理
     *
     * @return mixed|string
     */
    public function actionDeleteAll()
    {
        $ids = Yii::$app->request->post('id');
        if (empty($ids) || !($arrIds = explode(',', $ids))) {
            return $this->error(201);
        }

        /* @var $model \gxcok\admin\models\Admin */
        $model = $this->modelClass;
        if (!$admins = $model::findAll([$this->pk => $arrIds])) {
            return $this->error(220);
        }

        $message = Yii::t('admin', 'Successfully processed') . ' <br>';
        foreach ($admins as $admin) {
            if ($admin->delete()) {
                $message .= $admin->username . Yii::t('admin', 'successfully deleted') . ' ; <br>';
            } else {
                $message .= $admin->username . Yii::t('admin', 'failed to delete') . Helper::arrayToString($admin->getErrors()) . ' <br>';
            }
        }

        return $this->success($arrIds, $message);
    }
}