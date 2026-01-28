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

      // axios success (200 status)
      if (res.data.user.verified) {
        let userImage = res.data.user.image;

        // Ensure image is stored as a Base64 string even if it's a Buffer object
        if (userImage && typeof userImage === 'object' && userImage.type === 'Buffer' && Array.isArray(userImage.data)) {
          const base64String = btoa(
            userImage.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          userImage = `data:${res.data.user.imageType || 'image/png'};base64,${base64String}`;
        }

        localStorage.setItem('Token', res.data.token)
        localStorage.setItem('image', userImage)
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

          <div className="demo-accounts">
            <h4>Demo Accounts (Skip OTP)</h4>
            <div className="demo-account-info">
              <div className="demo-account-item">
                <div>Email: <strong>mipano3873@ixunbo.com</strong></div>
                <div>Password: <strong>Abcd@123</strong></div>
              </div>
              <div className="demo-account-item">
                <div>Email: <strong>gapali4650@juhxs.com</strong></div>
                <div>Password: <strong>Abcd@1234</strong></div>
              </div>
            </div>
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