const mongoose =require('mongoose')

const RoomSchema=new mongoose.Schema({
   roomName:{
        type: String,
        required: true,
   },
   roomId:{
    type:String,
    unique: true,
   },
   users:[{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
   }]

});
module.exports=mongoose.model('Room',RoomSchema);