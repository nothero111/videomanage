const mongoose = require('mongoose');
const baseModel = require('./baseModel');
const collectSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        required:true,
        ref:"User"//与user集合做一个关联
    },//用户
    video:{
        type:mongoose.ObjectId,
        required:true,
        ref:"Video"//与video集合做一个关联
    },
    ...baseModel
})
//输出一个redis的数据模型
module.exports = collectSchema
