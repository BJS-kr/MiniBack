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

const User = require('../schemas/user');
const csrfProtection = require('csurf')({ cookie: true });

// env 파일 읽기
// .env파일은 중요정보가 담겨있기 때문에 .gitignore에 포함되어야하며 항상 루트에 위치하여야 한다.
// process.env객체에 저장.여기선 jwt private key를 저장하기 위해 사용할 예정.
const dotenv = require('dotenv');
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

// 회원가입
router.post('/', async (req, res) => {
  const { userId, username, password } = req.body;

  if (!AreValuesMeetConditions(req)) {
    res.status(400).json({
      response: '입력조건에 맞지 않습니다.',
    });
  } else if (!IsUsernameExists(username)) {
    res.status(400).json({
      response: '이미 가입된 이름입니다.',
    });
  } else if (!IsUserIdExists(userId)) {
    res.status(400).json({
      response: '이미 가입된 아이디입니다.',
    });
  } else if (!IsPasswordIncludesUsername(password, username)) {
    res.status(400).json({
      response: '비밀번호에 이름을 포함시킬 수 없습니다.',
    });
  }

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

  if (IsUserIdExists(userId)) {
    res.status(401).json({
      response: '가입되지 않은 아이디입니다.',
    });
  } else if (storedPassword !== CreatePbkdf2HashedPassword(password, salt)) {
    res.status(401).json({
      response: '아이디 또는 비밀번호가 일치하지 않습니다.',
    });
  } else {
    const token = jwt.sign(
      {
        userId: userId,
        username: username,
        iat: Math.floor(Date.now() / 1000) - 30,
      },
      privateKey,
      { expiresIn: '1h' },
      { algorithm: 'RS256' }
    );
    res.status(200).send(token);
  }
});

// 좋아요
router.post('/:postId', (req, res) => {
  const { postId } = req.params;
  const { userId, like } = req.body;

  PushOrPullFavorites(like, postId, userId);

  res.json({ response: 'success' });
});

// 마이페이지
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const favoriteObjects = await User.findOne({ userId }).select({
    favorite: 1,
    _id: 0,
  });
  const favorites = favoriteObjects.favorite.reduce((acc, curr) => {
    return acc.push(curr.postId);
  }, []);
  res.json({ favorites: favorites });
});

module.exports = router;
