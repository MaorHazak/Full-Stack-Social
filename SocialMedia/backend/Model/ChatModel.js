// const mongoose = require("mongoose");
// // const mongoose = require("./User");

// const chatSchema = new mongoose.Schema(
//   {
//     members: Array,
//   },
//   {
//     timestamps: true,
//   }
// );

// const chatModel = mongoose.model("Chat", chatSchema);

// module.exports = chatModel;


// chatModel.js in model folder
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'User', // Referring to the User model
        required: true
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
