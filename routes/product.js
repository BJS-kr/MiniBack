const express = require('express');
const router = express.Router();
const Product = require('../schemas/Product');

router.put("/update/:productId", async (req, res) => {
    const productId = req.params;
    const { productName, price, description, category, imgPath } = req.body;

    await Product.findOneAndUpdate({ _id: productId },
        {
            $set: {
                productName: productName,
                price: price,
                description: description,
                category: category,
                imgPath: imgPath
            }
        });
    res.status(200).send({});

});

router.delete("/delete/:productId", async (req, res) => {
    const productId = req.params;

    const isExist = await Product.findById(productId);
    await isExist.delete();
    res.status(200).send({});
})