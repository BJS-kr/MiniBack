const { pagination } = require('./functions/pagination');
const express = require('express');
const router = express.Router();
const csrfProtection = require('csurf')({ cookie: true });

let last_id = null;
let currentPageNum = 0;

router.get('/', async (req, res, next) => {
  pageNum = 0;
  currentPageNum = 1;
  const [contents, totalLength] = pagination(currentPageNum, pageNum, last_id);
  last_id = contents.length < 10 ? null : contents[-1]._id;
  res.json({ contents: contents, totalLength: totalLength });
});

router.get('/:pageNum', async (req, res, next) => {
  const { pageNum } = req.params;
  const [contents, totalLength] = pagination(currentPageNum, pageNum, last_id);
  if (contents.length > 0) {
    last_id = contents[-1]._id;
    currentPageNum = pageNum;
    res.json({ contents: contents, totalLength: totalLength });
  } else {
    res.json({ response: '더 이상 게시글이 없습니다.' });
  }

  // const contents = await Product.find()
  //   .sort({ _id: -1 })
  //   .skip(10 * (pageNum - 1))
  //   .limit(10);
});

module.exports = router;
