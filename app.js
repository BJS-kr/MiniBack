const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { upload } = require('./upload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.set('views', './views');
app.set('view engine', 'pug');

const app = express();

app.use(logger('dev')); // dev, common, tiny, combined등의 옵션을 통해 log값이 달라짐.
app.use(express.json()); // json응답을 오류없이 받을수 있게 해줌 4.16버전 이후부터 express내장
app.use(express.urlencoded({ extended: false })); // false일시 node.js내장 querystring사용. true라면 qs모듈 사용(추가 설치 필요). qs는 qeurystring의 확장개념. 보안성이 더 높음
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 전체 라우팅 경로에서 static사용 가능.

app.use('/', indexRouter);
app.use('/users', usersRouter);



app.get('/create', (req, res) => {
  res.
});

app.post('/create', upload.array('images', 10), async (req, res) => {
  const { productName, wantToExchange, productCategory, title, description } =
    req.body;
  const images = req.body.url;
  await Undefined.create({
    productName,
    wantToExchange,
    productCategory,
    title,
    description,
    images,
  });
});

app.get('/detail/:id', (req, res) => {

})

app.post('/favorites/:id', async (req, res) => {
  const { id } = req.params;
  const likes = await Likes.findById(id)
  await Likes.findByIdAndUpdate(id, {$set:{likes:likes}})
  res.redirect(`/detail/${id}`)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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
