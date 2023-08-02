import React, { Suspense, useState } from 'react'
import profilelogo from '../assets/profilelogo.avif'
import { Link, Navigate } from 'react-router-dom'
import { FaPlusCircle } from 'react-icons/fa'
import './be.css'
import axios from 'axios'
import { URL } from '../Url'
const Nav = React.lazy(() => import('../n_f_components/Nav'))

function Registration() {
  const [image, setimage] = useState(null)
  const [res, setres] = useState(null)
  const [fileurl, setfileurl] = useState(null)
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [confirmpassword, setconfirmpassword] = useState('')
  const [error, seterror] = useState('')
  const [gender, setgender] = useState(null)
  const [upload, setupload] = useState(false)


  const uploadfile = async (e) => {
    setupload(true)
    try {
      const file = e.target.files[0];

      if (file.size <= 7340032) {
        return alert('max file size is 10mb please upload below 7Mb image')
      } else {
        setfileurl('Image Uploaded')
      }
      setupload(true)
      // uploading image to cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'gui0w71n')
      axios.post('https://api.cloudinary.com/v1_1/Bhuma00sai/image/upload', formData).then((response) => {
        setimage(response.data.secure_url);
      })
      setupload(false)
    } catch (error) {
      setupload(false)
      seterror(error);
    }
  }

  const registration = async (e) => {
    e.preventDefault()
    seterror('')
    // sending user inputs to backend
    URL.post('/register', image ? { name, image, email, password, confirmpassword, gender } : { name, email, password, confirmpassword, gender }).then((res) => {
      setres(res.data.msg)
      alert(res.data.msg)
    }).catch((err) => {
      seterror(err.response.data.msg);
    })

  }

  if (res) {
    return <Navigate to='/verify' />
  }
  if (localStorage.Token) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Suspense fallback={<center>...</center>}><Nav /></Suspense>
      <center><br />
        <h2 id='register'>{res}</h2>
        <div className="register-section">
          <h2 className='main-text'>register</h2>
          <form className='form-section' autoComplete='off' onSubmit={registration}>
            <div className="image">
              <img src={image || profilelogo} alt="profile" />
              <label htmlFor="file" onClick={() => document.getElementById('file').click()} color='green'><FaPlusCircle color='green' /></label>
              <input type="file" name="image-file" id="file" accept='image/*' onChange={uploadfile} hidden />
              {
                image ? <h5>{fileurl}</h5> : <h5>Image Not Added</h5>
              }
            </div>
            <input type="text" name="name" id="name" placeholder='enter your name' autoComplete='off' onChange={(e) => setname(e.target.value)} required maxLength={20} />
            <input type="email" name="email" id="email" placeholder='enter your email' autoComplete='off' onChange={(e) => setemail(e.target.value)} required />
            <input type="password" name="password" id="password" placeholder='password' onChange={(e) => setpassword(e.target.value)} required />
            <input type="password" name="confirmpassword" id="confirmpass" placeholder='confirm password' onChange={(e) => setconfirmpassword(e.target.value)} required />
            <div className="gender">
              <input type="radio" name="male" id="male" value="Male" onClick={(e) => setgender(e.target.value)} />
              <label htmlFor="male">male</label>
              <input type="radio" name="male" id="female" value="female" onClick={(e) => setgender(e.target.value)} />
              <label htmlFor="female">female</label>
              <input type="radio" name="male" id="other" value="other" onClick={(e) => setgender(e.target.value)} />
              <label htmlFor="other">other</label>
            </div>
            <center>
              <input type="submit" className='submit' value={upload ? 'processing' : 'register'} id='submit' />
            </center>
            <h6 id='error'>{error}</h6>
          </form>
          <h4>already have account <Link to='/login'>log in</Link></h4>
        </div >
        {
          upload ? <h5>please wait a minute</h5> : null
        }
        <center><p style={{ color: 'green' }}>Please Wait Until Register Process Complete</p></center>

      </center >
    </>
  )
}

export default Registration