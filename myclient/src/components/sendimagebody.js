import '../css/chat.css'
import '../css/sendimagebody.css'
import React, { useRef } from 'react'
import {useState} from 'react'
import {useConversations } from '../contexts/conversationsprovider';
import {useSocket} from '../contexts/socketprovider';
import {useUser} from '../contexts/userprovider';
import SendIcon from '@material-ui/icons/Send';
import {IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';


function SendImageBody(props) 
{

  const inputRef = useRef(null)
  const [Text,setText] = useState('')
  const {socket} = useSocket()
  const {info} = useUser()
  const {sendMessage,selectedConversation} = useConversations()

  function handleSubmit(imageFlag)
  {

    if(imageFlag===true)
      sendMessage(Text,true,props.imageURL)

    setText(' ')
    props.backToChat()

  }

  function typing(e)
  {

    setText(e.target.value)

    if (socket.current == null) return;
      socket.current.emit("typing", {user:info,Conversation:selectedConversation})

  }

    return (
      <div className='SendImage'>
        <div className='sendImageHeader'></div>
          <IconButton type='submit' onClick={()=>handleSubmit(false)}>
            <CloseIcon fontSize='large' /> 
          </IconButton>
          <img src= {props.imageURL} alt='' height='300px' width='300px'/>
          <div className='add_message'>
            <form onSubmit={()=>handleSubmit(true)} className='message_section'>
              <IconButton type='submit' style={{flex:'0.1'}}>
                <SendIcon fontSize='large'/>
              </IconButton>
              <input className='message_input' ref={inputRef}  value={Text} onChange={typing} type='text' placeholder='type a message'/>
            </form>
          </div>
      </div>
    )
}

export default SendImageBody
