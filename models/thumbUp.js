var db = require('./db');
var mongoose = require('mongoose');


var thumbUpSchema = new mongoose.Schema({
    like_id: String, //点赞对应的文章或评论的id
    user_id: String //点赞人的ID
    // goodList: Array， 点赞先不做
});

var thumbUpModel = db.model('posts',thumbUpSchema);

module.exports = thumbUpModel;