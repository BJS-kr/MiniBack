const express = require('express');
const router = express.Router();
const Product = require('../schemas/Product');

const { upload } = require('./functions/upload');
const { s3upload } = require('./functions/s3_upload');

router.post('/', async (req, res) => {
  const {
    userId,
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
    userId,
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

router.put('/:productId', async (req, res) => {
  const productId = req.params;
  const { productName, price, description, productCategory, images } = req.body;

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
  const productId = req.params;

  const isExist = await Product.findById(productId);
  await isExist.delete();
  res.status(200).send({});
});

module.exports = router;
