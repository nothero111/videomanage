//专门处理验证错误消息的文件
const {validationResult} = require('express-validator')
module.exports = validator =>{//匿名函数，直接传参
    return async (req,res,next)=>{
        await Promise.all(validator.map(v=>v.run(req)))//循环执行验证
        console.log(2)
            const errors = validationResult(req);//获取验证的结果
            if (!errors.isEmpty()) {
                console.log(3)
                return res.status(401).json({ errors: errors.array()});
            }//状态码为401，代表客户端传递的数据有问题
            next()//验证通过，进入下一个中间件
        }//验证错误的管理
}