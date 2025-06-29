<?php
namespace gxcok\admin\controllers;
use common\Lib\Util;
use gxcok\admin\models\Admin;
use gxcok\admin\models\Auth;
use Yii;
use yii\base\Model;
use yii\db\Query;
use yii\helpers\FileHelper;
use yii\helpers\ArrayHelper;
use yii\web\UploadedFile;
use gxcok\admin\strategy\Substance;
use gxcok\admin\helpers\Helper;
use gxcok\admin\traits\JsonTrait;
use gxcok\admin\behaviors\Logging;
use \yii\db\Expression;
/**
 * Class Controller 后台基础控制器
 *
 * @package gxcok\admin\controllers
 */
class Controller extends \yii\web\Controller
{
    // 引入json 返回处理类
    use JsonTrait;

    /**
     * @var string 定义使用的model
     */
    protected $modelClass = '\gxcok\admin\models\Admin';

    /**
     * @var string pk 定义表使用的主键名称
     */
    protected $pk = 'id';

    /**
     * @var string sort 定义默认排序条件
     */
    protected $sort = 'id';

    /**
     * @var string 定义上传文件的保存的路径
     */
    protected $strUploadPath = './uploads/';

    /**
     * @var string 定义使用资源的策略类名
     */
    protected $strategy = 'DataTables';

    /**
     * @var string 上传使用uploadForm 类名
     */
    protected $uploadFromClass = 'gxcok\admin\models\forms\UploadForm';

    /**
     * 定义使用的行为
     *
     * @return array
     */
    public function behaviors()
    {
        return [
            'logging' => [
                'class' => Logging::className(),
                'user'  => ArrayHelper::getValue($this->module, 'user'),
            ],
        ];
    }

    /**
     * 获取pk
     *
     * @return string
     */
    public function getPk()
    {
        return $this->pk;
    }

    /**
     * 首页显示
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    /**
     * 获取查询对象(查询结果一定要为数组)
     *
     * @param mixed|array $where 查询条件
     *
     * @return \yii\db\Query 返回查询对象
     * @see actionSearch()
     * @see actionExport()
     */
    protected function getQuery($where)
    {
        /* @var $model \yii\db\ActiveRecord */
        $model = $this->modelClass;
        //$model::getDb()->getQueryBuilder()
        //return (new Query())->from($model::tableName())->where($where);
        return $model::find()->from($model::tableName())->where($where);
    }

    /**
     * 处理查询数据
     * @return mixed|string
     * @throws \Exception
     * @see afterSearch()
     * @see getQuery()
     */
    public function actionSearch()
    {
        // 实例化数据显示类
        /* @var $strategy \gxcok\admin\strategy\Strategy */
        $strategy = Substance::getInstance($this->strategy);

        // 获取查询参数
        $search = $strategy->getRequest();
        // 查询数据
        if (method_exists($this, 'where')) {
            $filters         = ArrayHelper::getValue($search, 'filters');
            $search['where'] = Helper::handleWhere($filters, $this->where($filters));
        }
        // 查询数据
        $query = $this->getQuery(ArrayHelper::getValue($search, 'where', []));
        /*var_dump($query->createCommand()->getRawSql());
        exit;*/
        // 查询数据条数
        if ($total = $query->count()) {
            $orderBy = ArrayHelper::getValue($search, 'orderBy') ?: [$this->sort => SORT_DESC];
            //var_dump($orderBy);
            if ($array = $query->offset($search['offset'])->limit($search['limit'])->orderBy($orderBy)->all()) {
                $this->afterSearch($array);
            }
        } else {
            $array = [];
        }

        return $this->asJson($strategy->handleResponse($array, (int)$total));
    }

    /**
     * 查询之后的数据处理函数
     * @access protected
     *
     * @param mixed $array 查询出来的数组对象
     *
     * @return void  对数据进行处理
     * @see    actionSearch()
     */
    protected function afterSearch(&$array)
    {

    }

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

    /**
     * 处理修改数据
     *
     * @return mixed|string
     */
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

    public function actionView($id)
    {
        if (empty($id)){
            return $this->error(201);
        }
        $model = $this->findOne(["id"=>$id]);
        return $this->render('view',[
            'model' => $model,
        ]);
    }

    /**
     * 处理删除数据
     * @return mixed|string
     * @throws \Exception
     * @throws \Throwable
     * @throws \yii\db\StaleObjectException
     */
    public function actionDelete()
    {
        // 接收参数判断
        if (!$model = $this->findOne(Yii::$app->request->post())) {
            return $this->returnJson();
        }

        // 删除数据失败
        if (!$model->delete()) {
            return $this->error(1004, Helper::arrayToString($model->getErrors()));
        }

        return $this->success($model);
    }

    /**
     * 查询单个数据
     *
     * @param array $data 查询条件
     *
     * @return boolean|\yii\db\ActiveRecord
     */
    protected function findOne($data = [])
    {
        // 接收参数判断
        $data = $data ?: Yii::$app->request->post();
        if (!$data || empty($data[$this->pk])) {
            $this->setCode(201);
            return false;
        }

        // 通过传递过来的唯一主键值查询数据
        /* @var $model \yii\db\ActiveRecord */
        $model = $this->modelClass;
        if (!$model = $model::findOne([$this->pk => $data[$this->pk]])) {
            $this->setCode(220);
            return false;
        }

        return $model;
    }

    /**
     * 批量删除操作
     * @return mixed|string
     */
    public function actionDeleteAll()
    {
        $ids = Yii::$app->request->post('id');
        if (empty($ids) || !($arrIds = explode(',', $ids))) {
            return $this->error(201);
        }

        /* @var $model \yii\db\ActiveRecord */
        $model = $this->modelClass;
        if (!$model::deleteAll([$this->pk => $arrIds])) {
            return $this->error(1004);
        }

        return $this->success($ids);
    }

    /**
     * 处理行内编辑
     *
     * @return mixed|string
     */
    public function actionEditable()
    {
        // 接收参数
        $request  = Yii::$app->request;
        $mixPk    = $request->post('pk');    // 主键值
        $strAttr  = $request->post('name');  // 字段名
        $mixValue = $request->post('value'); // 字段值

        // 第一步验证： 主键值、修改字段、修改的值不能为空字符串
        if (empty($mixPk) || empty($strAttr) || $mixValue === '') {
            return $this->error(207);
        }

        // 通过主键查询数据
        /* @var $model \yii\db\ActiveRecord */
        $model = $this->modelClass;
        if (!$model = $model::findOne($mixPk)) {
            return $this->error(220);
        }

        // 修改对应的字段
        $model->$strAttr = $mixValue;
        if (!$model->save()) {
            return $this->error(206, Helper::arrayToString($model->getErrors()));
        }

        return $this->success($model);
    }

    /**
     * 处理文件上传操作
     * @return mixed|string
     * @see afterUpload()
     */
    public function actionUpload()
    {
        // 接收参数
        $request  = Yii::$app->request;
        $strField = $request->get('sField');    // 上传文件表单名称
        $select_type = $request->get('select_type');
        $select_type = empty($select_type)?"cos":$select_type;
        if (empty($strField)) {
            return $this->error(201);
        }

        // 判断删除之前的文件
        $strFile = (string)$request->post($strField);   // 旧的地址
        if (!empty($strFile) && file_exists('.' . $strFile)) {
            unlink('.' . $strFile);
        }

        // 初始化上次表单model对象，并定义好验证场景
        $className = $this->uploadFromClass;
        /* @var $model Model */
        $model = new $className();
        // 判断是否存在指定的验证场景，有则使用，没有默认
        /*if (ArrayHelper::getValue($model->scenarios(), $strField)) {
            $model->scenario = $strField;
        }*/

        try {
            // 上传文件
            $objFile = $model->$strField = UploadedFile::getInstance($model, $strField);
            if (empty($objFile)) {
                throw new \UnexpectedValueException(Yii::t('admin', 'No file upload'));
            }

            // 验证
            /*if (!$model->validate()) {
                throw new \UnexpectedValueException($model->getFirstError($strField));
            }*/

            // 生成文件随机名
            $filename=uniqid() . '.' . $objFile->extension;
            $oldname=$objFile->baseName.'.'.$objFile->extension;
            if($select_type=="cos"){
                $file_name = "/upload/".date("Ymd")."/".$filename;
                $res=Util::upload_file_cos($file_name,$objFile->tempName);
                $strFilePath=Yii::$app->params['cos']['base_url'].$file_name;
                /*var_dump($res);
                exit;*/
            }else{
                $dirName = $this->strUploadPath;
                // 定义好保存文件目录，目录不存在那么创建
                $strFilePath = $dirName . $filename;
                FileHelper::createDirectory($dirName);
                if (!file_exists($dirName)) {
                    throw new \UnexpectedValueException(Yii::t('admin', 'Directory creation failed') . $dirName);
                }
                // 执行文件上传保存，
                if (!$objFile->saveAs($strFilePath)) {
                    return $this->error(204);
                }
                // 如果自定义了上传之后的处理, 那么执行自定义的方法
                if (method_exists($this, 'afterUpload')) {
                    $strFilePath = $this->afterUpload($strFilePath, $strField, $objFile);
                    if (!$strFilePath) {
                        return $this->error(204);
                    }
                }
                $strFilePath=trim($strFilePath, '.');
                $strFilePath='http://'.$_SERVER["SERVER_NAME"].$strFilePath;
            }
            return $this->success([
                'sFilePath' => $strFilePath,
                'sFileName' => $oldname,
            ]);
        } catch (\Exception $e) {
            return $this->error(203, $e->getMessage());
        }
    }

    /**
     * 导出数据的处理 默认处理时间信息
     *
     * @return array
     */
    protected function getExportHandleParams()
    {
        return [
            'created_at' => function ($value) {
                return date('Y-m-d H:i:s', $value);
            },
            'updated_at' => function ($value) {
                return date('Y-m-d H:i:s', $value);
            },
        ];
    }

    /**
     * 文件导出处理
     *
     * @return mixed|string
     * @throws \PHPExcel_Exception
     * @throws \PHPExcel_Reader_Exception
     * @throws \PHPExcel_Writer_Exception
     * @throws \yii\base\ExitException
     * @see getQuery()
     * @see getExportHandleParams()
     */
    public function actionExport()
    {
        // 接收参数
        $request   = Yii::$app->request;
        $arrFields = $request->post('fields');    // 字段信息
        $strTitle  = $request->post('title');     // 标题信息
        $filters   = $request->post('filters');   // 查询条件信息

        // 判断数据的有效性
        if (empty($arrFields) || empty($strTitle)) {
            return $this->error(201);
        }

        // 查询条件处理
        if (method_exists($this, 'where')) {
            $conditions = Helper::handleWhere($filters, $this->where($filters));
        } else {
            $conditions = [];
        }

        // 数据导出
        return Helper::excel(
            $strTitle,
            $arrFields,
            $this->getQuery($conditions)->orderBy([$this->sort => SORT_DESC]),
            $this->getExportHandleParams()
        );
    }
}
