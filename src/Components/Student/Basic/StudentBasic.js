import React, { useState, useEffect } from "react";
import "./StudentBasic.css";
import { AiOutlineArrowRight, AiOutlineUser } from "react-icons/ai";
import { BsSpeedometer2 } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
import studentWelcomeImg from "../../../assets/images/student-wave.png";
import axios from 'axios';
import { Button, Card, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from 'moment/moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const StudentBasic = () => {
  let icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
  let userData = icmsUserInfo.data;
  console.log(userData);
  const [attendanceCountLabels, setAttendanceCountLabels] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [updatesData, setUpdatesData] = useState([]);
  let priorityMap = ["Low", "Mid", "High"];
  let priorityColorsMap = ["info", "warning", "Danger"];

  // for getting attendance
  useEffect(() => {
    const getClassroomData = async () => {
      try {
        // use get attendance by student ID
        const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-data/64006a28a96106bdcef993d6`);

        if (data && data.success) {
          let attendanceData = data.data.sectionAttendance;
          attendanceData = attendanceData.sort((a, b) => moment(a.date).diff(moment(b.date)));
          let temp1 = [];
          let temp2 = [];
          attendanceData.map((item, idx) => {
            temp1.push(item.date);
            temp2.push(item.presentStudents.length);
          })
          setDateLabels(temp1);
          setAttendanceCountLabels(temp2);
        }
      } catch (e) {
        console.log(e, "e");
      }
    };
    getClassroomData();

  }, []);

   // Chart.js code
  // for chartjs
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const lastFiveDaysOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance of last week',
      },
    },
  };
  const lastFiveDaysLabels = dateLabels.slice(-5);
  const lastFiveDaysData = {
    labels: lastFiveDaysLabels,
    datasets: [
      {
        label: 'Number of students',
        data: attendanceCountLabels.slice(-5),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  const allTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance of last 30 days',
      },
    },
  };
  const allTimeLabels = dateLabels.slice(-30);
  const alltimeData = {
    labels: allTimeLabels,
    datasets: [
      {
        label: 'Number of students',
        data: attendanceCountLabels.slice(-30),
        borderColor: "rgba(0, 191, 160, 1)",
        backgroundColor: "rgba(0, 191, 160, 0.5)",
      },
    ],
  };

  useEffect(() => {
    const getStudentUpdatesList = async () => {
      try {
        let studentID = JSON.parse(localStorage.getItem("icmsUserInfo")).data.user._id;
        // const { data } = await axios.get(`http://localhost:8002/api/v1/student/fetch-updates/${studentID}`);
        const { data } = await axios.get(`http://localhost:8002/api/v1/student/fetch-updates/6419ef7901e5b63cf6c04a0d`);

        if (data && data.success) {
          console.log(data, "student updates data");
          data.data.reverse();
          data.data = data.data.slice(0, 5);
          setUpdatesData(data.data); // for updates data
        }
      } catch (e) {
        console.log(e, "e");
      }
    };

    getStudentUpdatesList();

  }, []);

  return (
    <div className="student-basic-container">
      <div className="card welcome-card">
        <div className="card-body welcome-card-body">
          <div>
            <h1 className="card-subtitle mb-2">
              Welcome Back 👋, {userData.firstName || userData.user.firstName}{" "}
            </h1>
            <p className="card-text">
              Glad to see you back ! Let's catch up.
            </p>
          </div>

          <div className="welcome-image">
            <img className="img-fluid" src={studentWelcomeImg} alt="student-waving-img" />
          </div>
        </div>
      </div>

      <div className="main-cards-container">
        <div className="cards-left-container">
          <div className="card attendance-card">
          <div className="card-body">
            <Line options={lastFiveDaysOptions} data={lastFiveDaysData} />
          </div>
        </div>
        <div className="card attendance-card">
          <div className="card-body">
          <Line options={allTimeOptions} data={alltimeData} />
          </div>
        </div>
        </div>
        

        {/* <div className="card my-teachers-card">
          <div className="card-body text-center">
            <h5 className="card-title mb-3 d-flex align-items-center justify-content-center"><GiTeacher /> &nbsp; My Teachers &nbsp;&nbsp;<AiOutlineArrowRight /></h5>
            <p className="card-text">
              <span className="h1">7</span>
            </p>
            <p>
              View details
            </p>
          </div>
        </div> */}


        <div className="card updates-card">
          <div className="card-body">
            <h5 className="card-title mb-3 d-flex align-items-center">
              <BsSpeedometer2 className="me-2" /> Updates <AiOutlineArrowRight className="ms-2" />
              <Link to="student-updates" className="text-muted h6 ms-auto">View All</Link>
            </h5>
            <p className="card-text">
              {
                (updatesData.length == 0) && <h6 className="text-muted">You are all caught up! No updates for now.</h6>
              }
              {updatesData.length != 0 &&
                updatesData?.map((item, index) => (
                  <Link to={"student-updates#" + item._id} style={{ textDecoration: 'none', color: 'black' }}>
                    <Card className="mb-2 updatesCards" key={index}>
                      <Card.Body>
                        <div style={{ display: 'flex' }} className="mb-2">
                          <Image src={item.createdBy.profileImg} className="me-3 rounded-circle" style={{ height: '40px', width: '40px' }} />
                          <span style={{ display: 'flex', flexDirection: 'column' }}>
                            <b>{item.createdBy.firstName + " " + item.createdBy.lastName}</b>
                            {item.createdBy.isSectionHead && <span className="mb-2 text-muted">Section Head </span>}
                          </span>
                        </div>
                        <Card.Title>{item?.msgTitle || ""}</Card.Title>
                        <p>{item?.msgBody || ""}</p>
                        <Badge bg={priorityColorsMap[item.priority]} style={{ position: 'absolute', top: '10px', right: '30px' }}>
                          {priorityMap[item.priority]}
                        </Badge>
                        <Badge bg="dark" style={{ position: 'absolute', bottom: '10px', right: '30px' }}>
                          {item.type.toUpperCase()}
                        </Badge>
                        <div className="gocorner" href="#">
                          <div className="goarrow">→</div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                ))}
            </p>
          </div>
        </div>

        {/* similarly my courses card */}

      </div>



    </div>
  );
};

export default StudentBasic;
