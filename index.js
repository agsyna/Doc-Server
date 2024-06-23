const express = require("express");
const mongoose = require("mongoose");
// const config = require("config");
const multer = require('multer');
const authRouter = require("./routes/auth");
const File = require("./models/file");
const User = require("./models/user");
const upload = require('./storage');
const { Readable } = require("stream");


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(authRouter);

const DB = "mongodb+srv://syna:syna%401234@cluster0.5qwieuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });
  
  app.get('/details', (req, res) => {
    res.send("works here");
});



app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if(!file)
    {
      res.status(400).json({
        message : 'Failed to upload file',
      })
    }
    else{
      console.log(req.file);
      res.status(200).json({
        message : 'File uploaded successfully',

      })

    }
  
});

//To display the uploaded files
app.get('/files', async (req, res) => {
  try {
    // res.send("works here");
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve files', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`connected at port ${PORT}`);
});