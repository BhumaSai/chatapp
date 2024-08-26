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
                                        <img src={image} alt="" height={'50px'} width={'50px'} onClick={() => setUserdet(data)} style={{ cursor: 'pointer' }} />
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
                            <div className='user-Friend-Profile ' style={{ zIndex: '10000' }}>
                                <div className="friend-Profile">
                                    <button className='btn profilebtn' onClick={() => setUserdet('')} ><FaRegCircleXmark /></button>
                                    <div className="friend-details">
                                        <img src={userdet.image} alt={userdet.name} />
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