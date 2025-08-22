import React, { Suspense } from 'react'
import { Link } from 'react-router-dom'
import heroimage from '../assets/hero-img.avif'
import heroimage2 from '../assets/hero-img-2.avif'
import Footer from '../n_f_components/Footer'
import './friendProfile.css'

const Nav = React.lazy(() => import('../n_f_components/Nav'))


function Home() {
  return (
    <>
      <Suspense fallback={<center>...</center>}><Nav /></Suspense>
      {
        !localStorage.getItem('Token') ?
          <div className="hero-section">
            <div className="auth-btn">
              <img src={heroimage} alt="main-pic" />
              <div className="content">
                <p>Chat applications often require user authentication to ensure only authorized users can participate in conversations.</p>
                <div className="authbuttons">
                  <Link to='/login'>login</Link>
                  <Link to='/register'>register</Link>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="hero-content">
            {
              localStorage.getItem('Token') ? <div className="image">
                <img src={heroimage2} alt='hero-pic' />
                <p>welcome  <span>{localStorage.getItem('name')}</span></p>
              </div> : null
            }
          </div>
      }
      <Footer />
    </>
  )
}

export default Home