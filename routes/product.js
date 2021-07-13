const express = require('express');
const router = express.Router();
const Product = require('../schemas/Product');

const { upload } = require('./functions/upload');
const { s3upload } = require('./functions/s3_upload');

router.post('/', upload.array('images', 10), async (req, res) => {
  const { productName, wantToExchange, productCategory, title, description } =
    req.body;
  const images = req.body.url;
  await Product.create({
    productName,
    wantToExchange,
    productCategory,
    title,
    description,
    images,
  });
  // 생성시간을 찾아서 넣는게 더 빠를듯. 이건 전체 다 불러와야되서 느림.
  const latest = await Undefined.find({}).sort({ _id: -1 }).limit(1);
  const targetId = latest._id;
  res.redirect(`/detail/${targetId}`);
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
