const multer = require('multer');
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
      cb(null, `${new Date().valueOf()}_${path.extname(file.originalname)}`);
    },
    fileFilter: (req, file, cb) => {
      if (
        path.extname(file.originalname) !== '.jpg' ||
        '.gif' ||
        '.jpeg' ||
        '.png'
      ) {
        return cb(null, false);
      }
      cb(null, true);
    },
    // 크기 제한: 10메가
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
}).array('images', 10);

exports.upload = upload;
