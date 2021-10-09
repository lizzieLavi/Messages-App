const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const LoginBL=require('../bl/loginbl')
path = require('path')



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

router.post('/', async function(req, res)
{

  const name = req.body.name;
  const phone = req.body.phone;

  let User = await LoginBL.LogIn(name,phone)

  if(User) 
  {
    const userId = User._id; 
    const RSA_PRIVATE_KEY = 'somekey';

    var userToken = jwt.sign({ id: userId },
                             RSA_PRIVATE_KEY,
                            {expiresIn: 7200} 
                            );
                          
    res.status(200).send({User, token:userToken });
  }
  else
  {
    res.send("not found"); 
  }

});


router.post('/Register', async function(req, resp)
{

    let response = await LoginBL.Register(req.body)
    if(response.status == 'created') 
    {
     const userId = response.user._id; 
     const RSA_PRIVATE_KEY = 'somekey';

     var userToken = jwt.sign({ id: userId },
                             RSA_PRIVATE_KEY,
                            {expiresIn: 7200} 
                            );
                   
    resp.status(200).send({status:'created',User:response.user, token:userToken });
  }
  else
  {
    resp.send(response); 
  }

});


router.get('/:id', async function(req, resp)
{
    let token=req.headers['x-access-token']

        
    if(validation(token)==false)
        return resp.status(500).send({ auth: false, message: 'Failed to authenticate token.' })

    else
    {
      try{
          let user = await LoginBL.getUser(req.params.id)
          return resp.json(user);
         }
      catch(err){console.log(err)}
    }
});

router.get('/getByName/:name', async function(req, resp)
{

    let token=req.headers['x-access-token']

        
    if(validation(token)==false)
        return resp.status(500).send({ auth: false, message: 'Failed to authenticate token.' })

    else
    {
      try{
          let user = await LoginBL.getUserByName(req.params.name)
          return resp.json(user);
         }
      catch(err){console.log(err)}
    }
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

      let user = await LoginBL.UpdateUser(id,obj)
      return resp.json(user);
    }
})



  module.exports = router;