import {useState} from 'react'
import '../css/login.css'
import axios from 'axios'
import {Link,useHistory} from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';
import {Avatar} from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

 

function Register(props)
{

  const[phone,setPhone] =useState('')
  const[name,setName] =useState('')
  const [Picture,setPicture] =useState(null)
  const history=useHistory();
  const [error,setError] =useState('')
  const [previewImage,setPreviewImage]=useState()

  
  function getColor()
  {
    return ('#'+(Math.random()*0xFFFFFF<<0).toString(16))
  }

  //get user information and token from DB
  async function handleSubmit(e)
  {
    e.preventDefault();
        
    let picturePath=''

    if(Picture)
    {
      const data = new FormData()
      data.append('file',Picture)
      data.append("upload_preset","whatsApp_clone")
      data.append("cloud_name","dsrgpqnyv")
       
      try
      {
        let response = await axios.post("https://api.cloudinary.com/v1_1/dsrgpqnyv/image/upload",data)
        picturePath =response.data.url

      }catch(err){console.log(err)}

    }

  
    let randomColor=getColor()  
    let obj = {name:name,phone:phone,imageName:picturePath,contacts:[],LastSeen:'last seen at...',Status:"hello,i'm using Message-App!",color:randomColor}


    try{
         const response = await axios.post("https://messagesapp1.herokuapp.com/api/logIn/Register",obj)
         if(response.data.status === 'error')
         {
            setError(response.data.message)
         }

         else
          {
            sessionStorage['config']= response.data.token 
            sessionStorage['id'] = response.data.User._id
            sessionStorage['name'] = response.data.User.name
            props.CanLogIn(response.data.User._id)

            history.push('/App')
          }
        }catch(err){console.log(err)}     
  }
        

  function handleFileUpload(e) 
  {

    setPicture(e.target.files[0])
    setPreviewImage(window.URL.createObjectURL(e.target.files[0]))

  }

  return (

    <div className="overlay">
      <form className='login_form' onSubmit={handleSubmit}>
         <div className="con">
            <header className="head-form"  style={{marginBottom:'0px', paddingBottom:'0px'}}>
              <h2>Register</h2>
              <p>welcome to  my whatsApp</p>
            </header>
            <div className="field-set">
             {previewImage?
               <div className='change_group_image'> 
                    <Avatar  src={previewImage} style={{height: '140px', width: '140px' ,backgroundColor:'gray' ,margin:'15px',marginTop:'30px'}}> </Avatar>
                    <div className='change_image_on_hover' style={{display:'flex',flexDirection:'column',alignItems:'center',position:'absolute',zIndex:'1',color:'white',curser:'pointer'}}>
                      <AddAPhotoIcon  style={{height: '30px', width: '30px' ,color:'white'}}/>
                      <input accept="image/*" id="file" type="file" name="file" onChange={handleFileUpload}/>
                      <span style={{fontSize:'10px'}}>Change Picture </span>
                    </div>
                </div>
           
              :
              <div className='add_Profile_Picture'>
                <Avatar   style={{height: '140px', width: '140px' ,backgroundColor:'gray' ,margin:'15px',marginTop:'30px'}}>
                  <PeopleAltIcon style={{position:'absolute',zIndex:'0', opacity:'0.1',height: '80px', width: '80px' }}/>
                  <div  style={{display:'flex',flexDirection:'column',alignItems:'center',position:'absolute',zIndex:'1',color:'white',curser:'pointer'}}>
                    <AddAPhotoIcon  style={{height: '30px', width: '30px' ,color:'white'}}/>
                    <input accept="image/*" id="file" type="file" name="file" onChange={handleFileUpload}/>
                    <span style={{fontSize:'10px'}}>Add Profile Picture</span>
                  </div>
                </Avatar>
              </div> }
              <span className="input-item">
                <i class="fa fa-user-circle"></i>
                <input className="form-input" id="txt-input" type="text" placeholder="@UserName" onChange={(e)=> setName(e.target.value)} required />
              </span>
              <span className="input-item">
                <i class="fa fa-key"></i>
                <input className="form-input" type="password" placeholder="Password" id="pwd"  name="password" onChange={(e)=> setPhone(e.target.value)} required/>
              </span>
              <button className="log-in" type='submit'> Register </button>
            </div>
            <div>
              <Link  className="submits sign-up defaultLink" to={`/`}>    <i style={{margin:'7px'}}class="fa fa-user-plus" aria-hidden="true"/>back to Log In</Link>
            </div>
            <span style={{fontSize:'15px'}}>{error}</span>
          </div>
      </form>
    </div>
  )
}


export default Register
