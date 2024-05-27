const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  auctionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userLocation: {
    type: String
  },
});

module.exports = mongoose.model("Bid", bidSchema);
