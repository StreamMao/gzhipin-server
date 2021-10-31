var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
  const {username, password} = req.body
  if (username === 'admin') {//注册失败
    //返回相应数据：失败
    res.send({code: 1, msg:'此用户已存在'})
  } else { //注册成功
    //返回相应数据： 成功
    res.send({code: 0, data:{id: 'abc123', username, password}})
  }
})

module.exports = router;
