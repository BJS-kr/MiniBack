const jwt = require('jsonwebtoken');
const { privateKey } = require('../routes/users');
const User = require('../schemas/user');

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    if (req.headers.authorization.split(' ')[0] === 'Bearer') {
      const tokenValue = req.headers.token.split(' ')[1];
      try {
        const { username } = jwt.verify(tokenValue, privateKey);
        User.findOne({ username })
          .exec()
          .then((result) => {
            res.locals.username = username;
          });
        next();
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
