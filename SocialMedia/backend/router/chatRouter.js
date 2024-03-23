// const express = require("express");
// const { createChat, userChats, findChat } = require("../Controllers/chatController"); // Import chat controller
// const User = require("../Model/User"); // Import User model

// const router = express.Router();

// // Create a new chat
// router.post("/", createChat);

// // Get user object
// router.get("/:email", userChats);

// // Find an existing chat
// router.get("/find/:chatId", findChat);


// // Get all chats
// router.get("/", async (req, res) => {
//   try {
//     const loggedInUserId = req.query.userId;
//     // Fetch all users except the logged-in user
//     const users = await User.find({ _id: { $ne: loggedInUserId } });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

// chatRouter.js in routers folder
const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');

// Route for creating a new chat
router.post('/new', chatController.createChat);
// Route for finding a chat between two users
router.get('/:user1Id/:user2Id', chatController.findChat);

module.exports = router;
