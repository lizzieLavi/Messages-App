import React,{useState} from 'react'
import '../css/login.css'
import axios from 'axios'
import {Link,useHistory} from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';




export default function LogIn(props) 
{

  const [phone,setPhone] = useState('');
  const [UserName,setUserName] = useState('');
  const [Error,setError] = useState('')
  const history=useHistory();

  //get user information and token from DB
  async function handleSubmit(e)
  {
    setError('')
    e.preventDefault()
    let obj = {name: UserName,phone: phone}
    let response = await axios.post("https://messagesapp1.herokuapp.com/api/logIn",obj)

    if(response.data !== "not found")
    {
      sessionStorage['config']= response.data.token 
      sessionStorage['id'] = response.data.User._id
      sessionStorage['name'] = response.data.User.name
      props.CanLogIn(response.data.User._id)

       history.push('/App')

    }
        
    else
      setError("One or more of your identification details is incorrect.")

  }

  return (
  
    <div class="overlay">
      <form className='login_form' onSubmit={handleSubmit}>
        <div class="con">
          <header class="head-form">
            <h2>Log In</h2>
            <p>welcome to  my whatsApp</p>
          </header>
          <div class="field-set">
            <span class="input-item">
              <i class="fa fa-user-circle"></i>
              <input class="form-input" id="txt-input" type="text" placeholder="@UserName" onChange={(e)=> setUserName(e.target.value)} required />
            </span>
            <span class="input-item">
              <i class="fa fa-key"></i>
              <input class="form-input" type="password" placeholder="Password" id="pwd"  name="password" onChange={(e)=> setPhone(e.target.value)} required/>
            </span>
            <button className="log-in" type='submit'> Log In </button>
          </div>
          <div>
            <Link  className="submits sign-up defaultLink" to={`/Register`}>     Sign Up<i style={{margin:'7px'}}class="fa fa-user-plus" aria-hidden="true"/></Link>
          </div>
          {Error}
        </div>
      </form>
    </div>    
  )
}
