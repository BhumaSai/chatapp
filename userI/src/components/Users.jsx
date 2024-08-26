import React, { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import './components.css'
import { FaPlusCircle } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Loader from '../n_f_components/loader'
import { URL } from '../Url'

const Nav = React.lazy(() => import('../n_f_components/Nav'))


function Users() {
  const [data, setdata] = useState([])
  const [loading, setloading] = useState(false)
  const [err, seterr] = useState(null)
  const [logeduser, setlogeduser] = useState(null)

  const userdata = () => {
    setloading(true)
    try {
      URL.get(`/all-users`, { headers: { Token: localStorage.getItem('Token') } }).then(res => {
        setdata(res.data);
      }).catch(err => {
        seterr(err.data);
      })

      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  useEffect(() => {
    userdata()
    setlogeduser(localStorage.getItem('UserID'))
  }, [])

  if (!localStorage.getItem("Token")) {
    return <Navigate to='/login' />
  }

  return (
    <>
      <Suspense fallback={<center>...</center>}><Nav /></Suspense>
      <div className="user-section-container">
        <center><h2>USERS</h2></center>
        <div className="user-section">
          {data ?
            Array.isArray(data) && data?.map((data) => {
              const { _id, image, name } = data;
              return (
                <div className="user" key={_id}>
                  <img src={image} alt="img" />
                  <h4>{name}</h4>
                  <div>
                    <button className="btn" onClick={() => {
                      URL.post("/getuser", { logeduser, _id }).then(res => {
                        alert(res.data.msg)
                      }).catch(err => {
                        alert(err.response.data.msg)
                      })
                    }}>  <FaPlusCircle /></button>
                  </div>
                </div>
              )
            }) : null
          }
          {
            loading ? <Loader /> : null
          }
          <h5 color='red'>{err}</h5>
        </div>
      </div >
    </>
  )
}

export default Users