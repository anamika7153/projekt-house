const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const fileSchema = new mongoose.Schema(
  // const fileSchema =  mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
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
    member2: {
      type: String,
      required: false,
    },
    sec2: {
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
    member4: {
      type: String,
      required: false,
    },
    sec4: {
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
  // likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      text: String, //text: String is shorthand for text: {type: String}
      postedBy: { type: ObjectId, ref: "User" },
    },
  ],
  
  file_path: {
      type: String,
      required: true
  },
    file_mimetype: {
      type: String,
      required: true
    },
    postedBy: {
      type: ObjectId,
      ref: "User", // relation building in mongodb
    },
  },
  {timestamps: true}
);

mongoose.model('File', fileSchema);

// const File = mongoose.model('File', fileSchema);

// module.exports = File;
