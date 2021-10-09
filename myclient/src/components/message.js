import {useState} from 'react'
import Dialog from '@material-ui/core/Dialog';
import {useConversations} from '../contexts/conversationsprovider'

function Message({sender,message}) 
{
  const [modalOpen,setModalOpen] = useState(false)
  const [SelectedImageURL,setSelectedImageURL] =useState(null)
  const {selectedConversation} = useConversations()

  function openImage(URL)
  {
    setModalOpen(true)
    setSelectedImageURL(URL)  
  }


  return (

    <div className={sender}>  
      <div className='message' >
        <div className='image_and_sender'>

          {selectedConversation.isGroup?
          <div className='sender' style={{color:message.color}} >
             {message.name} 
          </div>
          :
          <div className='sender' >
          {message.name} 
          </div>}

          {message.containsImage? 
          <img className='image_in_message' src={message.imageURL} alt='' onClick={()=>openImage(message.imageURL)} width='200px' height='200px' /> 
           : ''}
        </div>
        <div>
          <div className='message_and_time'>
            <div className='message_content'  >{message.message}</div> 
            <div className='message_time_border'>
              <div className='message_time'>
                {(message.timeSent).substring(11,17)}
              </div>
            </div>
          </div> 
        </div>

        <Dialog onClose={()=> setModalOpen(false)}  open={modalOpen}>
          <img src={SelectedImageURL} alt=''/>
        </Dialog>
      </div>
    </div> 
  )}

export default Message

