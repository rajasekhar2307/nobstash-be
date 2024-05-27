const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    min: 10000000,
    default: 9876543210,
    required: true
  },
  amount: {
    type: Number,
    default: 6000,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
