const express = require('express');
var cors = require('cors');
require('dotenv').config()
require('./configs/database');

var fileupload = require("express-fileupload");

const LogInRouter = require('./routers/logInRouter')
const logInBL = require('./bl/loginbl')
const userConversationDAL  = require('./dal/userconversationsdal')
const UserConversationsRouter = require('./routers/userconversationsrouter')
const userConversationsBL =require('./bl/userconversationsbl');
const { emit } = require('./models/loginmodel');



var app = express();
app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = process.env.PORT || 5000;

const server = app.listen(port);


app.use('/api/logIn', LogInRouter);
app.use('/api/conversations', UserConversationsRouter);

const io = require( "socket.io" )( server,{cors: {
  origin: '*',}
});

let users = [];

const addUser= (userId, socketId)=>
{
  if(!users.some((user)=> user.userId === userId) )
    users.push({userId,socketId})
}

const getUser = (userId) =>
{
  return users.find(user => user.userId == userId)
}

const getUserTry = (userId) =>
{
  let result= users.find(user => user.userId == userId)
  return result
}

const removeUser = (socketId) =>
{
  users= users.filter((user) => user.socketId != socketId)
}



//user connected
io.on('connection', socket => {

  console.log('user connected')    

  //take userID and socketID from user
   socket.on("AddUser", userId =>
   {

      addUser(userId,socket.id)
      io.emit("getConnectedUsers",users)
   })

     //user Disconnect
   socket.on("disconnect", async() =>
   {
     console.log("a user disconnected")
     let discconectedUser= users.find(user => user.socketId == socket.id)
     
     let response = await logInBL.getUser(discconectedUser.userId)
     let user= response
     let parts = new Intl.DateTimeFormat('en', {
      hc: 'h12',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      timeZone:'Asia/Jerusalem'})
    .formatToParts(new Date())
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, Object.create(null));

    user.LastSeen= `last seen at: ${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
    
     delete user._id
     await logInBL.UpdateUser(discconectedUser.userId,user)
     removeUser(socket.id)
     io.emit("getConnectedUsers",users)
   })

  //user sent message
   socket.on('send-message', async ({sender,UpdatedConversation,conversationId}) =>
   {
    UpdatedConversation.Participants=[...UpdatedConversation.Participants,sender]
    UpdatedConversation.Participants.forEach(participant=>
      {
        newParticipants = UpdatedConversation.Participants.filter(p=> p.id!= participant.id)
        let sendToClient ={...UpdatedConversation,Participants:newParticipants}
        if(sender.id !== participant.id )
        {
          let user =getUser(participant.id)
          if(user)
            io.to(user.socketId).emit('receive-message',{UpdatedConv:sendToClient})
        }
      })
    
    delete (UpdatedConversation._id)
    try{
     let response = await userConversationDAL.UpdateConversation(conversationId,UpdatedConversation)
    } catch(err){console.log(err)}


   })

   socket.on('typing', ({user,Conversation}) =>
   {
     Conversation.Participants.forEach(participant =>
      {
          let userIds = getUser(participant.id)
          if(userIds)
          io.to(userIds.socketId).emit('user-typing',{user:user,conversationId:Conversation._id})
      })
   })

   socket.on('conversation-changed',(Conversation)=>
   {
    Conversation.Participants.forEach(participant =>
      {
        let userIds = getUser(participant.id)
        if(userIds)
        io.to(userIds.socketId).emit('update-conversation')
    })

   })

   socket.on('user-deleted',(Conversation)=>
   {
    Conversation.Participants.forEach(participant =>
      {
        let userIds = getUser(participant.id)
        if(userIds)
        io.to(userIds.socketId).emit('removed-user')
    })

   })

   socket.on('contact-changed',async(updatedUser)=>
   {
  
     logInBL.updateUsers(updatedUser).then(usersUpdatedList=>
      {
        usersUpdatedList.forEach(user=>
          {
            let userIds = getUserTry(user._id)
            console.log(userIds)
            if(userIds)
            {
              io.to(userIds.socketId).emit('update-contact')
            }
            })
      })
 
    

      

   })


})
