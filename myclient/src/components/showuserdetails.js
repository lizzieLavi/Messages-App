import React from 'react'
import {useState} from 'react'
import {useConversations } from '../contexts/conversationsprovider';
import {Avatar} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';

function ShowUserDetails({privateConversationHeader}) {

    const {selectedConversation} = useConversations()
    const [pictureDialogOpen,setPictureDialogOpen]=useState(false)


    return (

        <div className='user_info'>
           <div onClick={()=>setPictureDialogOpen(true)}>
               <Avatar  src={selectedConversation.Participants[0].imageName} style={{margin:'20px',height:'150px',width:'150px'}}/>
           </div>

           <Dialog className='open_picture_dialog' onClose={()=> setPictureDialogOpen(false)}  open={pictureDialogOpen}>
              <img src={selectedConversation.ConversationImage} alt=''/>
           </Dialog>

     
           <span className='name_and_lastSeen' style={{paddingBottom:'0px'}}>
              {console.log('here')}
              <span className='group_title'>
                 <h3>{selectedConversation.Name}</h3>
              </span>
     
              <span className='lastSeen' style={{padding:'10px',paddingLeft:'0px'}}>
                  {privateConversationHeader()}
              </span>
           </span>
       
      </div>

    )
}

export default ShowUserDetails
