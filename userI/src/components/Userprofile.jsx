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
                    <div className='circle'>
                        <p className='letter'>{name[0].toUpperCase()}</p>
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