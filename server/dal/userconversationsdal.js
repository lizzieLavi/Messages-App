const ConversationsModel = require('../models/userconversationsmodel');


const AddConversation = function(conversation)
{
    return new Promise((resolve, reject) =>
    {
        const c = new ConversationsModel({
            Name: conversation.Name,  
            creatorId: conversation.creatorId,
            Participants:conversation.Participants,
            Messages:conversation.Messages,
            LastMessage:conversation.LastMessage,
            ConversationImage:conversation.ConversationImage,
            isGroup:conversation.isGroup,
            createdDate:conversation.createdDate,
            description:conversation.description,
            
        });

        c.save(function(err,result) 
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                var res={status:'created',conversation:result}
                resolve(res);
            }
        })
    })
}
const getConversations =function()
{
    
    return new Promise((resolve, reject) =>
    {
        ConversationsModel.find({}, function(err,conversations) 
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(conversations);
            }
        })
    })
}
const getConversation =function(id)
{
    
    return new Promise((resolve, reject) =>
    {
        ConversationModel.find({_id:id}, function(err,conversation) 
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(conversation[0]);
            }
        })
    })
}

const UpdateConversation = function(id,conversation)
{
    return new Promise((resolve, reject) =>
    {
        ConversationsModel.findByIdAndUpdate(id,
            {
                Name: conversation.Name, 
                creatorId: conversation.creatorId,
                Participants:conversation.Participants,
                Messages:conversation.Messages,
                LastMessage:conversation.LastMessage,
                ConversationImage:conversation.ConversationImage,
                isGroup: conversation.isGroup,
                createdDate:conversation.createdDate,
                description:conversation.description

            }, {new:true},function(err,ConversationUpdated) 
             {       
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve({status:'Updated',Conversation: ConversationUpdated});
            }
        })
    })
}

module.exports = {getConversation,AddConversation,getConversations,UpdateConversation}