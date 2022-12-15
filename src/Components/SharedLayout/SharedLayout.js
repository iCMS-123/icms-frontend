import React from 'react'
import { Outlet , Link} from 'react-router-dom'
import './SharedLayout.css'
const SharedLayout = () => {
  return (
    <div className='container border border-primary'>
    <Link to='/'><div className='h1 text-center'>iCMS - Innovative College Management System</div></Link>
    
    <Outlet/>
    </div>
  )
}

export default SharedLayout