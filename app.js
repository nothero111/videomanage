const express = require('express')
const cors = require('cors')//关于跨域的中间件
const morgan = require('morgan')//关于日志的中间件
const app = express()


const router = require('./router')



app.use(express.json())//接收客户端发来的json数据的中间件
app.use(express.urlencoded())//接收客户端发来的urlencoded数据的中间件
app.use(cors())//使服务器支持跨域的请求
app.use(express.static('public'))//使服务器支持静态资源的访问
app.use(morgan('dev'))//使服务器在开发模式下支持日志的记录
app.use('/api/v1', router)//使服务器支持路由,说明当前路由是v1的版本

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
