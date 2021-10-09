import React from 'react'
import {useState ,useCallback,useEffect,useRef} from 'react'
import {useConversations} from '../contexts/conversationsprovider';
import {useSocket} from '../contexts/socketprovider';
import {useUser} from '../contexts/userprovider';
import {IconButton,Dialog } from '@material-ui/core'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import CloseIcon from '@material-ui/icons/Close';
import ImageIcon from '@material-ui/icons/Image';
import CheckIcon from '@material-ui/icons/Check';
import Picker from 'emoji-picker-react';
import { useReactMediaRecorder } from "react-media-recorder";
import axios from 'axios'
import Message from './message';
import AudioMessage from './audiomessage';


function ChatBody(props) {

  const [Text,setText] = useState('')
  const {socket} = useSocket()
  const {info} = useUser()
  const {sendMessage,selectedConversation,removedFromGroupFlag,setRemovedFromGroupFlag,setSelectedConversation} = useConversations()
  const inputRef = useRef(null)
  const [emojiFlag,setEmojiFlag] = useState(false)
  const [recordFlag,setRecordFlag] =useState(false)
  const {startRecording,stopRecording,mediaBlobUrl,clearBlobUrl} = useReactMediaRecorder({audio: true })
  const [audioBlob,setAudioBlob] = useState(null)

  //make messages scrolling down when message sent
  const setRef = useCallback((node) => 
  {
    if(node)
      node.scrollIntoView({smooth:true})

  },[])
  
  useEffect(()=>
  {
    setEmojiFlag(false)

  },[selectedConversation])

  

  //when audio message sent, upload it to cloudinary and send it to conversation participants
  useEffect( () => 
  {

    async function fetchData() 
    {
      if(audioBlob != null)
      {
        let audio= await fetch(mediaBlobUrl).then(res=> res.blob())
        const data = new FormData();
           
        data.append('file', audio);
        data.append('resource_type', 'video');
        data.append("upload_preset","whatsApp_clone")
        data.append("cloud_name","dsrgpqnyv")


        try
        {
          let response = await axios.post("https://api.cloudinary.com/v1_1/dsrgpqnyv/video/upload",data)
          let recordURL = response.data.url
          recordURL=(recordURL.slice(0,-4))
          recordURL+= 'mp3'
          setRecordFlag(false)
          clearBlobUrl()
          sendMessage(Text,null,null,recordURL)
          setRecordFlag(false)
  
        }catch(err){console.log(err)}
      }
    }

    fetchData();
 
  },[audioBlob])


  //when typing, let conversation participants know
  function typing(e)
  {

    setText(e.target.value)
    if (socket.current == null) return;
      socket.current.emit("typing", {user:info,Conversation:selectedConversation})

  }


  //send message to conversation participants
  function handleSubmit(e)
  {
    e.preventDefault()
    sendMessage(Text,false,null,null)
    setText(' ')

  }


  //upload image to cloudinary
  async function handleImage(e)
  {

    const data = new FormData()
    data.append('file',e.target.files[0])
    data.append("upload_preset","whatsApp_clone")
    data.append("cloud_name","dsrgpqnyv")
    try
    {

      let response = await axios.post("https://api.cloudinary.com/v1_1/dsrgpqnyv/image/upload",data)
      props.imageCallback(response.data.url)
      }catch(err){console.log(err)}

    }


  //when record start
  function recordStart()
  {

    setRecordFlag(true)
    startRecording()

  }
 
  //when record sent
  async function handleRecord()
  {
    stopRecording()
    let res = await fetch(mediaBlobUrl)
    setAudioBlob(res.blob())     
  }


  //when record canceled
  function cancelRecord()
  {
    stopRecording()
    clearBlobUrl()
    setRecordFlag(false)
  }


  //when recording, show recording div
  function updateRecordingDiv()
  {
    let recordDiv = 
    <div>
      <IconButton>
        <CloseIcon fontSize='large' style={{color:'red'}} onClick={cancelRecord} />
      </IconButton>
      <IconButton>
        <CheckIcon fontSize='large'style={{color:'green'}} onClick={handleRecord} />
      </IconButton>
    </div>

    return recordDiv
  
  }

  //if removed from group when group chat is on, dont show this group chat
  function handleRemovedFromGroup()
  {

    setRemovedFromGroupFlag(false)
    setSelectedConversation()

  }
    

  //add emoji to message
  const onEmojiClick = (event, emojiObject) => 
  {
    setText(Text + emojiObject.emoji)
  };



  return(

    <div className= 'body_and_footer'>
        <div className='chat_body'>

          {selectedConversation.Messages.map((message,index)=>
          {
            const lastMessage = selectedConversation.Messages.length -1 === index
            let sender= ''
            sender= message.name==='manager'? 'manager':( message.id===sessionStorage['id']? 'message_out' : 'message_in')
            let image=message.id===sessionStorage['id']? info.imageName :selectedConversation.ConversationImage
            let choosenClass = sender==='message_in'? 'chat_message chat_sender': ' chat_message chat_reciever'

            return (
              <div key={index}>
                {sender === 'manager'?
                <div className='around_message'ref={lastMessage ? setRef : null}>
                  <div className='manager_message'>
                     <span className='message_content'>{message.message}</span>
                  </div>
                </div>
                :
                <div key={index} className={choosenClass} ref={lastMessage ? setRef : null}>
                  {message.containsRecord ? 
                  <AudioMessage message={message} sender={sender} image={image}/> : <Message  sender={sender} message={message}/>}
                </div> }
              </div>
            )}
          )}

        </div>

        <div className='chat_footer_with_stickers'>
           {emojiFlag?  <Picker onEmojiClick={(e,emojiObject)=>onEmojiClick(e,emojiObject)} pickerStyle={{ width: '100%' }}/>: ''}
            <div className='chat_footer'>
              {emojiFlag? <IconButton  onClick={()=>setEmojiFlag(false)}><CloseIcon fontSize='large'/> </IconButton>:''}
              <IconButton  onClick={()=>setEmojiFlag(true)}>
                 <InsertEmoticonIcon fontSize='large'/>
              </IconButton>
              <input accept="image/*" className='invisibleInput' id="icon-button-file" type="file"  style={{ visibility: 'hidden'}} onChange={handleImage}/>
              <label htmlFor="icon-button-file">
                <IconButton component="span">
                  <ImageIcon  fontSize='large'/>
                </IconButton>
              </label> 
              <form onSubmit={handleSubmit} className='message_section'>
                 <input className='message_input' ref={inputRef}  value={Text} onChange={typing} type='text' placeholder='type a message'/>
                 <button type='submit' > send </button>
              </form>
              {recordFlag? updateRecordingDiv() :   
              <IconButton onClick={recordStart}>
                <MicIcon fontSize='large'  />
              </IconButton>}
            </div>
        </div>
        <Dialog className='exit_group_dialog'  open={removedFromGroupFlag}>
          <div style={{padding:'10px'}}>
            <h2 className='dialog_title'> you where removed from this group</h2>
              <div className='dialog_options_buttons'>
                <button className='dialog_button' onClick={()=>handleRemovedFromGroup()} >ok</button>
              </div>
          </div>
        </Dialog> 

    </div>    
)}

export default ChatBody
