import '../css/sidebar.css'
import React from 'react'
import { useState} from 'react';
import ChatIcon from '@material-ui/icons/Chat';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { Avatar, IconButton,Button, Modal } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Conversations from './conversations';
import Contacts from './contacts';
import AddNewContact from './addnewcontact'
import { useUser } from '../contexts/userprovider';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useConversations } from '../contexts/conversationsprovider';
import CreateNewGroup from './createnewgroup';
import ProfileDetails from './profiledetails';




export default function SideBar() 
{
  const [choosenAct,setChoosenAct]=useState('conversations')
  const [modalOpen, setModalOpen] = useState(false)
  const {info,getSearchContacts} =useUser()
  const [searchFlag,setSearchFlag] =useState(false)
  const {getSearchConverastions} = useConversations()
  const [choosenModal,setChoosenModal] =useState('')
  const [openProfileDetailsFlag,setOpenProfileDetailsFlag]=useState(false)
    
    
  function handleChange(e)
  {
    if(choosenAct === 'conversations')
      getSearchConverastions(e.target.value)

    else getSearchContacts(e.target.value)

  }

  function closeModal() 
  {
    setModalOpen(false)
  }

  function openChoosenModal(modalType)
  {
    setModalOpen(true)
    setChoosenModal(modalType)
  }

  function backToConversationsCallback()
  {
    setOpenProfileDetailsFlag(false)
  }

  return (
    
    <div className='sideBar'>

      {openProfileDetailsFlag? <ProfileDetails backToConversations={backToConversationsCallback}/>:
        <div>
          <div className='sidebar_top'>
            <div className='user_profile_pic' onClick={()=> setOpenProfileDetailsFlag(true)}>
              <Avatar src={info.imageName} fontSize='large' />
            </div>
            <div className='sidebar_top_right'>
              <IconButton onClick={()=>setChoosenAct('conversations')}>
                <ChatIcon fontSize='large' />
              </IconButton>
              <IconButton fontSize='large' onClick={()=>setChoosenAct('contacts')}>
                <PeopleIcon  fontSize='large'  />
              </IconButton>
              <IconButton >
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
         
          {searchFlag?  
          <div className='activeSearch' >
            <div className='arrowButton'>
              <IconButton onClick={()=>setSearchFlag(false)} >
                <ArrowBackIcon fontSize='large' />
              </IconButton>
            </div>
            <input className='searchBlock' type='text' onChange={handleChange}/> 
          </div>
          :
          <div className='searchBar'>
            <div className='searchContainer' >
              <SearchOutlined/>
              <input placeholder='search' type='text' onClick={()=>setSearchFlag(true)}/>
            </div>
          </div>}
           
          {choosenAct==='contacts'?
            <div>
              <div className='sidebar_middle'>
                <Button style={{fontSize:'10px'}} onClick={()=>openChoosenModal('NEW_CONTACT')}className='add_new_Button' >
                  Add New Contact
                </Button>
              </div>
              <div className='sidebar_bottom'>
                <Contacts newConversationCallback={()=> setChoosenAct('conversations')}  openModalCallback={()=>openChoosenModal('NEW_GROUP')}/>
              </div>
            </div>
            :   
            <div className='sidebar_bottom'><Conversations/></div>}
           
            <Modal  className='Modal' open={modalOpen} onClose={closeModal} >
              <div>
                {choosenModal === 'NEW_GROUP' ? 
                <CreateNewGroup closeModal={closeModal}  /> :
                <AddNewContact closeModal={closeModal} /> } 
              </div>
            </Modal>
        </div>}

      </div>
    )
}
