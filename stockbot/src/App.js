import './App.scss';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import InputForm from './InputForm';
import Popup from './Popup.js'
import Notification from './Notification.js'
import Results from './Results';
import Plot from './Plot'
import TestPanel from './TestPanel.js'
import { Oval } from 'react-loader-spinner'
import { motion, AnimatePresence } from "framer-motion";
import { BiPencil } from 'react-icons/bi'
import { BsSearch } from 'react-icons/bs'
import { GoArrowRight } from 'react-icons/go'
import { LiaTimesSolid } from 'react-icons/lia'
import Testing from './Testing'

export default function App() {
  const [firstRender, setFirstRender] = useState(true)
  const [loading, setLoading] = useState(false)
  const [stockData, setStockData] = useState([])
  const [echoData, setEchoData] = useState([])
  const [predictionData, setPredictionData] = useState([])
  const [shouldPopup, setShouldPopup] = useState(false)
  const [status, setStatus] = useState("")
  const [shouldNotify, setShouldNotify] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [mse, setMse] = useState(null)
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
  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); 
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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
  useEffect(()=>{   // dont let user scroll if an error popped up
    if (shouldNotify) {
        document.body.style.overflow='hidden'
    }
    else {
        document.body.style.overflow='auto'
    }
  }, [shouldNotify])
  const runEcho = async(data) => {
    try {
        setStatus('loading')
        const res = await axios.post(`${connection}/run_echo`, 
          { data:data.result
        })
        if (res.data) {
          console.log(res.data)
          setMse(res.data.mse)
          setEchoData(res.data.predictions[0])
          setStatus('success')
        }
    } catch(e) {
        setStatus('error')
        setErrorMessage(`From run_echo: ${e.message}`)
    } 
  }
  const futurePred = async(data) => {
    try {
      if (data&&data.result.length>=100) {
        const res = await axios.post(`${connection}/future_pred`, 
          { data:data.result
        })
        if (res.data) {
          console.log(res.data)
          setPredictionData(res.data.result)
          if (data.result.length < 200) {
            setStatus('success')
          }
        }
      }
      else {
        setErrorMessage("Ensure the data being passed has at least 100 items in the console.")
      }
    } catch(e) {
        setStatus('error')
        setErrorMessage(`From future_pred: ${e.message}`)
    } 
  }
  const grabData = async(data) => {
    setStatus('loading')
    try {
      setLoading(true)
      const res = await axios.post(`${connection}/grab_data`, 
      {symbol:data.symbol, 
       start_date:data.startDate, 
       end_date:data.endDate, 
       intervals:data.intervals})
      if (res.data) {
        console.log(res.data)
        setStockData(res.data) 
        futurePred(res.data)
        if (res.data.result.length >= 200) {
          runEcho(res.data)
        } 
      }
    } catch(e) {
      setStatus('error')
      if (Object.values(inputData).every(value => value !== null && value !== undefined && value !== '')) {
        setErrorMessage(e.message)
      } else {
        setErrorMessage("Ensure that all input fields have valid content.")
      }
    }
  }
  const handleSubmit = (data) => {  // passed to inputForm
      if (data.symbol && data.startDate && data.endDate && data.intervals) {
        setInputData(data)  // for testing if needed
        grabData(data)
      } else {
        setStatus("error")
      }
  }
  useEffect(()=> {  // for loading status bar
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
  useEffect(()=> {  // for loading error popup 
    if (errorMessage && errorMessage.length> 0) {
      setShouldNotify(true)
    }
  }, [errorMessage])
  useEffect(()=> {  // for loading prediction 
    setLoading(false)
    if (predictionData && predictionData.length>0 && status==='success') {
      setShowResult(true)
    } 
  }, [predictionData, status])
  useEffect(()=> {  // for hiding prediction when error is brought up
    if (shouldNotify) {
      setShowResult(false)
    }
  }, [shouldNotify])
   return (
    <div className='main-content'>
      <div className={`main-content-container`}>
        {<AnimatePresence>
          { // gives error message
            (shouldNotify)&&
            <Popup prompt={'error'} message={errorMessage} onClose={()=>handleClose()}/>
          }
        </AnimatePresence>
        }
        <section id="top" className='main-content-section'> 
        <div className={` main-content-wrapper ${shouldNotify?'inactive-landing-container':(!firstRender)?'active-container':''}`}>
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
            <InputForm onHandleSubmit={(formData)=>handleSubmit(formData)}/>
          </div>
        </div>
    
        </section>

		<section id="about">
			<div class="about-grid">
				<div class="title">
					<p>About Echo State Networks(ESNs)</p>
				</div>
				<div class="about-card">
					<div class="about-card-content">
						<p>Inputs come in and they are connected randomly to the hidden layer (AKA the reservoir)
						<hr/>
							<p>key hypeparameter:</p>
							<p>spectral radius - how much the value of the input weights effect the output</p>
						</p>
					</div>
				</div>
				<div class="about-card">
					<div class="about-card-content">

						<p>
							The reservoir has its nodes randomly and sparsely connected. Which creates an embedding of many different transformations.
							<hr/>
							<p>Imagine selecting a bunch of features all at once. More neurons = more features to combine.</p>
						</p>
					</div>
				</div>
				<div class="about-card">
					<div class="about-card-content">
						<p>This output layer learns the embedding/combination of transformations through backpropagation between itself and the resevoir.</p>
					</div>
				</div>

				<div class="about-info">
					<ul>
						<li>The idea behind ESNs is having a reservoir that gets learned only at the output layer</li>
						<li>This leads faster learning time because no need for backpropagation through hidden layers</li>
						<li>Hover the image for more details!</li>
					</ul>
				</div>

			</div>
			{/* <Testing/> */}
		</section>

        <AnimatePresence>     
          {(shouldPopup && status.length > 0)&&  // gives request status
            <Notification status={status} onClose={()=>closePopup()}/>
          }
        </AnimatePresence>
        <section id="mid" className='main-content-results'>
            <div className='header-container' style={{marginLeft: "8vw"}}>
              <span className='test-text-container' onClick={()=>handleTest()}>
                <p className='header-text'>
                  Prediction Results
                </p>
              </span>
              {(inputData)&&
                <p className='header-subtext'>
                  {`Viewing data collected from ${formatDate(inputData.startDate)} - ${formatDate(inputData.endDate)}.`} 
                </p>
              }
            </div>
           
          <div style={{minWidth:'100vw', display:"flex"}}>
            <AnimatePresence>
              {(echoData && echoData.length > 0 && mse)&&
                <Plot echoData={echoData} stockData={stockData.result.slice(0,200)} inputData={inputData}/>
              }
            </AnimatePresence>
            <div className='prediction-results-container-alt'>
              {(predictionData && predictionData.length>0 && mse)&&
              <AnimatePresence>
                {(showResult)&&
                  <Results data={predictionData} input={stockData.result} error={mse} onClose={()=>setShowResult(false)}/>
                }
              </AnimatePresence>
              }
            </div>
          </div>
        </section>
      </div>
    </div>

  )
}
