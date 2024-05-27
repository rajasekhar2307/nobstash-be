const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://shivatalluri725:Shiva551@cluster0.xtiys65.mongodb.net/Auctionblog";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
