const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  members: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  member1: {
    type: String,
    required: true,
  },
  sec1: {
    type: String,
    required: true,
  },
  mobile1: {
    type: String,
    required: true,
  },
  member2: {
    type: String,
    required: false,
  },
  sec2: {
    type: String,
    required: false,
  },
  mobile2: {
    type: String,
    required: false,
  },
  member3: {
    type: String,
    required: false,
  },
  sec3: {
    type: String,
    required: false,
  },
  mobile3: {
    type: String,
    required: false,
  },
  member4: {
    type: String,
    required: false,
  },
  sec4: {
    type: String,
    required: false,
  },
  mobile4: {
    type: String,
    required: false,
  },
  member5: {
    type: String,
    required: false,
  },
  sec5: {
    type: String,
    required: false,
  },
  mobile5: {
    type: String,
    required: false,
  },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      text: String, //text: String is shorthand for text: {type: String}
      postedBy: { type: ObjectId, ref: "User" },
    },
  ],
  filee: [
    {
    url: String,
    filenamee: String,
    term: String,
  }
],
  file_path: {
    type: String,
    required: false
},
  file_mimetype: {
    type: String,
    required: false
  },
  postedBy: {
    type: ObjectId,
    ref: "User", // relation building in mongodb
  },
},{timestamps:true});

mongoose.model("Post", postSchema);
