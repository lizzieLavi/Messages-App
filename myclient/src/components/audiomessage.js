import React from 'react'
import { Avatar } from '@material-ui/core'
import '../css/audiomessage.css'

function AudioMessage({message,sender,image})
{

  const messageColor = sender.includes('chat_reciever')?  'reciever':'sender' 

  return (
    
    <div className={sender}>  
      <div className='message_with_audio'>
        <div className={messageColor}>
            {sender === "message_out"?
            <div className='audio_and_avatar'> 
                <audio   controls controlsList="nodownload" >
                  <source src={message.recordURL} type="audio/mp3"/>
                </audio>
                <Avatar src={image} style={{ height: '50px', width: '50px',margin:'5px' }}/>
            </div>
               :
            <div className='audio_and_avatar'> 
                <Avatar src={image} style={{ height: '50px', width: '50px',margin:'5px' }}/>
                <audio   controls controlsList="nodownload" >
                  <source src={message.recordURL} type="audio/mp3"/>
                </audio>
            </div>}
            <span className='message_time'>{(message.timeSent).substring(11,17)}</span> 
        </div>
      </div>
    </div>
    )
}

export default AudioMessage
