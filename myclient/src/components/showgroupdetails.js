import React from 'react'
import '../css/sidebar.css'
import axios from 'axios';
import { useState,useEffect} from 'react'
import { useConversations } from '../contexts/conversationsprovider';
import { useUser } from '../contexts/userprovider';
import { Avatar ,IconButton,makeStyles,Modal} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import Picker from 'emoji-picker-react';
import PersonAdd from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddGroupMember from './addgroupmember';
import Dialog from '@material-ui/core/Dialog';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const useStyles = makeStyles({
    root: {
      "&:hover": {
        backgroundColor: "transparent"
  
      }}
    });
  

function ShowGroupDetails() {

    const {selectedConversation,createConversation,conversations,setSelectedConversation,UpdateConversation} = useConversations()
    const [EditGroupNameGlag,setEditGroupNameGlag]=useState(false)
    const [EditGroupDescriptionGlag,setEditGroupDescriptionGlag]=useState(false)
    const [emojiFlag,setEmojiFlag]=useState(false)
    const [Text,setText] = useState(selectedConversation.Name)
    const [Description,setDescription] = useState(selectedConversation.description)
    const {info} = useUser()
    const classes = useStyles();
    const [modalOpen, setModalOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteUserDialog,setDeleteUserDialog]= useState(false)
    const [userToDelete,setUserToDelete] = useState()
    const [previewImage,setPreviewImage]=useState(selectedConversation.ConversationImage)


       
    useEffect(()=>
    {
        setEditGroupNameGlag(false)
        setEditGroupDescriptionGlag(false)
        setEmojiFlag(false)

    },[selectedConversation])
  
  
    const onEmojiClick = (event, emojiObject) =>
    {
        setText(Text + emojiObject.emoji)
    };
  
    const onDescriptionEmojiClick = (event, emojiObject) =>
    {
        setDescription(Description + emojiObject.emoji)
    };
  
    function changeGroupName()
    {
        let message={name:"manager",message: info.name +" changed group name to " + Text,timeSent:'',containsImage:false,containsRecord:false,recordURL:null}
        let messages=selectedConversation.Messages
        messages.push(message)
        let updatedConversation={...selectedConversation,Name:Text,Messages:messages,LastMasage:message}
        UpdateConversation(updatedConversation)
        setEditGroupNameGlag(false)
    }
  
    function openConversation(participant)
    {
        let existsFlag=false

        conversations.forEach(conversation=>
        {
            if(conversation.isGroup === false && conversation.Participants[0].id === participant.id)
            {
              existsFlag=true
              setSelectedConversation(conversation)
            }
              
        })

        if(!existsFlag)
        {
            let participantId=[]
            participantId.push(participant.id)
            createConversation(participantId, participant.name, participant.imageName,false)
        }
        
    }
  
    function changeGroupDescription()
    {
         let message={name:"manager",message: info.name +" changed group Description",timeSent:'',containsImage:false,containsRecord:false,recordURL:null}
         let messages=selectedConversation.Messages
         messages.push(message)
         let updatedConversation={...selectedConversation,description:Description,Messages:messages,LastMessage:message}
         UpdateConversation(updatedConversation)
         setEditGroupDescriptionGlag(false)
    }
  
    function removeFromGroup()
    {
       let message={name:"manager",message: info.name +" left the group",timeSent:'',containsImage:false,containsRecord:false,recordURL:null}
       let messages=selectedConversation.Messages
       messages.push(message)
       let updatedConversation={...selectedConversation,Messages:messages,LastMessage:message}
       UpdateConversation(updatedConversation)
       setDialogOpen(false)
    }
  
    function beforeDeleteUser(participant)
    {
       setUserToDelete(participant)
       setDeleteUserDialog(true)
    }
  
    function removeUserFromGroup()
    {
       let messages=selectedConversation.Messages
       let message={name:"manager",message: info.name +" removed " + userToDelete.name + " from the group ",timeSent:'',containsImage:false,containsRecord:false,recordURL:null}
       messages.push(message)
       let participants= selectedConversation.Participants.filter(participant=> participant.id !== userToDelete.id)
       let updatedConversation={...selectedConversation,Participants:participants,Messages:messages,LastMessage:message}
       UpdateConversation(updatedConversation)
       setUserToDelete()
       setDeleteUserDialog(false)
    }
  
    function closeModal()
    {
       setModalOpen(false)
    }

    async function handleFileUpload(e)
    {
       setPreviewImage(window.URL.createObjectURL(e.target.files[0]))
        let picturePath=''
    
        const data = new FormData()
        data.append('file',e.target.files[0])
        data.append("upload_preset","whatsApp_clone")
        data.append("cloud_name","dsrgpqnyv")
       
        try
        {
          let response = await axios.post("https://api.cloudinary.com/v1_1/dsrgpqnyv/image/upload",data)
          picturePath =response.data.url

        }catch(err){console.log(err)}


        let messages=selectedConversation.Messages
        let message={name:"manager",message: info.name +" changed group picture",timeSent:'',containsImage:false,containsRecord:false,recordURL:null}
        messages.push(message)
        let updatedConversation={...selectedConversation,ConversationImage:picturePath,Messages:messages,LastMessage:message}    
        UpdateConversation(updatedConversation)


        
    }


    return (
        <div>
           <div className='user_info'>
              <div className='change_group_image'> 
                 <Avatar  src={previewImage} style={{height: '150px', width: '150px' ,backgroundColor:'gray' ,margin:'15px',marginTop:'30px'}}> </Avatar>
                 <div className='change_image_on_hover' style={{display:'flex',flexDirection:'column',alignItems:'center',position:'absolute',zIndex:'1',color:'white',curser:'pointer'}}>
                    <AddAPhotoIcon  style={{height: '30px', width: '30px' ,color:'white'}}/>
                    <input accept="image/*" id="file" type="file" name="file" onChange={handleFileUpload}/>
                    <span style={{fontSize:'10px'}}>Change Picture </span>
                 </div>
              </div>
              <span className='name_and_lastSeen'>
                {EditGroupNameGlag?
                   <div style={{display:'flex',flexDirection:'column'}}>
                     {emojiFlag?  <Picker onEmojiClick={(e,emojiObject)=>onEmojiClick(e,emojiObject)} pickerStyle={{ width: '100%' ,height:'200px'}}/> : ''}
                     <div className='edit_group_name'>
                        <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>changeGroupName()}>
                           <CheckIcon fontSize='large'/>
                        </IconButton>
                        <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>setEmojiFlag(!emojiFlag)}>
                            <InsertEmoticonIcon fontSize='large'/>
                        </IconButton>
                       <input className='input_text' defaultValue={Text} onChange={(e)=>setText(e.target.value)}></input>
                     </div>
                  </div>:
                  <span className='group_title'>
                     <h3>{selectedConversation.Name}</h3>
                     <IconButton onClick={()=>setEditGroupNameGlag(true)}>
                         <EditIcon style={{fontSize:'large',marginLeft:'10px'}}/>
                     </IconButton>
                  </span>}
                
                 <span className='lastSeen' style={{padding:'10px',paddingLeft:'0px'}}> created at:  {selectedConversation.createdDate} </span>
              </span>
            </div>

            <div className='group_details_container'>
               <h2 className='group_title' style={{padding:'5px'}}> Description </h2>
              {EditGroupDescriptionGlag?
                <div style={{display:'flex',flexDirection:'column'}}>
                  {emojiFlag?  <Picker onEmojiClick={(e,emojiObject)=>onDescriptionEmojiClick(e,emojiObject)} pickerStyle={{ width: '100%' ,height:'200px'}}/> : ''}
                  <div className='edit_group_name' style={{padding:'5px'}}>
                    <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>changeGroupDescription()}>
                        <CheckIcon fontSize='large'/>
                     </IconButton>
                    <IconButton className={classes.root} style={{padding:'3px'}} onClick={()=>setEmojiFlag(!emojiFlag)}><InsertEmoticonIcon fontSize='large'/></IconButton>
                    <input className='input_text' defaultValue={Description} onChange={(e)=>setDescription(e.target.value)} ></input>
                  </div>
                </div>:
                <div className='group_description_edit'>
                  <span style={{fontSize:'15px',marginRight:'5px'}}>
                      {selectedConversation.description}
                  </span>
                  <IconButton onClick={()=>setEditGroupDescriptionGlag(true)}>
                      <EditIcon style={{fontSize:'large'}}/>
                  </IconButton>
                </div>}
             
            </div>

            <div className='group_details_container'>
               <h2 className='group_title' style={{ padding:'10px' ,borderBottom:'1px solid #B0B0B0'}}>
                   {selectedConversation.Participants.length +1} participants
               </h2>
               <Modal className='Modal' open={modalOpen} onClose={closeModal} >
                  <AddGroupMember closeModal={closeModal}  /> 
               </Modal>

               {selectedConversation.creatorId===sessionStorage['id']?
                   <div className='participant' style={{cursor:'pointer',fontSize:'15px'}} onClick={()=>setModalOpen(true)} >
                      <Avatar>
                         <IconButton className={classes.root} style={{padding:'3px'}}>
                            <PersonAdd fontSize='large'/>
                         </IconButton>
                      </Avatar>
                      <h3 className='group_participant_name'>Add Member</h3>
                   </div>:''}

               {selectedConversation.Participants.map((participant,index)=>
               {
                  return(
                   <div  key={index} className='participant' >
                     <div onClick={()=>openConversation(participant)} style={{display:'flex',flexGrow:'1',flexDirection:'row',alignItems:'center',cursor:'pointer'}}>
                         <Avatar src={participant.imageName}/>
                         <div  style={{display:'flex',flexGrow:'1',flexDirection:'row',alignItems:'center'}}>
                           <h3 className='group_participant_name'>{participant.name}</h3>
                           {participant.id===selectedConversation.creatorId?
                             <div className='group_admin'>
                                <h3 style={{fontSize:'13px'}}>Group Manager</h3>
                             </div>
                           :''}
                         </div >
                     </div>
                     {sessionStorage['id'] === selectedConversation.creatorId?
                        <IconButton  onClick={()=>beforeDeleteUser(participant)} style={{padding:'3px'}}>
                          <CloseIcon fontSize='medium'/>
                        </IconButton>
                     :''}
                   </div>)
                })}

                <div  className='participant'>
                   <div style={{display:'flex',flexGrow:'1',flexDirection:'row',alignItems:'center'}}>
                     <Avatar src={info.imageName}/>
                     <div style={{display:'flex',flexGrow:'1',flexDirection:'row',alignItems:'center'}}>
                         <h3 className='group_participant_name'>{info.name}</h3>
                         {sessionStorage['id']===selectedConversation.creatorId?
                           <div className='group_admin'>
                               <h3 style={{fontSize:'13px'}}>Group Manager</h3>
                           </div>
                          :''}
                     </div >
                   </div>
                </div>
            </div>

            <div className='group_details_container leave' onClick={()=>setDialogOpen(true)} >
                <div className='leaveGroup'>
                    <IconButton className={classes.root} style={{padding:'3px'}} >
                      <ExitToAppIcon style={{color:'darkred'}}fontSize='large'/>
                    </IconButton>
                     <h3 className='group_participant_name' style={{color:'darkRed',fontSize:'17px'}}>leave Group</h3>
                </div>
            </div>

            <Dialog className='exit_group_dialog' onClose={()=> setDialogOpen(false)}  open={dialogOpen}>
               <div style={{padding:'10px'}}>
                 <h2 className='dialog_title'> are you sure you want to leave this group?</h2>
                 <div className='dialog_options_buttons'>
                   <button className='dialog_button' onClick={()=>removeFromGroup()} >yes</button>
                   <button className='dialog_button' onClick={()=>setDialogOpen(false)}>no</button>
                 </div>
                </div>
            </Dialog>


            <Dialog className='exit_group_dialog' onClose={()=> setDeleteUserDialog(false)}  open={deleteUserDialog}>
               <div style={{padding:'10px'}}>
                 <h2 className='dialog_title'> are you sure you want to delete this user?</h2>
                 <div className='dialog_options_buttons'>
                   <button className='dialog_button' onClick={()=>removeUserFromGroup()} >yes</button>
                   <button className='dialog_button' onClick={()=>setDeleteUserDialog(false)}>no</button>
                 </div>
                </div>
            </Dialog>

        </div>
    )
}

export default ShowGroupDetails
