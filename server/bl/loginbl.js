const LogInDAL = require('../dal/logindal');

const LogIn = async function(name,phone)
{
    let Users = await LogInDAL.getAllUsersLogIn()
    let UserLogedIn = Users.find(user => user.name == name && user.phone == phone)


    return(UserLogedIn)
}

const Register = async function(user)
{
    let users= await LogInDAL.getAllUsersLogIn()
    let checkIfExsists=users.filter(existsUser => existsUser.name.toLowerCase() === user.name.toLowerCase())
    let res=''
    if(checkIfExsists.length===0)
       res = await LogInDAL.Register(user)
    
    else res={status:'error',message:'user name already exists'} 


    return(res)
}

const getUser = async function(id)
{
    let res = await LogInDAL.getUser(id)
    return res;
}

const getUserByName = async function(name)
{
    let res = await LogInDAL.getUserByName(name)
    if(res== undefined)
      return ('no such user')
    else
      return res;
}

const UpdateUser =async function(id,user)
{
    let res= await LogInDAL.UpdateUser(id,user)
    return res;
}

const updateUsers = async function(updatedUser)
{

    let users= await LogInDAL.getAllUsersLogIn()
    
    let usersUpdatedList=await Promise.all(users.map(async(user) =>
    {
      userExistsInContacts=false
 
      let newContacts=[]
      newContacts=user.contacts.map(contact =>
      {
            if(contact.id==updatedUser.id)
            {
                userExistsInContacts=true
                return updatedUser
            }
            else
               return contact
      })


      if(userExistsInContacts)
        {
            let updateUser=user
            updateUser.contacts=newContacts
            delete updateUser._id
           let res = await UpdateUser(user._id,updateUser)

           return res.user
           
        }


    }))

    let List=usersUpdatedList.filter(user=>user!==undefined)
 
    return List

}

module.exports = {LogIn,Register,getUser,getUserByName,UpdateUser,updateUsers}