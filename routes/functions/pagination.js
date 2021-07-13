const Product = require('../../schemas/product');

exports.pagination = async function pagination(
  currentPageNum,
  pageNum,
  last_id
) {
  const spin = Math.abs(pageNum - currentPageNum);
  if (last_id !== null) {
    if (pageNum > currentPageNum) {
      const targetToSlice = await Product.find({
        _id: { $gt: last_id },
      }).limit(10 * spin);
      return targetToSlice.slice(-9);
    } else {
      const targetToSlice = await Product.find({
        _id: { $lt: last_id },
      }).limit(10 * spin);
      return targetToSlice.slice(0, 10);
    }
  } else {
    const targetToSlice = await Product.find()
      .sort({ _id: -1 })
      .limit(10 * spin);
    return targetToSlice.slice(-9);
  }
  last_id = contents[-1]._id;
  currentPageNum = pageNum;
};
