<?php

namespace gxcok\admin\controllers;

use gxcok\admin\models\Admin;
use gxcok\admin\helpers\Helper;
use gxcok\admin\helpers\Tree;
use Yii;
use gxcok\admin\models\Auth;
use gxcok\admin\models\Menu;
use yii\helpers\ArrayHelper;
use yii\web\HttpException;
use \yii\web\UnauthorizedHttpException;

/**
 * Class RoleController 角色管理类
 * @package backend\controllers
 */
class RoleController extends Controller
{
    /**
     * @var string 定义使用的主键
     */
    public $pk = 'name';

    /**
     * @var string 定义使用的model
     */
    public $modelClass = 'gxcok\admin\models\Auth';

    /**
     * @var string 定义排序字段
     */
    public $sort = 'created_at';

    /**
     * 设置查询参数
     *
     * @return array
     */
    public function where()
    {
        // 查询角色信息
        $where = ['and', ['type' => Auth::TYPE_ROLE]];
        // 不是管理员
        $uid = ArrayHelper::getValue($this->module, 'userId');
        if ($uid != Admin::SUPER_ADMIN_ID) {
            // 获取用户的所有角色
            if ($roles = Yii::$app->authManager->getRolesByUser($uid)) {
                $where[] = ['in', 'name', array_keys($roles)];
            }
        }

        return [
            'where' => [$where],

            // 字段查询
            [['name', 'description'], 'like'],
        ];
    }

    /**
     * 角色信息显示首页
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index', [
            'type' => Auth::TYPE_ROLE,
        ]);
    }

    /**
     * 修改角色权限信息
     *
     * @param string $name 角色名
     *
     * @return string|\yii\web\Response
     * @throws \yii\web\UnauthorizedHttpException
     * @throws HttpException
     * @throws \yii\base\Exception
     */
    public function actionEdit($name)
    {
        // 管理员直接返回
        if ($name === Auth::SUPER_ADMIN_NAME) {
            Yii::$app->session->setFlash(
                'warning',
                Yii::t('admin', 'You can not modify the super administrator privileges')
            );
            return $this->redirect(['view', 'name' => $name]);
        }

        // 判断自己是否有这个权限
        $uid      = ArrayHelper::getValue($this->module, 'userId');     // 用户ID
        $objAuth  = Yii::$app->getAuthManager();                            // 权限对象
        $mixRoles = $objAuth->getAssignment($name, $uid);                   // 获取用户是否有改权限
        if (!$mixRoles && $uid != Admin::SUPER_ADMIN_ID) {
            throw new UnauthorizedHttpException(Yii::t('admin', 'Sorry, you do not have permission to modify this role!'));
        }

        $request = Yii::$app->request;                          // 请求信息
        /* @var $model \gxcok\admin\models\Auth */
        $model = $this->findModel($name);                       // 查询对象
        $array = $request->post();                              // 请求参数信息
        if ($array && $model->load($array, '')) {
            // 修改权限
            $permissions = $this->preparePermissions($array);
            if ($model->updateRole($name, $permissions)) {
                Yii::$app->session->setFlash(
                    'success',
                    " '$model->name' " . Yii::t('admin', 'successfully updated')
                );
                return $this->redirect(['view', 'name' => $name]);
            } else {
                Yii::$app->session->setFlash('error', Helper::arrayToString($model->getErrors()));
            }
        }

        $permissions = $this->getPermissions();
        $model->loadRolePermissions($name);
        $trees = (new Tree([
            'parentIdName' => 'pid',
            'childrenName' => 'children',
            'array'        => Menu::getMenusByPermissions($permissions),
        ]))->getTreeArray(0);

        $trees = Menu::getJsMenus($trees, $model->_permissions);
        
        // 加载视图返回
        return $this->render('edit', [
            'model'       => $model,              // 模型对象
            'permissions' => $this->handlePermissionGroups($permissions),  // 权限信息
            'trees'       => $trees,              // 导航栏树,
        ]);
    }

    /**
     * 查看角色权限信息
     *
     * @param string $name 角色名称
     *
     * @return string
     * @throws HttpException
     */
    public function actionView($name)
    {
        // 查询角色信息
        /* @var $model \gxcok\admin\models\Auth */
        $model = $this->findModel($name);

        // 获取角色权限信息
        $permissions = Yii::$app->authManager->getPermissionsByRole($name);

        // 查询导航栏信息
        $tree = new Tree([
            'parentIdName' => 'pid',
            'childrenName' => 'child',
            'array'        => Menu::getMenusByPermissions($permissions),
        ]);

        return $this->render('view', [
            'menus'       => $tree->getTreeArray(0),
            'model'       => $model,
            'permissions' => $permissions,
        ]);
    }

    /**
     * 查询单个model
     *
     * @param string $name
     *
     * @return \gxcok\admin\models\Auth
     * @throws \yii\web\HttpException
     */
    protected function findModel($name)
    {
        if ($name) {
            $auth  = Yii::$app->getAuthManager();
            $model = new Auth();
            $role  = $auth->getRole($name);
            if ($role) {
                $model->name        = $role->name;
                $model->type        = $role->type;
                $model->description = $role->description;
                $model->created_at  = $role->createdAt;
                $model->updated_at  = $role->updatedAt;
                $model->setIsNewRecord(false);
                return $model;
            }
        }

        throw new HttpException(404);
    }

    /**
     * 获取用户对应的权限信息
     * @return array
     */
    protected function getPermissions()
    {
        $uid    = ArrayHelper::getValue($this->module, 'userId');
        $models = $uid == Admin::SUPER_ADMIN_ID ? Auth::find()->where([
            'type' => Auth::TYPE_PERMISSION,
        ])->orderBy(['name' => SORT_ASC])->all() : Yii::$app->getAuthManager()->getPermissionsByUser($uid);

        return ArrayHelper::map($models, 'name', function ($model) {
            return $model->name . ' (' . $model->description . ')';
        });
    }

    /**
     * 加载权限信息
     *
     * @param array $post 提交参数
     *
     * @return array
     */
    protected function preparePermissions($post)
    {
        return (isset($post['Auth']['_permissions']) &&
            is_array($post['Auth']['_permissions'])) ? $post['Auth']['_permissions'] : [];
    }

    /**
     * @param $permissions
     */
    protected function handlePermissionGroups($permissions)
    {
        $items = [];
        foreach ($permissions as $name => $value) {
            $names = explode('/', $name);
            array_pop($names);
            $index = implode('/', $names);
            if (!isset($items[$index])) {
                $items[$index] = [];
            }

            $items[$index][$name] = $value;
        }

        return $items;
    }
}
