const {Video} = require('../model/index')
const {Videocomment, Videolike} = require("../model/index");
const {Subscribe} = require("../model");
const {CollectModel} = require('../model/index')
const {hotInc,topHots} = require('../model/redis/redishotsinc')
//热门视频推荐，观看+1 点赞 +2 评论 +2 收藏 +3
//获取热门视频
exports.gethots = async (req,res) =>{
    let topnum = req.params.topnum
    let tops = await topHots(topnum)
    res.status(200).json({tops})
}
exports.collect = async (req,res) =>{
    const videoId = req.params.videoId
    const userId = req.user._id
    const video = await Video.findById(videoId)
    if (!video) {
        return res.status(404).json({message: '视频不存在'})
    }
    let doc = await CollectModel.findOne({user:userId,video:videoId})
    if (doc) {
        return res.status(403).json({message: '已经点赞'})
    }
    const myCollect = await CollectModel({user:userId,video:videoId}).save()
    if (myCollect){
        await hotInc(videoId,3)
    }


    res.status(201).json({message: '收藏成功',myCollect})
}
exports.likelist = async (req,res) =>{
    const {pageNum = 1,pageSize = 10} = req.body
    let likes = await  Videolike.find({
        like:1,
        user:req.user._id
    }).skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .populate('video','_id title cover vodvideoId user')
    let likeCount = await Videolike.countDocuments({
        like:1,
        user:req.user._id
    })
    res.status(200).json({likes,likeCount})
}
exports.dislikevideo = async (req,res) =>{
    const videoId = req.params.videoId
    const userId = req.user._id
    console.log(videoId,userId)
    let video = await Video.findById(videoId)
    if (!video) {
        return res.status(404).json({message: '视频不存在'})
    }
    let doc = await Videolike.findOne({user:userId,video:videoId})
    let isdislike = true//默认不喜欢
    if (doc&&doc.like === -1) {
        await doc.deleteOne()
        // res.status(200).json({msg: '取消点踩成功'})
    }else if (doc&&doc.like === 1) {
        doc.like  = -1
        await doc.save()
        isdislike = false
    }else{
        await new Videolike({
            user:userId,
            video:videoId,
            like:-1
        }).save()
    }
    video.likeCount = await Videolike.countDocuments({
        video: videoId,
        like: 1
    })
    video.dislikeCount =  await Videolike.countDocuments({
        video: videoId,
        like: -1
    })
    await video.save()
    res.status(200).json({
        ...video.toJSON(),
        isdislike
    })}
exports.likevideo = async (req, res) => {
    const videoId = req.params.videoId
    const userId = req.user._id
    console.log(videoId,userId)
    const video = await Video.findById(videoId)
    if (!video) {
        return res.status(404).json({message: '视频不存在'})
    }
    let doc = await Videolike.findOne({user:userId,video:videoId})
    let islike = true//默认喜欢
    if (doc&&doc.like === 1) {
        await doc.deleteOne()
        islike = false
        // res.status(200).json({msg: '取消点赞成功'})
    }else if (doc&&doc.like === -1) {
        doc.like  = 1
        await doc.save()
        await hotInc(videoId,2)
    }else{
        await new Videolike({
            user:userId,
            video:videoId,
            like:1
        }).save()
        await hotInc(videoId,2)
    }
    video.likeCount = await Videolike.countDocuments({
        video: videoId,
        like: 1
    })
    video.dislikeCount =  await Videolike.countDocuments({
        video: videoId,
        like: -1
    })
    await video.save()
    res.status(200).json({
        ...video.toJSON(),
        islike
    })
}
//删除视频评论
exports.deletecomment = async (req, res) => {
    const {videoId,commentId} = req.params
    const videoInfo = await Video.findById(videoId)
    if (!videoInfo) {
        return res.status(404).json({message: '视频不存在'})
    }
    const comment = await Videocomment.findById(commentId)
    if (!comment) {
        return res.status(404).json({message: '评论不存在'})
    }
    if (!comment.user.equals(req.user._id)) {
        return res.status(403).json({message: '没有权限删除评论'})
    }
    await comment.deleteOne()
    videoInfo.commentCount--
    await videoInfo.save()
    res.status(200).json({message: '删除成功'})
}
exports.commentList = async (req, res) => {
    const videoId = req.params.videoId
    console.log(videoId)
    const {pageNum = 1,pageSize = 10} = req.body
    const commentList = await Videocomment
        .find({video:videoId})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .populate('user','_id username cover')//还要拿到用户的一部分信息
    const commentCount = await Videocomment.countDocuments
    ({video:videoId})
    res.status(200).json({commentList,commentCount})
}
exports.comment = async (req, res) => {
    const {videoId} = req.params
    const videoInfo =  await  Video.findById(videoId)
    if(!videoInfo){
        return res.status(404).json({message:'视频不存在'})
    }else{
        const comment =  await new Videocomment({
            content:req.body.content,
            video:videoId,
            user:req.user._id,//关联用户
        }).save()
        videoInfo.commentCount++
        await videoInfo.save()
        await hotInc(videoId,2)
        res.status(201).json(comment)
    }
}
//视频分页
exports.videolist = async (req, res) => {
    let {pageNum = 1,pageSize = 10} = req.body
    //pageNum查询的页码，pagesize是每页的数据
    //如果客户端不传
    // ，则默认值为1和10
    let getVideo = await Video.find()
        .skip((pageNum - 1) * pageSize)//跳过多少条数据
        .limit(pageSize)//限制获取多少条数据
        .sort({creatAt:-1})//按照创建时间降序排列
        //populate可以根据关联的数据在相关的库里查询
        .populate('user','_id username cover')//关联用户
    //返回集合里的总的数据条数
    const getvideoCount = await Video.countDocuments()
    console.log(getVideo)
    res.status(200).json({getVideo:getVideo,videoCount:getvideoCount})
}
exports.createvideo = async (req, res) => {
    body = req.body
    body.user = req.user._id
    const videoModel = new Video(body)
    try{
        let dbBack = await videoModel.save()
        res.status(201).json({dbBack:dbBack})
    }catch (err) {
        res.status(500).send({err:err})
    }
}
//获取视频详情的方法
exports.video = async (req,res) => {
    const videoId = req.params.videoId
    const videoInfo = await Video.findById(req.params.videoId)
        .populate('user','_id cover username')
    islike = false
    isDislike = false
    isSubscribe = false
    if (req.user) {
        const userId = req.user._id
            if (await Videolike.findOne({
                user:userId, video:videoId,like:1
            })){
                islike = true
            }//查看曾经是否喜欢这个视频
        if (await Videolike.findOne({
            user:userId, video:videoId,like:-1
        })){
            isDislike = true
        }//查看曾经是否不喜欢这个视频
        if (await Subscribe.findOne({user:userId,channel: videoInfo.user._id})){
            isSubscribe = true
        }
    }
    await hotInc(videoId,1)
    res.status(200).json({
        videoInfo,
        islike,
        isDislike,
        isSubscribe
    })

}