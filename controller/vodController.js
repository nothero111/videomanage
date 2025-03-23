let RPCClient = require('@alicloud/pop-core').RPCClient;
function initVodClient(accessKeyId,accessKeySecret) {
    let regionId = 'cn-shanghai';  // 点播服务接入区域
    let client = new RPCClient({
        accessKeyId:accessKeyId,
        accessKeySecret:accessKeySecret,
        endpoint: 'http://vod.cn-shanghai.aliyuncs.com',
        apiVersion:'2017-03-21'});
    return client;
}

exports.getvod = async (req,res,next) => {
    let client = initVodClient('accessKeyId',
        'accessKeySecret')
    let vodBack = await client.request('CreateUploadVideo', {
        Title: 'test',//视频的名字
        FileName: 'test.mp4'//视频本身的名字以及后缀
    },{})
    res.status(200).json({vod:vodBack})
}
