const LogInModel = require('../models/loginmodel');


const getAllUsersLogIn = function()
{
    return new Promise((resolve, reject) =>
        {
           LogInModel.find({}, function(err,users) 
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve(users);
                }
            })
        })
}
const Register = function(user)
{
   return new Promise((resolve, reject) =>
   {
      const u = new LogInModel({
        name: user.name,
        phone: user.phone,
        imageName: user.imageName,
        contacts: user.contacts,
        LastSeen: user.LastSeen,
        Status: user.Status,
        color: user.color,
      });

      u.save(function(err,result) 
      {
        if(err)
        {
            reject(err);
        }
        else
        {
            var res={status:'created',user:result}
            resolve(res);
        }
      })
})
}

const getUser =function(id)
{
    return new Promise((resolve, reject) =>
    {
        LogInModel.find({_id:id}, function(err,user) 
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(user[0]);
            }
        })
    })
}

const getUserByName =function(name)
{
    

    return new Promise((resolve, reject) =>
    {
        LogInModel.find({name:name}, function(err,user) 
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(user[0]);
            }
        })
    })
}

const UpdateUser = function(id,user)
{
    return new Promise((resolve, reject) =>
    {
        LogInModel.findByIdAndUpdate(id,
            {
                name:  user.name,
                phone: user.phone,
                imageName: user.imageName,
                contacts: user.contacts,
                LastSeen: user.LastSeen,
                Status: user.Status,
                color: user.color,
            }, function(err,user) 
             {       
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve({status:'Updated',user:user});
            }
        })
    })
}

module.exports = {getAllUsersLogIn,Register,getUser,getUserByName,UpdateUser}