import React from 'react'
import './nf.css'
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { CgMail } from 'react-icons/cg'

function Footer() {
  return (
    <>
      <footer className='footer-section'>
        <div className='footer-items'>
          <div className='main-text'>
            <h3>designed & developed by<span>Bhuma Sai</span></h3>
            <p><CgMail size='1.5rem' />  bhumasairam123@gmail.com</p>
          </div>
          <div className='footer-links'>
            <a href="https://github.com/BhumaSai" target='blank'><FaGithub color='#fff' size='1.2rem' /> Git Hub</a>
            <a href="https://www.linkedin.com/in/sai-ram-919b7b255/" target='blank'><FaLinkedin color='#1515d8' size='1.2rem' /> Linked in</a>
            <a href="http://instagram"><FaInstagram color='orange' size='1.2rem' /> instagram</a>
            <a href="http://twitter"><FaTwitter color='#7fc6ef' size='1.2rem' /> twitter</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer