<?php

namespace gxcok\admin;

use Yii;

/**
 * Class AdminAsset 后台资源加载类
 * @package backend\assets
 */
class AdminAsset extends AppAsset
{
    /**
     * @var array 定义默认加载的js
     */
    public $js = [
        'js/ace-elements.min.js',
        'js/ace.min.js',
        'js/common/tools.js',
        'js/layer/layer.js'
    ];

    /**
     * 注册 meTables 所需的js
     *
     * @param \yii\web\View $view 视图
     * @param string        $url  路径
     */
    public static function meTablesRegister($view, $url = '')
    {
        // 没有配置地址
        if (empty($url)) {
            list(, $url) = Yii::$app->assetManager->publish((new self)->sourcePath);
        }

        // 加载资源
        $resource = [
            'js/jquery.dataTables.min.js',
            'js/jquery.dataTables.bootstrap.js',
            'js/jquery.validate.min.js',
            'js/validate.message.js',
            'js/common/meTables.js',
        ];

        // 注入js
        foreach ($resource as $value) {
            $view->registerJsFile($url . '/' . $value, ['depends' => self::className()]);
        }
    }
}