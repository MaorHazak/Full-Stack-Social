// messageController.js in controllers folder
const Message = require("../Model/MessageModel");
const User = require('../Model/User');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;

    // Check if the required fields are provided
    if (!chatId || !senderId || !text) {
      return res.status(400).json({ error: 'chatId, senderId, and text are required' });
    }

    // Find the sender user by their Google ID
    const senderUser = await User.findOne({ 'info.googleId': senderId });

    // Check if sender user exists
    if (!senderUser) {
      return res.status(404).json({ error: 'Sender user not found' });
    }

    // Create a new message document
    const message = new Message({
      chatId,
      senderId: senderUser._id, // Use the user's MongoDB _id as the senderId
      text,
    });

    // Save the message to the database
    const savedMessage = await message.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};




