import React, {useState, useEffect, useContext} from 'react'
import './TestPanel.scss'
import {MdTipsAndUpdates} from 'react-icons/md'
import {FiSettings,FiTrendingUp} from 'react-icons/fi'
import {AiOutlineStock} from 'react-icons/ai'
import {BsStars} from 'react-icons/bs' 
import {BsFillSuitHeartFill} from 'react-icons/bs'
import {HiSpeakerphone,HiTrendingUp} from 'react-icons/hi'
import {FaShoppingBasket} from 'react-icons/fa'

export default function TestPanel({data, onGrabData, onRunEcho, onPredict}) {

    return (
        <div className={`side-navigation`}>
            <div className="navigation-item-container">
                    <span className="navigation-item" onClick={()=>onGrabData()}>
                        <FaShoppingBasket className='cart-side-icon'/>
                    </span>
                    <p className="navigation-item-text">
                        Grab Data
                    </p>
                </div>
                <div className="navigation-item-container">
                    <span className="navigation-item" onClick={()=>onRunEcho()}>
                        <HiSpeakerphone className='feedback-icon'/>
                    </span>
                    <p className="navigation-item-text">
                        Run Echo
                    </p>
                </div>
                <div className="navigation-item-container">
                    <span className="navigation-item" onClick={()=>onPredict()}>
                        <BsStars className='archive-icon'/>
                    </span>
                    <p className="navigation-item-text">
                        Prediction
                    </p>
                </div>
        </div>
    )
}