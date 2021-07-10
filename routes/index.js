const { pagination } = require('./pagination');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const contents = await Undefined.find().sort({ _id: -1 }).limit(10);
  res.send({ contents: contents });
});

router.get('/:pageNum', async (req, res, next) => {
  const { pageNum } = req.params;
  const contents = await Undefined.find()
    .sort({ _id: -1 })
    .skip(10 * (pageNum - 1))
    .limit(10);

  let last_id = null;
  let currentPageNum = 0;

  res.send({ contents: contents });
});

module.exports = router;
