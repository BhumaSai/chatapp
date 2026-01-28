import React, { useState, useEffect, Suspense } from 'react'
import './components.css'
import { Navigate } from 'react-router-dom'
import { FaVenus } from 'react-icons/fa'
import { BsGenderMale } from 'react-icons/bs'
import { FaRegCircleXmark } from 'react-icons/fa6'
import { URL } from '../Url'

const Nav = React.lazy(() => import('../n_f_components/Nav'))


function Notification() {

    const [friendRequests, setFriendRequests] = useState(null)
    const [acceptedUser, setAcceptedUser] = useState(null)
    const [response, setResponse] = useState('')
    const [loading, setloading] = useState(false)
    const [userdet, setUserdet] = useState(null)
    useEffect(() => {
        setloading(true)
        try {
            URL.get('/friend-requests', { headers: { Token: localStorage.getItem('Token') } }).then(res => { setFriendRequests(res.data) }).catch(err =>
                alert(err.message)
            )
            setAcceptedUser(localStorage.getItem('UserID'))
            setloading(false)
        } catch (err) {
            alert(err.message);
            setloading(false)
        }
    }, [response])


    const acceptRequest = (requestUser) => {
        URL.put('/accept-request', { requestUser, acceptedUser }).then(res => {
            setResponse(res.data.msg);
        }).catch(err => {
            alert(err.response.msg);
        })
    }
    const deleteRequest = (requestedUser) => {
        URL.delete(`/delete-request/${requestedUser}/${acceptedUser}`).then(res => {
            setResponse(res.data.msg);
        }).catch(err => {
            alert(err.response.msg);
        })
    }

    setTimeout(() => {
        setResponse('')
    }, 3000);

    if (!localStorage.getItem("Token")) {
        return <Navigate to='/login' />
    }

    return (
        <>
            <Suspense fallback={<center>...</center>}><Nav /></Suspense>
            <div className="request-section">
                <div className='request-container'>
                    <h3>Friend Requests</h3>
                    <p style={{ color: "green", textTransform: "capitalize" }}>{response}</p>
                    {
                        friendRequests && !loading ?

                            Array.isArray(friendRequests) && friendRequests.map((data, index) => {
                                const { _id, image } = data
                                return (
                                    <div className="request" key={index} >
                                        {image && image !== null && image !== undefined ?
                                            <img src={image} alt="" height={'50px'} width={'50px'} onClick={() => setUserdet(data)} style={{ cursor: 'pointer', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--aqua-primary)' }} /> :
                                            <div className='circle' style={{ width: '50px', height: '50px', cursor: 'pointer', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aqua-primary)' }} onClick={() => setUserdet(data)}>
                                                <p className='letter' style={{ fontSize: '1.2rem', color: '#000', margin: 0, fontWeight: 700 }}>{data.name ? data.name[0].toUpperCase() : '?'}</p>
                                            </div>
                                        }
                                        <div className='buttons-section'>
                                            <button onClick={() => acceptRequest(_id)}>accept</button>
                                            <button onClick={() => deleteRequest(_id)}>delete</button>
                                        </div>
                                    </div>
                                )
                            }) : null

                    }
                    {
                        userdet ?
                            <div className='user-Friend-Profile'>
                                <div className="friend-Profile">
                                    <button className='profilebtn' onClick={() => setUserdet('')} ><FaRegCircleXmark /></button>
                                    <div className="friend-details">
                                        {userdet.image && userdet.image !== "null" && userdet.image !== "undefined" ?
                                            <img src={userdet.image} alt={userdet.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--aqua-primary)' }} /> :
                                            <div className='circle' style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--aqua-primary)' }}>
                                                <p className='letter' style={{ fontSize: '2.5rem', color: '#000', margin: 0, fontWeight: 700 }}>{userdet.name ? userdet.name[0].toUpperCase() : '?'}</p>
                                            </div>
                                        }
                                        <h5 className='name'>Name : {userdet.name}</h5>
                                        <p className='email'>Mail : {userdet.email}</p>
                                        <span> {userdet.gender === 'Female' ? <FaVenus /> : <BsGenderMale />} Gender :  {userdet.gender} </span>
                                    </div>
                                </div>
                            </div>
                            : null
                    }

                </div>
            </div>
        </>
    )
}

export default Notification