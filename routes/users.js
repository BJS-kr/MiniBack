var express = require('express');
var router = express.Router();
const csrfProtection = require('csurf')({ cookie: true });

// env 파일 읽기
// .env파일은 중요정보가 담겨있기 때문에 .gitignore에 포함되어야하며 항상 루트에 위치하여야 한다.
// process.env객체에 저장.여기선 jwt private key를 저장하기 위해 사용할 예정.
// 로그인 기능이 완성되면 활용
const dotenv = require('dotenv');
dotenv.config();

process.env.PRIVATE_KEY = require('crypto').randomBytes(64).toString('hex');

// 좋아요
app.post('/:postId', async (req, res) => {
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

// 마이페이지
app.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const target = await User.findById(userId);
  const targetIds = target.likes;
  res.json({ targetIds: targetIds });
});

module.exports = router;
