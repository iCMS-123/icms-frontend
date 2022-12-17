import React from 'react'
import { Link} from 'react-router-dom'
import './SharedLayout.css'
const SharedLayout = () => {
  return (
    <div className='border border-primary'>
    <Link to='/'><div className='h1 text-center'>iCMS - Innovative College Management System</div></Link>
    
     
    </div>
  )
}

export default SharedLayout