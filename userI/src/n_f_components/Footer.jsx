import './nf.css'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { CgMail } from 'react-icons/cg'

function Footer() {
  return (
    <>
      <footer className='footer-section'>
        <div className='footer-items'>
          <div className='main-text'>
            <h3>designed & developed by<span>Bhuma Sai</span></h3>
            <p><CgMail size='1rem' />  bhumasairam123@gmail.com</p>
          </div>
          <div className='footer-links'>
            <a href="https://github.com/BhumaSai" target='blank'><FaGithub color='#fff' size='1.2rem' /> Git Hub</a>
            <a href="https://www.linkedin.com/in/bhuma-sai/" target='blank'><FaLinkedin color='#1515d8' size='1.2rem' /> Linked in</a>
            <a href="https"><FaTwitter color='#7fc6ef' size='1.2rem' /> twitter</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer