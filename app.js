const express = require('express')
const router = require('./router')

const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', router)


const privateKey = fs.readFileSync('./https/3940384_jingjingbaobao.xyz.key', 'utf8')
const certificate = fs.readFileSync('./https/3940384_jingjingbaobao.xyz.pem', 'utf8')
const credentials = { key: privateKey, cert: certificate }

const httpsServer = https.createServer(credentials, app)
const SSLPORT = 18082


const server = app.listen(5000, function(){
    const {address, port} = server.address()
    console.log('服务启动成功', address, port)
})
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT)
  })