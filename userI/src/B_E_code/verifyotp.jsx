import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { URL } from '../Url'
import './be.css'

function Verifyotp() {
    const [email, setemail] = useState('')
    const [otp, setotp] = useState('')
    const [status, setStatus] = useState({ type: '', msg: '' })
    const [wait, setwait] = useState(false)
    const [shouldRedirect, setShouldRedirect] = useState(false)

    // Auto-close status after 3 seconds
    useEffect(() => {
        if (status.msg) {
            const timer = setTimeout(() => {
                setStatus({ type: '', msg: '' })
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [status.msg])

    const otpSubmit = async (e) => {
        e.preventDefault()
        setStatus({ type: '', msg: '' })
        setwait(true)
        try {
            const res = await URL.post('/otp-verification', { email, otp })
            setStatus({ type: 'success', msg: res.data.msg })
            setwait(false)

            setTimeout(() => {
                setShouldRedirect(true)
            }, 2000)

        } catch (err) {
            setwait(false)
            setStatus({ type: 'error', msg: err.response?.data?.msg || err.message })
        }
    }

    if (shouldRedirect) {
        return <Navigate to='/login' />
    }

    return (
        <div className="otp-verify">
            <center><br />
                <h2 style={{ color: 'green', textTransform: 'capitalize' }}>otp has sent to your mail please verify</h2>
                <form onSubmit={otpSubmit} className='otp-verify-form'>
                    <input type="email" name="email" id="email" required placeholder='enter registered email' value={email} onChange={(e) => setemail(e.target.value)} />
                    <input type="number" name="otp" id="otp" placeholder='Enter otp' required value={otp} onChange={(e) => setotp(e.target.value)} />
                    {
                        wait ?
                            <button type="submit" className='submit' disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <div className="spinner"></div> Verifying...
                            </button> :
                            <button type="submit" className='submit'>Confirm</button>
                    }

                    {status.msg && (
                        <div className={`status-msg ${status.type}`} style={{ width: '60%' }}>
                            <span>{status.msg}</span>
                            <button type="button" className="status-close-btn" onClick={() => setStatus({ type: '', msg: '' })}>&times;</button>
                        </div>
                    )}
                </form>
            </center>
        </div >
    )
}

export default Verifyotp