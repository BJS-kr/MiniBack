const User = require('../../schemas/user');

exports.PushOrPullFavorites = async (like, postId, userId) => {
  if (like == 'true') {
    return await User.findOneAndUpdate(
      { userId },
      { $push: { favorite: { postId: postId } } },
      { new: true }
    );
  } else {
    return await User.findOneAndUpdate(
      { userId },
      { $pull: { favorite: { postId: postId } } },
      { new: true }
    );
  }
};
