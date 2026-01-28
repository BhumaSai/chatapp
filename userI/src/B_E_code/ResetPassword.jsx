import React, { useState, useEffect } from 'react'
import './be.css'
import { Navigate, useLocation } from 'react-router-dom'
import { URL } from '../Url'

function ResetPassword() {

    const [password, setpass] = useState('')
    const [confirmpass, setcpass] = useState('')
    const [toggle, settoggle] = useState(false)
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

    const togglepass = () => {
        settoggle(!toggle)
    }
    const location = useLocation()
    const handlepass = async (e) => {
        e.preventDefault()
        setStatus({ type: '', msg: '' })
        try {
            setwait(true)
            const res = await URL.post(`/reset_password${location.search}`, { password, confirmpass })
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
    if (localStorage.Token) {
        return <Navigate to='/' />
    }

    return (
        <>

            <center className="setpassword">
                <center><h2>Reset Password</h2></center>
                <form className="resetPassword" onSubmit={handlepass} autoComplete='off'>
                    <input type={toggle ? 'text' : 'password'} className='tp' name="password" id="setPass" placeholder='new password' value={password} onChange={(e) => setpass(e.target.value)} required />
                    <input type={toggle ? 'text' : 'password'} className='tp' name="confirmpassword" id="cPass" placeholder='confirm password' value={confirmpass} onChange={(e) => setcpass(e.target.value)} required />
                    <div className='v-pass'>
                        <input type="checkbox" name="check" id="checkpass" onClick={togglepass} />
                        <label htmlFor="checkpass" style={{ fontWeight: '800' }}>{toggle ? 'Hide' : 'Show'}</label>
                    </div>
                    {
                        wait ?
                            <button type="button" className='submit' disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <div className="spinner"></div> Resetting...
                            </button> :
                            <button type="submit" className='submit'>Reset Password</button>
                    }
                </form>

                {status.msg && (
                    <div className={`status-msg ${status.type}`} style={{ width: '50%' }}>
                        <span>{status.msg}</span>
                        <button type="button" className="status-close-btn" onClick={() => setStatus({ type: '', msg: '' })}>&times;</button>
                    </div>
                )}
            </center>
        </>
    )
}

export default ResetPassword