//var settings = require('../settings'),
//    Db = require('mongodb').Db,
//    Connection = require('mongodb').Connection,
//    Server = require('mongodb').Server;
//module.exports = new Db(settings.db, new Server(settings.host, settings.port, {safe:true}));

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','blog');


module.exports = db;
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
    console.log('mongodb connection is OK!');
});