import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import profilelogo from '../assets/profilelogo.avif'
import { FaBell, FaComment, FaHome, FaSignInAlt, FaUserFriends } from 'react-icons/fa'
import './nf.css'



function Nav() {
    return (
        <>
            <nav className="nav-section-container">
                <div className="nav-section">
                    <div className="logo-title">
                        <h2>chat application</h2>
                    </div>
                    <div className='nav-items'>
                        <div className="nav-links-d">
                            <ul>
                                <li><NavLink to='/'><FaHome /></NavLink></li>
                                <li><NavLink to='/chat'><FaComment /></NavLink></li>
                                <li><NavLink to='/users'><FaUserFriends /></NavLink></li>
                                <li><NavLink to='/notifications'><FaBell /></NavLink></li>
                            </ul>

                        </div>
                        <div className="user-auth">
                            {localStorage.Token ?
                                <>
                                    <div className='user-profile'>
                                        <Link to='/my-profile'><img src={localStorage.getItem("image") || profilelogo} alt="user-profile" /></Link>
                                    </div> </> :
                                <>
                                    <div className='user-access-details'>
                                        <Link to='/login' >log in</Link><span>/</span>
                                        <Link to='/register' >register</Link>
                                    </div>
                                    <div className='login'>
                                        <Link to='/login'><FaSignInAlt size={"1.5rem"} color='#000' /></Link>
                                    </div>
                                </>
                            }

                        </div>
                    </div>

                </div>
            </nav>
        </>
    )
}

export default Nav