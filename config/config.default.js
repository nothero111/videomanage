/**
 * 默认配置
 */

module.exports = {
  uuid:'78307231-3d6b-47f2-aab7-55082095067a',
  mongoPath: 'mongodb://localhost:27017/express-video',
  redisClient:{
    path:'127.0.0.1',
    port:6379,
    options:{password:'123456'}
  }
}
