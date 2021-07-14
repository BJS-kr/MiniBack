const { registerSchema } = require('../../schemas/register');
const crypto = require('crypto');
const User = require('../../schemas/user');

exports.IsUserIdExists = async function (userId) {
  const isUserIdExists = await User.find({ userId });
  if (isUserIdExists.length > 0) {
    throw '이미 가입된 아이디입니다.';
  }
};

exports.IsUsernameExists = async function (username) {
  const isUsernameExists = await User.find({ username });
  if (isUsernameExists.length > 0) {
    console.log(isUsernameExists.length);
    throw '이미 존재하는 이름입니다.';
  }
};

exports.IsPasswordIncludesUsername = function (password, username) {
  if (password.includes(username)) {
    throw '비밀번호에 닉네임을 포함시키지 마세요.';
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
  } catch (err) {
    throw '아이디나 비밀번호가 가입 조건에 맞지 않습니다.';
  }
};
