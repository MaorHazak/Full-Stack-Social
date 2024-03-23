// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   chatId: {
//     type: String,
//     required: true,
//   },
//   userInfo: {
//     type: Object,
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   // not forgeting time stap
// });

// const Message = mongoose.model("Message", messageSchema);

// module.exports = Message;


// MessageModel.js in models folder
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // Referring to the Chat model
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referring to the User model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
