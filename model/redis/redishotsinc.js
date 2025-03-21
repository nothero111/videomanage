//关于热度增长的数据实现
const {redis} = require('./index')
exports.hotInc = async (videId,incNum)=>{
    let data = await redis.zscore('videohots',videId)
    let inc//设置查询结果
    if(data){
        inc = await redis.zincrby('videohots',incNum,videId)

    }else {
        inc = redis.zadd('videohots',incNum,videId)

    }
    return inc
}
exports.topHots = async (num)=>{//获取前几名
    let paixun =  await redis.zrevrange('videohots',0,-1,
        'WITHSCORES')
    let newarr = paixun.slice(0,num*2)
    let obj = {}//用来存储相关信息
    for (let i = 0; i < newarr.length; i+=2) {
        obj[paixun[i]] = paixun[i+1]//把score和member放在对象里
    }
    return obj
}