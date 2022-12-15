import React from 'react'
import './Home.css'
import useDocumentTitle from '../../Hooks/useDocumentTitle'
import { Link } from 'react-router-dom';
const Home = () => {
    useDocumentTitle('Home');
 
 
  return (
     <div className='home-hero text-center'>

        <h1 className='text-center'>Welcome to iCMS</h1>
         <p className='text-center'>iCMS sabki maa chod dega.. Sabse mast project hai.... 
         <br/> 
         Samjhaa Birendra Bhen ke Lode</p>

        <Link to='/login'><button className='btn btn-dark'> Login/Signup </button></Link>
        
        

     </div>
  )
}

export default Home