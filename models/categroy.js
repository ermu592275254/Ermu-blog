//var mongodb = require('./db');

/**
 * 文章分类
 * @param code      代码，一些和技术相关的文章，可根据语言再细分
 * @param life      生活，一些生活中的照片，生活中发生的事，也可以是待办的事
 * @param diary     日记  记录生活中值得记录的事情
 * @param letter    文学  写一些乱七八糟的东西
 * @param recreation娱乐 吉他、游戏、电影、歌曲等
 * @constructor
 */
function Categroy (code,life,diary,letter,recreation){
    this.code = code;
    this.life = life;
    this.diary = diary;
    this.letter = letter;
    this.recreation = recreation;
}

//module.exports = Categroy; //将整个Categroy作为exports对象

//category的曾删改查

Categroy.peototype.save = function(callback) {

};