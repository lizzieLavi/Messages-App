import React, { useState ,useEffect} from 'react'
import {useUser } from '../contexts/userprovider'
import {useConversations } from '../contexts/conversationsprovider'
import {Avatar,IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import '../css/addnew.css'

function AddGroupMember({closeModal}) 
{

    const [selectedContactsId, setSelectedContactsId] = useState([])
    const {contacts,info } = useUser()
    const {UpdateConversation,selectedConversation} = useConversations()
    const [conversationContacts,setConversationContacts]=useState([])

  
    //save ids of group participants so they wont show in add to group list
    useEffect(() =>
    { 
        let ids=[]
        selectedConversation.Participants.forEach((participant)=>
        {
           ids.push(participant.id)
        }) 
        setConversationContacts(ids)

    },[selectedConversation.Participants])

    function AddMember()
    {
        let newParticipants= []
        newParticipants=selectedConversation.Participants
        let messages=selectedConversation.Messages
        let message=''

        //add choosen contacts to group participants
        contacts.forEach(contact=>
        {
            if(selectedContactsId.includes(contact.id))
            {
                newParticipants.push(contact)
                message={name:"manager",message: info.name +" added " + contact.name + " to the group",timeSent:'',containsImage:false,containsRecord:false,recordURL:null}
                messages.push(message)
            }

        })

        let updatedConversation={...selectedConversation,Participants:newParticipants,Messages:messages,LastMessage:message}
        UpdateConversation(updatedConversation)
        closeModal()

    }

    //on checkbox Click,if exists- remove from list,if not-add to list
    function handleCheckboxChange(contactId) 
    {
       
        if(selectedContactsId.includes(contactId))
        {
            setSelectedContactsId(prevSelectedContactsId =>
            {
                return (prevSelectedContactsId.filter(id=> id!==contactId))
            } )
        }
  
        else
        {
           setSelectedContactsId(prevSelectedContactsId=>
            {
              return [...prevSelectedContactsId,contactId]
            })
        } 

    }

    return (
       <div className='add_new'>
           <div className='add_new_group_border'>
               <div className='new_conversation new_group'>
                   <div style={{flex:'1'}} className='title_and_close'>
                       <h2 className='add_contact_title' style={{marginLeft:'80px',paddingRight:'0px'}}>Select Members:</h2> 
                       <IconButton style={{marginLeft:'40px'}}className='close_add_new'  onClick={()=>closeModal()}>
                          <CloseIcon fontSize='large' /> 
                       </IconButton>
                   </div>
                   <div style={{overflowY:'overlay',height:'200px'}}>
                       {contacts.map(contact =>
                       {
                         //show only user contacts that are not in the group
                         if(!(conversationContacts.includes(contact.id)))
                         {
                           return(
                               <div className='contact_item' >
                                   <input type="checkbox" value={selectedContactsId.includes(contact.id)}
                                    id={contact.id} onChange={() => handleCheckboxChange(contact.id)}/>
                                   <label style={{display:'flex',flexDirection:'row',alignItems:'center',width:'100%'}}for={contact.id} >
                                      <Avatar  style={{margin:'5px'}} src={process.env.PUBLIC_URL + contact.imageName}   fontSize='large'/>
                                      <h3 className='enter_phone' style={{marginLeft:'10px' ,fontWeight:'400'}}>{contact.name} </h3>
                                   </label>
                               </div>
                            )}

                         else return ''
            
                        }) } 
             
                   </div>
                   <div style={{display:'flex' , justifyContent:'center'}}>
                        <button className='add_new_button'  type="submit" onClick={()=>AddMember()}>Add</button>
                   </div>

               </div>
           </div>
       </div>
    )
}

export default AddGroupMember
