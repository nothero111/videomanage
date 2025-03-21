//导入fs进行本地文件操作
const fs = require('fs')
//引入promisify方法
const {promisify} = require('util')
//引入lodash库
const lodash = require('lodash')
//对应于user的事物处理模块
const {User} = require('../model/index');
//导入生成token方法
const {creatToken} = require('../util/jwt')
const {Subscribe} = require("../model");
const rename = promisify(fs.rename)//将fs模块的rename方法转成promise对象
//获取粉丝列表
exports.getchannel = async (req, res) => {
    try{
        let channelList = await Subscribe.find({
            channel:req.user._id
        }).populate('user')
        channelList = channelList.map(item => {
            return lodash.pick(item.user,['_id','username','image','subscribeCount','cover','chaneldes'])
        })
        res.status(200).json(channelList)
    }catch (e){
        console.log(e)
        res.send(11)
    }
}
//获取关注的人
exports.getsubscribe = async (req, res) => {
    let subscribeList = await Subscribe.find({
        user:req.params.userId
    }).populate('channel')
    subscribeList = subscribeList.map(item => {
        return lodash.pick(item.channel,['_id','username','image','subscribeCount','cover','chaneldes'])
    })
    res.status(200).json(subscribeList)
}
//获取频道信息
exports.getuser = async (req, res) => {
    let isSubscribe = false
    if (req.user){
        const record = await Subscribe.findOne({
            channel:req.params.userId,
            user:req.user._id
        })
    if (record){
        isSubscribe = true
    }
    }
    let user = await User.findById(req.params.userId)
    user.isSubscribe = isSubscribe
    res.status(200).json({
        ...lodash.pick(user,['_id','username','image','subscribeCount','cover','chaneldes']),
        isSubscribe
    })
}
//用户取消关注请求
exports.unsubscribe = async (req, res) => {
    const userId = req.user._id//当前登录用户的id
    const channelId = req.params.userId//被关注用户的id
    //1.用户不能取消关注自己,如果相同返回402
    if (userId === channelId) {
        return res.status(401).json({error: '不能取消关注自己'})
    }
    const record = await Subscribe.findOne({
        user:userId,
        channel:channelId
    })
    if(record){
        await record.deleteOne()//把查找到的直接删除掉
        const user = await User.findById(channelId)
        user.subscribeCount++
        await user.save()
        res.status(200).json(user)
    }else{
        res.status(401).json({error:'没有订阅此频道'})
    }
    //2.用户不能重复关注
    //3.把用户的关注放在集合里
}
//用户关注请求
exports.subscribe = async (req, res) => {
    const userId = req.user._id//当前登录用户的id
    const channelId = req.params.userId//被关注用户的id
    //1.用户不能关注自己,如果相同返回402
    if (userId === channelId) {
        return res.status(401).json({error: '不能关注自己'})
    }
    const record = await Subscribe.findOne({
        user:userId,
        channel:channelId
    })
    if(!record){
        await new Subscribe({
            user:userId,
            channel:channelId
        }).save()
        const user = await User.findById(channelId)
        user.subscribeCount++
        await user.save()
    }else{
        res.status(401).json({error:'不能重复关注'})
    }
    res.status(200).json({msg:"关注成功"})
    //2.用户不能重复关注
    //3.把用户的关注放在集合里
}
//创建解决用户注册的业务逻辑
exports.register = async (req, res) => {
    const userModel = new User(req.body)
    const dbBack = await userModel.save()
    let user  = dbBack.toJSON()
    delete user.password
    res.status(201).json(dbBack)
}
//用户登陆内容
exports.login = async (req, res) => {
    //客户端数据验证
    //链接数据库查询
    let dbBack = await User.findOne(req.body)
    if (!dbBack) {
        return res.status(402).json({error: '邮箱或密码错误'})
    }
    //生成token,添加到返回值里
    dbBack = dbBack.toJSON()//这个是必须有的，因为直接返回的dbBack是文档对象模型，
    //虽然直接添加属性的操作不会报错，但返回到客户端的时候，客户端
    //无法识别这个对象，所以需要转成json对象
    dbBack.token = await creatToken(dbBack)
    res.status(200).json(dbBack)
}
//用户修改信息
exports.update = async (req, res) => {
    let id = req.user._id
    //根据id查找并更新数据,返回的值是修改前的数据
    let dbBacck = await User.findByIdAndUpdate(id,req.body)
    // console.log(dbBacck)
    res.status(200).json({user: dbBacck})
}
//用户头像上传
exports.headimg = async (req, res) => {
    console.log(req.file)
    //此时的得到的图片文件名字是一串随机的哈希值，没有图片后缀
    //不会被识别为图片，下面要对文件修改
    let fileArr = req.file.originalname.split('.')
    let fileType = fileArr[fileArr.length-1]//为了防止文件名中有多个点符号

    try{
        await rename(
            './public/'+req.file.filename,
            './public/' + req.file.filename + '.' + fileType)
        res.status(201).json({filePath: req.file.filename + '.' + fileType})
    }catch (err){
        res.status(500).json({error: '文件上传失败'})
    }
}
exports.list = async (req, res) => {
    console.log(req)
    res.send('/user_list')
}

exports.delete = async (req, res) => {
    console.log(req.method)
}



