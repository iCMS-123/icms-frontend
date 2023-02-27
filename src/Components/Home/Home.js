import React from "react";
import "./Home.css";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import ICMSTitle from "../ICMSTitle/ICMSTitle"
const Home = () => {
  useDocumentTitle("Home");

  return (
    <div className="home-hero text-center">
      <ICMSTitle/>
      <h1 className="text-center mb-2">Welcome to iCMS</h1>
      {/* <p className="h6">A Single Tool to Manage Entire Institute</p> */}
      {/* <p className="h6">ERP Solution for Seamless Management of College</p> */}
      <h6>
        Cloud Hosted and Mobile-Ready Education CRM Education ERP and CRM
        software for the Administration of Schools, Colleges and Universities{" "}
      </h6>
      <Image
        id="college-img"
        src={require("../../assets/images/collegebg.jpg")}
        alt="college-bg"
      />
      <Link to="/login">
        <Button className="btn btn-dark get-started-btn"> Get Started</Button>
      </Link>
      <br />
      <br />
      <br />
    </div>
  );
};

export default Home;
