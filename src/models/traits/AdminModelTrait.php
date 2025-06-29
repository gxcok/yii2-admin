<?php
/**
 *
 * Timestamp.php
 *
 * Author: gxcok.liu
 * Create: 2019-06-21 15:16
 * Editor: created by PhpStorm
 */

namespace gxcok\admin\models\traits;

use yii\behaviors\TimestampBehavior;
use gxcok\admin\behaviors\UpdateBehavior;

/**
 * Trait AdminModelTrait 定义处理时间戳
 *
 * @package gxcok\admin\models\traits
 */
trait AdminModelTrait
{
    /**
     * 定义行为处理时间
     *
     * @return array
     */
    public function behaviors()
    {
        return [
            // 时间处理
            TimestampBehavior::className(),

            // created_id 和 updated_id 字段的处理
            UpdateBehavior::className(),
        ];

    }
}