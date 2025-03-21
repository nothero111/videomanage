const mongoose = require('mongoose');
const baseModel = require('./baseModel');
const videolikeSchema = new mongoose.Schema({
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
    like:{
      type:Number,
      enum:[1,-1]//1表示喜欢，-1表示不喜欢
    },
    ...baseModel
})

module.exports = videolikeSchema
