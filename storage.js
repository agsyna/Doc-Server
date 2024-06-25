const multer = require('multer');
let path = require('path');
const mongoose = require("mongoose");
const User = require("./models/user");


const getDestination = async (req, file, cb) => {
  // const folderName = path.join(__dirname, '/'+req.session.type+req.session.pg);
  const user = await User.findById(req.user);
  // console.log(user);
  // console.log();
  
  const folderName = path.join(__dirname, '/deptfolders/'+ user.departmentnumber+'/');
  console.log(folderName);
  console.log(__dirname);
  cb(null, `${folderName}`);
};

const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const upload = multer({
  limits: { fileSize: 300 * 1024 * 1024 }, //300 mbs
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
