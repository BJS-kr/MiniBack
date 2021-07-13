const express = require('express');
const router = express.Router();
const Product = require('../schemas/Product');

const { upload } = require('./functions/upload');
const { s3upload } = require('./functions/s3_upload');

router.post('/', upload.array('images', 10), async (req, res) => {
  const { userId, productName, price, productCategory, title, description } =
    req.body;
  const images = req.body.url;
  const date = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  await Product.create({
    userId,
    productName,
    price,
    productCategory,
    title,
    description,
    images,
    date,
  });
  // 글작성완료하면 자신이 쓴 글로 이동할 수 있게
  res.json({ latest: userId, date });
});

router.put('/:productId', async (req, res) => {
  const productId = req.params;
  const { productName, price, description, category, imgPath } = req.body;

  await Product.findOneAndUpdate(
    { _id: productId },
    {
      $set: {
        productName: productName,
        price: price,
        description: description,
        category: category,
        imgPath: imgPath,
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
