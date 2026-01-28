import React, { Suspense, useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FaPlusCircle, FaUser } from 'react-icons/fa'
import './be.css'
import { URL } from '../Url'
const Nav = React.lazy(() => import('../n_f_components/Nav'))

function Registration() {
  const [image, setimage] = useState(null)
  const [fileurl, setfileurl] = useState(null)
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [confirmpassword, setconfirmpassword] = useState('')
  const [gender, setgender] = useState(null)
  const [register, setregister] = useState(false)
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [redirect, setRedirect] = useState(false)

  // Auto-close status after 3 seconds
  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => {
        setStatus({ type: '', msg: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status.msg])

  const uploadfile = async (e) => {
    setStatus({ type: '', msg: '' })
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setStatus({ type: 'error', msg: 'Max file size is 10MB. Please upload a smaller image.' })
      return
    }

    setfileurl('Processing Image...')
    const reader = new FileReader();
    reader.onloadend = () => {
      setimage(reader.result);
      setfileurl('Image Ready');
    };
    reader.onerror = () => {
      setStatus({ type: 'error', msg: 'Failed to process image' });
      setfileurl('Failed');
    };
    reader.readAsDataURL(file);
  }

  const registration = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })

    try {
      setregister(true)
      const userData = { name, image, email, password, confirmpassword, gender }

      await URL.post('/register', userData)

      setStatus({ type: 'success', msg: 'Successfully registered. Please check your email for OTP.' })
      setregister(false)

      // Delay redirect to allow user to read message
      setTimeout(() => {
        setRedirect(true)
      }, 2000)

    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || err.message })
      setregister(false)
    }
  }

  if (redirect) {
    return <Navigate to='/verify' />
  }
  if (localStorage.Token) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Suspense fallback={<center>...</center>}><Nav /></Suspense>
      <center><br />
        <div className="register-section">
          <h2 className='main-text'>register</h2>
          <form className='form-section' autoComplete='off' onSubmit={registration}>
            <div className="image-upload-container">
              <div className="image-preview">
                {image ?
                  <img src={image} alt="profile" /> :
                  <div className='circle' style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                    <p className='letter'>{name ? name[0].toUpperCase() : <FaUser />}</p>
                  </div>
                }
                <label htmlFor="file" className="upload-icon">
                  <FaPlusCircle />
                </label>
              </div>
              <input type="file" name="image-file" id="file" accept='image/*' onChange={uploadfile} hidden />
              <div className="upload-status">
                {fileurl && <span style={{ color: fileurl.includes('Failed') ? 'red' : 'var(--aqua-primary)' }}>{fileurl}</span>}
              </div>
            </div>

            <div className="input-group">
              <input type="text" name="name" id="name" placeholder='Name' autoComplete='off' onChange={(e) => setname(e.target.value)} required maxLength={20} />
              <input type="email" name="email" id="email" placeholder='Email' autoComplete='off' onChange={(e) => setemail(e.target.value)} required />
              <input type="password" name="password" id="password" placeholder='Password' onChange={(e) => setpassword(e.target.value)} required />
              <input type="password" name="confirmpassword" id="confirmpass" placeholder='Confirm Password' onChange={(e) => setconfirmpassword(e.target.value)} required />
            </div>

            <div className="gender-selection">
              <p>Gender:</p>
              <div className="gender-options">
                <label htmlFor="male">
                  <input type="radio" name="gender" id="male" value="Male" onChange={(e) => setgender(e.target.value)} />
                  <span>Male</span>
                </label>
                <label htmlFor="female">
                  <input type="radio" name="gender" id="female" value="female" onChange={(e) => setgender(e.target.value)} />
                  <span>Female</span>
                </label>
                <label htmlFor="other">
                  <input type="radio" name="gender" id="other" value="other" onChange={(e) => setgender(e.target.value)} />
                  <span>Other</span>
                </label>
              </div>
            </div>
            <center>
              {
                register ?
                  <button type="submit" className='submit' id='submit' disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '45px', width: '100%' }}>
                    <div className="spinner"></div> Please wait...
                  </button> :
                  <button type="submit" className='submit' id='submit' style={{ width: "100%" }}>Register</button>
              }
            </center>

            {status.msg && (
              <div className={`status-msg ${status.type}`}>
                <span>{status.msg}</span>
                <button type="button" className="status-close-btn" onClick={() => setStatus({ type: '', msg: '' })}>&times;</button>
              </div>
            )}

          </form>
          <h4>already have account <Link to='/login'>log in</Link></h4>
        </div >
      </center >
    </>
  )
}

export default Registration