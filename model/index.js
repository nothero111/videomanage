//引入数据库地址
const {mongoPath} = require('../config/config.default')

//引入mongoose
const mongoose = require('mongoose');
//连接数据库
async function main() {
    //连接的时候直接在后面跟上要创建的库好了
    await mongoose.connect(mongoPath);
}
main()
    .then(res=>{
    console.log('mongo链接成功')
    })
    .catch(err=>{
    console.log(err)
    console.log('mongo链接失败')
})
module.exports = {
    //创建一个叫User的模型
    User:mongoose.model('User',require('./userModel')),
    Video:mongoose.model('Video',require('./videoModel')),
    Subscribe:mongoose.model('Subscribe',require('./subscribeModel')),
    Videocomment:mongoose.model('Videocomment',require('' +
        './videocommentModel')),
    Videolike:mongoose.model('Videolike',require('./videolikeModel')),
    CollectModel:mongoose.model('Collect',require('./collectModule')),
}