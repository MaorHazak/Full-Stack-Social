const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const app = express();
const { Server } = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  // Handle socket connections here
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.ClOUD_SECRET,
});

// Configure Mongoose
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Handle image upload
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Crud API
// User API
app.use('/api/users', require('./router/userRouter'));
app.use('/api/posts', require('./router/postRouter'));
app.use('/api/comments', require('./router/commentRouter'));
// Message API
app.use('/api/messages', require('./router/messageRouter'));
// Chat API
app.use('/api/chats', require('./router/chatRouter'));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
