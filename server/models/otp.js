const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expireIn: {
    type: Number,
  },
}, {timestamps: true});

mongoose.model("Otp", otpSchema, 'otp');
