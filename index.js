var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");


var {
  Mongoose
} = require('./untils/config');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var moviesRouter = require('./routes/movies');
var iconRateRouter = require('./routes/iconRate');
var iconNumRouter = require('./routes/iconNum');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

//session的配置
app.use(session({
  secret: 'as%%*&', //加密形式
  name: 'sessionId', //session的名字
  resave: false, //即使 session 没有被修改，也保存 session 值
  saveUninitialized: false, //是否自动初始化
  cookie: { //session的有效时间
    maxAge: 1000 * 60 * 60 * 24
  }
}))


//设置cors
app.use(cors());

//为了统一项目的api路径，这里在api2的根路径下访问
app.use('/api2', indexRouter);
app.use('/api2/users', usersRouter);
app.use('/api2/admin', adminRouter);
app.use('/api2/movies', moviesRouter);
app.use('/api2/iconRate', iconRateRouter);
app.use('/api2/iconNum', iconNumRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



Mongoose.connect();

app.listen(8895, () => {
  console.log('服务器启动');
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
