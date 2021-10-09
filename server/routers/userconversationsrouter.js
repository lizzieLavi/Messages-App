const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
path = require('path')
const ConversationsBL=require('../bl/userconversationsbl')



const  validation =(token) =>
{
    const RSA_PRIVATE_KEY = 'somekey'

    if (!token)
        return res.status(401).send({ auth: false, message: 'No token provided.' })
        
    
    jwt.verify(token, RSA_PRIVATE_KEY, async function(err) 
    {
        if (err) 
          return false;
        else
          return true;
    })
}

router.get('/:id', async function(req, resp)
{
    let token=req.headers['x-access-token']

    if (!token)
      return resp.status(401).send({ auth: false, message: 'No token provided.' })
        
    if(validation(token)==false)
        return resp.status(500).send({ auth: false, message: 'Failed to authenticate token.' })

    else
    {
      try{
          let conversation = await ConversationsBL.getConversation(req.params.id)
          return resp.json(conversation);
         }
      catch(err){console.log(err)}
    }
});


router.get('/UserConversations/:id', async function(req, resp)
{
    let token=req.headers['x-access-token']

    if (!token)
      return resp.status(401).send({ auth: false, message: 'No token provided.' })
        
    if(validation(token)==false)
        return resp.status(500).send({ auth: false, message: 'Failed to authenticate token.' })

    else
    {
      try{
          let userConversations = await ConversationsBL.getUserConversations(req.params.id)
          return resp.json(userConversations);
         }
      catch(err){console.log(err)}
    }
});

router.post('/', async function(req, resp)
{

  let token=req.headers['x-access-token']


      
  if(validation(token)==false)
      return resp.status(500).send({ auth: false, message: 'Failed to authenticate token.' })

  else
  {
    try{
    const Conversation = {Name:req.body.Name,creatorId:req.body.creatorId,Participants:req.body.Participants,
      Messages:req.body.Messages,LastMessage:req.body.LastMessage,ConversationImage:req.body.ConversationImage,
      isGroup:req.body.isGroup,createdDate:req.body.createdDate,description:req.body.description}
    let response = await ConversationsBL.AddConversation(Conversation)
    return resp.json(response)
    }catch(err){console.log(err)}

  }

});


router.post('/AddConversationPic', async function(req, res)
{
    if (req.files === null) {
        return res.json({ msg: 'No file uploaded' });
      }
      
      const file =req.files.file
      let myPath='C:/Users/User/OneDrive/Desktop/whatsapp/myclient/public/uploads/'+file.name 
    
      file.mv(myPath, err => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
    
        res.json({msg:'file uploaded', fileName: file.name, filePath: myPath });
      });
    
});

router.put('/:id',async function(req,resp)
{
    let token=req.headers['x-access-token']
      
    if(validation(token)==false)
      return resp.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    
    else
    {
      let id = req.params.id;
      let obj = req.body;

      let conversation = await ConversationsBL.UpdateConversation(id,obj)
      return resp.json(conversation);

    }
})


  module.exports = router;