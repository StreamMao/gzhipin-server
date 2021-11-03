// 测试使用mongoose操作mongoDB数据库
/*
使用mongoose 操作mongodb 的测试文件
1. 连接数据库
    1.1. 引入mongoose
    1.2. 连接指定数据库(URL 只有数据库是变化的)
    1.3. 获取连接对象
    1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
    2.1. 定义Schema(描述文档结构)
    2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model 或其实例对集合数据进行CRUD 操作
    3.1. 通过Model 实例的save()添加数据
    3.2. 通过Model 的find()/findOne()查询多个或一个数据
    3.3. 通过Model 的findByIdAndUpdate()更新某个数据
    3.4. 通过Model 的remove()删除匹配的数据
*/
const md5 = require('blueimp-md5')

// 1.1. 引入mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function(){//连接成功回调
    console.log('数据库连接成功')
})

// 2.1. 定义Schema(描述文档结构)  文档是一个对象，user文档意思就是一个user对象；集合是数组，多个文档组成一个集合users
const userSchema = mongoose.Schema({//指定文档结构：属性名/属性值的类型，是否必须的，默认值
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}
})

// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema) //这里用user，那么对应的的集合名是users

// 3.1. 通过Model 实例的save()添加数据
function testSave() {
    //创建userModel的实例
    const userModel = new UserModel({username: 'Bob', password: md5('234'), type:'laoban'}) //这里password要加密
    //调用save()保存
    userModel.save(function (error, user) {
        console.log('save()', error, user)
    })
}
// testSave()

// 3.2. 通过Model 的find()/findOne()查询多个或一个数据
function testFind() {
    //查询多个：返回的是数组，如果有匹配返回的是一个[user, user..], 如果没有一个匹配的返回[]
    UserModel.find(function (error, users) { 
        console.log('find()', error, users)
    })
    //查询一个，如果有匹配返回的是一个user, 如果没有一个匹配的返回null
    UserModel.findOne({_id:'6181e7eec18b8ae8347257d4'}, function (error, user) {
        console.log('findOne()', error, user)
    })
}
// testFind()

// 3.3. 通过Model 的findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id:'6181e7eec18b8ae8347257d4'}, {username: 'Jack'}, function(err, user) {
        console.log('findByIdAndUpdate()', err, user)
    })
}
// testUpdate()

// 3.4. 通过Model 的remove()删除匹配的数据
function testDelete() {
    UserModel.remove({_id:'6181edfee8bbfc9f63e1ec70'}, function(err, result) {
        console.log('remove()', err, result)
    })
}
testDelete()
