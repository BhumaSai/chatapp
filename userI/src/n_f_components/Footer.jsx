import './nf.css'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { CgMail } from 'react-icons/cg'

function Footer() {
  return (
    <>
      <footer className='footer-section'>
        <div className='footer-container'>
          <div className='footer-main-info'>
            <div className='footer-brand'>
              <h3>designed & developed by <span>Bhuma Sai</span></h3>
              <p><CgMail className="footer-icon" /> bhumasairam123@gmail.com</p>
            </div>
            <div className='footer-links-group'>
              <a href="https://github.com/BhumaSai" target='_blank' rel="noopener noreferrer"><FaGithub /> GitHub</a>
              <a href="https://www.linkedin.com/in/bhuma-sai/" target='_blank' rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
              <a href="https://twitter.com/your_handle" target='_blank' rel="noopener noreferrer"><FaTwitter /> Twitter</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Chat App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer