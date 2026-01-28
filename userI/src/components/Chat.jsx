import React, { Suspense, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import './components.css'
import { MdSend } from 'react-icons/md'
import { useState } from 'react'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import dateFormat from 'dateformat'
import { FaArrowAltCircleLeft, FaEllipsisV } from 'react-icons/fa'
import Userprofile from './Userprofile'
import { URL } from '../Url'
import Loader from '../n_f_components/loader'

const Nav = React.lazy(() => import('../n_f_components/Nav'))


function Chat() {

  const [message, setmessage] = useState('')
  const [friends, setfriends] = useState(null)
  const [selecteduser, setselecteduser] = useState('')
  const [pickUser, setPickUser] = useState(undefined)
  const [privatemsg, setprivatemsg] = useState([])
  const [conversation, setconversation] = useState([])
  const [owner, setowner] = useState('')
  const [active, setactive] = useState('')
  const [toggle, settoggle] = useState(false)
  const [viewProfile, setViewProfile] = useState(false)
  const [online, setOnline] = useState(null)

  const [loadingfriends, setloadingfriends] = useState(false)

  // scrolling messages auto
  const scrollMsg = useRef()
  useEffect(() => {
    scrollMsg.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])
  // socket 
  const socket = useRef()

  useEffect(() => {
    if (owner) {
      socket.current?.emit("add-user", owner)
    }
  }, [owner, socket])

  // getting conversation
  useEffect(() => {
    socket.current?.on('conversation', (data) => {
      setprivatemsg({
        senderID: data.senderID,
        receiverID: data.receiverID,
        message: data.message,
        updatedAt: data.updatedAt
      })
    })
  }, [conversation])
  // only pickUser can receive message
  useEffect(() => {
    privatemsg && selecteduser === privatemsg.senderID && setconversation((prev) => [...prev, privatemsg])
  }, [privatemsg, selecteduser])

  // on mount setup
  useEffect(() => {
    friendslist()
    setowner(localStorage.getItem('UserID'))
    socket.current = io('https://feelfreebe.onrender.com/')
  }, [])

  // send message function
  const sendmessage = (e) => {
    e.preventDefault()
    if (message !== "") {
      setmessage('')
      const savemsg = { senderID: owner, receiverID: pickUser._id, message }
      URL.post('/add-messages', savemsg).catch(err => {
        alert(err)
      })
      setconversation([...conversation, savemsg])
      socket.current?.emit('FromSender', savemsg)

    }
  }

  // select User function
  const selectUser = (User) => {
    setPickUser(User)
    setselecteduser(User._id)
    setconversation([])
    setViewProfile(false) // Ensure profile is closed when switching users
    if (owner) {
      URL.get(`/get-messages/${User._id}/${owner}`).then(res => { setconversation(res.data.messages) }).catch(err => alert(err))
    }
    setactive(User)

  }



  // user friends api
  const friendslist = () => {
    try {
      setloadingfriends(true)
      URL.get('/user-friends', { headers: { Token: localStorage.getItem("Token") } }).then(res => {
        setfriends(res.data);
        setloadingfriends(false)
      }).catch(err => {
        alert(err)
        setloadingfriends(false)
      })
    } catch (error) {
      setloadingfriends(false)
      alert(error.message)
    }
  }

  // menu toggle
  const togglemenu = (e) => {
    e.preventDefault()
    settoggle(!toggle)
    console.log('togglemenu');
  }
  // profile view function
  const viewProfilefunc = (e) => {
    if (e) e.preventDefault()
    setViewProfile(!viewProfile)
    // Only close menu if we are opening profile
    if (!viewProfile) {
      settoggle(false)
    }
  }

  // Close profile only
  const closeProfile = (e) => {
    if (e) e.preventDefault()
    setViewProfile(false)
  }

  // getting all online users
  useEffect(() => {
    socket.current?.on('onlineUsers', (data) => {
      setOnline(data);
    })
  }, [socket])

  // authentification
  if (!localStorage.getItem("Token")) {
    return <Navigate to='/login' />
  }

  const isUserOnline = pickUser && Array.isArray(online) && online.some(data => data.User === pickUser._id);

  return (
    <>
      <Suspense fallback={<Loader />}><Nav /></Suspense>
      <center>
        <div className="chat-box">
          <div className="chat-items">
            {/* If pickUser is true (chat active), hide chat-users on mobile. 
                We can control this with CSS classes. */}
            <div className={`chat-users ${pickUser ? 'hidden-on-mobile' : ''}`}>
              <h3 className='message-title'>Friends</h3>
              {friends ?
                Array.isArray(friends) && friends.map(data => {
                  const { _id, name } = data
                  return (
                    <>
                      <div key={_id} className={active._id === _id && pickUser ? "user-chat-active" : "user-chat"} onClick={() => selectUser(data)}>
                        <div className='circle' style={{ borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aqua-primary)', width: '45px', height: '45px', overflow: 'hidden' }}>
                          {(() => {
                            let imgSrc = null;
                            if (data.image) {
                              if (typeof data.image === 'string' && data.image !== "null" && data.image !== "undefined") {
                                imgSrc = data.image;
                              } else if (typeof data.image === 'object' && data.image.type === 'Buffer' && Array.isArray(data.image.data)) {
                                const base64 = btoa(data.image.data.reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
                                imgSrc = `data:image/png;base64,${base64}`;
                              }
                            }
                            return imgSrc ?
                              <img src={imgSrc} alt={name} className="img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> :
                              <p className='letter' style={{ color: '#000', margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>{name ? name[0].toUpperCase() : '?'}</p>
                          })()}
                        </div>
                        <h5 id='friend-name'>{name}</h5>
                        <span className={Array.isArray(online) && online.some(data => { return data.User === _id }) ? 'online' : 'offline'}></span>
                      </div>

                    </>
                  )
                })
                : null
              }
              {
                loadingfriends ?
                  <div className='friends-loading'>
                    <div className="spinner-small"></div>
                  </div>
                  : null
              }
            </div>

            {pickUser ? (
              <div className={"chat-area"}>
                <div className="conversation">
                  <div className="det">
                    <button className='btn back-btn' onClick={() => setPickUser(undefined)}> <FaArrowAltCircleLeft fontSize={'1.3rem'} /></button>
                    <div className='circle' style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--aqua-primary)', overflow: 'hidden' }}>
                      {(() => {
                        let headerImg = null;
                        if (pickUser.image) {
                          if (typeof pickUser.image === 'string' && pickUser.image !== "null" && pickUser.image !== "undefined") {
                            headerImg = pickUser.image;
                          } else if (typeof pickUser.image === 'object' && pickUser.image.type === 'Buffer' && Array.isArray(pickUser.image.data)) {
                            const base64 = btoa(pickUser.image.data.reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
                            headerImg = `data:image/png;base64,${base64}`;
                          }
                        }
                        return headerImg ?
                          <img src={headerImg} alt={pickUser.name} className="img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> :
                          <p className='letter' style={{ color: '#000', margin: 0, fontWeight: 700 }}>{pickUser.name ? pickUser.name[0].toUpperCase() : '?'}</p>
                      })()}
                    </div>
                    <div className="user-header-info">
                      <h5>{pickUser.name}</h5>
                      <p className={`user-status-text ${isUserOnline ? 'online-text' : 'offline-text'}`}>
                        {isUserOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="details">
                    <button className='btn btn2' onClick={togglemenu}> <FaEllipsisV size={"1.3rem"} /></button>
                    <div className={`det-items ${toggle ? 'show-menu' : ''}`}>
                      <button className="btn" onClick={viewProfilefunc}>View Profile</button>
                    </div>
                    <Userprofile pickUser={pickUser} viewProfilefunc={closeProfile} viewProfile={viewProfile} />
                  </div>
                </div>

                <div className="messages">
                  {
                    pickUser ? (
                      <>
                        {conversation.map((data, index) => {
                          const { senderID, message, updatedAt } = data;
                          return (
                            <div className={owner === senderID ? "sender" : 'receiver'} key={index}>
                              <p className={owner === senderID ? "send-text" : 'receive-text'}>{message}</p>
                              <h6 className='current-time' >{updatedAt ? dateFormat(updatedAt, 'hh:MM') : dateFormat(new Date(), "hh:MM")}</h6>
                            </div>
                          )
                        })}
                        <div ref={scrollMsg} />
                      </>
                    ) : null
                  }

                </div>
                <form className='input-form' onSubmit={sendmessage} autoComplete='off'>
                  <input type="text" name='message' placeholder='Type something .........' value={message} onChange={(e) => setmessage(e.target.value)} />
                  <input type="submit" className='msgBtn' id='msgs' hidden />
                  <label htmlFor="msgs"><MdSend fontSize={'1.9rem'} /></label>
                </form>
              </div>
            ) : (
              <div className="chat-area chat-welcome hidden-on-mobile">
                <div className="welcome-text">
                  <h3>Select a user to start chatting</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </center >
    </>
  )
}

export default Chat