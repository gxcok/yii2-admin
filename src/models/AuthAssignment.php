<?php

namespace gxcok\admin\models;

use yii\db\ActiveRecord;
use gxcok\admin\models\traits\CreatedAtTrait;

/**
 * This is the model class for table "{{%auth_assignment}}".
 *
 * @property string  $item_name
 * @property string  $user_id
 * @property integer $created_at
 */
class AuthAssignment extends ActiveRecord
{
    use CreatedAtTrait;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%auth_assignment}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['item_name', 'user_id'], 'required'],
            [['created_at'], 'integer'],
            [['item_name', 'user_id'], 'string', 'max' => 64],
            [['item_name'], 'unique', 'targetAttribute' => ['item_name', 'user_id']],
            [
                ['item_name'],
                'exist',
                'skipOnError'     => true,
                'targetClass'     => Auth::className(),
                'targetAttribute' => ['item_name' => 'name'],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'item_name'  => '角色',
            'user_id'    => '管理员',
            'created_at' => '创建时间',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getItemName()
    {
        return $this->hasOne(Auth::className(), ['name' => 'item_name']);
    }
}
