const Redis = require('ioredis');
const {redisClient} = require('../../config/config.default')
const redis = new Redis(redisClient.port,redisClient.path,redisClient.options);
redis.on('error',err=>{//给redis绑定链接错误事件
    if (err){
        console.log(err,'redis链接失败')
        redis.quit()//退出不再尝试链接
    }
})
redis.on('ready',()=>{
    //给redis绑定链接成功事件
    console.log('redis链接成功')
    })

exports.redis = redis;//导出redis
