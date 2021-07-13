const express = require('express');
const router = express.Router();
const { PushOrPullFavorites } = require('./functions/favorites');
const csrfProtection = require('csurf')({ cookie: true });

// env 파일 읽기
// .env파일은 중요정보가 담겨있기 때문에 .gitignore에 포함되어야하며 항상 루트에 위치하여야 한다.
// process.env객체에 저장.여기선 jwt private key를 저장하기 위해 사용할 예정.
// 로그인 기능이 완성되면 활용
const dotenv = require('dotenv');
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

// 회원가입
// router.post('/', async (req, res) => {
//   const { id, username, password } = req.body;
//   const favorites = [];
//   User.create({ id, username, password, favorites });
// });

// 좋아요
router.post('/:postId', (req, res) => {
  const { postId } = req.params;
  const { userId, like } = req.body;

  PushOrPullFavorites(like, postId, userId);

  res.send({ response: 'success' });
});

// 마이페이지
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const target = await User.findOne({ userId });
  const targetIds = target.likes;
  res.json({ targetIds: targetIds });
});

module.exports = router;
