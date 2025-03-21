//关于视频处理的模块
const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const vodController = require('../controller/vodController');
const {verifyToken} = require("../util/jwt");
const {videoValidator} = require("../middleware/validator/videoValidator");
router
    .get('/gethots/:topnum',videoController.gethots)
    .get('/collect/:videoId',verifyToken(),videoController.collect)
    .get('/likelist',verifyToken(),videoController.likelist)
    .get('/dislike/:videoId',verifyToken(),videoController.dislikevideo)
    //给视频点赞或取消点赞
    .get('/like/:videoId',verifyToken(),videoController.likevideo)
    //删除评论
    .delete('/comment/:videoId/:commentId',verifyToken(),
        videoController.deletecomment)
    .get('/commentList/:videoId', verifyToken(false),
        videoController.commentList)
    .post('/comment/:videoId', verifyToken(),videoController.comment)
    .get('/videolist', videoController.videolist)
    //下面是获取视频信息
    .get('/video/:videoId', verifyToken(false),videoController
        .video)
    .get('/getvod', verifyToken(),vodController.getvod)
    .post('/createvideo', verifyToken(),videoValidator,
        videoController.createvideo)
module.exports = router;