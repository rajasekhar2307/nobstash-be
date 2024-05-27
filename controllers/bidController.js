const Bid = require("../models/Bid");
const { getIO } = require("../utils/socket");

exports.getBidsByAuctionId = async (req, res) => {

  try {
    const bids = await Bid.find({ auctionID: req.params.id }).sort({ time: 1 });
    res.status(200).send(bids);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.placeBid = async (req, res) => {
  try {
    const newBid = {
      userID: req.body.uid,
      bidAmount: req.body.bidamount,
      auctionID: req.body.id,
      userName: req.body.userName
    };
    await Bid.insertMany([newBid]);
    const io = getIO();
    io.to(req.body.id).emit('chat message', newBid);
    res.status(200).send("Bid successfully placed");
  } catch (err) {
    res.status(500).send(err);
  }
};
