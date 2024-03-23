// messageRouter.js in routers folder
const express = require("express");
const router = express.Router();
const { createMessage, getMessages } = require("../Controllers/messageController");

// Route for creating a new message
router.post("/", createMessage);
// Route for getting messages by chat ID
router.get("/:chatId", getMessages);

module.exports = router;
