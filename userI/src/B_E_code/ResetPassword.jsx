import React, { useState } from 'react'
import './be.css'
import { Navigate, useLocation } from 'react-router-dom'
import { URL } from '../Url'

function ResetPassword() {

    const [password, setpass] = useState('')
    const [confirmpass, setcpass] = useState('')
    const [toggle, settoggle] = useState(false)
    const [err, seterr] = useState('')
    const [msg, setmsg] = useState('')


    const togglepass = () => {
        settoggle(!toggle)
    }
    const location = useLocation()
    const handlepass = (e) => {
        e.preventDefault()
        URL.post(`/reset_password${location.search}`, { password, confirmpass }).then((res) => {
            setmsg(res.data)
            alert(res.data.msg)
        }).catch((err) => {
            seterr(err.response.data.msg);
        })
    }
    if (msg.status === true) {
        return <Navigate to='/login' />
    }
    if (localStorage.Token) {
        return <Navigate to='/' />
    }

    return (
        <>
            <center>
                <div className="setpassword">
                    <center><h2>Reset Password</h2></center>
                    <form className="resetPassword" onSubmit={handlepass} autoComplete='off'>
                        <input type={toggle ? 'text' : 'password'} className='tp' name="password" id="setPass" placeholder='new password' value={password} onChange={(e) => setpass(e.target.value)} required />
                        <input type={toggle ? 'text' : 'password'} className='tp' name="confirmpassword" id="cPass" placeholder='confirm password' value={confirmpass} onChange={(e) => setcpass(e.target.value)} required />
                        <div className='v-pass'>
                            <input type="checkbox" name="check" id="checkpass" onClick={togglepass} />
                            <label htmlFor="checkpass" style={{ fontWeight: '800' }}>{toggle ? 'Hide' : 'Show'}</label>
                        </div>
                        <input type="submit" className='submit' value="Reset Password" />
                    </form>
                    <center><h3 style={{ color: 'red', textTransform: 'capitalize' }}>{err}</h3></center>
                    <center><h3 style={{ color: 'green', textTransform: 'capitalize' }}>{msg.msg}</h3></center>
                </div>
            </center>
        </>
    )
}

export default ResetPassword