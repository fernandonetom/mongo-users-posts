require('dotenv').config();
const multer = require('multer');
const uuid = require('uuid').v4;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.UPLOAD_PATH);
  },
  filename(req, file, cb) {
    const fileType = file.originalname.split('.')[1];

    const fileName = uuid();

    cb(null, `${fileName}.${fileType}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      return cb(null, true);
    }
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  },
});

module.exports = upload;
