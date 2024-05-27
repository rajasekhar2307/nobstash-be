const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  AuctionID: {
    type: String,
    required: true,
    unique: true
  },
  Aval: {
    type: Number,
    required: true
  },
  Title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  videoURL: {
    type: String,
    default: "https://www.youtube.com/watch?v=t_E5zjFj6Ew",
    required: true
  },
  poc_email: {
    type: String,
    required: true
  },
  poc_name: {
    type: String,
    required: true
  },
  reserved_price: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  endtime: {
    type: Date,
    default: function () {
      const oneHourLater = new Date(this.time);
      oneHourLater.setHours(oneHourLater.getHours() + 1);
      return oneHourLater;
    }
  }
});

module.exports = mongoose.model('Auction', auctionSchema);
