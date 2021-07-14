const User = require('../../schemas/user');
const { CreatePbkdf2HashedPassword } = require('./register');

exports.IsUserIdExistsForLogIn = async (userId) => {
  const isUserIdExists = await User.find({ userId });
  if (isUserIdExists.length !== 1) {
    throw '아이디 또는 비밀번호가 일치하지 않습니다.';
  }
};

exports.IsPasswordMatchesToStoredPassword = async (
  password,
  storedPassword,
  salt
) => {
  const hashedPassword = CreatePbkdf2HashedPassword(password, salt);
  if (hashedPassword !== storedPassword) {
    throw '아이디 또는 비밀번호가 일치하지 않습니다.';
  }
};
