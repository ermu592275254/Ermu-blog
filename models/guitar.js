var db = require('./db');
var mongoose = require('mongoose');

var guitarSchema = new mongoose.Schema({
    uper_id: String, //上传人id
    name: String, // 歌名
    author: String,//歌手
    url: Array,//图片URL
    time: Date //上传时间
});

var guitarModel  = db.model('guitars',guitarSchema);
/**
 * 查询吉他谱列表
 * @desc 通过user、name、author查询
 * @returns {Array}
 */
guitarModel.getGuitarList = function(params){
    var result;
    guitarModel.find(function(res,err){
        if(err){return result = err};
    });
    return result;
};

module.exports = guitarModel;
