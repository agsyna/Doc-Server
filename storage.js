const multer = require('multer');
let path = require('path');
const session = require('express-session');
const mongodbsession = require('connect-mongodb-session')(session);

const getDestination = (req, file, cb) => {
  // const folderName = path.join(__dirname, '/'+req.session.type+req.session.pg);
  const folderName = path.join(__dirname, '/');
  console.log(folderName);
  cb(null, `${folderName}`);
};

const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const upload = multer({
  limits: { fileSize: 45 * 1024 * 1024 }, //5 mbs
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only pdf files are allowed.'), false);
    }
  },
  storage: storage,
});

module.exports = upload;
