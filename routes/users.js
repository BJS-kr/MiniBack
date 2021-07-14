const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PushOrPullFavorites } = require('./functions/favorites');
const {
  IsUsernameExists,
  IsUserIdExists,
  IsPasswordIncludesUsername,
  CreateSalt,
  CreatePbkdf2HashedPassword,
  AreValuesMeetConditions,
} = require('./functions/register');
const {
  IsUserIdExistsForLogIn,
  IsPasswordMatchesToStoredPassword,
} = require('./functions/login');

const Product = require('../schemas/product');
const User = require('../schemas/user');
const csrfProtection = require('csurf')({ cookie: true });

// env 파일 읽기
// .env파일은 중요정보가 담겨있기 때문에 .gitignore에 포함되어야하며 항상 루트에 위치하여야 한다.
// process.env객체에 저장.여기선 jwt private key를 저장하기 위해 사용할 예정.
const dotenv = require('dotenv');
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
exports.privateKey = privateKey;
// 회원가입
router.post('/', async (req, res) => {
  const { userId, username, password } = req.body;

  try {
    await AreValuesMeetConditions(req);
    await IsUserIdExists(userId);
    await IsUsernameExists(username);
    await IsPasswordIncludesUsername(password, username);

    const salt = CreateSalt();
    const storedPassword = CreatePbkdf2HashedPassword(password, salt);
    const favorites = [];
    await User.create({
      userId,
      username,
      password: { salt, storedPassword },
      favorites,
    });
    res.status(201).json({
      response: '가입완료!',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      response: err,
    });
  }
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const { storedPassword, salt, username } = await User.findOne({
    userId,
  }).select({
    salt: 1,
    storedPassword: 1,
    username: 1,
    _id: 0,
  });

  try {
    await IsUserIdExistsForLogIn(userId);
    await IsPasswordMatchesToStoredPassword(password, storedPassword, salt);

    const userInfo = await User.findOne({ userId }).select({ password: 0 });
    const token = jwt.sign(
      {
        userId: userId,
        username: username,
        iat: Math.floor(Date.now() / 1000) - 30,
      },
      privateKey,
      { expiresIn: '24h' },
      { algorithm: 'RS256' }
    );

    res.status(200).json({ token: token, userInfo: userInfo });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      response: err,
    });
  }
});

// 좋아요
router.post('/:postId', (req, res) => {
  const { postId } = req.params;
  const { userId, like } = req.body;

  PushOrPullFavorites(like, postId, userId);

  res.status(200).json({ response: 'success' });
});

// 마이페이지
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  User.findOne({ userId })
    .select({ favorite: 1, _id: 0 })
    .populate('favorite')
    .exec(async (err, favorites) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        favorites: favorites.favorite,
        myPosts: await Product.find({ 'user.userId': userId }),
      });
    });
});

module.exports = router;
