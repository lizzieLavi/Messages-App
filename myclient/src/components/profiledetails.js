import React,{useState} from 'react'
import '../css/profiledetails.css'
import axios from 'axios';
import {useUser } from '../contexts/userprovider';
import { useConversations } from '../contexts/conversationsprovider';
import {Avatar, IconButton,makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Picker from 'emoji-picker-react';


const useStyles = makeStyles({
    root: {
      "&:hover": {
        backgroundColor: "transparent"
  
      }}
    });

function ProfileDetails({backToConversations}) 
{
  const {info,contacts,updateInformation} = useUser()
  const {updateConversationParticipant} = useConversations()
  const [previewImage,setPreviewImage]=useState(info.imageName)
  const [editNameFlag,setEditNameFlag] = useState(false)
  const [editStatusFlag,setEditStatusFlag] = useState(false)
  const [emojiFlag,setEmojiFlag]=useState(false)
  const [Text,setText] = useState(info.name)
  const [Status,setStatus] = useState(info.status)
  const [statusEmojiFlag,setStatusEmojiFlag]=useState(false)
  const classes = useStyles();


  //add emoji to name
  const onEmojiClick = (event, emojiObject) => 
  {
    setText(prevText => prevText + emojiObject.emoji)
  };


  //add emoji to status 
  const onStatusEmojiClick = (event, emojiObject) => 
  {
    setStatus(prevStatus => prevStatus + emojiObject.emoji)
  };


  //change profile picture  and update users on real time
  async function handleFileUpload(e)
  {

    let picturePath=''
    
    const data = new FormData()
    data.append('file',e.target.files[0])
    data.append("upload_preset","whatsApp_clone")
    data.append("cloud_name","dsrgpqnyv")
       
    try
    {

      let response = await axios.post("https://api.cloudinary.com/v1_1/dsrgpqnyv/image/upload",data)
      picturePath =response.data.url
      
      let user = {name:info.name,phone: info.phone,imageName:picturePath,contacts:contacts,LastSeen:info.LastSeen,Status:info.Status,color:info.color}
      let userToContacts={id:sessionStorage['id'],name:info.name,phone: info.phone,imageName:picturePath,Status:info.Status,color:info.color}
      updateConversationParticipant(userToContacts,'image',picturePath)
      updateInformation(user,userToContacts)

    }catch(err){console.log(err)}

    setPreviewImage(window.URL.createObjectURL(e.target.files[0]))

  }


   //change user nickname  and update users on real time
  async function changeProfileName()
  {
    let user = {name: Text,phone: info.phone,imageName:info.imageName,contacts:contacts,LastSeen:info.LastSeen,Status:info.Status,color:info.color}
    let userToContacts={id:sessionStorage['id'],name: Text,phone: info.phone,imageName:info.imageName,Status:info.Status}

    sessionStorage['name' ] = Text

    updateConversationParticipant(userToContacts,'name',Text)
    updateInformation(user,userToContacts)
    setEmojiFlag(false)
    setEditNameFlag(false)

  }


   //change status  and update users on real time
  async function changeProfileStatus()
  {

    let user = {name:info.name,phone: info.phone,imageName:info.imageName,contacts:contacts,LastSeen:info.LastSeen,Status:Status,color:info.color}
    let userToContacts={id:sessionStorage['id'],name:info.name,phone: info.phone,imageName:info.imageName,Status:Status}

    updateConversationParticipant(userToContacts,'status',Status)
    updateInformation(user,userToContacts)
    setStatusEmojiFlag(false)
    setEditStatusFlag(false)

  }



    return (
        <div className='show_details'>
            <header className='profile_title'>
              <div className='title_and_back_to_conversations'>
                <IconButton onClick={()=>backToConversations()}>
                   <ArrowBackIcon style={{height:'30px',width:'30px'}}  />
                </IconButton>
                <h2 className='title_h2'> Profile </h2>
              </div>

            </header>

            <div className='profile_details_body'>

              <div className='profile_pic'>
                 <Avatar  src={previewImage} style={{height: '170px', width: '170px' ,backgroundColor:'gray' ,margin:'15px',marginTop:'30px'}}> </Avatar>
                 <div className='change_image_on_hover' style={{display:'flex',flexDirection:'column',alignItems:'center',position:'absolute',zIndex:'1',color:'white',curser:'pointer'}}>
                     <AddAPhotoIcon  style={{height: '30px', width: '30px' ,color:'white'}}/>
                     <input accept="image/*" id="file" type="file" name="file" onChange={handleFileUpload}/>
                     <span style={{fontSize:'10px'}}>Change Picture </span>
                 </div>
              </div>

              <span className='profile_details'>
                <h3 className='edit_title'>your name:</h3>
                {editNameFlag?
                   <div>
                      {emojiFlag?  <Picker onEmojiClick={(e,emojiObject)=>onEmojiClick(e,emojiObject)} pickerStyle={{ width: '100%' ,height:'200px'}}/> : ''}
                      <div className='edit_group_name' style={{margin:'10px',padding:'5px'}}>
                        <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>changeProfileName()}>
                          <CheckIcon fontSize='large'/>
                        </IconButton>
                        <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>setEmojiFlag(!emojiFlag)}>
                          <InsertEmoticonIcon fontSize='large'/>
                        </IconButton>
                        <input className='input_text' defaultValue={Text} onChange={(e)=>setText(e.target.value)} ></input>
                      </div>
                    </div>
                    :
                    <div className='edit_details'>
                      <IconButton onClick={()=>setEditNameFlag(true)}>
                        <EditIcon style={{fontSize:'large'}}/>
                      </IconButton>
                      <h3>{info.name}</h3>
                    </div>}
                  </span>

              <span className='profile_details'>

              <h3 className='edit_title'>status:</h3>
              {editStatusFlag?
                <div>
                  {emojiFlag?  <Picker onEmojiClick={(e,emojiObject)=>onStatusEmojiClick(e,emojiObject)} pickerStyle={{ width: '100%' ,height:'200px'}}/> : ''}
                  <div className='edit_group_name' style={{margin:'10px',padding:'5px'}}>
                    <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>changeProfileStatus()}>
                      <CheckIcon fontSize='large'/>
                    </IconButton>
                    <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>setStatusEmojiFlag(!statusEmojiFlag)}>
                      <InsertEmoticonIcon fontSize='large'/>
                    </IconButton>
                    <input className='input_text' defaultValue={Status} onChange={(e)=>setStatus(e.target.value)} ></input>
                  </div>
                </div>:
                <div className='edit_details'>
                  <IconButton onClick={()=>setEditStatusFlag(true)}>
                    <EditIcon style={{fontSize:'large'}}/>
                  </IconButton>
                  <h3 style={{fontSize:'15px'}}>{info.Status}</h3>
                </div>}
              </span>
            </div>
        </div>
    )
}

export default ProfileDetails
