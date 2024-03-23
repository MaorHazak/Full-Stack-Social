import React, { useEffect, useState } from "react";
import axios from "axios";
import { postRequest } from "../utils/postRequest";
import { NavLink } from "react-router-dom";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chat, setChat] = useState(null);

  const getUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users/");
    if (res.data) {
      setUsers(res.data);
    }
  };

  useEffect(() => {
    getUsers();
    // console.log("Current chat:", chat);
    // console.log("message:", chatMessages);
  }, []);

  // const handleUserClick = async (receiverId) => {
  //   try {
  //     // Check if a chat room exists between the current user and the clicked user
  //     const response = await axios.get(`http://localhost:5000/api/chats/${receiverId}`);

  //     if (response.data) {
  //       // Chat room exists, retrieve all messages
  //       const chatId = response.data._id;
  //       const messagesResponse = await axios.get(`http://localhost:5000/api/messages/${chatId}`);
  //       setChatMessages(messagesResponse.data);
  //     } else {
  //       // Chat room doesn't exist, create a new one
  //       const newChatResponse = await postRequest('/api/chats', { receiverId });
  //       const newChatId = newChatResponse.data._id;
  //       setChatMessages([]);
  //     }
  //   } catch (error) {
  //     console.error('Error handling user click:', error);
  //   }
  // };
  const user_data =
    localStorage.getItem("user_data") !== "undefined"
      ? JSON.parse(localStorage.getItem("user_data"))
      : null;

  // console.log(user_data)
  // console.log(users)

  const handleUserClick = async (clickedUserGoogleId) => {
    const loggedInUserGoogleId = user_data?.googleId; // Get the GoogleId of the logged-in user

    try {
      // Check if there is a chat between the logged-in user and the clicked user
      const res = await axios.get(
        `http://localhost:5000/api/chats/${loggedInUserGoogleId}/${clickedUserGoogleId}`
      );

      // If a chat exists, navigate to the chat room or display a message
      console.log("Chat already exists:", res.data);
      // Redirect the user to the chat room or show a message

      // Fetch messages for the existing chat
      const chatId = res.data._id;
      const messagesRes = await axios.get(
        `http://localhost:5000/api/messages/${chatId}`
      );

      const messagesData = messagesRes.data;

      // Handle the fetched messages, for example:
      // console.log("Messages:", messagesRes.data);
      setChatMessages(messagesData);
      setChat(res.data); // Set the chat state to the retrieved chat data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If no chat exists, create a new chat between the two users
        const chatCreationRes = await axios.post(
          "http://localhost:5000/api/chats/new",
          {
            user1Id: loggedInUserGoogleId,
            user2Id: clickedUserGoogleId,
          }
        );
        if (chatCreationRes.data && chatCreationRes.data._id) {
          // Chat created successfully
          console.log("New chat created:", chatCreationRes.data);

          // Redirect the user to the chat room or show a message
          setChat(chatCreationRes.data); // Set the chat state to the newly created chat data
        } else {
          // Handle error if chat creation fails
          console.error("Failed to create chat:", chatCreationRes.data);
          // Display an error message to the user
        }
      } else {
        // Handle other errors gracefully
        console.error("An error occurred:", error.message);
        // Display a generic error message to the user
      }
    }
  };

  const sendMessage = async () => {
    try {
      if (!chat) {
        console.error(
          "No chat selected. Please select a chat to send a message."
        );
        return;
      }

      const messageData = {
        chatId: chat._id,
        senderId: user_data?.googleId,
        text: message,
      };

      // Send the message data to the backend
      const response = await axios.post(
        "http://localhost:5000/api/messages",
        messageData
      );
      console.log("Message sent:", response.data);

      // Update the chatMessages state with the new message
      setChatMessages((prevMessages) => [...prevMessages, response.data]);

      // Clear the message input field after sending the message
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-row justify-between h-800">
      <button className="flex flex-col gap-5 bg-gray-100">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex flex-row gap-5 bg-gray-200"
            onClick={() => handleUserClick(user.info.googleId)}
          >
            <img
              src={user?.info?.imageUrl}
              className="w-8 h-8 rounded-full shadow:sm"
              alt="user"
            />
            {user?.info?.name}
          </div>
        ))}
      </button>
      <div className="flex flex-col justify-between w-full bg-gray-100 p-4">
        <div>
          <h2>Chat</h2>
          <div className="flex flex-col gap-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className="flex flex-row">
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            className="p-2 border rounded w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
