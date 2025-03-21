//index主要作用是加载不同模块的路由
const express = require('express');
const router = express.Router();


//加载不同的路由模块
router.use('/user',require('./user'))
router.use('/video',require('./video'))


module.exports = router;