import React, { Suspense, useEffect, useState } from 'react'
import Loader from '../n_f_components/loader'
import { Link, Navigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa6'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { URL } from '../Url'
import './be.css'
const Nav = React.lazy(() => import('../n_f_components/Nav'))

function Myprofile() {
  const [data, setdata] = useState(null)
  const [Loading, setloading] = useState(false)
  const [error, seterror] = useState(null)
  const [friends, setfriends] = useState(null)
  const [showfriends, setshowfriends] = useState(false)
  const [del, setdel] = useState(false)
  const userdata = () => {
    setloading(true)
    try {
      URL.get('/my-profile', { headers: { Token: localStorage.getItem('Token') } }).then(res => {
        setdata(res.data.user);
        setfriends(res.data.myfriends)
        setloading(false)
      }).catch(err => {
        seterror(err.message)
        setloading(false)
      })
    } catch (error) {
      alert(error.message)
      setloading(false)
    }
  }
  useEffect(() => {
    userdata()
  }, [])

  const handlelogout = () => {
    localStorage.clear()
  }

  if (!localStorage.getItem('Token')) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Suspense fallback={<center>...</center>}><Nav /></Suspense><br />
      <center>
        {
          data && !Loading && !error ?
            <div className="my-profile-section">
              <div className="my-profile">
                <div className='circle' style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--aqua-primary)', overflow: 'hidden' }}>
                  {(() => {
                    let imgSrc = null;
                    if (data.image) {
                      if (typeof data.image === 'string' && data.image !== "null" && data.image !== "undefined") {
                        imgSrc = data.image;
                      } else if (typeof data.image === 'object' && data.image.type === 'Buffer' && Array.isArray(data.image.data)) {
                        const base64String = btoa(data.image.data.reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
                        imgSrc = `data:image/png;base64,${base64String}`;
                      }
                    }
                    return imgSrc ?
                      <img src={imgSrc} alt={data.name} className="img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> :
                      <p className='letter' style={{ color: '#000', margin: 0, fontWeight: 700, fontSize: '3rem' }}>{data.name ? data.name[0].toUpperCase() : '?'}</p>
                  })()}
                </div>
                <div className="my-data">
                  <h3>Name: <span>{data.name}</span></h3><br />
                  <h3>Mail-ID : <span>{data.email}</span></h3><br />
                  <h3>Gender : <span>{data.gender}</span></h3><br />
                  <div className="show-friends">
                    <button className='btn my-p-b' onClick={() => setshowfriends(!showfriends)}>friends{showfriends ? <FaCaretUp /> : <FaCaretDown />}</button>
                  </div>
                </div><br />
                <button className="log-out" onClick={handlelogout}><Link to={'/'}>Log Out</Link></button>
              </div>
              <div className={showfriends ? "friends" : "friends display"}>
                <h5>Friends</h5><br />
                {
                  Array.isArray(friends) && data && !Loading && !error && friends ?
                    friends.map(data => {
                      const { _id, name } = data;
                      return (
                        <div className='all-friends' key={_id}>
                          <div className='circle' style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aqua-primary)', overflow: 'hidden' }}>
                            {(() => {
                              let fImgSrc = null;
                              if (data.image) {
                                if (typeof data.image === 'string' && data.image !== "null" && data.image !== "undefined") {
                                  fImgSrc = data.image;
                                } else if (typeof data.image === 'object' && data.image.type === 'Buffer' && Array.isArray(data.image.data)) {
                                  const base64 = btoa(data.image.data.reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
                                  fImgSrc = `data:image/png;base64,${base64}`;
                                }
                              }
                              return fImgSrc ?
                                <img src={fImgSrc} alt={name} className="img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> :
                                <p className='letter' style={{ color: "black", textAlign: "center", margin: 0, fontWeight: 700 }}>{name ? name[0].toUpperCase() : '?'}</p>
                            })()}
                          </div>
                          <p>{name}</p>
                          <button className='btn trashbtn' onClick={() => {
                            setdel(!del)
                          }}><FaTrash /></button>
                        </div>
                      )
                    })
                    : <Loader />
                }
              </div>
              <div className={del ? 'confirm-delete' : 'confirm-delete display'}>
                <div className="buttons">
                  <p>currently unavailable to delete friends from friend list </p>
                  <div className='btn'>
                    <button onClick={() => setdel(!del)}>ok</button>

                  </div>
                </div>
              </div>
            </div> :
            error ? <center><h3 style={{ color: 'red' }}>{error}</h3></center> :
              <Loader />
        }
      </center>
    </>
  )
}

export default Myprofile