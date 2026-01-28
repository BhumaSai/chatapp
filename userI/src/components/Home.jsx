import React, { Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../n_f_components/Footer'
import './friendProfile.css'

const Nav = React.lazy(() => import('../n_f_components/Nav'))


function Home() {
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const { left, top } = containerRef.current.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top
      containerRef.current.style.setProperty('--x', `${x}px`)
      containerRef.current.style.setProperty('--y', `${y}px`)
    }
  }

  return (
    <>
      <Suspense fallback={<center>...</center>}><Nav /></Suspense>
      <div onMouseMove={handleMouseMove} ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {
          !localStorage.getItem('Token') ?
            <div className="hero-section">
              <div className="auth-btn">
                <div className="content">
                  <h1>Connect <span>Instantly</span></h1>
                  <p>Experience seamless communication with our modern chat application. Connect with friends, share moments, and stay in touch wherever you are. Secure, fast, and built for you.</p>
                  <div className="authbuttons">
                    <Link to='/login'>Log In</Link>
                    <Link to='/register'>Register</Link>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className="hero-content">
              {
                localStorage.getItem('Token') ? <div className="image">
                  <p>welcome  <span>{localStorage.getItem('name')}</span></p>
                </div> : null
              }
            </div>
        }
      </div>
      <Footer />
    </>
  )
}

export default Home