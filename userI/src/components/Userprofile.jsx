import React from 'react'
import './friendProfile.css'
import { FaRegCircleXmark } from 'react-icons/fa6'
import { FaVenus } from 'react-icons/fa';
import { BsGenderMale } from 'react-icons/bs';

function Userprofile({ pickUser, viewProfile, viewProfilefunc }) {
    const { name, email, gender } = pickUser;
    return (
        <div className={viewProfile ? 'user-Friend-Profile ' : 'user-Friend-Profile visible'}>
            <div className="friend-Profile">
                <button className='btn profilebtn' onClick={viewProfilefunc}><FaRegCircleXmark /></button>
                <div className="friend-details">
                    <div className='circle' style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua-primary), #008b8b)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--aqua-primary)' }}>
                        {pickUser.image && pickUser.image !== null && pickUser.image !== undefined ?
                            <img src={pickUser.image} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> :
                            <p className='letter' style={{ fontSize: '3rem', color: '#000', margin: 0, fontWeight: 700 }}>{name ? name[0].toUpperCase() : '?'}</p>
                        }
                    </div>
                    <h5 className='name'>Name : {name}</h5>
                    <p className='email'>Mail : {email}</p>
                    <span> {gender === 'Female' ? <FaVenus /> : <BsGenderMale />} Gender :  {gender} </span>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Userprofile);