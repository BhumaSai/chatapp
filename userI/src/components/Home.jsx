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
      <div className='hero-section-container'>
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
            : null
        }
        <div className="hero-content">
          {
            localStorage.getItem('Token') ? <div className="image">
              <img src={heroimage2} alt='hero-pic' />
              <p>welcome  <span>{localStorage.getItem('name')}</span></p>
            </div> : null
          }
          <div className="note-points">
            <h2>Note:-</h2>
            <ul>
              <li>Only,Your chat conversations will be deleted regularaly,why because this application isn't providing any data storage.</li>
              <li>your registrastion details doesn't delete it will be stored in our data base.</li>
              <li>this application provides you to chat with selected person,and group chat currently not available it may add in future.</li>
              <li>your chat conversations didn't secure so, please make your conversation appropriate.</li>
              <li>in this application you're facing any issues  please contact me through mail. </li>
            </ul>
          </div><br />
          <div className='hero-text-center'>
            <div className="text">
              <p>Messages play a significant role in modern communication, offering a convenient and efficient way to interact with others across distances and time zones. They have become an essential part of daily life, enabling people to stay connected, collaborate, and share information in a fast and accessible manner. </p>
            </div>
          </div>
        </div>
      </div><br />
      <Footer />
    </>
  )
}

export default Home