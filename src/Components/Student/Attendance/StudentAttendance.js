import { useState, useEffect } from "react";
import axios from "axios";
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
import { Card } from "react-bootstrap";
import { url } from '../url'


const StudentAttendance = () => {
  let icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
  let userData = icmsUserInfo.data;
  let userID = userData.user._id;
  const [subjectsAttendanceData, setSubjectsAttendanceData] = useState();
  const [activeSubject, setActiveSubject] = useState();
  const [attendanceCountLabels, setAttendanceCountLabels] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  function updateLineChart(index) {
    setActiveSubject(subjectsAttendanceData[index].subjectName);
    let attendanceData = subjectsAttendanceData[index].subjectAttendance;
    let temp1 = [];
    let temp2 = [];
    attendanceData?.forEach((item, idx) => {
      temp1.push(item.date);
      temp2.push(item.status);
    })
    setDateLabels(temp1);
    setAttendanceCountLabels(temp2);
  }
  
  useEffect( ()=>{
    const fetchAttendance = async () => {
    try{
            let data = await axios.get(`${url}/api/v1/section/fetch-attendance-student-id/${userID}`)
            console.log(data.data.data, "subjectsAttendanceData");
            let receivedData = data.data.data;
              // sort all the attendance data by date
            receivedData.forEach((subject)=>{
              subject.subjectAttendance = subject.subjectAttendance.sort((a, b) => moment(a.date).diff(moment(b.date)));
            })
            setSubjectsAttendanceData(receivedData);
          }catch(err){
            console.log(err);
        }
    }
    fetchAttendance();
    
  }, []);

  useEffect(()=>{
    if(subjectsAttendanceData){
      updateLineChart(0);
    }
  }, [subjectsAttendanceData])

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
        text: `Attendance of last 5 classes of ${activeSubject}` ,
      },
    },
  };
  const lastFiveDaysLabels = dateLabels.slice(-5);
  const lastFiveDaysData = {
    labels: lastFiveDaysLabels,
    datasets: [
      {
        label: 'Present/Absent',
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
        text: `Attendance of last 30 classes of ${activeSubject}`,
      },
    },
  };
  const allTimeLabels = dateLabels.slice(-30);
  const alltimeData = {
    labels: allTimeLabels,
    datasets: [
      {
        label: 'Present/Absent',
        data: attendanceCountLabels.slice(-30),
        borderColor: "rgba(0, 191, 160, 1)",
        backgroundColor: "rgba(0, 191, 160, 0.5)",
      },
    ],
  };
   

  return (
    <div className="attendance-container" style={attendanceContainer}>
      <h4>Subjects</h4>
      {subjectsAttendanceData?.map((subject, ind) => {
        return (
          <button
            key={ind}
            onClick={(e) => {
              updateLineChart(ind);
            }}
            type="button"
            className="btn btn-dark btn-sm mx-1 mb-2"
            style={subjectButton}
          >
            {subject.subjectName} {`(${subject.subjectCode})`}
          </button>
        );
      })}
      <Card style={cardStyles} className='mb-3'>


<Card.Body>

 
      <Line style={chartStyles} options={lastFiveDaysOptions} data={lastFiveDaysData} />
</Card.Body>
</Card>
      <Card style = {cardStyles} className='mb-3' >


<Card.Body>

      <Line style={chartStyles} options={allTimeOptions} data={alltimeData} />
 
</Card.Body>
</Card>
    </div>
  );
};

export default StudentAttendance;

const attendanceContainer = {
  margin: "20px",
};
const cardStyles= {
  width : '100%',
  padding : '10px',
  margin : '10px',
}
const chartStyles = {
 height : '500px',
}

const subjectButton = {
  borderRadius: "20px",
};
