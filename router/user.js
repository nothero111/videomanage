const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller');
const validator = require('../middleware/validator/userValidator');
const {verifyToken} = require('../util/jwt');
const multer = require('multer');
//创建一个文件夹，用来存放上传的文件,public是项目根目录下的文件夹
const upload = multer({dest:'public/'})
router
    //返回粉丝列表
    .get('/getchannel',verifyToken(),userController.getchannel)
    //获取关注列表
    .get('/getsubscribe/:userId',userController.getsubscribe)
    //获取频道信息的请求路由
    .get('/getuser/:userId',verifyToken(false),userController.getuser)
    //关注的请求路由
    .get('/subscribe/:userId',verifyToken(),userController.subscribe)
    //取消关注的请求路由
    .get('/unsubscribe/:userId',verifyToken(),userController.unsubscribe)
    .post('/registers',validator.register,userController.register)
    .post('/logins',validator.login,userController.login)
    .get('/lists',verifyToken(), userController.list)
    .put('/',verifyToken(),validator.update,userController.update)
    .post('/headimg',verifyToken(),upload.single('heading'),userController.headimg)
    .delete('/', userController.delete)
module.exports = router;



