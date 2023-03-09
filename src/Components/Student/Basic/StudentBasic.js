import React from "react";
import "./StudentBasic.css";
import {AiOutlineArrowRight , AiOutlineUser} from "react-icons/ai";
import {BsSpeedometer2} from "react-icons/bs";
import {GiTeacher} from "react-icons/gi";
import studentWelcomeImg from "../../../assets/images/student-wave.png";
const StudentBasic = () => {
  let icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
  let userData = icmsUserInfo.data;
  console.log(userData);

  return (
    <div className="student-basic-container">
      <div className="card welcome-card">
        <div className="card-body welcome-card-body">
          <div>
            <h1 className="card-subtitle mb-2">
              Welcome Back 👋, {userData.firstName || userData.user.firstName}{" "}
            </h1>
            <p className="card-text">
              Your progress this week is awesome ! Let's keep it up.
            </p>
          </div>

          <div className="welcome-image">
            <img className="img-fluid" src={studentWelcomeImg} alt="student-waving-img" />
          </div>
        </div>
      </div>

      <div className="main-cards-container">

  <div className="card attendance-card">
        <div className="card-body text-center">
          <h5   className="card-title mb-3 d-flex align-items-center justify-content-center"><AiOutlineUser/> &nbsp;  Attendance &nbsp;&nbsp;<AiOutlineArrowRight/></h5>
          <p className="card-text">
          <span className="h1">90% ( 18/20 )</span> 
          </p>
          <p>
            Total Sessions Done
          </p>
          </div>
      </div>
   
      <div className="card gpa-card">
        <div className="card-body text-center">
          <h5 className="card-title mb-3 d-flex align-items-center justify-content-center"><BsSpeedometer2/> &nbsp; GPA &nbsp;&nbsp;<AiOutlineArrowRight/></h5>
          <p className="card-text">
          <span className="h1">8.3</span> 
          </p>
          <p>
            Keep it up !
          </p>
          </div>
      </div>

       
      <div className="card my-teachers-card">
        <div className="card-body text-center">
          <h5 className="card-title mb-3 d-flex align-items-center justify-content-center"><GiTeacher/> &nbsp; My Teachers &nbsp;&nbsp;<AiOutlineArrowRight/></h5>
          <p className="card-text">
          <span className="h1">7</span> 
          </p>
          <p>
            View details
          </p>
          </div>
      </div>

      {/* similarly my courses card */}

      </div>



    </div>
  );
};

export default StudentBasic;
