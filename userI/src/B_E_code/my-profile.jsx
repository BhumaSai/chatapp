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
      }).catch(err => {
        console.log(err.message);
        seterror(err.message)
      })
      setloading(false)
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
                <div className='circle'>
                  <p className='letter'>{data.name[0].toUpperCase()}</p>
                </div>
                <div className="my-data">
                  <h3>Name: <span>{data.name}</span></h3><hr /><br />
                  <h3>Mail-ID : <span>{data.email}</span></h3><hr /><br />
                  <h3>Gender : <span>{data.gender}</span></h3><hr /><br />
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
                          <div className='circle'>
                            <p className='letter' style={{ color: "white", textAlign: "center" }}>{name[0].toUpperCase()}</p>
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
            <Loader />
        }
      </center>
    </>
  )
}

export default Myprofile