// // const chatModel = require("../Model/chatModel");
// // const User = require("../Model/User");
// // const { validationResult } = require("express-validator");

// // // const createChat = async (req, res) => {
// // //   const { senderId, receiverId } = req.body;
// // //   try {
// // //     // check if a chat already exist
// // //     const chat = await chatModel.findOne({
// // //       members: { $all: [senderId, receiverId] },
// // //     });

// // //     if (chat) return res.status(200).json(chat);

// // //     const newChat = new chatModel({
// // //       members: [senderId, receiverId],
// // //     });

// // //     const response = await newChat.save();
// // //     res.status(200).json(response);
// // //   } catch (error) {
// // //     res.status(500).json(error);
// // //   }
// // // };

// // const createChat = async (req, res) => {
// //   // Extract user IDs from request body
// //   const { userIds } = req.body;

// //   try {
// //     // Check if a chat already exists between the two users
// //     const existingChat = await chatModel.findOne({
// //       members: { $all: userIds },
// //     });

// //     if (existingChat) {
// //       return res.status(200).json(existingChat);
// //     }

// //     // Create a new chat document
// //     const newChat = new chatModel({
// //       members: userIds,
// //     });

// //     // Save the chat to the database
// //     const savedChat = await newChat.save();

// //     // Respond with the created chat object
// //     res.status(201).json(savedChat);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };


// // const userChats = async (req, res) => {
// //   const email = req.params.email;

// //   try {
// //     // Find the user based on the email address
// //     const user = await User.findOne({ email });

// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     // Retrieve chats for the found user
// //     const chats = await chatModel.find({ members: { $in: [user._id] } });

// //     res.status(200).json(chats);
// //   } catch (error) {
// //     res.status(500).json(error);
// //   }
// // };

// // const findChat = async (req, res) => {
// //   const chatId = req.params.chatId;

// //   try {
// //       // Query the database to find the chat by its ID
// //       const chat = await chatModel.findById(chatId);

// //       // If chat is found, return it
// //       if (chat) {
// //           return res.status(200).json(chat);
// //       } else {
// //           // If chat is not found, return a 404 Not Found response
// //           return res.status(404).json({ message: 'Chat not found' });
// //       }
// //   } catch (error) {
// //       // Handle any errors that occur during the database query
// //       console.error('Error finding chat:', error);
// //       return res.status(500).json({ error: 'Internal server error' });
// //   }
// // };


// // module.exports = { createChat, userChats, findChat };



// const Chat = require('../Model/chatModel');

// // Create a new chat between two users
// exports.createChat = async (req, res) => {
//   try {
//     const { user1Id, user2Id } = req.body;

//     // Check if both user IDs are provided
//     if (!user1Id || !user2Id) {
//       return res.status(400).json({ error: 'Both user IDs are required to create a chat' });
//     }

//     // Create a new chat document
//     const chat = new Chat({ members: [user1Id, user2Id] });
//     await chat.save();

//     res.status(201).json(chat);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.findChat = async (req, res) => {
//   try {
//     const { user1Id, user2Id } = req.params;

//     // Find a chat where both users are members
//     const chat = await Chat.findOne({
//       members: { $all: [user1Id, user2Id] }
//     });

//     if (!chat) {
//       return res.status(404).json({ message: 'Chat not found' });
//     }

//     res.json(chat);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



const Chat = require('../Model/chatModel');
const User = require('../Model/User');

// Create a new chat between two users
exports.createChat = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    // Check if both user IDs are provided
    if (!user1Id || !user2Id) {
      return res.status(400).json({ error: 'Both user IDs are required to create a chat' });
    }

    // Find users by their Google IDs
    const [user1, user2] = await Promise.all([
      User.findOne({ 'info.googleId': user1Id }),
      User.findOne({ 'info.googleId': user2Id })
    ]);

    // Check if users exist
    if (!user1 || !user2) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Extract googleId from user objects
    const user1GoogleId = user1.info.googleId;
    const user2GoogleId = user2.info.googleId;

    // Create a new chat document
    const chat = new Chat({ 
      members: [user1._id, user2._id],
      user1GoogleId,
      user2GoogleId
    });

    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findChat = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    // Find users by their Google IDs
    const [user1, user2] = await Promise.all([
      User.findOne({ 'info.googleId': user1Id }),
      User.findOne({ 'info.googleId': user2Id })
    ]);

    // Check if users exist
    if (!user1 || !user2) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Find a chat where both users are members
    const chat = await Chat.findOne({
      members: { $all: [user1._id, user2._id] }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
