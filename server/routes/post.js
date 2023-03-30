
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const { s3Uploadv2, s3Uploadv3 } = require("../middlewares/s3service.js");
const requireLogin = require("../middlewares/requireLogin");
const Post = mongoose.model("Post");
AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3 } = require("aws-sdk");
const { resolve } = require("path");
const { rejects } = require("assert");

const router = express.Router();

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const buc = process.env.AWS_BUCKET_NAME
const reg = process.env.AWS_REGION

const upload = multer({
  storage: multer.memoryStorage({
    destination: function(req, file, cb) {
      cb(null, '');
    },
  }),
  limits: {
    fileSize: 8000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|ppt|pptx)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls, ppt, pptx format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
})

router.post(`/createteam`, requireLogin, upload.array('file'), async(req, res) => {
  console.log("req.files",req.files)
  const uploadtos3 = async (filename, file) => {
    return new Promise (async (resolve, reject) => {
      const params = {
        Key: filename,
        Bucket : process.env.AWS_BUCKET_NAME,
        Body: file,
      }
      await s3.upload(params, (err, data) => {
        if(err) {
          console.log("ERR", err)
          reject(err)
        } else {
          console.log("Running")
          resolve(data.Location)
        }
      })
    })
}
const { title, description, members, member1, sec1,mobile1, member2, sec2,mobile2, member3, sec3,mobile3, member4, sec4,mobile4, member5, sec5,mobile5,  } = req.body;
  try {
    if (!title || !description) {
    return res.status(422).json({ error: "Please fill in all the fields" });
  }
  req.user.password = null;
  const post = new Post({
          title,
          description,
          members,
          member1,          
          mobile1,
          sec1,
          member2,          
          mobile2,
          sec2,
          member3,          
          mobile3,
          sec3,
          member4,          
          mobile4,
          sec4,
          member5,          
          mobile5,
          sec5,
          postedBy: req.user,
  })
  try {
    const savepost = await post.save()
    const postid = savepost._id
    console.log("req.files",req.files)
    req.files.forEach(async (file) => {
      console.log("file",file)
      if(file.mimetype.includes("image/jpeg")) folder = 'newuploads'
      else folder = 'newuploads'
      let filename = `newuploads/${file.originalname}`
      let medialink = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
      console.log("file.originalname",file.originalname)
        var linkk = await uploadtos3(filename, file.buffer)
        var filnam = file.originalname
        const fil = {
          url: linkk,
          filenamee:filnam
        }
        await Post.findByIdAndUpdate(
          postid,
          {
            $push: {filee:fil }
          }
        )
    })
    console.log("save to post")
    res.status(200).json("added")
  } catch (error) {
    console.log("err in saving to db",error)
    res.status(500).json(error)
  }
  } catch (error) {
    console.log(error)
  }
},
(error, req, res, next) => {
  if (error) {
    res.status(500).send(error.message);
  }
}
);

router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt") // - for descending order , createdAt for factor on whihc we need to sort
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/download/:id', async (req, res) => {
  try {
    const file = await Post.findById(req.params.id);
    res.set({
      'Content-Type': file.file_mimetype
    });
    res.sendFile(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

router.get("/getSubPost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

//load data to editpost route
router.get('/edit/:id', (req,res) => {
  Post.findById(req.params.id, (error,data)=> {
    if(error){
      return next(error)
    } else {
      res.json(data)
    }
  })
})

const strg = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
})

const fileFilter = (req,file, cb) => {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|ppt|pptx)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls, ppt, pptx format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
}

const upl = multer({
  strg,
  fileFilter,
  limits: {fileSize: 8000000, files: 2},
})


router.put("/newupload/:id",requireLogin ,upl.array("file"), async (req,res)=> {
  postid=req.params.id
  console.log("postid", postid)
  const { term } = req.body
  console.log("term",term)
  const uploadtos3 = async (filename, file) => {
    return new Promise (async (resolve, reject) => {
      const params = {
        Key: filename,
        Bucket : process.env.AWS_BUCKET_NAME,
        Body: file,
      }
      await s3.upload(params, (err, data) => {
        if(err) {
          console.log("ERR", err)
          reject(err)
        } else {
          console.log("Running")
          resolve(data.Location)
        }
      })
    })
  }
  try {
    console.log("req.files",req.files)
    req.files.forEach(async (file) => {
      console.log("file",file)
      if(file.mimetype.includes("image/jpeg")) folder = 'newuploads'
      else folder = 'newuploads'
      let filename = `newuploads/${file.originalname}`
      let medialink = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
      console.log("file.originalname",file.originalname)
        var linkk = await uploadtos3(filename, file.buffer)
        var filnam = file.originalname
        const fil = {
          url: linkk,
          filenamee:filnam,
          term:term
        }
        await Post.findByIdAndUpdate(
          postid,
          {
            $push: {filee:fil }
          }
        )
    })
    console.log("save to post")
    res.json({status: "success"})
  } catch (error) {
    console.log(error)
  }
  
})

router.get('/downloadfile/:id', async (req, res) => {
  try {
    const fileurl = getUrlFromBucket (AWS_BUCKET_NAME, )
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});


router.put('/updatedata/:id', (req,res)=> {
  Post.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if(error){
      return next(error)
    } else {
      res.json(data)
    }
  })
})

router.get('/getfiles/:postid/:id',upl.array("file"), async (req,res) => {
  const postid = req.params.postid
  const id = req.params.id
  try {
    const data = await Post.findById({'filee._id' : id})
      res.json(data)
  } catch (error) {
    console.log(error)
  }
})

router.put("/editfiles/:postid/:id",requireLogin ,upl.single("file"), async (req,res)=> {
  const postid = req.params.postid
  const id = req.params.id
  const uploadtos3 = async (filename, file) => {
    return new Promise (async (resolve, reject) => {
      const params = {
        Key: filename,
        Bucket : process.env.AWS_BUCKET_NAME,
        Body: file,
      }
      await s3.upload(params, (err, data) => {
        if(err) {
          console.log("ERR", err)
          reject(err)
        } else {
          console.log("Running")
          resolve(data.Location)
        }
      })
    })
  }
  try {
      const file = req.file
      console.log("file in route",file)
      let filename = `newuploads/${file.originalname}`
      const orgname = file.originalname
      // let medialink = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
      let medialink = 'https://' + buc + '.s3.' + reg + '.amazonaws.com/' + 'newuploads/' + orgname
      // `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
      console.log("file.originalname",file.originalname)
      console.log("medialink",medialink)
        var linkk = await uploadtos3(filename, file.buffer)
        console.log("linkk",linkk)
        await Post.updateOne(
          {"filee._id": id},
          {
            $set: {'filee.$.url': linkk, 'filee.$.filenamee': orgname }
          }
        )
    console.log("save to post")
    res.json({status: "success"})

  } catch (error) {
    console.log(error)
  }
  
})

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletefile/:postId/:fileid", requireLogin, (req, res) => {
  const { postId, fileid } = req.params;
  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { filee: { _id: fileid } },
    },
    {
      new: true,
    }
  )
  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.delete("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
  const { postId, commentId } = req.params;
  const tmpId = mongoose.Types.ObjectId(commentId);
  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { comments: { _id: tmpId } },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.get("/post/:id", (req, res) => {
  Post.findOne({_id: req.params.id})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt") // - for descending order , createdAt for factor on whihc we need to sort
    .then((post) => {
      res.json({ post });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() == req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;

