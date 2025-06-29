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

use yii\db\Expression;
use yii\behaviors\TimestampBehavior;

/**
 * Trait TimestampTrait 定义处理时间戳
 *
 * @package gxcok\admin\models\traits
 */
trait TimestampTrait
{
    /**
     * 定义行为处理时间
     *
     * @return array
     */
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
        ];
    }
}