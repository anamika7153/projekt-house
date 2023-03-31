const express = require("express");
const mongoose = require("mongoose");
const { mailer } = require("../middlewares/mailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const requireLogin = require("../middlewares/requireLogin");
const { JWT_SECRET } = require("../config/keys");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Otp = mongoose.model("Otp");

const router = express.Router();

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.post("/user/sendemail", async(req, res) => {
  const { email } = req.body
  const data = await User.findOne({ email: email })
  // console.log(data)
  const responseType = {}

  if(!data) {
    responseType.statusText = 'error'
    responseType.message = 'Email Id does not exist'
    // console.log("data")
    
  }
  else {
    let otpcode = Math.floor((Math.random()*10000)+1)
    let otpData = new Otp ({
      email: req.body.email,
      code: otpcode,
      expireIn: new Date().getTime()+ 600*1000
    })
    let otpResponse = await otpData.save()
    // mailer(otpData.email,otpData.code)
    mailer('yanamika419@gmail.com',otpData.code)
    console.log("otp", otpData.code)
    responseType.statusText = 'success'
    responseType.message = 'Please check your email id'
    // console.log("no data")
  }
  res.status(200).json(responseType)
  // res.status(200).json(req.body.email)
  // res.json({ data });
});

router.put("/user/changepassword", async (req, res) => {
  console.log("body in route",req.body.email, req.body.otpCode)
  const data = await Otp.findOne({ email: req.body.email, code: req.body.otpCode })
  console.log("data",data)
  const setpass =async(userid,hashed) => {
    await User.findByIdAndUpdate(
      userid, 
      {
        $set: {password:hashed}
      }
    )
  }
  const response = {}
  if(data) {
    const { password } =req.body
    // const newpass = req.body.password
    var newpass;
    let currentTime = new Date().getTime()
    let diff = data.expireIn - currentTime
    if(diff < 0) {
      response.message = 'Token Expired'
      response.statusText = 'error'
    } else {
      let user = await User.findOne({ email:req.body.email })
      bcrypt.hash(password, 12).then((hashedPass) => {
        newpass  = hashedPass
        setpass(user._id,hashedPass)
        // user.password = hashedPass
        //  User.findByIdAndUpdate(
        //   user._id, 
        //   {
        //     $set: {password:hashedPass}
        //   }
        // )
      })
      // user.password = req.body.password
      // user.save()
      response.message = 'Password Changed Successfully'
      response.statusText = 'success'
    }
  }
  else {
    response.message = 'Invalid OTP'
    response.statusText = 'error'
  }
  res.status(200).json(response)
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Pic can not be updated" });
      }
      res.json(result);
    }
  );
});

router.post("/search-users", (req, res) => {
  const userr = req.body.query
  User.find({ name: { $regex: new RegExp(userr, 'i') } })
  // User.find({ name: userr })
    .select("_id name email pic")
    .then((user) => {
      res.json({ user });
      console.log(user)
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/top-creators", (req, res) => {
  User.find()
    .sort("-following")
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
