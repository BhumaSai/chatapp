import React, { Suspense, useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './be.css'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { URL } from '../Url'

const Nav = React.lazy(() => import('../n_f_components/Nav'))


function Login() {
  const [show, setshow] = useState(false)
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [log, setlog] = useState(0)
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const [logwait, setlogwait] = useState(false)

  // Auto-close status after 3 seconds
  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => {
        setStatus({ type: '', msg: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status.msg])

  const loginform = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value })
  }

  const loginToChatApp = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })
    try {
      setlogwait(true)
      const res = await URL.post('/login', login)

      // Axios success (200 status)
      // Check for user verification just in case, though usually 403 is thrown if not verified
      if (res.data.user.verified) {
        localStorage.setItem('Token', res.data.token)
        localStorage.setItem('image', res.data.user.image);
        localStorage.setItem('UserID', res.data.user._id)
        localStorage.setItem('name', res.data.user.name)
        setlog(200)
      } else {
        setStatus({ type: 'error', msg: 'Please verify your email.' })
        setTimeout(() => setlog(401), 2000)
      }
      setlogwait(false)
    } catch (err) {
      setlogwait(false)
      const errorMsg = err.response?.data?.msg || err.message;
      setStatus({ type: 'error', msg: errorMsg })

      if (err.response?.status === 403) {
        setTimeout(() => setlog(401), 2000)
      }
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
            <input type="email" name="email" id="user-email" placeholder='enter registerd @gmail ' value={login.email} onChange={loginform} autoComplete='off' required />
            <div className="password-show">
              <input type={show ? 'text' : 'password'} name="password" id="user-password" placeholder='enter your password' value={login.password} onChange={loginform} required />
              {
                show ?
                  <button type="button" className='btn' onClick={() => setshow(!show)}><BsFillEyeFill /></button> :
                  <button type="button" className='btn' onClick={() => setshow(!show)}><BsFillEyeSlashFill /></button>
              }
            </div>
            {
              logwait ?
                <button type="submit" className='submit' disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '45px' }}>
                  <div className="spinner"></div> Processing...
                </button> :
                <button type="submit" className='submit' style={{ height: '45px' }}>Log In</button>
            }
          </form>
          <div className="redirect-register">
            <Link to='/mail_verify'>forget password?</Link>
            <p>don't have account <Link to='/register'>register</Link></p>
          </div>

          {status.msg && (
            <div className={`status-msg ${status.type}`}>
              <span>{status.msg}</span>
              <button type="button" className="status-close-btn" onClick={() => setStatus({ type: '', msg: '' })}>&times;</button>
            </div>
          )}

        </div>
      </center>
    </>
  )
}

export default Login