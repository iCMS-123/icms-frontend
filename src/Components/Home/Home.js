import React from 'react'
import './Home.css'
import useDocumentTitle from '../../Hooks/useDocumentTitle'
import { Link } from 'react-router-dom';
import { Image } from "react-bootstrap";
const Home = () => {
    useDocumentTitle('Home');
 
 
  return (
     <div className='home-hero text-center'>

        <h1 className='text-center mb-5'>Welcome to iCMS</h1>
         <Image src={"../../assets/images/collegebg.jpg"} alt="college-bg" />
        <Link to='/login'><button className='btn btn-dark'> Login/Signup </button></Link>
        
        

     </div>
  )
}

export default Home