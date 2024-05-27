const http = require("http");
const app = require("./app");
const { initSocket } = require("./utils/socket");

const server = http.createServer(app);
const io = initSocket(server);

// Ensure controllers are imported after initializing socket
require("./controllers/bidController");

server.listen(8000, () => {
  console.log("Server started on port 8000");
});
