var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);





var session = require('cookie-session');
var checkAuth=require('./untils/checkAuth');
var auth=require('./routes/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var gelery = require('./routes/gelery');
var reg=require('./routes/reg');
var config=require('./config');
var app = express();

// view engine setup подключаем настройки
app.set('views', path.join(__dirname, 'views')); //Подключаем папку с шаблонами(в данном случае в корне есть папка views
app.set('view engine', 'jade');// Выбираем какой шаблонизатор используем. сейчас шаблон jade

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  keys: ['key1', 'key2'] // подключаем сессии
  
}));

app.use(function(req,res,next){
	res.locals={
	userId:req.session.user
	};
	console.log(req.session.user);
	next();
})


app.use(express.static(path.join(__dirname, 'public')));// указывает статичные файлы находятся в папке public(стили, скрипты, img)




app.get('/', routes.index);// добавляем прослушиватели
app.use('/users', users);// подключается контролера users.js
app.get('/add',routes.add);// прослушиваем добавление к БД

app.get('/logout',checkAuth,reg.logout);

app.get('/cabinet',checkAuth,auth.cabinet);//перед вызовом личного кабинета, подключаем мидлвар(промежуточная функция), если все гуд переходим к auth.cabinet

app.get('/reg',reg.index);// прослушиваем reg



app.get('/gelery',gelery.index);
app.get('/:id',routes.index);// передаем в id Get парраметр

app.post('/reg',reg.send);

app.get('/', function (req, res) {
  res.sendfile(__dirname + 'chat/index');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(9000);

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
styles=config.get('styles');
scripts=config.get('scripts');

console.log(config.get('scripts'));

app.use(function(err, req, res, next) {

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(config.get('port'));

module.exports = app;// все передаем в exports
