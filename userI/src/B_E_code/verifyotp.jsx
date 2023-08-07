import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { URL } from '../Url'
import './be.css'

function Verifyotp() {
    const [email, setemail] = useState('')
    const [otp, setotp] = useState('')
    const [err, seterr] = useState('')
    const [verified, setverified] = useState('')
    const [wait, setwait] = useState(false)

    const otpSubmit = (e) => {
        e.preventDefault()
        try {
            setwait(true)
            URL.post('/otp-verification', { email, otp }).then((res) => {
                alert(res.data.msg)
                setverified(res.data.msg)
                setwait(false)
            }).catch((err) => {
                setwait(false)
                seterr(err.response.data.msg);
            })
        } catch (error) {
            alert(error.message)
        }
    }
    if (verified) {
        return <Navigate to='/login' />
    }

    return (
        <div className="otp-verify">
            <center><br />
                <h2 style={{ color: 'green', textTransform: 'capitalize' }}>otp has sent to your mail please verify</h2>
                <form onSubmit={otpSubmit} className='form'>
                    <input type="email" name="email" id="email-verify" required placeholder='enter registered email' value={email} onChange={(e) => setemail(e.target.value)} />
                    <input type="number" name="otp" id="verify" placeholder='Enter otp' required value={otp} onChange={(e) => setotp(e.target.value)} />
                    {
                        wait ?
                            <div className='loginwait'><span></span></div> :
                            <input type="submit" className='submit' value="confirm" />
                    }
                </form>
                <h3 style={{ color: 'red' }}>{err}</h3><br />
            </center>
            <center><h3 style={{ textTransform: 'capitalize', color: "green", textDecoration: "underline" }}>{verified}</h3></center>
        </div >
    )
}

export default Verifyotp