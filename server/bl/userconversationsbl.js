const ConversationsDAL = require('../dal/userconversationsdal');
const { exists } = require('../models/loginmodel');
let FromAddConversation =false;


const AddConversation = async function(Conversation)
{
    let response = null

    //if private conversation, and conversation alreadt exists, send it back to client
    if(!Conversation.isGroup)
    {
      FromAddConversation=true;
      let UserConversations = await getUserConversations(Conversation.creatorId)
      FromAddConversation=false;
      UserConversations.forEach(con =>
      {
        //compare only with private conversations
        if(!con.isGroup)
        {
          if(con.creatorId == Conversation.Participants[0].id)
            response= {status:'created',conversation:con}
        }
      })
      
    }

    if(response == null)
    { 
       response = await ConversationsDAL.AddConversation(Conversation)
       let userParticipants = response.conversation.Participants.filter(p=> p.id != Conversation.creatorId)
       response.conversation.Participants = userParticipants
    }
    return (response)
}

const getUserConversations = async function(id)
{
    let res = await ConversationsDAL.getConversations()
  
    let UserConversations = res.filter(conversation =>
    {
        let userConversationParticipants=[]
        let UserExsistsInConversation = 0;
        conversation.Participants.forEach(participant =>
        {
            if(participant.id == id)
            {
             if(conversation.Messages.length != 0 || conversation.isGroup === true || FromAddConversation == true)
          
                  UserExsistsInConversation = 1
            }
            else userConversationParticipants= [...userConversationParticipants,participant]
        })

        if(UserExsistsInConversation==1)
        {
           let currentConversation = conversation;
           currentConversation.Participants = userConversationParticipants;
    
            return currentConversation;
        } 

    })
    return UserConversations;
  
}

const getConversation = async function(id)
{
    let res = await ConversationDAL.getConversation(id)
    return res;
}

const UpdateConversation =async function(id,conversation)
{
    let res= await ConversationsDAL.UpdateConversation(id,conversation)
    return res;
}


module.exports = {getConversation,AddConversation,getUserConversations,UpdateConversation}