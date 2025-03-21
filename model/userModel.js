const mongoose = require('mongoose');
const md5 = require('blueimp-md5')
const baseModel = require('./baseModel')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true//设置该参数是否是必选，如果为true，则必须传入
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true,
        set:value => md5(value),//设置该字段的值，在存储到数据库之前，先进行md5加密
        select:false//设置该字段不可查询
    },
    image:{
        type:String,
        default:null
    },
    cover:{
        type:String,
        default:null
    },//频道封面
    channeldes:{
        type:String,
        default:null
    },//频道描述
    subscribeCount:{
        type:Number,
        default:0
    },
    ...baseModel

})

module.exports = userSchema
