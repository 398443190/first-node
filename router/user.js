const express = require('express')
const boom = require('boom')
const Result = require('../models/Result')
const { login, findUser } = require('../service/user')


const { md5, decode } = require('../utils')
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const router = express.Router()
router.get('/', function (req, res, next) {
  res.send('user index')
})
router.post('/login',
  [
    body('username').isString().withMessage('用户名必须是字符'),
    body('password').isString().withMessage('密码必须是字符')
  ],
  function (req, res, next) {
    const err = validationResult(req)
    console.log(err, 'errerr')
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      next(boom.badRequest(msg))
    } else {
      let username = req.body.username
      let password = req.body.password
      password = md5(`${password}${PWD_SALT}`)
      console.log('md5',md5(`${'huanglu'}${PWD_SALT}`),'md5')
      login(username, password).then(user => {
        if (!user || user.length === 0) {
          new Result('登录失败,用户名或密码不匹配').fail(res)
        } else {
          const token = jwt.sign(
            { username },
            PRIVATE_KEY,
            { expiresIn: JWT_EXPIRED }
          )
          console.log(token)
          new Result({ token }, '登陆成功了啊').success(res)
        }
      })
    }
  })
router.get('/info', function (req, res, next) {
  const decod = decode(req)
  if (decod && decod.username) {
    console.log('decodusername', decod.username, 'decodusername')
    findUser(decod.username).then(user => {
      console.log(user, 'usersssss')
      if (user) {
        user.roles = [user.role]
        new Result(user, '用户信息查询成功').success(res)
      } else {
        new Result('用户信息查询失败').fail(res)
      }
    }).catch(err => {
      console.log(err, 'err')
    })
  } else {
    new Result('用户信息查询失败').fail(res)
  }
})

module.exports = router
