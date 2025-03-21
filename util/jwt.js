const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const jwtSign = promisify(jwt.sign)//把回掉函数形式的sign方法
//转成promise形式的jwtSign方法
const {uuid} = require('../config/config.default')
const verify = promisify(jwt.verify)//把回掉函数形式的verify方法
//转成promise形式的verify方法
module.exports.verifyToken = function (required = true){
        return async (req,res,next) => {
                let token = req.headers.authorization
                token = token?token.split("Bearer ")[1]:null
                if (token){
                        try{
                                req.user = await verify(token, uuid)
                                next()
                        }catch (err){
                                res.status(402).send({message: "token无效"})
                        }
                }
                else if (required){
                        res.status(402).send({message:"请传入token"})
                }else{
                        next()
                }
        }//因为token验证是在路由的时候验证的，所以写成中间件的形式
}
module.exports.creatToken = async userinfo => {
        return await jwtSign(userinfo, uuid, {expiresIn: 60*60*24})
}
