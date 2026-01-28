import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { URL } from '../Url'
import './be.css'

function Emailverify() {

  const [email, setemail] = useState('')
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [processing, setprocessing] = useState(false)

  // Auto-close status after 3 seconds
  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => {
        setStatus({ type: '', msg: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status.msg])

  const resetpass = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })

    try {
      setprocessing(true)
      const response = await URL.post('/forget_password_verification', { email })
      setStatus({ type: 'success', msg: response.data.msg })
      setprocessing(false)
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.msg || err.message })
      setprocessing(false)
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
              <button type="submit" className='submit' id='reset-btn' disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                <div className="spinner"></div> Sending...
              </button> :
              <button type="submit" className='submit' id='reset-btn' style={{ width: '100%' }}>Send</button>
          }
        </form>

        {status.msg && (
          <div className={`status-msg ${status.type}`} style={{ width: '30%' }}>
            <span>{status.msg}</span>
            <button type="button" className="status-close-btn" onClick={() => setStatus({ type: '', msg: '' })}>&times;</button>
          </div>
        )}

      </div>
    </center>
    </>
  )
}

export default Emailverify