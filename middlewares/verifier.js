const jwt = require('jsonwebtoken');
const { privateKey } = require('../routes/users');
const User = require('../schemas/user');

module.exports = (req, res) => {
  if (req.headers.authorization.split(' ')[0] === 'Bearer') {
    const tokenValue = req.headers.token.split(' ')[1];
    try {
      const { username } = jwt.verify(tokenValue, privateKey);
      User.findOne({ username })
        .exec()
        .then((user) => {
          res.locals.user = user;
        });
      next();
    } catch (err) {
      console.log(err);
      res.status(400).send({ response: '올바른 토큰이 아닙니다.' });
    }
  } else {
    res.status(400).send({
      response: '올바른 토큰이 아닙니다.',
    });
  }
};
