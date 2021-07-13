const { registerSchema } = require('../schemas/register');
const crypto = require('crypto');
const User = require('../../schemas/user');

exports.IsUserIdExists = async function (userId) {
  const isUserIdExists = await User.findOne({ userId });
  if (isUserIdExists) {
    return false;
  } else {
    return true;
  }
};

exports.IsUsernameExists = async function (username) {
  const isUsernameExists = await User.findOne({ username });
  if (isUsernameExists) {
    return false;
  } else {
    return true;
  }
};

exports.IsPasswordIncludesUsername = function (password, username) {
  if (password.include(username)) {
    return false;
  } else {
    return true;
  }
};

exports.CreateSalt = function () {
  return crypto.randomBytes(64).toString('base64');
};

exports.CreatePbkdf2HashedPassword = function (password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 105636, 64, 'sha512')
    .toString('base64');
};

exports.AreValuesMeetConditions = async function (req) {
  try {
    await registerSchema.validateAsync(req.body);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
