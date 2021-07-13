exports.pagination = function pagination(currentPageNum, pageNum, last_id) {
  const spin = pageNum - currentPageNum;
  if (last_id !== null) {
    if (pageNum > currentPageNum) {
      const targetToSlice = await Undefined.find({
        _id: { $gt: last_id },
      }).limit(10 * spin);
      const contents = targetToSlice.slice(-9);
    } else {
      const targetToSlice = await Undefined.find({
        _id: { $lt: last_id },
      }).limit(10 * spin);
      const contents = targetToSlice.slice(0, 10);
    }
  } else {
    const targetToSlice = await Undefined.find({ _id: -1 }).limit(10 * spin);
    const contents = targetToSlice.slice(-9);
  }
  last_id = contents[-1]._id;
  currentPageNum = pageNum;
};
