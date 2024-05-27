const express = require("express");
const { createAuction, getAuctions, getAuctionById } = require("../controllers/auctionController");

const router = express.Router();

router.post("/", createAuction);
router.get("/", getAuctions);
router.get("/:id", getAuctionById);

module.exports = router;
