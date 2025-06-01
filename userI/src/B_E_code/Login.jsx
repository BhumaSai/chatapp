import React, { Suspense, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './be.css'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { URL } from '../Url'
import Loader from '../n_f_components/loader'

const Nav = React.lazy(() => import('../n_f_components/Nav'))


function Login() {
  const [show, setshow] = useState(false)
  const [err, seterr] = useState("")
  const [log, setlog] = useState(0)
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const [logwait, setlogwait] = useState(false)



  const loginform = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value })
  }

  const loginToChatApp = (e) => {
    e.preventDefault()
    try {
      setlogwait(true)
      URL.post('/login', login).then(res => {
        if (res.data.user.verified) {
          localStorage.setItem('Token', res.data.token)
          localStorage.setItem('image', res.data.user.image);
          localStorage.setItem('UserID', res.data.user._id)
          localStorage.setItem('name', res.data.user.name)
          setlog(200)
        } else {
          setlog(401)
        }
        setlogwait(false)
      }).catch(err => {
        seterr(err.response.data.msg);
        setlogwait(false)
      })
    } catch (error) {
      alert(error.message)
    }
  }


  if (log === 200) {
    return <Navigate to='/' />
  } else if (log === 401) {
    return <Navigate to="/verify" />
  }
  if (localStorage.getItem("Token")) {
    return <Navigate to='/' />
  }
  return (
    <>

      <Suspense fallback={<center>...</center>}><Nav name={localStorage.getItem("name")} /></Suspense>
      <center>
        <div className="login-section">
          <h2 className='main-text'>log in</h2>
          <form className="log-in-form" autoComplete='off' onSubmit={loginToChatApp}>
            <input type="email" name="email" id="user-email" placeholder='enter registerd @gmail ' value={login.email} onChange={loginform} autoComplete='off' />
            <div className="password-show">
              <input type={show ? 'text' : 'password'} name="password" id="user-password" placeholder='enter your password' value={login.password} onChange={loginform} />
              {
                show ?
                  <button className='btn' onMouseUp={() => setshow(!show)}><BsFillEyeFill /></button> :
                  <button className='btn' onMouseUp={() => setshow(!show)}><BsFillEyeSlashFill /></button>
              }
            </div>
            {
              logwait ?
                <div className='loginwait'><span></span></div> :
                <input type="submit" className='submit' value="log in" />
            }
          </form>
          <div className="redirect-register">
            <Link to='/mail_verify'>forget password?</Link>
            <p>don't have account <Link to='/register'>register</Link></p>
          </div>
        </div>
        <center><h4 style={{ color: 'red', textTransform: 'capitalize', textAlign: 'center' }}>{err}</h4></center>
      </center>
      {
        logwait ?
          <Loader /> : null
      }
    </>
  )
}

export default Login