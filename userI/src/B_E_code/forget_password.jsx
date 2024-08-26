import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { URL } from '../Url'
import './be.css'

function Emailverify() {

  const [email, setemail] = useState('')
  const [msg, setmsg] = useState('')
  const [err, seterr] = useState('')
  const [processing, setprocessing] = useState(false)

  const resetpass = (e) => {
    e.preventDefault()
    setmsg('')
    seterr('')
    try {
      setprocessing(true)
      URL.post('/forget_password_verification', { email }).then(response => {
        setmsg(response.data.msg);
        setprocessing(false)
      }).catch(err => {
        seterr(err.response.data.msg);
        setprocessing(false)
      })
    } catch (error) {
      alert(error.message)
    }
  }

  if (localStorage.Token) {
    return <Navigate to='/' />
  }

  return (
    <><center>
      <div className="forget-pass">
        <form onSubmit={resetpass} className='reset-pass'>
          <input type="email" name="email" id="r-email" placeholder='enter registered email ' value={email} onChange={e => setemail(e.target.value)} required />
          {
            processing ?
              <div className='loginwait' style={{ width: '100%', margin: '0' }}><span></span></div> :
              <input type="submit" className='submit' id='reset-btn' value="send" />
          }
        </form>
        <center><h3 style={{ color: 'green' }}>{msg}</h3></center>
        <center><h3 style={{ color: 'red' }}>{err}</h3></center>
      </div>
    </center>
    </>
  )
}

export default Emailverify