var db = require('./db');
var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
    author: String,
    title: String,
    firstSort: String,
    secondSort:String,
    tags: String,
    post: String,
    time: Date,
    readNum: Number,
    // goodList: Array， 点赞先不做
});

var postModel = db.model('posts',postSchema);

module.exports = postModel;


//
//postModel.findById('580ac9ce0926210a58bc1cb4',function(err,user){
//        console.log(user);
//    user.readNum += 10;
//    postModel.update({_id:user._id},{readNum: user.readNum}, function(err,user){
//        console.log(user);
//    });
//});



//function Post(user,title,tags,post) {
//    this.user = user;
//    this.title = title;
//    this.tags=tags;
//    this.post = post;
//}
//
//module.exports = Post;
//
//Post.prototype.save = function(callback) {
//var date = new Date();
//var time = {
//    date: date,
//    year : date.getFullYear(),
//    month : date.getFullYear() + "-" + (date.getMonth()+1),
//    day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
//    minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
//}
//var post = {
//    user: this.user,//用户
//    time: time,//发表时间
//    title: this.title,//标题
//    pv:0,//访问量
//    tags:this.tags,
//    post: this.post,//文章内容
//    comments:[]//评论
//};
//
//mongodb.open(function (err, db) {
//    if (err) {
//        return callback(err);
//    }
//
//    db.collection('posts', function (err, collection) {
//        if (err) {
//            mongodb.close();
//            return callback(err);
//        }
//
//        collection.insert(post, {
//            safe: true
//        }, function (err,post) {
//            mongodb.close();
//            callback(err,post);
//        });
//    });
//});
//};
//
//Post.getAll = function(user, callback) {//获取一个人的所有文章
//
//    db.collection('posts', function(err, collection) {
//        if (err) {
//            return callback(err);
//        }
//
//        var query={};
//        if(user){//因为index.js中app.get('/')为Post.getAll(null, function(err, posts){}),所以要判断user
//            query.user=user;
//        }
//        collection.find(query).sort({
//            time: -1
//        }).toArray(function (err, docs) {
//            if (err) {
//                callback(err, null);
//            }
//            //docs.forEach(function (doc) {
//            //    doc.post = markdown.toHTML(doc.post);
//            //});
//            if(Array.isArray(docs)){
//                for(var i = 0;i< docs.length; i++){
//                    docs[i].post = markdown.toHTML(docs[i].post);
//                }
//            }
//            callback(null, docs);
//        });
//    });
//};
//
//
////阅读排行
//Post.getFive = function(callback) {//获取一个人的所有文章
//mongodb.open(function (err, db) {
//    if (err) {
//        return callback(err);
//    }
//
//    db.collection('posts', function(err, collection) {
//        if (err) {
//            mongodb.close();
//            return callback(err);
//        }
//
//        var query={};
//        collection.find(query).sort({
//            pv: -1
//        }).toArray(function (err, docs) {
//            mongodb.close();
//            if (err) {
//                callback(err, null);
//            }
//           // 解析 markdown 为 html
//                console.log(docs);
//             //docs.forEach(function (doc) {
//             //  doc.post = markdown.toHTML(doc.post);
//             //});
//            if(Array.isArray(docs)){
//                for(var i = 0;i< docs.length; i++){
//                    docs[i].post = markdown.toHTML(docs[i].post);
//                }
//            }
//            callback(null, docs);
//        });
//    });
//});
//};
////一次获取十篇文章
//Post.getTen = function(user,tags, page, callback) {
//  //打开数据库
//  mongodb.open(function (err, db) {
//    if (err) {
//      return callback(err);
//    }
//    //读取 posts 集合
//    db.collection('posts', function (err, collection) {
//      if (err) {
//        mongodb.close();
//        return callback(err);
//      }
//      var query = {};
//      if (user) {
//        query.user = user;
//      }
//      if(tags !=null){
//        query.tags=tags;
//      }
//      //使用 count 返回特定查询的文档数 total
//      collection.count(query, function (err, total) {
//        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
//        collection.find(query, {
//          skip: (page - 1)*10,
//          limit: 10
//        }).sort({
//          time: -1
//        }).toArray(function (err, docs) {
//          mongodb.close();
//          if (err) {
//            return callback(err);
//          }
//          //解析 markdown 为 html
//          // docs.forEach(function (doc) {
//          //   doc.post = markdown.toHTML(doc.post);
//          // });
//          callback(null, docs, total);
//        });
//      });
//    });
//  });
//};
//
//
//Post.getOne = function(user, day, title, callback) {//获取一篇文章
//    mongodb.open(function (err, db) {
//        if (err) {
//            return callback(err);
//        }
//
//        db.collection('posts', function(err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//
//            collection.find({"user":user,"time.day":day,"title":title},function (err, doc) {
//                mongodb.close();
//                if (err) {
//                    callback(err);
//                }
//                if(doc){
//                    doc.post=markdown.toHTML(doc.post);
//                    doc.comments.forEach(function(comment){
//                        comment.content = markdown.toHTML(comment.content);
//                    });
//                }
//                callback(null, doc);
//            });
//            collection.update({"user":user,"time.day":day,"title":title},{$inc:{"pv":1}});
//        });
//    });
//};
//
//
//Post.edit=function(user,day,title,callback){
//    mongodb.open(function(err,db){
//        if(err){
//            return callback(err);
//        }
//        db.collection('posts',function(err,collection){
//            if(err){
//                mongodb.close();
//                return callback(err);
//            }
//            collection.findOne({"user":user,"time.day":day,"title":title},function (err, doc) {
//                mongodb.close();
//                if (err) {
//                    return callback(err);
//                }
//                callback(null, doc);
//            });
//        });
//    });
//};
//
//
//Post.update = function(name, day, title, newpost, callback) {
//  //打开数据库
//  mongodb.open(function (err, db) {
//    if (err) {
//      return callback(err);
//    }
//    //读取 posts 集合
//    db.collection('posts', function (err, collection) {
//      if (err) {
//        mongodb.close();
//        return callback(err);
//      }
//      //更新文章内容
//      collection.update({
//        "user": name,
//        "time.day": day,
//        "title": title
//      }, {
//        $set: {post : newpost}
//      }, function (err) {
//        mongodb.close();
//        if (err) {
//          return callback(err);
//        }
//        callback(null);
//      });
//    });
//  });
//};
//
//
//Post.remove=function(user,day,title,callback){
//    mongodb.open(function(err,db){
//        if(err){
//            return callback(err);
//        }
//        db.collection('posts',function(err,collection){
//            if(err){
//                mongodb.close();
//                return callback(err);
//            }
//            collection.remove({
//                "user":user,
//                "time.day":day,
//                "title":title
//            },{w:1},function(err){
//                mongodb.close();
//                if(err){
//                    return callback(err);
//                }
//                callback(null);
//            });
//        });
//    });
//};
