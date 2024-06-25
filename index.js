const express = require("express");
const mongoose = require("mongoose");
// const config = require("config");
const multer = require("multer");
const auth = require("./middleware/auth");
const authRouter = require("./routes/auth");
const File = require("./models/file");
const User = require("./models/user");
const upload = require("./storage");
const { Readable } = require("stream");
let path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(authRouter);
app.use(express.static(__dirname + "/public/assets"));

const DB =
  "mongodb+srv://syna:syna%401234@cluster0.5qwieuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/details", (req, res) => {
  res.send("works here");
});

app.post("/upload", auth, upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "Failed to upload file",
    });
  } else {
    res.status(200).json({
      message: "File uploaded successfully",
      filename: file.filename.toString(),
    });
  }
});

//To display the uploaded files
app.get("/files", auth, async (req, res) => {
  const user = await User.findById(req.user);

  const directoryPath = path.join(
    __dirname,
    "/deptfolders/" + user.departmentnumber + "/"
  );

  var fdarray = [];
  // console.log(directoryPath);
  fs.readdir(directoryPath, (error, files) => {
    if (error) {
      res.status(400).json({ message: "Failed" });
    } else {
      for (var i = 0; i < files.length; i++) {
        if (
          files[i].substring(files[i].length - 4, files[i].length) == ".pdf"
        ) {
          fdarray.push(files[i]);
        }
      }
      res.status(200).json(fdarray);
    }
  });
});

// json\1.json

//to read jsondata from designated files
app.post("/entry", auth, async (req, res) => {
  try {
    const { eventname, date, natureofevent, id, filename } = req.body;
    const user = await User.findById(id);

    var entries = {
      eventname: eventname,
      date: date,
      natureofevent: natureofevent,
      filename: filename,
    };

    const jsonfilename = path.join(
      __dirname,
      "/json/" + user.departmentnumber + ".json"
    );

    fs.readFile(jsonfilename, "utf8", (err, data) => {

      if (err) {
        console.log(err);
        res.status(400).json({
          message: "Error in read",
        });
      } else {
        data = JSON.parse(data);

        data.push(entries);

        fs.writeFile(jsonfilename, JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              message: "File update failed",
            });
          } else {
            res.status(200).json({
              message: "File updated",
            });
          }
        });
      }
    });
  } catch (e) {}
});

app.listen(PORT, () => {
  console.log(`connected at port ${PORT}`);
});
