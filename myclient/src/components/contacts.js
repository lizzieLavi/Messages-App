import React from 'react'
import {Avatar,Button} from '@material-ui/core';
import {useUser} from '../contexts/userprovider';
import {useConversations} from '../contexts/conversationsprovider'
import '../css/conversations.css'

export default function Contacts({newConversationCallback,openModalCallback}) 
{

  const {contacts} = useUser()
  const {createConversation} = useConversations()

  function startConversation({id,name,image}) 
  {
    let ids=[id]
    createConversation(ids,name,image,false)
    newConversationCallback()
    
  }

  return (

    <div className='Chats contacts'  >
      <h4 className='new_chat_title'>Start New Chat:</h4>            
      <Button  style={{height:'30px' ,margin:'5px 0px',fontSize:'10px'}} onClick={()=>openModalCallback()}
      className='add_new_Button' > Create Group </Button>
      <div className='contacts_list'>
        {contacts.map(contact =>
        {
          return(
         
           <div className='ChatsListItem' onClick={()=>startConversation({id:contact.id,name:contact.name,image:contact.imageName})}>
             <Avatar src={contact.imageName}/>
              <div className='chatInfo'>
                <h2 className='user_name'>{contact.name} </h2>
                <span className='user_status'> {contact.Status.slice(0,25)}
                {contact.Status.length > 25? '...' :''}
                </span>

              </div>
            </div> 
          )
        })}
      </div>
    </div>
  )
  
};