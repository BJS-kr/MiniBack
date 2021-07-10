const { pagination } = require('./pagination');
const express = require('express');
const router = express.Router();

let last_id = null;
let currentPageNum = 0;
/* GET home page. */
router.get('/', async (req, res, next) => {
  pageNum = 0;
  // function this는 전역이니까 이렇게해도 전역에서 contents 찾을 수 있는건가?
  pagination(currentPageNum, pageNum, last_id);
  res.send({ contents: contents });
});

router.get('/:pageNum', async (req, res, next) => {
  const { pageNum } = req.params;
  pagination(currentPageNum, pageNum, last_id);
  // 이건 대안
  // const contents = await Undefined.find()
  //   .sort({ _id: -1 })
  //   .skip(10 * (pageNum - 1))
  //   .limit(10);
  res.send({ contents: contents });
});

module.exports = router;
