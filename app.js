var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var settings=require('./settings');
var flash = require('connect-flash');
var crypto = require('crypto');
var multer = require('multer');
var session=require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var ejs = require('ejs');

// view engine setup
app.set('www', path.join(__dirname, 'www'));
//app.set('view engine', 'html');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(flash());
//会话信息存储到数据库中
app.use(session({ 
      secret: settings.cookieSecret, 
      key:settings.db,
      cookie:{maxAge:1000*60*60*24*30},
      store: new MongoStore({ 
      db: settings.db,
      url:'mongodb://localhost/'+settings.db,
   }) 
}));
app.use(multer({
  dest:'./public/images',
  rename: function(fieldname,filename){
    return filename;
  }
}));
//这里添加视图助手
/*app.use(function(req,res,next){
    var err = req.flash('error'),
    success = req.flash('success');
    res.locals.user = req.session.user;
    res.locals.error = err.length ? err : null;
    res.locals.success = success.length ? success : null;
    next();
});*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));


routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//网页图标
//app.use(favicon(__dirname + '/public/images/favicon.ico'));

console.log(__dirname);
module.exports = app;
