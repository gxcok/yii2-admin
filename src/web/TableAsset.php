<?php

namespace gxcok\admin\web;

use yii\web\AssetBundle;

/**
 * Class TableAsset
 *
 * @package gxcok\admin\web
 */
class TableAsset extends AssetBundle
{
    /**
     * @var string 定义使用的目录路径
     */
    public $basePath = '@bower/gxcok-tables/dist/';

    /**
     * @var string 定义使用的目录路径
     */
    public $sourcePath = '@bower/gxcok-tables/dist/';

    /**
     * @var array 定义默认加载的js
     */
    public $js = [
        'meTables.js',
    ];

    /**
     * 重写注入资源函数
     *
     * @param \yii\web\View $view
     *
     * @return void|AssetBundle
     * @throws \yii\base\InvalidConfigException
     */
    public static function register($view)
    {
        $view->registerAssetBundle(ValidateAsset::className());
        $view->registerAssetBundle(DataTablesAsset::className());
        return parent::register($view);
    }
}