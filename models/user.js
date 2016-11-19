var mongoose = require('mongoose');
var db = require('./db');


//定义一个Schema，不过是一些文本属性
var　userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String
});

//将schema发布为Model，发布为model才算得上在数据库建了模型
var userModel = db.model('users',userSchema);//对应一个user表


//查找操作
//userModel.find(function(err, user) {
//    console.log(user);
////});
//userModel.findOne({name:'ermu',password:'ermu'},function(err,user){
//    console.log(user);
//});
//userModel.findById('57396278292e29f00e6c6b21',function(err,user){
//    console.log(user);
//});

// 增加
//var userEntity  = new userModel({name:'10010',password: '10010'});
//
//userEntity.save();

//userModel.create({name:'123456',password:'123456'},function(err,user){
//    console.log(user);
//});

//更新
//
//userModel.update({name:'123456'},{name:'654321'}, function(err,user){ // 查询对象，更新对象，回调函数
//    console.log(err);
//    console.log(user);
//});

// 删除
//userModel.remove({name:'654321'},function(err,user){
//    console.log(user);
//});

module.exports = userModel;　