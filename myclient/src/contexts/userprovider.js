
import React, { useState ,useEffect, useContext} from 'react'
import axios from 'axios'
import { useSocket } from "./socketprovider";
const UserContext = React.createContext()


export function useUser() 
{
  return useContext(UserContext)
}

export  function UserProvider({ children })
{
  const [contacts, setContacts] = useState([])
  const [info,setInfo] =useState({})
  const config= {'headers': {'x-access-token':sessionStorage['config']}}
  const {socket} = useSocket();
  const [updateFlag,setUpdateFlag]=useState(true)

  
  useEffect( () =>
  {
    async function fetchData() 
    {
      getContacts().then(res=> setContacts(res))
    }

    if(updateFlag)
    {
      fetchData();
      setUpdateFlag(false)
    }

   },[updateFlag])

   useEffect(()=>
   {
     async function fetchData() 
     {
       if(socket.current ==null ) return;

       //when other user updates contact information, update this user on changes
       socket.current.on('update-contact',async ()=>
       {
         setUpdateFlag(true)
       })
 
   }
 
   fetchData();
 
   },[])

   async function getContacts()
   {
      const response = await axios.get("https://messagesapp1.herokuapp.com/api/logIn/"+sessionStorage['id'],config);
      setInfo({id:response.data._id,name:response.data.name,phone:response.data.phone,imageName:response.data.imageName,LastSeen:response.data.LastSeen,Status:response.data.Status,color:response.data.color})
      console.log(response.data.contacts)
      return(response.data.contacts)

   }
   

  function getSearchContacts(str)
  {
    getContacts().then(res=>
    {
      let SearchResult =res.filter(contact=> contact.name.includes(str) === true)
      setContacts(SearchResult)
    })

  }


  const createContact = async(name) =>
  {
    
    if(name === info.name)
    {
      return {status:'error',message:'cant Add yourself'};
    }

    let checkIfExists = contacts.filter(contact=> contact.name === name)

    if(checkIfExists.length !== 0)
    {
      return {status:'error',message:'already exists'};
    }

    try
    { 

      const response= await axios.get("https://messagesapp1.herokuapp.com/api/logIn/getByName/" + name,config)

      if(response.data !== 'no such user')
      {
        const contact = {id:response.data._id,phone:response.data.phone,name:response.data.name,imageName:response.data.imageName,Status:response.data.Status,color:response.data.color}
        let newContacts = [...contacts,contact]
        setContacts(newContacts)
        let UpdatedUser={...info,contacts:newContacts}
        try
        {
          await axios.put("https://messagesapp1.herokuapp.com/api/logIn/" + sessionStorage['id'],UpdatedUser,{'headers': {'x-access-token':sessionStorage['config']}})
        } catch(err){console.log(err)}
      }
      else return {status:'error',message:'user doesnt exist'};
     
    }catch(err){console.log(err)}

    return {status:'ok'}

  }

  const updateInformation = async(user,userToContacts) =>
  {
    try
    {
      let response = await axios.put("https://messagesapp1.herokuapp.com/api/logIn/" + sessionStorage['id'],user,config)
      if(response.data.status==='Updated')
      {
        setInfo({...user,id:sessionStorage['id']})
        
      }
    }catch(err){console.log(err)}

     socket.current.emit('contact-changed',userToContacts)
  }



  return (
    <UserContext.Provider value={{setContacts,setInfo,info,config,contacts,createContact,getSearchContacts,updateInformation }}>
      {children}
    </UserContext.Provider>
  )
}