const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth.js');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Real-time Communication with Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join a room to listen to music together
    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Play song for all users in the room
    socket.on('playSong', ({ roomId, songId, timestamp }) => {
        io.to(roomId).emit('playSong', { songId, timestamp });
        console.log(`Playing song ${songId} at ${timestamp} in room: ${roomId}`);
    });

    // Pause song for all users in the room
    socket.on('pauseSong', ({ roomId }) => {
        io.to(roomId).emit('pauseSong');
        console.log(`Paused song in room: ${roomId}`);
    });

    // Seek song for all users in the room
    socket.on('seekSong', ({ roomId, timestamp }) => {
        io.to(roomId).emit('seekSong', { timestamp });
        console.log(`Seek song to ${timestamp} in room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Serve the app
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
