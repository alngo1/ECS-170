import './App.scss';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import InputForm from './InputForm';
import Popup from './Popup.js'
import Notification from './Notification.js'
import TestPanel from './TestPanel.js'
import { Oval } from 'react-loader-spinner'
import { motion, AnimatePresence } from "framer-motion";
import { BiPencil } from 'react-icons/bi'
import { BsSearch } from 'react-icons/bs'
import { GoArrowRight } from 'react-icons/go'
import { LiaTimesSolid } from 'react-icons/lia'

export default function App() {
  const [firstRender, setFirstRender] = useState(true)
  const [loading, setLoading] = useState(false)
  const [stockData, setStockData] = useState([])
  const [echoData, setEchoData] = useState([])
  const [predictionData, setPredictionData] = useState([])
  const [shouldPopup, setShouldPopup] = useState(false)
  const [status, setStatus] = useState("")
  const [shouldNotify, setShouldNotify] = useState(false)
  const [inputData, setInputData] = useState({
    symbol:'',
    startDate:'',
    endDate:'',
    intervals:''
  })
  const [errorMessage, setErrorMessage] = useState(``)
  const connection = process.env.REACT_APP_API_URL
  function handleTest() {
    console.log(stockData.result)
  }
  function handleClose() {
    setFirstRender(false)
    setShouldNotify(false)
    setErrorMessage('')
  }
  function closePopup() {
    setShouldPopup(false)
    setStatus('')
  }
  useEffect(()=>{
    if (shouldNotify !== null) {
        document.body.style.overflow='hidden'
    }
    else {
        document.body.style.overflow='auto'
    }
  }, [shouldNotify])
  const runEcho = async() => {
    try {
        setStatus('loading')
        const res = await axios.post(`${connection}/run_echo`, 
          { data:stockData.result
        })
        if (res.data) {
          console.log(res.data)
          setEchoData(res.data)
          setStatus('success')
        }
    } catch(e) {
        setStatus('error')
        setErrorMessage(e.message)
    } 
  }
  const futurePred = async() => {
    try {
      setStatus('loading')
      if (stockData&&stockData.result.length>=100) {
        const res = await axios.post(`${connection}/future_pred`, 
          { data:stockData.result
        })
        if (res.data) {
          console.log(res.data)
          setPredictionData(res.data)
          setStatus('success')
        }
      }
      else {
        setErrorMessage("Ensure the data being passed has at least 100 items in the console.")
      }
    } catch(e) {
        setStatus('error')
        setErrorMessage(e.message)
    } 
  }
  const grabData = async() => {
    setStatus('loading')
    try {
      setLoading(true)
 
      const res = await axios.post(`${connection}/grab_data`, 
      {symbol:inputData.symbol, 
       start_date:inputData.startDate, 
       end_date:inputData.endDate, 
       intervals:inputData.intervals})
      if (res.data) {
        console.log(res.data)
        setStockData(res.data)
        setStatus('success')
      }
    } catch(e) {
      setStatus('error')
      setErrorMessage(e.message)
      setShouldNotify(!shouldNotify)
    }
  }
  useEffect(()=> {
    if (status.length>0) {
      setShouldPopup(true)
      if (status!=='loading') {
        setTimeout(() => {
          setShouldPopup(false)
          setStatus('')
        }, 3000);
      }
    }
  }, [status])
  useEffect(()=> {
    if (errorMessage && errorMessage.length> 0) {
      setShouldNotify(!shouldNotify)
    }
  }, [errorMessage])
  useEffect(()=> {
    if (inputData.symbol && inputData.startDate && inputData.endDate && inputData.intervals) {
      grabData()
    }
    setLoading(false)
  }, [inputData])
  return (
    <div className={`main-content-container`}>
      {<AnimatePresence>
        { // gives error message
          (shouldNotify)&&
          <Popup prompt={'missing'} message={errorMessage} onClose={()=>handleClose()}/>
        }
      </AnimatePresence>
      }
      <div className='header-blur'/>
      <div className={`main-content-wrapper ${shouldNotify?'inactive-landing-container':(!firstRender)?'active-container':''}`}>
        <div className='main-content-left'>
          <div className='header-container '>
            <span className='test-text-container' onClick={()=>handleTest()}>
              <p className='header-text'>
                Stock Price Prediction
              </p>
            </span>
            <p className='header-subtext'>
              Try our AI project with the stock {'&'} timeframe of your choice.
            </p>
          </div>
          <InputForm onHandleSubmit={(formData)=>setInputData(formData)}/>
        </div>
      </div>
      <AnimatePresence>     
         {(shouldPopup && status.length > 0)&&  // gives request status
          <Notification status={status} onClose={()=>closePopup()}/>
         }
      </AnimatePresence>
      <TestPanel data={inputData} onGrabData={()=>grabData()} onRunEcho={()=>runEcho()} onPredict={()=>futurePred()}/>
      <div className='footer-blur'/>
    </div>
  )
}
