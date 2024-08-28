const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const http=require('http');
const socketIo=require('socket.io');

dotenv.config();
const app=express();
const server=http.createServer(app);
const io=socketIo(server,{
    cors:{
        origin: '*',
    }
});
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Music Chatt App backend');
});

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('Mongo DB connected'))
.catch((err)=>console.log(err));

io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle joining a room for listening together
    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Handle play song
    socket.on('playSong', ({ roomId, songId, timestamp }) => {
        io.to(roomId).emit('playSong', { songId, timestamp });
    });

    // Handle pause song
    socket.on('pauseSong', ({ roomId }) => {
        io.to(roomId).emit('pauseSong');
    });

    // Handle seek song
    socket.on('seekSong', ({ roomId, timestamp }) => {
        io.to(roomId).emit('seekSong', { timestamp });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT=process.env.PORT||5000;
server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
