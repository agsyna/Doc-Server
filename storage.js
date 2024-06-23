const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const DB = "mongodb+srv://syna:syna%401234@cluster0.5qwieuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const storage = new GridFsStorage({
  url: DB,
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

const upload = multer({ storage });

module.exports = upload;
