const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const dotenv = require('dotenv');
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    const tokenTypeAndValue = req.headers.authorization;
    if (tokenTypeAndValue.split(' ')[0] === 'Bearer') {
      const tokenValue = tokenTypeAndValue.split(' ')[1];
      try {
        const { username } = jwt.verify(tokenValue, privateKey);
        User.findOne({ username })
          .exec()
          .then((result) => {
            res.locals.username = username;
            next();
          });
      } catch (err) {
        console.log(err);
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
};
