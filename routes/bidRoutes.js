const express = require("express");
const { getBidsByAuctionId, placeBid } = require("../controllers/bidController");

const router = express.Router();

router.get("/:id", getBidsByAuctionId);
router.post("/", placeBid);

module.exports = router;
