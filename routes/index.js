const { pagination } = require('./functions/pagination');
const express = require('express');
const router = express.Router();
const csrfProtection = require('csurf')({ cookie: true });

let last_id = null;
let currentPageNum = 0;

router.get('/', async (req, res, next) => {
  pageNum = 0;
  const contents = pagination(currentPageNum, pageNum, last_id);
  res.json({ contents: contents });
});

router.get('/:pageNum', async (req, res, next) => {
  const { pageNum } = req.params;
  const contents = pagination(currentPageNum, pageNum, last_id);

  // const contents = await Product.find()
  //   .sort({ _id: -1 })
  //   .skip(10 * (pageNum - 1))
  //   .limit(10);
  res.json({ contents: contents });
});

module.exports = router;
