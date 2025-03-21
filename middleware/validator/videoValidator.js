//有关用户注册信息上传的
const validate = require('./errorBack');
const { body } = require('express-validator');
const {User} = require("../../model");
module.exports.videoValidator = validate([
    body('title').notEmpty().withMessage('视频名不能为空')
        .isLength({max:20}).withMessage('视频名长度不能大于20')
        .bail(),
    body('vodvideoId')
        .notEmpty().withMessage('vod不能为空').bail(),
])

