const socketIO = require("socket.io");
let io;

const initSocket = (server) => {
  io = socketIO(server, {
    transports: ["polling", "websockets"],
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user is connected");

    socket.on("join auction", (auctionID) => {
      socket.join(auctionID);
      console.log(`User joined auction room: ${auctionID}`);
      const Bid = require("../models/Bid"); // Import model here to avoid circular dependency
      Bid.find({ auctionID }).sort({ timestamp: -1 })
        .then((latestBid) => {
          if (latestBid.length > 0) {
            socket.emit('chat message', latestBid);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("disconnect", () => {
      console.log(`socket ${socket.id} disconnected`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
