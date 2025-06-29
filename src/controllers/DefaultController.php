<?php

namespace gxcok\admin\controllers;

use Yii;

use yii\filters\AccessControl;
use yii\filters\VerbFilter;
use yii\helpers\ArrayHelper;
use gxcok\admin\models\Auth;
use gxcok\admin\models\Menu;
use gxcok\admin\models\Admin;
use gxcok\admin\helpers\Helper;
use gxcok\admin\traits\JsonTrait;
use gxcok\admin\models\forms\AdminForm;


/**
 * Class DefaultController 后台首页处理
 * @package backend\controllers
 */
class DefaultController extends \yii\web\Controller
{
    use JsonTrait;

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'user'  => ArrayHelper::getValue($this->module, 'user'),
                'rules' => [
                    [
                        'actions' => ['login', 'error', 'captcha'],
                        'allow'   => true,
                    ],
                    [
                        'actions' => [
                            'logout', 'index', 'system',
                            'update', 'create', 'switch-login',
                        ],
                        'allow'   => true,
                        'roles'   => ['@'],
                    ],
                ],
            ],
            'verbs'  => [
                'class'   => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error'   => [
                'class' => 'gxcok\admin\actions\ErrorAction',
            ],
            'captcha' => [
                'class'     => 'yii\captcha\CaptchaAction',
                'maxLength' => 6,           // 最大显示个数
                'minLength' => 4,           // 最少显示个数
                'padding'   => 2,           // 间距
                'height'    => 34,          // 高度
                'width'     => 130,         // 宽度
                'offset'    => 8,           // 设置字符偏移量 有效果
            ],
        ];
    }

    /**
     *
     * 管理员登录欢迎页
     *
     * @return string
     */
    public function actionIndex()
    {
        $this->layout = false;

        // 获取用户导航栏信息
        $user  = ArrayHelper::getValue($this->module->getAdmin(), 'identity');
        $menus = Menu::getUserMenus($user->id);
        return $this->render('index', compact('user', 'menus'));
    }

    /**
     * 显示首页系统信息
     *
     * @return string
     */
    public function actionSystem()
    {
        // 获取用户信息
        $user = ArrayHelper::getValue($this->module->getAdmin(), 'identity');
        return $this->render('system', [
            'yii'    => 'Yii ' . Yii::getVersion(),                         // Yii 版本
            'upload' => ini_get('upload_max_filesize'),             // 上传文件大小,
            'user'   => $user,
        ]);
    }

    /**
     * 切换账号登录
     *
     * @return \yii\web\Response
     */
    public function actionSwitchLogin()
    {
        // 数据不存在
        if (!$array = Helper::getSwitchLoginInfo(Yii::$app->request->get('token'))) {
            return $this->redirect(Yii::$app->request->getReferrer());
        }

        // 查询用户是否
        if (!$afterUserInfo = Admin::findOne(ArrayHelper::getValue($array, 'after_user_id'))) {
            Yii::$app->session->setFlash('error', Yii::t('admin', '切换登录用户不存在'));
            return $this->redirect(Yii::$app->request->getReferrer());
        }

        /* @var $admin \yii\web\User */
        /* @var  $user Admin */
        $admin = $this->module->getAdmin();
        $user  = $admin->identity;
        // 验证用户权限
        if (
            $user->id == Admin::SUPER_ADMIN_ID || // 超级管理员随便切
            in_array($afterUserInfo->id, [Admin::SUPER_ADMIN_ID, $user->created_id]) ||
            $admin->can(Auth::SUPER_ADMIN_NAME) // 拥有超级管理员权限
        ) {
            // 退出当前用户
            $admin->logout();

            // 记录之前登录的用户
            if (Yii::$app->request->get('type') != 'come-back') {
                Yii::$app->session->set('before_user', $user->toArray(['id', 'username']));
            }

            // 登录新增用户
            $admin->login($afterUserInfo, 0);
            return $this->redirect(['default/index']); // 到首页去
        }

        Yii::$app->session->setFlash('error', Yii::t('admin', '抱歉，没有权限进行该操作'));
        return $this->redirect(Yii::$app->request->getReferrer());
    }

    /**
     * 后台管理员登录
     *
     * @return string|\yii\web\Response
     * @throws \yii\base\InvalidConfigException
     */
    public function actionLogin()
    {
        $this->layout = 'login.php';

        // 不是游客直接跳转到首页
        if (!$this->module->getAdmin()->isGuest) {
            return $this->goHome();
        }

        $model = new AdminForm();
        if ($model->load(Yii::$app->request->post())) {
            if ($model->login(ArrayHelper::getValue($this->module, 'user'))) {
                Yii::$app->session->remove('validateCode');
                return $this->goBack(); // 到首页去
            } else {
                Yii::$app->session->set('validateCode', true);
            }
        }

        return $this->render('login', compact('model'));
    }

    /**
     * 后台管理员退出
     *
     * @return \yii\web\Response
     */
    public function actionLogout()
    {
        $user  = $this->module->getAdmin();
        $admin = ArrayHelper::getValue($user, 'identity');
        if ($admin && $admin instanceof Admin) {
            $admin->last_time = time();
            $admin->last_ip   = Helper::getIpAddress();
            $admin->save();
        }

        $user->logout();
        return $this->goHome();
    }
}
