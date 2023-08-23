import React, { useState, useEffect, useRef } from 'react'
import "./Notification.scss"
import { motion } from "framer-motion";
import {BsCheckLg} from 'react-icons/bs'
import {BiTimeFive} from 'react-icons/bi'
import { LiaTimesSolid,LiaHourglass } from 'react-icons/lia'

export default function Notification ({ status, onClose }) {
    // this is the tab at the bottom that renders when a request goes off
    return (
          <motion.div
              className="popup-container"
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              exit= {{ opacity:0 }}
              transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
          }}
      >
          <div className={`popup-wrapper ${status}-wrapper`}>
            <div className="popup-text-container">
                <p className={"popup-text"}>
                    {(status==="success")?'Response successfully received.':
                    (status==="loading")?"Processing request...":
                    "An error occured."}
                </p>
            </div>
            <span className='exit-icon-container' onClick={()=>onClose()}>
                {(status==='success')?
                <BsCheckLg className='exit-icon'/>:
                (status==='loading')?
                <BiTimeFive className='exit-icon'/>:
                <LiaTimesSolid className='exit-icon'/>
                }
            </span>
          </div>
      </motion.div>
    )
  }