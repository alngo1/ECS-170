import './Testing.scss'
import React, {useState} from 'react'
import './Testing.scss'

export default function Testing() {
  const [shouldDropdown, setShouldDropdown] = useState(false)
  return (
    <div style={{color:"white"}}>
        Testing
        <span onClick={()=>setShouldDropdown(!shouldDropdown)}>
          click me
        </span>
        {(shouldDropdown)?
            <div className='dropdown'>
              stuff
            </div>:"n"
        }
    </div>
  )
}