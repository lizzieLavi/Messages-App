import React, {useState } from 'react'
import {useUser } from '../contexts/userprovider'
import {useConversations } from '../contexts/conversationsprovider'
import {Avatar,IconButton} from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';

function CreateNewGroup( { closeModal }) {

    const [selectedContactsId, setSelectedContactsId] = useState([])
    const {contacts} = useUser()
    const {createConversation} = useConversations()
    const [groupName,setGroupName] =useState('')
    const [groupImage,setGroupImage] =useState()
    const [previewImage,setPreviewImage]=useState()
    const [goToParticipants,setGoToParticipants] = useState(false)


    function createGroup()
    {
        createConversation(selectedContactsId,groupName,groupImage,true)
        closeModal()
    }

    
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

    function handleFileUpload(e)
    {
        setGroupImage(e.target.files[0])
        setPreviewImage(window.URL.createObjectURL(e.target.files[0]))
    }


    return (
      <div className='add_new'>
        <div className='add_new_group_border'>
          <div className='new_conversation new_group'>
            {goToParticipants !==true ?
            <div className='top_new_group'>
              <div style={{flex:'1'}}className='title_and_close'>
                <h2 className='add_contact_title' style={{marginLeft:'85px',paddingRight:'0px'}}>Create New Group:</h2> 
                <IconButton style={{marginLeft:'45px'}}className='close_add_new'  onClick={()=>closeModal()}>
                  <CloseIcon fontSize='large' /> 
                </IconButton>
              </div>

              {previewImage? 
              <div className='change_group_image'> 
                <Avatar  src={previewImage} style={{height: '110px', width: '110px' ,backgroundColor:'gray' ,margin:'15px',marginTop:'30px'}}>  </Avatar>
                <div className='change_image_on_hover' style={{display:'flex',flexDirection:'column',alignItems:'center',position:'absolute',zIndex:'1',color:'white'}}>
                  <AddAPhotoIcon  style={{height: '30px', width: '30px' ,color:'white'}}/>
                  <input accept="image/*" id="file" type="file" name="file" onChange={handleFileUpload}/>
                  <span style={{fontSize:'10px'}}>Change Image </span>
                </div>
              </div>
              :
              <div className='add_group_image'>
                <Avatar   style={{height: '110px', width: '110px' ,backgroundColor:'gray' ,margin:'15px',marginTop:'30px'}}>
                  <PeopleAltIcon style={{position:'absolute',zIndex:'0', opacity:'0.1',height: '80px', width: '80px' }}/>
                  <div  style={{display:'flex',flexDirection:'column',alignItems:'center',position:'absolute',zIndex:'1',color:'white'}}>
                    <AddAPhotoIcon  style={{height: '30px', width: '30px' ,color:'white'}}/>
                    <input accept="image/*" id="file" type="file" name="file" onChange={handleFileUpload}/>
                    <span style={{fontSize:'10px'}}>add group image</span>
                  </div>
                </Avatar>
              </div> }
              <div className='group_name'>
                <span style={{padding:'5px', margin:'5px' , fontSize:'13px', color:'#fcfcfc'}}> Group Name:</span>
                <input style={{borderRadius:'10px', border:'none',outline:'none'}} onChange={(e)=>setGroupName(e.target.value)}/>
              </div>
              <button style={{display:'flex',alignItems:'center',width:'180px',justifyContent:'center'}} className='add_new_button'  onClick={()=>setGoToParticipants(true)}><ArrowBackIcon style={{margin:'5px'}} /> Add Members</button>
            </div>
            :
            <div>
              <div style={{flex:'1'}}className='title_and_close'>
                <h2 className='add_contact_title' style={{marginLeft:'80px',paddingRight:'0px'}}>Select Members:</h2> 
                <IconButton style={{marginLeft:'40px'}}className='close_add_new'  onClick={()=>closeModal()}>
                  <CloseIcon fontSize='large' /> 
                </IconButton>
              </div>
              <div style={{overflowY:'overlay',height:'200px'}}>
              {contacts.map(contact =>
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
                )}) 
                }  
              </div>
              <div style={{display:'flex' , justifyContent:'center'}}>
                <button className='add_new_button'  type="submit" onClick={()=>createGroup()}>Create</button>
              </div>

            </div>}  
          </div>
        </div>
      </div>
    )
}

export default CreateNewGroup
