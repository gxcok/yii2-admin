<?php

use yii\db\Migration;
use yii\helpers\ArrayHelper;
use yii\db\Query;

class m170801_081237_insert_rabc extends Migration
{
    private $table = '{{%auth_item}}';

    private $itemTable = '{{%auth_item_child}}';

    private $ruleTable = '{{%auth_rule}}';

    private $assignmentTable = '{{%auth_assignment}}';

    public function safeUp()
    {
        $time = time();

        $batchInsertArray = [
            ['admin', 1, '管理员', $time, $time],
            ['admin/address', 2, '管理员信息信息-查询地址', $time, $time],
            ['admin/create', 2, '管理员信息-添加数据', $time, $time],
            ['admin/delete', 2, '管理员信息-删除数据', $time, $time],
            ['admin/delete-all', 2, '管理员信息-批量删除', $time, $time],
            ['admin/editable', 2, '管理员信息-行内编辑', $time, $time],
            ['admin/export', 2, '管理员信息-导出数据', $time, $time],
            ['admin/index', 2, '管理员信息-显示数据', $time, $time],
            ['admin/search', 2, '管理员信息-搜索数据', $time, $time,],
            ['admin/update', 2, '管理员信息-修改数据', $time, $time,],
            ['admin/upload', 2, '管理员信息-上传头像', $time, $time],
            ['admin/view', 2, '管理员信息-显示详情', $time, $time],
            ['administrator', 1, '超级管理员', $time, $time],
            ['arrange/arrange', 2, '我的日程-查询数据', $time, $time],
            ['arrange/calendar', 2, '我的日程-查看详情', $time, $time],
            ['arrange/create', 2, '日程管理-添加数据', $time, $time],
            ['arrange/delete', 2, '日程管理-删除数据', $time, $time],
            ['arrange/delete-all', 2, '日程信息-批量删除', $time, $time],
            ['arrange/editable', 2, '日程管理-行内编辑', $time, $time],
            ['arrange/export', 2, '日程信息-导出数据', $time, $time],
            ['arrange/index', 2, '日程管理-显示页面', $time, $time],
            ['arrange/search', 2, '日程管理-搜索数据', $time, $time],
            ['arrange/update', 2, '日程管理-修改数据', $time, $time],
            ['auth-assignment/create', 2, '角色分配-添加数据', $time, $time],
            ['auth-assignment/delete', 2, '角色分配-删除数据', $time, $time],
            ['auth-assignment/export', 2, '角色分配-导出数据', $time, $time],
            ['auth-assignment/index', 2, '角色分配-显示页面', $time, $time],
            ['auth-assignment/search', 2, '角色分配-搜索数据', $time, $time],
            ['auth-rule/create', 2, '规则管理-添加数据', $time, $time],
            ['auth-rule/delete', 2, '规则管理-删除数据', $time, $time],
            ['auth-rule/delete-all', 2, '规则管理-批量删除', $time, $time],
            ['auth-rule/export', 2, '规则管理-导出数据', $time, $time],
            ['auth-rule/index', 2, '规则管理-显示数据', $time, $time],
            ['auth-rule/search', 2, '规则管理-搜索数据', $time, $time],
            ['auth-rule/update', 2, '规则管理-修改数据', $time, $time],
            ['authority/create', 2, '权限信息-添加数据', $time, $time],
            ['authority/delete', 2, '权限信息-删除数据', $time, $time],
            ['authority/delete-all', 2, '权限信息-批量删除', $time, $time],
            ['authority/export', 2, '权限信息-导出数据', $time, $time],
            ['authority/index', 2, '权限信息-显示页面', $time, $time],
            ['authority/search', 2, '权限信息-搜索数据', $time, $time],
            ['authority/update', 2, '权限信息-修改数据', $time, $time],
            ['china/create', 2, '地址信息-添加数据', $time, $time],
            ['china/delete', 2, '地址信息-删除数据', $time, $time],
            ['china/delete-all', 2, '地址信息-批量删除', $time, $time],
            ['china/export', 2, '地址信息-导出数据', $time, $time],
            ['china/index', 2, '地址信息-显示页面', $time, $time],
            ['china/search', 2, '地址信息-搜索数据', $time, $time],
            ['china/update', 2, '地址信息-修改数据', $time, $time],
            ['menu/create', 2, '导航栏目-添加数据', $time, $time],
            ['menu/delete', 2, '导航栏目-删除数据', $time, $time],
            ['menu/delete-all', 2, '导航栏目-批量删除', $time, $time],
            ['menu/export', 2, '导航栏目-导出数据', $time, $time],
            ['menu/index', 2, '导航栏目-显示页面', $time, $time],
            ['menu/search', 2, '导航栏目-搜索数据', $time, $time],
            ['menu/update', 2, '导航栏目-修改数据', $time, $time],
            ['module/create', 2, '代码生成-生成预览表单', $time, $time],
            ['module/index', 2, '代码生成-显示页面', $time, $time],
            ['module/produce', 2, '代码生成-生成文件', $time, $time],
            ['module/update', 2, '代码生成-生成预览文件', $time, $time],
            ['role/create', 2, '角色信息-添加数据', $time, $time],
            ['role/delete', 2, '角色信息-删除数据', $time, $time],
            ['role/edit', 2, '角色信息-分配权限', $time, $time],
            ['role/export', 2, '角色信息-导出数据', $time, $time],
            ['role/index', 2, '角色信息-显示页面', $time, $time],
            ['role/search', 2, '角色信息-搜索数据', $time, $time],
            ['role/update', 2, '角色信息-修改数据', $time, $time],
            ['role/view', 2, '角色权限-查看详情', $time, $time],
            ['admin-log/index', 2, '操作日志-显示页面', $time, $time],
            ['admin-log/search', 2, '操作日志-搜索数据', $time, $time],
            ['admin-log/delete', 2, '操作日志-删除数据', $time, $time],
            ['admin-log/delete-all', 2, '操作日志-批量删除', $time, $time],
            ['admin-log/export', 2, '操作日志-导出数据', $time, $time],
            ['uploads/index', 2, '上传文件-显示页面', $time, $time],
            ['uploads/search', 2, '上传文件-搜索数据', $time, $time],
            ['uploads/create', 2, '上传文件-添加数据', $time, $time],
            ['uploads/update', 2, '上传文件-修改数据', $time, $time],
            ['uploads/delete', 2, '上传文件-删除数据', $time, $time],
            ['uploads/delete-all', 2, '上传文件-批量删除', $time, $time],
            ['uploads/export', 2, '上传文件-导出数据', $time, $time],
            ['uploads/upload', 2, '上传文件-文件上传', $time, $time],
        ];

        $prefix = ArrayHelper::getValue(Yii::$app->params, 'admin_rule_prefix', 'admin');
        $prefix = trim($prefix, '/') . '/';
        foreach ($batchInsertArray as &$value) {
            if ($value[1] == 2) {
                $value[0] = $prefix . $value[0];
            }
        }

        unset($value);

        // 第一步写入权限
        $this->batchInsert($this->table, [
            'name',
            'type',
            'description',
            'created_at',
            'updated_at'
        ], $batchInsertArray);

        // 管理员信息
        $admin = [
            'uploads/upload',
            'uploads/update',
            'uploads/search',
            'uploads/index',
            'uploads/export',
            'uploads/delete-all',
            'uploads/delete',
            'uploads/create',
            'role/search',
            'role/index',
            'menu/search',
            'menu/index',
            'china/update',
            'china/search',
            'china/index',
            'china/export',
            'china/delete-all',
            'china/delete',
            'china/create',
            'authority/search',
            'authority/index',
            'auth-rule/search',
            'auth-rule/index',
            'auth-assignment/search',
            'auth-assignment/index',
            'arrange/update',
            'arrange/search',
            'arrange/index',
            'arrange/export',
            'arrange/editable',
            'arrange/delete-all',
            'arrange/delete',
            'arrange/create',
            'arrange/calendar',
            'arrange/arrange',
            'admin/view',
            'admin/upload',
            'admin/search',
            'admin/index',
            'admin-log/search',
            'admin-log/index',
        ];

        foreach ($admin as &$value) {
            $value = $prefix . $value;
        }

        // 第二步写入超级管理员的权限
        $all = (new Query())->from($this->table)->select('name')->where(['type' => 2])->all();
        if ($all) {
            $insert = [];
            foreach ($all as $value) {
                $insert[] = ['administrator', $value['name']];
                if (!in_array($value['name'], $admin)) {
                    $insert[] = ['admin', $value['name']];
                }
            }

            $this->batchInsert($this->itemTable, ['parent', 'child'], $insert);
        }

        // 第三步写入规则信息
        $this->batchInsert($this->ruleTable, ['name', 'data', 'created_at', 'updated_at'], [
            [
                'admin',
                serialize(unserialize('O:29:"gxcok\admin\rules\AdminRule":3:{s:4:"name";s:5:"admin";s:9:"createdAt";i:1526723554;s:9:"updatedAt";i:1526723554;}')),
                $time,
                $time
            ],
            [
                'auth-assignment',
                serialize(unserialize('O:38:"gxcok\admin\rules\AuthAssignmentRule":3:{s:4:"name";s:15:"auth-assignment";s:9:"createdAt";i:1526723606;s:9:"updatedAt";i:1526723606;}')),
                $time,
                $time
            ],
            [
                'admin-delete',
                serialize(unserialize('O:35:"gxcok\admin\rules\AdminDeleteRule":3:{s:4:"name";s:12:"admin-delete";s:9:"createdAt";i:1526723573;s:9:"updatedAt";i:1526723573;}')),
                $time,
                $time
            ],
        ]);

        // 第三步修改权限对应的规则
        $this->update($this->table, ['rule_name' => 'admin'], ['name' => $prefix . 'admin/update']);
        $this->update($this->table, ['rule_name' => 'admin-delete'], ['name' => $prefix . 'admin/delete']);
        $this->update($this->table, ['rule_name' => 'auth-assignment'], ['name' => $prefix . 'auth-assignment/delete']);

        // 第四步写入分配信息
        $this->batchInsert($this->assignmentTable, [
            'item_name',
            'user_id',
            'created_at'
        ], [
            ['administrator', 1, $time],
            ['admin', 2, $time]
        ]);
    }

    public function safeDown()
    {
        echo "m170801_081237_insert_rabc cannot be reverted.\n";
        return false;
    }
}
