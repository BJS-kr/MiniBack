const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const connect = require('./schemas');
connect();

const app = express();

const indexRouter = require(path.join(__dirname, '/routes/index'));
const usersRouter = require(path.join(__dirname, '/routes/users'));
const productRouter = require(path.join(__dirname, '/routes/product'));

app.use(helmet()); // jwt를 로컬스토리지에 저장하는 방식이므로 xss공격 차단용 helmet
// cors는 get, head, options에만 허용하는 것이 csrf보안상 좋다.
app.use(cors()); // cors를 모두 허용하고 있으므로 공격자가 csrf토큰을 탈취할 가능성이 높아졌다.
app.use(logger('dev')); // dev, common, tiny, combined등의 옵션을 통해 log값이 달라짐.
app.use(express.json()); // json응답을 오류없이 받을수 있게 해줌 4.16버전 이후부터 express내장
app.use(express.urlencoded({ extended: false })); // false일시 node.js내장 querystring사용. true라면 qs모듈 사용(추가 설치 필요). qs는 qeurystring의 확장개념. 보안성이 더 높음
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 전체 라우팅 경로에서 static사용 가능.

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);

// 404 handle
app.use(function (req, res, next) {
  next(createError(404));
});

// csrf error handle
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send('form tampered with');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
