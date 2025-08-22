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
    scrollMsg.current?.scrollIntoView({ behaviour: 'smooth' })
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
    e.preventDefault()
    setViewProfile(!viewProfile)
    settoggle(!toggle)
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

  return (
    <>
      <Suspense fallback={<center>...</center>}><Nav /></Suspense>
      <center>
        <div className="chat-box">
          <div className="chat-items">
            <div className={pickUser ? "chat-users width" : "chat-users-full"}>
              <h3 className='message-title'>messages</h3>
              {friends ?
                Array.isArray(friends) && friends.map(data => {
                  const { _id, name } = data
                  return (
                    <div key={_id} className={active._id === _id ? "user-chat-active" : "user-chat"} onClick={() => selectUser(data)}>
                      <div className='circle'>
                        <p className='letter'>{name[0].toUpperCase()}</p>
                      </div>
                      <h5 id='friend-name'>{name}</h5>
                      <span className={Array.isArray(online) && online.some(data => { return data.User === _id }) ? 'online' : 'offline'}></span>
                    </div>
                  )
                })
                : null
              }
              {
                loadingfriends ? <div className='select'><h3>loading ..........</h3></div> : null
              }
              {/* message area */}
            </div>
            {pickUser ?
              <div className={"chat-area"}>
                <div className="conversation">
                  <div className="det">
                    <button className='btn' onClick={() => setPickUser()}> <FaArrowAltCircleLeft fontSize={'1.3rem'} /></button>
                    <div className='circle' style={{ width: "40px", height: "40px" }}>
                      <p className='letter'>{pickUser.name[0].toUpperCase()}</p>
                    </div>
                    <h5>{pickUser.name}</h5>
                  </div>
                  <div className="details">
                    <button className='btn btn2' onClick={togglemenu}> <FaEllipsisV size={"1.3rem"} /></button>
                    <div className="det-items" id={!toggle ? 'display' : ''}>
                      <button className="btn delbtn" onClick={viewProfilefunc}>view profile</button>
                    </div>
                    <Userprofile pickUser={pickUser} viewProfilefunc={viewProfilefunc} viewProfile={viewProfile} toggle={toggle} />
                  </div>
                </div>

                <div className="messages">
                  {
                    pickUser ?
                      conversation.map((data, index) => {
                        const { senderID, receiverID, message, updatedAt } = data;
                        return (
                          <div className={owner !== receiverID ? "sender" : 'receiver'} key={index} ref={scrollMsg}>
                            <p className={owner === senderID ? "send-text" : 'receive-text'}>{message}</p>
                            <h6 className='current-time' >{updatedAt ? dateFormat(updatedAt, 'hh:MM') : dateFormat(new Date(), "hh:MM")}</h6>
                          </div>
                        )
                      }) : null
                  }

                </div>
                <form className='input-form' onSubmit={sendmessage} autoComplete='off'>
                  <input type="text" name='message' placeholder='Type something .........' value={message} onChange={(e) => setmessage(e.target.value)} />
                  <input type="submit" className='msgBtn' id='msgs' hidden />
                  <label htmlFor="msgs"><MdSend fontSize={'1.9rem'} /></label>
                </form>
              </div> : null
            }
          </div>
        </div>
      </center >
    </>
  )
}

export default Chat