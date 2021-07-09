var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const contents = await Undefined.find().sort({ _id: -1 }).limit(10);
  res.send({ contents: contents });
});

router.get('/:pageNum', async (req, res, next) => {
  const { pageNum } = req.params;
  const N = 10;
  const contents = await Undefined.find()
    .sort({ _id: -1 })
    .skip(N * (pageNum - 1))
    .limit(10);

  // 이것도 중간값 가져오는 쿼리긴한데 아마 글 삭제하면 이상하게 가져올거같아서 안 좋아보임.
  // const contents = await Undefined.find({_id:{$le:20} , _id:{$ge:10}}).sort({_id:-1})

  res.send({ contents: contents });
});

module.exports = router;
