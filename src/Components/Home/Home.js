import React from "react";
import "./Home.css";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import ICMSTitle from "../ICMSTitle/ICMSTitle"
const Home = () => {
  useDocumentTitle("Home");

  return (
    <div className="home-hero">
      <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', position: 'relative', top: '10px', left: '10px' }} />

      <ICMSTitle />
      {/* <h1 className="text-center mb-2">Welcome to iCMS</h1> */}
      {/* <p className="h6">A Single Tool to Manage Entire Institute</p> */}
      {/* <p className="h6">ERP Solution for Seamless Management of College</p> */}

      <div className="text-center">
        <h6 className="text-center mt-2 mb-5" style={{ margin: '0 15%' }}>
          Cloud Hosted and Mobile-Ready Education CRM Education ERP and CRM
          software for the Administration of Schools, Colleges and Universities{" "}
        </h6>
        <Link to="/login">
          <Button className="btn btn-dark get-started-btn"> Get Started</Button>
        </Link>
      </div>
      <Image
        className="mt-2"
        id="college-img"
        src={'/images/jssImage.png'}
        alt="college-bg"
      />

    </div>
  );
};

export default Home;
