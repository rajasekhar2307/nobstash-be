const Auction = require("../models/Auction");

exports.createAuction = async (req, res) => {
  try {
    const date = new Date(req.body.selectedDate);
    const [hours, minutes] = req.body.selectedTime.split(":").map(part => parseInt(part, 10));
    date.setHours(hours - 5);
    date.setMinutes(minutes - 30);
    date.setSeconds(0);
    if (date.getMinutes() < 0) {
       date.setHours(date.getHours() - 1);
       date.setMinutes(60 + date.getMinutes());
    }

    if (date.getHours() < 0) {
       date.setDate(date.getDate() - 1);
       date.setHours(24 + date.getHours());
    }

    date.setUTCHours(date.getHours());
    date.setUTCMinutes(date.getMinutes());
    date.setUTCSeconds(date.getSeconds());
    const newAuction = {
      AuctionID: req.body.auctionID,
      Aval: req.body.Quantity,
      Title: req.body.title,
      description: req.body.Description,
      imageURL: req.body.imgUrl,
      videoURL: req.body.videoUrl,
      poc_email: req.body.pocemail,
      poc_name: req.body.pocname,
      reserved_price: req.body.reserve,
      time: date,
    };
    await Auction.insertMany([newAuction]);
    res.status(200).send("Auction successfully created");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAuctions = async (req, res) => {
  try {
    const currentDateTime = new Date();
    const auctions = await Auction.find({ endtime: { $gte: currentDateTime } });
    res.status(200).send(auctions);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    res.status(200).send(auction);
  } catch (err) {
    res.status(500).send(err);
  }
};
