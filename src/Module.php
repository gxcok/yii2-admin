<?php

namespace gxcok\admin;

use Yii;
use yii\helpers\Json;
use gxcok\admin\traits\JsonTrait;
use yii\web\UnauthorizedHttpException;

/**
 * admin module definition class
 */
class Module extends yii\base\Module
{
    use JsonTrait;

    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'gxcok\admin\controllers';

    /**
     * @var string 定义使用布局
     */
    public $layout = '@gxcok/admin/views/layouts/main';

    /**
     * @var string 指定用户
     */
    public $user = 'admin';

    /**
     * @var array 不验证的控制器名称
     */
    public $allowControllers = ['default'];

    /**
     * @var int 允许开启 iFrame 个数
     */
    public $frameNumberSize = 8;

    /**
     * @var int 开启多少个 iFrame 显示关闭按钮
     */
    public $frameNumberShowClose = 3;

    /**
     * @var bool 权限验证
     */
    public $verifyAuthority = true;

    /**
     * @var string 默认首页action
     */
    public $defaultAction = 'default/system';

    /**
     * @var string 退出地址
     */
    public $logoutUrl = 'default/logout';

    /**
     * @var string 验证码地址
     */
    public $captchaAction = null;

    /**
     * @var bool 左边头部按钮
     */
    public $leftTopButtons = false;

    /**
     * @var array 用户点击相关按钮
     */
    public $userLinks = false;

    /**
     * @var string[] 登录视图中需要引入其他页面的路径配置
     */
    public $loginOtherRenderPaths = [
        // 注册管理员
        'register' => '/default/register',

        // 忘记密码
        'forgot'   => '/default/forgot',
    ];

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();

        // 资源处理
        Yii::$app->assetManager->bundles = [
            // 去掉自己的bootstrap 资源
            'yii\bootstrap\BootstrapAsset' => [
                'css' => [],
            ],
            // 去掉自己加载的Jquery
            'yii\web\JqueryAsset'          => [
                'sourcePath' => null,
                'js'         => [],
            ],
        ];

        // 设置错误处理页面
        Yii::$app->errorHandler->errorAction = $this->getUniqueId() . '/default/error';
        if (!isset(Yii::$app->i18n->translations['admin'])) {
            Yii::$app->i18n->translations['admin'] = [
                'class'          => 'yii\i18n\PhpMessageSource',
                'sourceLanguage' => 'en',
                'basePath'       => '@gxcok/admin/messages',
            ];
        }
    }

    /**
     * @param \yii\base\Action $action
     *
     * @return bool|\yii\console\Response|\yii\web\Response
     * @throws UnauthorizedHttpException
     * @throws \yii\base\InvalidConfigException
     * @throws \yii\web\ForbiddenHttpException
     */
    public function beforeAction($action)
    {
        // 不验证权限和用户登录
        if (in_array($action->controller->id, $this->allowControllers)) {
            return parent::beforeAction($action);
        }

        /* @var $webUser \yii\web\User */
        $webUser = Yii::$app->get($this->user);
        // 验证用户登录
        if ($webUser->isGuest) {
            $webUser->loginRequired();
            return false;
        }

        // 验证权
        if ($this->verifyAuthority && !$webUser->can($action->getUniqueId())) {
            // 没有权限AJAX返回
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->content = Json::encode($this->error(216));
                return false;
            }

            throw new UnauthorizedHttpException('对不起，您现在还没获得该操作的权限!');
        }

        return true;
    }

    /**
     * 获取登录用户
     *
     * @return null|object
     * @throws \yii\base\InvalidConfigException
     */
    public function getUser()
    {
        return Yii::$app->get($this->user);
    }

    /**
     * 获取登录用户ID
     *
     * @return mixed
     * @throws \yii\base\InvalidConfigException
     */
    public function getUserId()
    {
        return $this->getUser()->id;
    }

    /**
     * @return null|object
     *
     * @throws \yii\base\InvalidConfigException
     */
    public function getAdmin()
    {
        return $this->getUser();
    }
}
