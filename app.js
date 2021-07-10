const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { upload } = require('./upload');
const { s3upload } = require('./s3_upload');

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
  res.send('create.html'); //?? 어떻게 보내줘야 되는거지
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

  // 마지막으로 생성된 글의 id를 찾아서 자신이 작성한 글로 리디렉트
  // _id가 문자열이어야되나?
  const latest = await Undefined.find({}).sort({ _id: -1 }).limit(1);
  const targetId = latest._id;
  res.redirect(`/detail/${targetId}`);
});

app.get('/detail/:id', (req, res) => {
  // 게시글 띄울때 데이터 건네준거로 프론트에서 처리 가능. 딱히 만들건 없는 듯.
});

// 좋아요는 어떤 식으로 구현?
// 유져 DB에 특정 유져가 좋아요 누른 게시글 id 추가?
// 그럼 애초에 회원가입할때 User DB에 좋아요한 글 id들을 저장할 column이 필요하다.
app.post('/favorites/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, like } = req.body;
  const targetUser = await User.findById(userId);
  const target = targetUser.likes;

  if (like) {
    target.push(id);
  } else {
    target.remove(id);
  }

  await User.findByIdAndUpdate(id, { likes: target });
  res.send({});
});

app.get('/mypage/:userId', (req, res) => {
  const { userId } = req.params;
  const target = await User.findById(userId);
  const targetIds = target.likes;
  res.json({ targetIds: targetIds });
});

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
