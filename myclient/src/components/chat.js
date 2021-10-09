import '../css/chat.css'
import '../css/sidebar.css'
import React from 'react'
import ShowGroupDetails from './showgroupdetails'
import ShowUserDetails from './showuserdetails'
import { useState} from 'react'
import { useConversations } from '../contexts/conversationsprovider';
import { Avatar ,IconButton} from '@material-ui/core'
import ChatBody from './chatbody';
import SendImageBody from './sendimagebody';
import CloseIcon from '@material-ui/icons/Close';

export default function Chat() 
{

  const {selectedConversation,currentConversationIsConnected,typingFlag,setTypingFlag,showDetails,setShowDetails} = useConversations()
  const [imageFlag,setImageFlag] =useState(false)
  const [imageURL,setImageURL] =useState(false)

  //check if user is connected/disconnected/typing
  const privateConversationHeader = () =>
  {
  
    let returnValue = ''
    if(currentConversationIsConnected === '')
    {

      if(typingFlag !== '')
      {
        returnValue = <div className='lastSeen'> typing...</div>
        setTimeout(()=> setTypingFlag(''),1000)
      }
  
      else returnValue = <div className='connected'><div className='circle'></div> online </div>
              
    }
  
    else returnValue = <div className='lastSeen'>{currentConversationIsConnected}</div>
  
  
    return returnValue
  
  }

  const groupheader = () =>
  {

    let returnValue = ''
    if(typingFlag !== '')
    {
      returnValue = <div className='lastSeen'> {typingFlag} is typing...</div>
      setTimeout(()=> setTypingFlag(''),1000)
    }

    else
    {

      let UsersInGroup = ''

      selectedConversation.Participants.forEach((participant,index)=> 
      {
        if(index ===  selectedConversation.Participants.length-1 )
          UsersInGroup = UsersInGroup + participant.name
        else
          UsersInGroup= UsersInGroup + participant.name + ', '
      })
            
      returnValue=  <div className='lastSeen'>{UsersInGroup} </div>

    }

    return returnValue
  }

  function chatBodyCallback(image)
  {
    setImageURL(image)
    setImageFlag(true)
  }

  function backToChatCallback()
  {
    setImageURL(null)
    setImageFlag(false)
  }


  const chatSide=
    <div>
      <div className='chat_header' onClick={()=>setShowDetails(true)}>
        {selectedConversation.isGroup?
        <Avatar src={selectedConversation.ConversationImage}/>:<Avatar src={selectedConversation.Participants[0].imageName}/>}
        <div className='chat_header_info'>
          <h2 style={{fontSize:'20px'}}> {selectedConversation.Name} </h2> 
          {selectedConversation.isGroup?  groupheader() : privateConversationHeader()}
        </div>
      </div>
      {imageFlag? <SendImageBody imageURL={imageURL} backToChat={backToChatCallback}/>:<ChatBody imageCallback={chatBodyCallback}/>} 
    </div>


  return (
       
    showDetails?
      <div className='chat_with_details'>
        <div className='chat narrow_chat'>
          {chatSide}
        </div>

        <div className='chat_details'>
          <div className='chat_details_top '>
            <IconButton onClick={()=>setShowDetails(false)}>
              <CloseIcon fontSize='large'  />
            </IconButton>
            <h2 style={{paddingLeft:'10px',fontSize:'22px'}}>{selectedConversation.isGroup? 'Group Details:' : 'Contact Details:' }</h2>
          </div>

          <span className='chat_details_body'>
              {selectedConversation.isGroup? <ShowGroupDetails/>: <ShowUserDetails privateConversationHeader={privateConversationHeader}/>}
          </span>
        </div>
      </div>
      :
      <div className='chat'>
        {chatSide}
      </div>

          
    )
}
