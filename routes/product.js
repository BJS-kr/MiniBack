const express = require('express');
const router = express.Router();
const Product = require('../schemas/product');

const { SearchOptions } = require('./functions/search');
const { upload } = require('./functions/upload');
const { s3upload } = require('./functions/s3_upload');

router.get('/search/:pageNum', async (req, res) => {
  const { pageNum } = req.params;
  try {
    const options = await SearchOptions(req);
    const contents = await Post.find({ $or: options })
      .sort({ _id: -1 })
      .skip(10 * (pageNum - 1))
      .limit(10);
    res.status(200).json({ contents: contents });
  } catch (err) {
    console.error(err);
    res.status(400).send({
      response: err,
    });
  }
});

router.post('/', async (req, res) => {
  const {
    user,
    productName,
    price,
    productCategory,
    title,
    description,
    images,
    imgUploadCnt,
    insertedAt,
  } = req.body;

  const newProd = await Product.create({
    user,
    productName,
    price,
    productCategory,
    title,
    description,
    images,
    imgUploadCnt,
    insertedAt,
  });
  // 글작성완료하면 자신이 쓴 글로 이동할 수 있게
  res.status(201).json({ latest: newProd._id });
});

router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  const getProduct = await Product.findById(productId);
  res.json({ getProduct: getProduct });
});

router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const {
    title,
    productName,
    price,
    description,
    productCategory,
    images,
    imgUploadCnt,
  } = req.body;

  await Product.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        title: title,
        productName: productName,
        price: price,
        description: description,
        productCategory: productCategory,
        images: images,
        imgUploadCnt: imgUploadCnt,
      },
    }
  );
  res.status(200).send({});
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;

  await Product.findByIdAndDelete(productId);
  res.status(200).send({});
});

module.exports = router;
