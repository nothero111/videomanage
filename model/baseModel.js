/**
 * 基础模型
 */const baseModel = {
    createAt:{//创建时间
        type:Date,
        default:Date.now()
    },
    updateAt:{//更新时间
        type:Date,
        default:Date.now()
    }
}

module.exports = baseModel
