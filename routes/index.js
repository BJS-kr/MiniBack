const { pagination } = require('./functions/pagination');
const Product = require('../schemas/product');
const express = require('express');
const router = express.Router();
const csrfProtection = require('csurf')({ cookie: true });

// let last_id = null;
// let currentPageNum = 0;

router.get('/', async (req, res) => {
  // pageNum = 0;
  // currentPageNum = 1;
  // const contents = await pagination(currentPageNum, pageNum, last_id);
  const contents = await Product.find().sort({ _id: -1 }).limit(10);
  const totalLength = await Product.estimatedDocumentCount();
  // if (contents.length < 10) {
  //   last_id = null;
  // } else if (contents.length >= 10) {
  //   last_id = contents[contents.length - 1]._id;
  // }

  res.status(200).json({ contents: contents, totalLength: totalLength });
});

router.get('/:pageNum', async (req, res) => {
  const { pageNum } = req.params;
  // const contents = await pagination(currentPageNum, pageNum, last_id);
  const totalLength = await Product.estimatedDocumentCount();
  // if (contents.length > 0) {
  //   last_id = contents[contents.length - 1]._id;
  //   currentPageNum = pageNum;
  //   res.json({ contents: contents, totalLength: totalLength });
  // } else {
  //   res.json({ response: '더 이상 게시글이 없습니다.' });
  // }

  const contents = await Product.find()
    .sort({ _id: -1 })
    .skip(10 * (pageNum - 1))
    .limit(10);
  res.json({ contents: contents, totalLength: totalLength });
});

module.exports = router;
