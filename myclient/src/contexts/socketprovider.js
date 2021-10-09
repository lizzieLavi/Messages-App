import React, { useState,useContext,useRef,useEffect} from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() 
{
  return useContext(SocketContext)
}

export function SocketProvider({ userId, children }) 
{

  const socket = useRef()
  const [ConnectedUsers,setConnectedUsers] =useState([])

  useEffect(()=>
  {
    async function fetchData() {
       socket.current = io("wss://messagesapp1.herokuapp.com:443/");
    }

    fetchData()

  },[])

useEffect(()=>
{
  async function fetchData() 
  {
    socket.current.emit("AddUser",sessionStorage['id'])
    socket.current.on("getConnectedUsers", users =>
    {
      setConnectedUsers(users)
    })
  }

  fetchData();

},[userId])

  return (
    <SocketContext.Provider value={{socket,ConnectedUsers}}>
      {children}
    </SocketContext.Provider>
  )
}