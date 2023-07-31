import React from 'react'
import './nf.css'
import { Link } from 'react-router-dom'

function Error() {
  return (
    <>
      <center>
        <div className='error'>
          <span>🧐</span>
          <h3>something went wrong back to the home page</h3><br />
          <Link to='/' className='submit'>home</Link>
        </div>
      </center>
    </>
  )
}

export default Error

export const Device = () => {
  return (
    <>
      <center>
        <div className="device">
          <span>😔</span>
          <p>this website unavailable in your device</p>
          <p>device width greater than 500</p>
        </div>
      </center>
    </>
  )
}