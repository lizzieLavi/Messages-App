import '../css/dashboard.css'
import React from 'react'
import SideBar from './sidebar'
import Chat from './chat'
import { useConversations } from '../contexts/conversationsprovider'
import { withRouter } from 'react-router-dom'

export default withRouter(function Dashboard({id}) {
    const {selectedConversation} =useConversations()

    return (
        <div className='dashboard'>
            <div className='dashboard_body'>
              <SideBar/>
              {selectedConversation!==undefined?  <Chat id={id}  />: ''}
            </div>
        </div>
    )
})
