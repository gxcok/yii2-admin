<?php

namespace gxcok\admin\controllers;

use gxcok\admin\models\forms\ModuleForm;
use Yii;
use yii\helpers\ArrayHelper;
use yii\helpers\FileHelper;
use yii\helpers\Url;
use gxcok\admin\models\Menu;
use gxcok\admin\models\Auth;
use gxcok\admin\helpers\Helper;
use yii\web\Application;

/**
 * Class ModuleController 模块生成测试文件
 * @package backend\controllers
 */
class ModuleController extends Controller
{
    /**
     * 定义使用的行为，修改行为，不记录日志
     *
     * @return array
     */
    public function behaviors()
    {
        return [];
    }

    /**
     * 首页显示
     *
     * @return string
     * @throws \yii\base\NotSupportedException
     */
    public function actionIndex()
    {
        $db_name=Yii::$app->request->get('db');
        if(!empty($db_name)){
            $db=Yii::$app->getDb($db_name);
        }else{
            $db=Yii::$app->db;
            $db_name=$db->getCurrentDbName();
        }
        /*var_dump($db_name);
        exit;*/
        //var_dump($_SESSION,Yii::$app->session['all_table']);
        if($db->driverName=='pgsql'){
            $sql = "SELECT table_name FROM INFORMATION_SCHEMA.TABLES where table_schema='public'";
        }else{
            $sql = "SELECT table_name FROM INFORMATION_SCHEMA.TABLES where table_schema='".$db_name."'";
        }
        if(empty(Yii::$app->session['all_table'])){
            //Yii::app()->session['all_table']=Yii::$app->db->getSchema()->getTableSchemas();
            $tables = $db->createCommand($sql)->queryAll();
            $tables = array_change_key_case($tables, CASE_LOWER);//mysql8 返回表名都是大写 都转大写 兼容优化
            $tables = ArrayHelper::map($tables, 'TABLE_NAME', 'TABLE_NAME');
            $unselect_table_arr=[];
            foreach ($tables as $tb) {
                if(!empty($unselect_table_arr)){
                    if(in_array($tb,$unselect_table_arr)){
                        unset($tables[$tb]);
                    }
                }
                //排除Yii本身的表
                if(strpos($tb,'yii2_') !== false){
                    unset($tables[$tb]);
                }
            }
            Yii::$app->session['all_table'] = $tables;
            //var_dump(Yii::$app->session['all_table']);
        }else{
            $tables = Yii::$app->session['all_table'];
        }
        $select_db=empty($db_name)?'':$db_name;
        /*$pos = strpos($search_arr, ',');
        if($pos !== false){
            var_dump($tb);
        }*/

        //var_dump($tables);
        return $this->render('index', [
            //'db'             => ['game_data_db'=>'游戏用户库','game_dic_db'=>'游戏字典库','game_log_db'=>'游戏记录数据库'],
            'select_db'         => $select_db,
            'tables'         => $tables,
            'is_application' => $this->module->module instanceof Application,
        ]);
    }

    /**
     * 第一步接收标题和数据表数据生成表单配置信息
     *
     * @return mixed|string
     * @throws \yii\base\NotSupportedException
     * @throws \yii\db\Exception
     */
    public function actionCreate()
    {
        // 1、接收参数并验证
        $request  = Yii::$app->request;
        $strTitle = $request->post('title'); // 标题
        $select_db = $request->post('select_db');
        $strTable = $request->post('table'); // 数据库表
        if (empty($strTable) || empty($strTitle)) {
            return $this->error(201);
        }

        // 获取库信息
        if(empty($select_db)){
            $db = Yii::$app->db;
        }else{
            $db = Yii::$app->get($select_db);
        }

        // 查询表结构信息
        if($db->driverName=='pgsql'){
            $arrTables = $db->createCommand("SELECT a.attname AS field,t.typname AS type,a.atttypmod AS lengthvar,a.attnotnull AS notnull,b.description AS comment FROM pg_class c,pg_attribute a LEFT OUTER JOIN pg_description b ON a.attrelid=b.objoid AND a.attnum = b.objsubid,pg_type t WHERE c.relname = '".$strTable."' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid")->queryAll();
            $key = $db->createCommand("SELECT string_agg(DISTINCT a.attname,',')  AS primaryKeyColumn FROM pg_constraint s INNER JOIN pg_class c ON s.conrelid = c.oid INNER JOIN pg_attribute a ON a.attrelid = c.oid AND array_position(s.conkey,a.attnum) is not null WHERE  s.contype = 'p' AND a.attnum > 0 AND  c.relname = '".$strTable."'")->queryOne();
            foreach ($arrTables as $k => $value) {
                $arrTables[$k]['primarykeycolumn']=$key['primarykeycolumn'];
            }
            //var_dump($arrTables);
        }else{
            $arrTables = $db->createCommand('SHOW FULL COLUMNS FROM `' . $strTable . '`')->queryAll();
            foreach ($arrTables as $key => $value) {
                $arrTables[$key]=array_change_key_case($value,CASE_LOWER);
            }
        }
        if (empty($arrTables)) {
            return $this->error(218);
        }

        return $this->success($this->createForm($arrTables));
    }

    /**
     * 第二步生成预览HTML文件
     * @return mixed|string
     * @throws \yii\base\Exception
     */
    public function actionUpdate()
    {
        // 1、获取验证参数
        $request = Yii::$app->request;

        $model = new ModuleForm([
            'attr'       => $request->post('attr'),
            'table'      => $request->post('table'),
            'primaryKey' => $request->post('pk'),
            'title'      => $request->post('title'),
        ]);

        if (empty($model->table) || empty($model->attr)) {
            return $this->error(201);
        }

        $name = $model->getName();
        if (empty($name)) {
            return $this->error(217);
        }

        // 类名需要处理为大驼峰法
        $className = $model->getTableClassName();

        // 路由、菜单、视图 需要将 _ 替换为 -
        $name = str_replace('_', '-', $name);

        // 命名空间
        $basePath = '@' . str_replace(['\\', '/controllers'], ['/', ''], $this->module->module->controllerNamespace);

        // 控制器路径
        $controllerName = $basePath . '/controllers/' . $className . 'Controller.php';

        // 模型路径
        $modelName = $basePath . '/models/' . $className . '.php';

        // 视图路径
        $viewName = $basePath . '/views/' . $name . '/index.php';

        // 如果是模块的话，添加模块名称
        if (!($this->module->module instanceof Application)) {
            $name = $this->module->module->id . '/' . $name;
        }

        return $this->success([
            'html'        => highlight_string($this->createView($model, false), true),
            'file'        => [$viewName, file_exists(Yii::getAlias($viewName))],
            'controller'  => [$controllerName, file_exists(Yii::getAlias($controllerName))],
            'model'       => [$modelName, file_exists(Yii::getAlias($modelName))],
            'primary_key' => $model->primaryKey,
            'auth_name'   => $name,
            'menu_name'   => $name,
        ]);
    }

    /**
     * 第三步开始生成文件
     * @return mixed|string
     * @throws \yii\base\Exception
     */
    public function actionProduce()
    {
        // 接收参数
        $request = Yii::$app->request;

        // 模型赋值
        $model = new ModuleForm();
        $model->load($request->post(), '');
        if (!$model->validate()) {
            return $this->error(201, Helper::arrayToString($model->getErrors()));
        }

        // 其他参数
        $auth  = (int)$request->post('auth');  // 生成权限
        $menu  = (int)$request->post('menu');  // 生成导航
        $allow = (int)$request->post('allow'); // 允许文件覆盖

        // 前缀
        $authName = $request->post('auth_prefix');
        $menuName = $request->post('menu_prefix');

        // 表名字不能为空
        if (!$name = $model->getName()) {
            return $this->error(217);
        }

        // 获取文路径
        $viewPath       = $model->getViewPath();
        $controllerPath = $model->getControllerPath();
        $modelPath      = $model->getModelPath();

        // 路由、菜单、视图 需要将 _ 替换为 -
        $name = str_replace('_', '-', $name);

        // 验证文件不存在
        if ($allow !== 1 && (file_exists($viewPath) || file_exists($controllerPath) || file_exists($modelPath))) {
            return $this->error(219);
        }

        // 生成权限
        if ($auth == 1 && !$this->createAuth($name, $model->title, $authName)) {
            return $this->error(223);
        }

        // 生成导航栏目
        if ($menu == 1 && !$this->createMenu($name, $model->title, $menuName)) {
            return $this->error(224);
        }

        // 生成视图文件
        $this->createView($model);

        // 生成控制器
        $this->createController($model);

        // 生成model
        $this->createModel($model);

        // 返回数据
        return $this->success(Url::toRoute(['/' . $name . '/index']));
    }

    /**
     * 生成权限操作
     * @access private
     *
     * @param string $prefix    前缀名称
     * @param string $title     标题
     * @param string $auth_name 权限名称
     *
     * @return bool
     *
     * @throws \yii\base\Exception
     */
    private function createAuth($prefix, $title, $auth_name = '')
    {
        $name = $auth_name ?: $prefix;
        $name = trim($name, '/') . '/';
        $auth = new Auth();
        return $auth->batchInsert(array_keys($auth->array_default_auth), $name, $title);
    }

    /**
     * 生成导航栏信息
     *
     * @access private
     *
     * @param string $name      权限名称
     * @param string $title     导航栏目标题
     * @param string $menu_name 栏目名称
     *
     * @return bool
     */
    private function createMenu($name, $title, $menu_name = '')
    {
        $url = $menu_name ?: $name;
        $url = trim($url, '/') . '/index';

        // 不存在创建、存在修改
        if (!$model = Menu::findOne(['url' => $url])) {
            $model        = new Menu();
            $model->pid   = 0;
            $model->icons = 'menu-icon fa fa-globe';
            $model->url   = $url;
            $model->sort   = 1;
        }

        $model->menu_name = $title;
        $model->status    = 1;

        return $model->save(false);
    }

    /**
     * 生成视图文件信息
     *
     * @param $array
     *
     * @return string
     */
    private function createForm($array)
    {
        $primary_key = '';
        foreach ($array as $value) {
            if(array_key_exists('primarykeycolumn',$value)){//pgsql
                $primary_key = $value['primarykeycolumn'];
            }else{
                if (ArrayHelper::getValue($value, 'key') == 'PRI') {
                    $primary_key = ArrayHelper::getValue($value, 'field');
                }
            }
            break;
        }
        $strHtml = '<div class="alert alert-info">
    <button data-dismiss="alert" class="close" type="button">×</button>
    <strong>填写配置表格信息!</strong>
</div>';
        $table   = '';
        foreach ($array as $value) {
            $key     = $value['field'];
            $title   = ArrayHelper::getValue($value, 'comment') ?: $value['field'];
            $options = [];
            if(array_key_exists('primarykeycolumn',$value)) {//pgsql
                if (ArrayHelper::getValue($value, 'notnull') == 't') {
                    $options[] = 'required: true';
                }
                if (stripos($value['type'], 'int') !== false) {
                    $options[] = 'number: true';
                }
                if (stripos($value['type'], 'varchar') !== false) {
                    $options[] = 'rangeLength: "[3, ' . (intval($value['lengthvar'])-4) . ']"';
                }
            }else{
                if (ArrayHelper::getValue($value, 'null') == 'NO') {
                    $options[] = 'required: true';
                }

                if (stripos($value['type'], 'int(') !== false) {
                    $options[] = 'number: true';
                }

                if (stripos($value['type'], 'varchar(') !== false) {
                    $sLen      = trim(str_replace('varchar(', '', $value['type']), ')');
                    $options[] = 'rangeLength: "[2, ' . $sLen . ']"';
                }
            }

            // 主键修改隐藏
            if ($key == $primary_key) {
                $options = [];
                $select  = '<option value="hidden" selected="selected">hidden</option>';
            } else {
                $select = '<option value="text" selected="selected">text</option>';
            }

            $other   = stripos($value['field'], '_at') !== false ? 'MeTables.dateTimeString' : '';
            $options = implode(', ', $options);
            $table   .= <<<HTML
<tr>
    <td>{$key}</td>
    <td><input type="text" name="attr[{$key}][title]" value="{$title}" required="required" /></td>
    <td>
        <select class="is-hide" name="attr[{$key}][edit]">
            <option value="1" selected="selected">开启</option>
            <option value="0" >关闭</option>
        </select>
        <select name="attr[{$key}][type]">
            {$select}
            <option value="text">text</option>
            <option value="hidden" >hidden</option>
            <option value="select">select</option>
            <option value="radio">radio</option>
            <option value="password">password</option>
            <option value="textarea">textarea</option>
        </select>
        <input type="text" name="attr[{$key}][options]" value='{$options}'/>
    </td>
    <td class="text-center">
        <select name="attr[{$key}][search]">
            <option value="1">开启</option>
            <option value="0" selected="selected">关闭</option>
        </select>
    </td>
    <td class="text-center">
        <select name="attr[{$key}][bSortable]">
            <option value="1" >开启</option>
            <option value="0" selected="selected">关闭</option>
        </select>
    </td>
    <td class="text-center">
        <input type="text" name="attr[{$key}][createdCell]" value="{$other}" />
    </td>
    <td class="text-center">
        <button class="btn btn-danger btn-xs" type="button" onclick="$(this).parent().parent().remove()">删除</button>
    </td>
</tr>
HTML;
        }

        return '<table class="table table-striped table-bordered table-hover">
     <thead>
     <tr>
        <th class="text-center">字段</th>
        <th class="text-center">标题</th>
        <th class="text-center">编辑</th>
        <th class="text-center">搜索</th>
        <th class="text-center">排序</th>
        <th class="text-center">回调</th>
        <th class="text-center">操作</th>
    </tr>
    <tbody>
    ' . $table . '
</tbody>
</thead>       
</table>' . $strHtml . '<input type="hidden" name="pk" value="' . $primary_key . '">';
    }

    /**
     * 生成预览HTML文件
     * @access private
     *
     * @param ModuleForm $model
     * @param boolean    $write
     *
     * @return string
     * @throws \yii\base\Exception
     */
    private function createView($model, $write = true)
    {
        $strHtml = '';
        if ($model->attr) {
            foreach ($model->attr as $key => $value) {
                $arrayOptions = [
                    "title: \"{$value['title']}\"",
                    "data: \"{$key}\"",
                ];

                // 编辑
                if ($value['edit'] == 1 && !in_array($key, ['created_at', 'updated_at', 'create_time', 'update_time'])) {
                    $edit = ['type: "' . $value['type'] . '"'];
                    if ($options = trim($value['options'], ',')) {
                        $edit[] = $options;
                    }

                    $arrayOptions[] = 'edit: {' . implode(', ', $edit) . '}';
                }

                // 搜索
                if ($value['search'] == 1) {
                    $arrayOptions[] = 'search: {type: "text"}';
                }

                // 排序
                if ($value['bSortable'] == 0) {
                    $arrayOptions[] = 'sortable: false';
                }

                // 回调
                if (!empty($value['createdCell'])) {
                    $arrayOptions[] = "createdCell: {$value['createdCell']}";
                }

                $strHtml .= "\n\t\t\t\t\t{\n\t\t\t\t\t\t" . trim(implode(",\n\t\t\t\t\t\t", $arrayOptions), ', ') . "\n\t\t\t\t\t},";
            }
        }

        $strHtml            = trim($strHtml, ',');
        $primary_key_config = $model->primaryKey && $model->primaryKey != 'id' ? 'pk: "' . $model->primaryKey . '",' : '';
        $sHtml              = <<<html
<?php

use gxcok\admin\widgets\MeTable;
// 定义标题和面包屑信息
\$this->title = '{$model->title}';
?>
<?=MeTable::widget()?>
<?php \$this->beginBlock('javascript') ?>
<script type="text/javascript">
    var m = meTables({
        title: "{$model->title}",
        number: false,
        {$primary_key_config}
        table: {
            columns: [
                {$strHtml}
            ]       
        }
    });
    
    /**
    $.extend(m, {
        // 显示的前置和后置操作
        beforeShow: function(data) {
            return true;
        },
        afterShow: function(data) {
            return true;
        },
        
        // 编辑的前置和后置操作
        beforeSave: function(data) {
            return true;
        },
        afterSave: function(data) {
            return true;
        }
    });
    */

     \$(function(){
         m.init();
     });
</script>
<?php \$this->endBlock(); ?>
html;
        // 生成文件
        $path = $model->getViewPath();
        if ($write && !empty($path)) {
            FileHelper::createDirectory(dirname($path));
            file_put_contents($path, $sHtml);
        }

        return $sHtml;
    }

    /**
     * 生成控制器文件
     *
     * @access private
     *
     * @param ModuleForm $model 处理表单
     *
     * @return void
     */
    private function createController($model)
    {
        list($className, $namespace) = $model->getControllerInfo();
        list(, , $modelNamespace) = $model->getModelInfo();

        $pk = $sort = '';

        // 主键不是ID
        if ($model->primaryKey && $model->primaryKey) {
            $pk = <<<html
    /**
     * @var string pk 定义表使用的主键名称
     */
    protected \$pk = '{$model->primaryKey}'; 
html;

            $sort = <<<html
    /**
     * @var string sort 定义默认排序字段名称
     */
    protected \$sort = '{$model->primaryKey}'; 
html;
        }

        $searchColumns = implode("', '", $model->getSearchColumns());


        // 上层模块是 Application,那么只要基础module 下的基础控制器就好了
        if ($this->module->module instanceof Application) {
            $use = '';
        } else {
            $use = 'use gxcok\admin\controllers\Controller;';
        }

        // 模板
        $strControllers = <<<Html
<?php

namespace {$namespace};

{$use}

/**
 * Class {$className} {$model->title} 执行操作控制器
 * @package {$namespace}
 */
class {$className} extends Controller
{
    {$pk}
    
    {$sort}
   
    /**
     * @var string 定义使用的model
     */
    public \$modelClass = '{$modelNamespace}';
    
    /**
     * 需要定义where 方法，确定前端查询字段对应的查询方式
     * 
     * @return array 
     */
    public function where()
    {
        return [
            [['{$searchColumns}'], '='],
        ];
    }
}

Html;

        file_put_contents($model->getControllerPath(), $strControllers);
    }

    /**
     * 生成 model 文件
     *
     * @param ModuleForm $model 模型文件名称 @backend/models/Users.php
     *
     * @throws \yii\base\InvalidConfigException
     */
    private function createModel($model)
    {
        // 获取 model 类名、命名空间
        list($modelClassName, $namespace) = $model->getModelInfo();

        /* @var $generator yii\gii\generators\model\Generator */
        $generator = Yii::createObject(['class' => 'yii\gii\generators\model\Generator']);
        $generator->load([
            'tableName'                  => $model->table,
            'modelClass'                 => $modelClassName,
            'standardizeCapitals'        => '0',
            'ns'                         => $namespace,
            'baseClass'                  => 'yii\db\ActiveRecord',
            'db'                         => 'db',
            'useTablePrefix'             => '1',
//            'generateRelations'                  => 'all',
//            'generateRelationsFromCurrentSchema' => '1',
            'generateLabelsFromComments' => '1',
            'generateQuery'              => '0',
            'queryNs'                    => $namespace,
            'queryBaseClass'             => 'yii\db\ActiveQuery',
            'enableI18N'                 => '0',
            'messageCategory'            => 'app',
            'useSchemaName'              => '1',
            'template'                   => 'default',
        ], '');

        foreach ($generator->generate() as $f) {
            if ($f instanceof yii\gii\CodeFile) {
                file_put_contents($f->path, $f->content);
            }
        }
    }
}