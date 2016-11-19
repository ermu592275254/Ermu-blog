var db = require('./db');
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    owner_user: String, //此评论的创建者
    target_user: String, // 此评论的对象
    created_time: Date,
    content: String,
    parent_id: String, // 文章或评论的id
    parent_type:String, // 评论是针对文章还是评论
    comment_num: Number, //评论数
    likeCount: Number,  //此条评论点赞数
    isReply: Boolean, //是否为回复
    article_id: String //当删除文章时，通过对应的article_id来删除对应的所有评论
});

var commentModel  = db.model('comments',commentSchema);

module.exports = commentModel;











//var mongodb = require('./db');
//
//function Comment(user, day, title, comment) {
//    this.user = user;
//    this.day = day;
//    this.title = title;
//    this.comment = comment;
//}
//
//module.exports = Comment;
//
//Comment.prototype.save = function(callback) {
//var user = this.user,
//    day = this.day,
//    title = this.title,
//    comment = this.comment;
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
//        collection.update({"user":user,"time.day":day,"title":title}
//        , {$push:{"comments":comment}}
//        , function (err,comment) {
//            mongodb.close();
//            callback(err,comment);
//        });
//    });
//    mongodb.close();
//});
//};