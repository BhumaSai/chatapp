import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaBell, FaComment, FaHome, FaUserFriends, FaSun, FaMoon, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import './nf.css'
import { FaUser } from 'react-icons/fa6'

function Nav() {
    const [theme, setTheme] = useState('dark')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark'
        setTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
    }, [])

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [isSidebarOpen])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    const logout = () => {
        localStorage.clear()
        navigate('/login')
        window.location.reload()
    }

    return (
        <>
            <nav className="nav-section-container">
                <div className="nav-section">
                    <div className="logo-title">
                        <Link to='/'><h2>Chat App</h2></Link>
                    </div>

                    {/* Navigation Links - Hidden on mobile, icons available in sidebar */}
                    <div className="nav-links-container desktop-nav">
                        <ul>
                            <li><NavLink to='/' end title="Home"><FaHome /></NavLink></li>
                            <li><NavLink to='/chat' title="Chat"><FaComment /></NavLink></li>
                            <li><NavLink to='/users' title="Users"><FaUserFriends /></NavLink></li>
                            <li><NavLink to='/notifications' title="Notifications"><FaBell /></NavLink></li>
                        </ul>
                    </div>

                    <div className='user-auth-items desktop-nav'>
                        {!localStorage.Token ? (
                            <div className="nav-auth-buttons">
                                <Link to='/login' className="nav-btn login">Log In</Link>
                                <Link to='/register' className="nav-btn signup">Sign Up</Link>
                                <button className="dropdown-item" onClick={() => { toggleTheme(); setIsDropdownOpen(false); }}>
                                    {theme === 'dark' ? <><FaSun color="orange" /> Light Mode</> : <><FaMoon color="slateblue" /> Dark Mode</>}
                                </button>
                            </div>
                        ) :


                            <div className="nav-dropdown-wrapper"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}>

                                <button className="nav-dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    {localStorage.Token ? (
                                        localStorage.getItem("image") && localStorage.getItem("image") !== "null" && localStorage.getItem("image") !== "undefined" ?
                                            <img src={localStorage.getItem("image")} alt="user-profile" className="nav-trigger-img" /> :
                                            <div className="circle1" >
                                                <p className="letter" style={{ fontSize: '1.5rem', color: '#000', margin: 0, fontWeight: 700 }}>{localStorage.getItem('name') ? localStorage.getItem('name')[0].toUpperCase() : <FaUser />}</p>
                                            </div>
                                    ) : (
                                        <FaBars className="user-svg-icon" />
                                    )}
                                </button>

                                <div className={`nav-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>

                                    {localStorage.Token && (
                                        <>
                                            <button className="dropdown-item" onClick={() => { toggleTheme(); setIsDropdownOpen(false); }}>
                                                {theme === 'dark' ? <><FaSun color="orange" /> Light Mode</> : <><FaMoon color="slateblue" /> Dark Mode</>}
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <Link to='/my-profile' className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                                <FaUser /> My Profile
                                            </Link>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item logout-item" onClick={() => { logout(); setIsDropdownOpen(false); }}>
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        }
                    </div>

                    <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars />
                    </button>
                </div>
            </nav>

            {/* Sidebar / Hamburger Menu */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
                <div className={`sidebar-content ${isSidebarOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                    <div className="sidebar-header">
                        <h3>Settings</h3>
                        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="sidebar-profile-section">
                        {localStorage.Token ? (
                            <div className="profile-info">
                                <Link to='/my-profile' onClick={() => setIsSidebarOpen(false)} className="profile-img-container">
                                    {localStorage.getItem("image") && localStorage.getItem("image") !== "null" && localStorage.getItem("image") !== "undefined" ?
                                        <img src={localStorage.getItem("image")} alt="user-profile" /> :
                                        <div className="circle" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aqua-primary)' }}>
                                            <p className="letter" style={{ fontSize: '1.5rem', color: '#000', margin: 0, fontWeight: 700 }}>{localStorage.getItem('name') ? localStorage.getItem('name')[0].toUpperCase() : <FaUser />}</p>
                                        </div>
                                    }
                                </Link>
                                <div className="profile-text">
                                    <h4>{localStorage.getItem('name') || 'User'}</h4>
                                </div>
                            </div>
                        ) : (
                            <div className="sidebar-auth-links">
                                <Link to="/login" onClick={() => setIsSidebarOpen(false)}>Login</Link>
                                <Link to="/register" onClick={() => setIsSidebarOpen(false)}>Register</Link>
                            </div>
                        )}
                    </div>

                    <div className="sidebar-links secondary-links">
                        <NavLink to='/' end onClick={() => setIsSidebarOpen(false)}><FaHome /> Home Page</NavLink>
                        <NavLink to='/chat' onClick={() => setIsSidebarOpen(false)}><FaComment /> Messages</NavLink>
                        <NavLink to='/users' onClick={() => setIsSidebarOpen(false)}><FaUserFriends /> Discover Friends</NavLink>
                        <NavLink to='/notifications' onClick={() => setIsSidebarOpen(false)}><FaBell /> Notifications</NavLink>
                        {localStorage.Token && (
                            <NavLink to='/my-profile' onClick={() => setIsSidebarOpen(false)}><FaBars /> View Profile</NavLink>
                        )}
                    </div>

                    <div className="sidebar-footer">
                        <div className="footer-actions">
                            <button className="theme-toggle-sidebar" onClick={toggleTheme}>
                                {theme === 'dark' ? <><FaSun color="orange" /> Light Mode</> : <><FaMoon color="slateblue" /> Dark Mode</>}
                            </button><br />
                            {localStorage.Token && (
                                <button className="logout-btn-sidebar" onClick={logout}>
                                    <FaSignOutAlt /> Logout Account
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Nav