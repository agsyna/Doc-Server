const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require('multer');


// Sign Up
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, departmentname,departmentnumber,profileurl, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      profileurl,
      departmentname,
      departmentnumber,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Sign In

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({
       id: user._id }, 
       "passwordKey", {
        expiresIn: '168h'
       });

    

       const date = new Date();
       jwt.verify(token, 'secretKey', function(err, decoded) {
        if (err) {
            console.log(`${date.getHours()}:${date.getMinutes()}
                                           :${date.getSeconds()}`);
            console.log(err);
        }
        else {
            console.log(`${date.getHours()}:${date.getMinutes()}
                                           :${date.getSeconds()}`);
            console.log("Token verifified successfully");
        }
      });
       console.log(`Token Generated at:- ${date.getHours()}
                               :${date.getMinutes()}
                               :${date.getSeconds()}`);

      console.log(token);


    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
authRouter.get("/", auth, async (req, res) => {
  // console.log(user);
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = authRouter;
