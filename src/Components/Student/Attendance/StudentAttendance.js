import { useState, useEffect } from "react";
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


const StudentAttendance = () => {
  let icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
  let userData = icmsUserInfo.data;
  console.log(userData);
  let subjectsAttendanceData = userData.attendanceData;
  // sort all the attendance data by date
  subjectsAttendanceData?.forEach((subject)=>{
    subject.subjectAttendance = subject.subjectAttendance.sort((a, b) => moment(a.date).diff(moment(b.date)));
  })
  const [activeSubject, setActiveSubject] = useState(subjectsAttendanceData[0].subjectName);
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
  useEffect(() => {
    updateLineChart(0);
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
        text: `Attendance of last 5 days of ${activeSubject}` ,
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
        text: `Attendance of last 30 days of ${activeSubject}`,
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
      {subjectsAttendanceData.map((subject, ind) => {
        return (
          <button
            key={ind}
            onClick={(e) => {
              updateLineChart(ind);
            }}
            type="button"
            className="btn btn-dark mx-1 mb-2"
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
