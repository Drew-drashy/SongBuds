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

io.on('connection',(socket)=>{
    console.log('New Client Connected');
    socket.on('disconnected',()=>{
        console.log('Client disconnected');
    });
});
const PORT=process.env.PORT||5000;
server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
