import {useState} from 'react'
import LogIn from './login'
import Dashboard from './dashboard'
import {UserProvider} from '../contexts/userprovider'
import {ConversationsProvider} from '../contexts/conversationsprovider'
import { SocketProvider } from '../contexts/socketprovider'
import {BrowserRouter as Router,Switch, Route,Redirect} from 'react-router-dom'
import Register from './register'
import '../css/app.css'


function App() 
{

  const [id,setId] =useState()

  const dashboard = (
   <SocketProvider userId={id} >
     <UserProvider id={id}>
      <ConversationsProvider >
        <Dashboard  id={id}/>
      </ConversationsProvider>
     </UserProvider>
    </SocketProvider>
  )

  return (

    <Router >
      <div className="App">
         <Switch>
           {sessionStorage['id']}
            <Route exact path='/' > <LogIn CanLogIn={setId}/></Route> 
            <Route path='/Register' > <Register CanLogIn={setId}/></Route>
            {sessionStorage['id']?  <Route exact path='/App' > {dashboard} </Route>:<Redirect to="/" />}
         </Switch>
  
      </div>

    </Router>
  );
}

export default App;
