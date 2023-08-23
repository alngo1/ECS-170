import './App.scss';
import './InputForm.scss';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Popup from './Popup.js'
import { Oval } from 'react-loader-spinner'
import { motion, AnimatePresence } from "framer-motion";
import { BiPencil } from 'react-icons/bi'
import { BsSearch,BsCalendarDate,BsFillCalendar2DateFill } from 'react-icons/bs'
import { GoArrowRight } from 'react-icons/go'
import { MdDateRange } from 'react-icons/md'
import { LiaTimesSolid } from 'react-icons/lia'
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs'

const DatePicker = ({ value, type, onSelect, onClose }) => {
    const [newDate, setNewDate] = useState(value.length>0?dayjs(value):dayjs())
    function handleChange(selected) {   
        setNewDate(selected)
        onSelect(type, selected)
    }
    const modalRef = useRef(null);
    const handleOutsideClick = (event) => {  // closes and unblurs the screen 
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };
    useEffect(() => {   // trigger the above if you click outside the calender
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    return (
        <DateCalendar value={value.length>0?dayjs(value):dayjs(newDate)} 
        onChange={(selected) => handleChange(selected)} showDaysOutsideCurrentMonth
        fixedWeekNumber={6} ref={modalRef}/>
    )
}
export default function InputForm({ onHandleSubmit }) {
    const [openStart, setOpenStart] = useState(false)
    const [openEnd, setOpenEnd] = useState(false) 
    // ensures date is in form 'YYYY-MM-DD'
    const dateRegex = /^(?:19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    // what actually gets submitted
    const [formData, setFormData] = useState({
        symbol:'',
        startDate:'',
        endDate:'',
        intervals:''
    })
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
    }
    const handleDateChange = (name, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: dateRegex.test(date)?date:formatDate(new Date(date))
        }))
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name === "startDate" || name === 'endDate') { // refresh the calender when input is switched
            setOpenStart(false)
            setOpenEnd(false)
        }
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };
    const handleSubmit = () => {
        console.log(formData)
        onHandleSubmit(formData)
    };
    function handleClose() {
        setOpenStart(false)
        setOpenEnd(false)
    }
    // opens respective calenders
    useEffect(()=> {
        if (openStart) {
            setOpenEnd(false)
        }
    }, [openStart])
    useEffect(()=> {
        if (openEnd) {
            setOpenStart(false)
        }
    }, [openEnd])
    return (
        <div className='input-form-container '>
            <div className='form-content'>
                <div className='fields-container'> 
                    <div className='input-container'>
                        <p className='input-header-text'>
                            Ticker Symbol 
                        </p>
                        <div className='input-wrapper'>
                            <input className='input-content'
                            type="text"
                            name="symbol"
                            value={formData.symbol.toUpperCase()}
                            onChange={(e)=>handleInputChange(e)}
                            placeholder='Enter a valid ticker symbol...'/>
                        </div>
                    </div>
                    <div className='input-date-container'>
                        <div className='start-date-container'>
                            <p className='input-header-text-alt'>
                            Start Date 
                            </p>
                            <div className='input-wrapper'>
                                <input className='input-content-alt '
                                type='text'
                                name="startDate"
                                value={formData.startDate}
                                onChange={(e)=>handleInputChange(e)}
                                placeholder='YYYY-MM-DD'/>
                                <span className='calender-icon-wrapper' 
                                    onClick={()=>setOpenStart(!openStart)}>
                                    <BsFillCalendar2DateFill className='calender-icon'/>   
                                </span>
                            </div>
                        </div>
                        <div className='end-date-container'>
                            <p className='input-header-text-alt'>
                            End Date 
                            </p>
                            <div className='input-wrapper'>
                                <input className='input-content-alt'
                                    type='text'
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={(e)=>handleInputChange(e)}
                                    placeholder='YYYY-MM-DD'/>
                                    <span className='calender-icon-wrapper' 
                                    onClick={()=>setOpenEnd(!openEnd)}>
                                    <BsCalendarDate className='calender-icon-alt'/>   
                                    </span>
                            </div>
                        </div>
                    </div>
                    <div className='input-container'>
                        <p className='input-header-text'>
                        Interval
                        </p>
                        <div className='input-wrapper'>
                            <input className='input-content'
                                type='text'
                                name="intervals"
                                value={formData.intervals}
                                onChange={(e)=>handleInputChange(e)}
                                placeholder='Enter a valid interval...'/>
                        </div>
                    </div>
                    <span className='submit-button' 
                    role='button'
                    tabIndex={'0'}
                    onClick={()=>handleSubmit()}>
                        <p className='submit-text'>
                            Submit
                        </p>
                        <GoArrowRight className="button-icon"/>
                    </span>
                </div>
            </div>
            {
                <div className={`${(openStart || openEnd)?'calender-container':'calender-container-alt'}`}>
                    {
                    <DatePicker 
                        value={(openStart)?formData.startDate:formData.endDate} 
                        type={(openStart)?'startDate':'endDate'}
                        onSelect={(name, selected)=>handleDateChange(name, selected)}
                        onClose={()=>handleClose()}/>
                    }
                </div>
            }
        </div>
    )
}
