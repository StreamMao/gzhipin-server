var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5');
const { route } = require('express/lib/application');
const UserModel = require('../db/models').UserModel
const filter = {password: 0, __v: 0} //指定过滤的属性

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.post('/register', function(req, res) {
//   console.log('register()')
  
//   const {username, password} = req.body
//   if (username === 'admin') {//注册失败
//     返回相应数据：失败
//     res.send({code: 1, msg:'此用户已存在'})
//   } else { //注册成功
//     返回相应数据： 成功
//     res.send({code: 0, data:{id: 'abc123', username, password}})
//   }
// })

//注册路由
router.post('/register', function(req, res) {
  //读取请求参数
  const {username, password, type} = req.body
  //处理：判断用户是否已经存在，如果存在，返回提示错误信息，如果不存在，保存
    //查询（根据username)
  UserModel.findOne({username}, function (err, user) {
    
    if (user) {//如果user有值，则已存在，返回提示错误信息
      res.send({code:1, msg:'此用户已存在'})
    } else { // 没值，则不存在，保存到数据库
      new UserModel({username, type, password: md5(password)}).save(function (err, user) {
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 持久化cookie, 浏览器会保存在本地文件
        //返回包含user的json数据
        const data = {username, type, _id: user._id} //响应数据中不要携带password
        res.send({code:0, data})
      })
    }
    //
  })
  //返回响应数据
})

//登陆路由
router.post('/login', function(req, res) {
  const {username, password} = req.body
  //根据username和password查询数据库users, 若没有，返回提示错误的信息，如果有，返回登陆成功的信息
  UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
    if(user) {//登陆成功
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 持久化cookie, 浏览器会保存在本地文件
      //返回登陆成功信息（包含user）
      res.send({code: 0, data: user})
    } else {//登陆失败
      res.send({code: 1, msg:'用户名或密码不正确'})
    }
  })
})

//更新用户信息的路由
router.post('/update', function (req, res){
  //从请求的cookie中获得userid
  const userid = req.cookies.userid
  //如果不存在，直接返回一个提示信息
  if(!userid) {
    res.send({code: 1, msg:'请先登陆'})
    return
  }
  //存在，根据usrid更新对应的user文档数据
  //得到提交的用户数据
    const user = req.body //req.body里没有id
    UserModel.findByIdAndUpdate({_id:userid}, user, function (error, oldUser){
      if(!oldUser) {
        //查询不到，说明id有问题，通知浏览器删除userid cookie
        res.clearCookie('userid')
        //返回一个提示信息
        res.send({code:1, msg:'请先登陆'})
      } else {
        //准备一个返回的user数据对象
        const {_id, username, type} = oldUser
        const data = Object.assign({_id, username, type}, user)
        //返回
        res.send({code:0, data})
      }
    })
})

//获取用户信息的路由（根据cookie中的userid）
router.get('/user', (req, res) => {
  //从请求的cookie中获得userid
  const userid = req.cookies.userid
  //如果不存在，直接返回一个提示信息
  if(!userid) {
    res.send({code: 1, msg:'请先登陆'})
    return
  }
  //根据userid查询对应的user
  UserModel.findOne({_id:userid}, filter, function (error, user) {
    res.send({code:0, data:user})
  })
})


module.exports = router;
