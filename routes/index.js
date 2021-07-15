const { pagination } = require('./functions/pagination');
const Product = require('../schemas/product');
const User = require('../schemas/user');
const express = require('express');
const router = express.Router();
const verifier = require('../middlewares/verifier');
const csrfProtection = require('csurf')({ cookie: true });

router.get('/', async (req, res) => {
  const contents = await Product.find().sort({ _id: -1 }).limit(10);
  const totalLength = await Product.estimatedDocumentCount();

  res.status(200).json({ contents: contents, totalLength: totalLength });
});

router.get('/:pageNum', verifier, async (req, res) => {
  const { pageNum } = req.params;
  const totalLength = await Product.estimatedDocumentCount();
  const contents = await Product.find()
    .sort({ _id: -1 })
    .skip(10 * (pageNum - 1))
    .limit(10);

  if (res.locals.username) {
    const favorites = await User.findOne({
      username: res.locals.username,
    }).select({
      favorite: 1,
      _id: 0,
    });

    res.json({
      contents: contents,
      totalLength: totalLength,
      favorites: favorites,
    });
    return;
  }
  res.json({
    contents: contents,
    totalLength: totalLength,
  });
});

module.exports = router;
