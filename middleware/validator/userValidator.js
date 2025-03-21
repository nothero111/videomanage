//有关用户注册信息上传的
const validate = require('./errorBack');
const { body } = require('express-validator');
const {User} = require("../../model");

module.exports.register = validate([
    body('username').notEmpty().withMessage('用户名不能为空')
        .bail()//bail的作用是如果验证失败则不会继续往下，如果成功会继续往下
        //每一个验证规则后都应该加withMessage
        .isLength({min:6}).withMessage('用户名长度不能小于6'),
    body('email').notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式不正确')
        .custom(async val =>{
            const user = await User.findOne({email: val});
            if (user) {
                return Promise.reject('邮箱已被注册')
            }
        }).bail(),
    body('phone')
        .notEmpty().withMessage('手机号不能为空')
        .custom(async val =>{
            const user = await User.findOne({phone: val});
            if (user) {
                return Promise.reject('手机号已被注册')
            }
        }).bail(),
    body('password').notEmpty().withMessage('密码不能为空')
        .isLength({min:5}).withMessage('密码长度不能小于5').bail()
])

//有关用户登录信息上传的
module.exports.login = validate([
    body('email').notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式不正确').custom(async val =>{
        const user = await User.findOne({email: val});
        if (!user) {
            return Promise.reject('邮箱未注册')
        }
    }).bail()
    ,
    body('password').notEmpty().withMessage('密码不能为空')
])

//有关用户修改信息
module.exports.update = validate([

    body('username')
        .custom(async val =>{
        const nameValidator = await User.findOne({username: val});
        if (nameValidator) {
            return Promise.reject('用户名已经被注册')
        }
    }).bail(),
    body('email')
        .if(body('email').exists())
        .isEmail().withMessage('邮箱格式不正确')
        .if(body('email').exists())
        .custom(async val =>{
        const emailValidator = await User.findOne({email: val});
        if (emailValidator) {
            return Promise.reject('邮箱已经被注册')
        }
    }).bail(),
    body('phone')
        .custom(async val =>{
            const phoneValidator = await User.findOne({phone: val});
            if (phoneValidator) {
                return Promise.reject('手机号已经被注册')
            }
        }).bail(),
])
