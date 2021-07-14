const Product = require('../../schemas/product');

exports.pagination = async function (currentPageNum, pageNum, last_id) {
  const spin = Math.abs(pageNum - currentPageNum);
  if (last_id !== null) {
    if (pageNum > currentPageNum) {
      const targetToSlice = await Product.find({
        _id: { $gt: last_id },
      }).limit(10 * spin);
      return targetToSlice.slice(-10);
    } else {
      const targetToSlice = await Product.find({
        _id: { $lte: last_id },
      }).limit(10 * spin);
      return targetToSlice.slice(0, 10);
    }
  } else {
    return await Product.find().sort({ _id: -1 }).limit(10);
  }
};
