import React, { useState, useEffect, useRef } from 'react'
import "./Popup.scss"
import { motion } from "framer-motion";

export default function Popup({ prompt, message, onClose }) {
    // this is the box that renders when an error message is sent back
    function handleClose() {
      onClose()
    }
    const modalRef = useRef(null);
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
          handleClose();
      }
  };
  useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      };
  }, []);
    return (
          <motion.div
              ref={modalRef}
              className="notification-container"
              initial={{ scale: 0}}
              animate={{ scale: 1}}
              exit= {{ opacity:0 }}
              transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
          }}
      >
          <div className={"notification-header "}>
          <p className={"notification-header-text"}>
              Feature Unavailable
          </p>
          <div className="notification-header-subtext-container">
              <p className={"notification-header-subtext"}>
                  {(prompt==="error")?`An error occured, please check the logs of the backend server for more information.`:
                  `This feature is currently unavailable, please check back again soon.`}
              </p>
              <p className={"notification-header-subtext"}>
                {message}
              </p>
          </div>
          <div className="notification-footer-container">
              <span className="notification-footer-button" onClick={()=>handleClose()}> 
                  <p className="notification-footer-button-text">
                      Got it
                  </p>
              </span>
          </div>
          </div>
      </motion.div>
    )
  }