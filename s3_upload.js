const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.KEYID, //노출주의
  secretAccessKey: process.env.KEY, //노출주의
  region: process.env.REGION, //노출주의
});

const storage = multerS3({
  s3: s3,
  bucket: 'cucumber-market-images',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, `uploads/${Date.now()}_${file.originalname}`);
  },
  limits: { fileSize: 1024 * 1024 }, // 1메가
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
});
// multers3객체가 storage로 정의되어있음.
exports.s3upload = multer({ storage: storage });
