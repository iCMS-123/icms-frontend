import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card, InputGroup, Form } from "react-bootstrap";
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk, FaBookOpen, FaCalendar, FaUsers } from 'react-icons/fa';
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import axios from 'axios';
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

export const Basic = () => {
  // For attendance
  const [attendanceCountLabels, setAttendanceCountLabels] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [activeSubject, setActiveSubject] = useState();
  useDocumentTitle("Dashboard");
  const navigate = useNavigate();
  let userData;
  let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
  if (icmsLocalStorageData === null) {
    navigate("/login");
  } else {
    userData = icmsLocalStorageData?.data;
  }
  let currUser = userData._id;
  let isHod = userData.isHod;
  let isSectionHead = userData.isSectionHead;
  // for reference 
  // let branchName = userData.branchName || userData.user.branchName; 
  // for section head
  const [sectionHeadSubjects, setSectionHeadSubjects] = useState([]);
  // for normal teacher
  const [subjectAndSectionID, setSubjectAndSectionID] = useState([]);
  // for HOD
  const [sectionList, setSectionList] = useState([]);

  function updateDateAndAttendanceState(attendanceData) {
    let temp1 = [];
    let temp2 = [];
    attendanceData = attendanceData.sort((a, b) => moment(a.date).diff(moment(b.date)));
    attendanceData?.forEach((item) => {
      temp1.push(item.date);
      temp2.push(item.presentStudents.length);
    })
    setDateLabels(temp1);
    setAttendanceCountLabels(temp2);
  }
  async function updateLineChart(index) {
    // this flow is for normal teacher
    if ((!isHod && !isSectionHead) || (isHod && !isSectionHead)) {
      console.log(subjectAndSectionID[index])
      let subjectId = subjectAndSectionID[index].subjectId;
      let sectionId = subjectAndSectionID[index].sectionId;

      setActiveSubject(subjectAndSectionID[index].subjectName);
      try {
        let { data } = await axios.get(`http://localhost:8002/api/v1/section/get-attendance-subject-section-id?sectionId=${sectionId}&subjectId=${subjectId}`);
        let attendanceData = data.data[0].attendance;
        updateDateAndAttendanceState(attendanceData);
      } catch (err) {
        console.log(err);
      }
    }
    else if (isSectionHead && !isHod) {
      // for section head
      let subject = sectionHeadSubjects[index];
      setActiveSubject(subject.subjectName);
      updateDateAndAttendanceState(subject.attendance);
    }
  }

  async function selectedSectionChanged(sId) {
    console.log(sId, "sel sec changed");
    fetchSubjectsForSection(sId)
  }

  async function fetchSubjectsForSection(sId) {
    try {
      const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-subject-list/${sId}`);

      if (data && data.success){
        let temp = data.data;
          let obj = [];
          temp.forEach((item) => {
            obj.push({
              subjectName: item.subjectName,
              subjectId: item.subjectId,
              sectionId: sId,
            });
          });
          console.log(obj);
          setSubjectAndSectionID(obj);
      }
    } catch (e) {
      console.log(e, "e");
    }
  }

  useEffect(() => {
    if (subjectAndSectionID.length > 0 || sectionHeadSubjects.length > 0) {
      updateLineChart(0);
    }
  }, [subjectAndSectionID, sectionHeadSubjects])
  useEffect(() => {
    const getClassroomData = async () => {
      if (!isHod && !isSectionHead) {
        try {
          const { data } = await axios.get(`http://localhost:8002/api/v1/teacher/fetch-subjects/${currUser}`);
          console.log(data.data);
          let temp = data.data;
          let obj = [];
          temp.forEach((item) => {
            obj.push({
              subjectName: item.subjectName,
              subjectId: item.subjectId,
              sectionId: item.sectionId._id,
            });
          });
          console.log(obj);
          setSubjectAndSectionID(obj);

        } catch (err) {
          console.log(err);
        }
      }
      else if (isSectionHead && !isHod) {
        try {
          const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-data/${currUser}`);

          if (data && data.success) {
            let attendanceData = data.data.sectionSubject;
            console.log(attendanceData, "attendanceData");
            setSectionHeadSubjects(attendanceData);
          }
        } catch (e) {
          console.log(e, "e");
        }
      }
      else {
        console.log(userData.branchName || userData.user.branchName);
        try {
          const { data } = await axios.get(`http://localhost:8002/api/v1/hod/get-list-section?branchName=${userData.branchName || userData.user.branchName}`);

          if (data && data.success) {
            console.log(data, "sectionList HOD");
            setSectionList(data);
          }
        } catch (e) {
          console.log(e, "e");
        }
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
        text: `Attendance of last 5 days of ${activeSubject}`,
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
        text: `Attendance of last 30 days of ${activeSubject}`,
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
  return (
    <div>

      <div style={{ display: 'flex' }} >
        <div className="basic-left" style={{ flex: 1, padding: '0px 10px' }}>

          <Card style={{ margin: '0 10px', minHeight: "350px" }}>
            <Card.Img style={{ objectFit: 'contain', padding: '5px', width: '200px', margin: '0 auto', height: '175px' }} variant="top" src="https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png" />
            <Card.Body>
              <Card.Title className='text-center'>Welcome back <strong>{userData?.firstName || userData?.user.firstName}</strong> !</Card.Title>
              <Card.Text>
                Start your day by marking attendance or by checking active issues if any.
              </Card.Text>

            </Card.Body>
          </Card>

          <Card className='mb-3' style={{ margin: '15px 10px', minHeight: "300px" }}>
            <Card.Body>
              <h4>Notifications</h4>

              <p>You are all caught up! There are currently no new notifications.</p>

            </Card.Body>
          </Card>



          {/* Graph for attendance */}

        </div>

        <div className="basic-right" style={{ flex: 2 }}>

          <Card className='mb-3' style={{ minHeight: "350px" }}>
            <Card.Body>
              {
                isHod && <>
                  {/* Section Picker */}
                  <Form.Group className="mb-2" controlId="formFirstName">
                    <Form.Label className="text-muted">Section for marking attendance</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1"><FaUsers /></InputGroup.Text>

                      {(sectionList.length == 0 || (sectionList?.firstYear?.length + sectionList?.secondYear?.length + sectionList?.thirdYear?.length + sectionList?.fourthYear?.length) < 1) && <p className="text-muted m-1">No section available!</p>}

                      <Form.Select style={{ display: ((sectionList?.firstYear?.length + sectionList?.secondYear?.length + sectionList?.thirdYear?.length + sectionList?.fourthYear?.length) > 0) ? '' : 'none' }}
                        onChange={e => selectedSectionChanged(e.target.value)}
                        aria-label="Default select example" required>

                        <option value="">Select Section</option>
                        <option disabled>First Year</option>
                        {sectionList?.firstYear?.length != 0 && sectionList?.firstYear?.map((option, index) => (
                          <option key={index} value={option._id}>
                            {option.sectionName}
                          </option>
                        ))}
                        <option disabled>Second Year</option>
                        {sectionList?.secondYear?.length != 0 && sectionList?.secondYear?.map((option, index) => (
                          <option key={index} value={option._id}>
                            {option.sectionName}
                          </option>
                        ))}
                        <option disabled>Third Year</option>
                        {sectionList?.thirdYear?.length != 0 && sectionList?.thirdYear?.map((option, index) => (
                          <option key={index} value={option._id}>
                            {option.sectionName}
                          </option>
                        ))}
                        <option disabled>Fourth Year</option>
                        {sectionList?.fourthYear?.length != 0 && sectionList?.fourthYear?.map((option, index) => (
                          <option key={index} value={option._id}>
                            {option.sectionName}
                          </option>
                        ))}

                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </>
              }

              <h4>Subjects</h4>
              {((!isHod && !isSectionHead) || (isHod && !isSectionHead)) && subjectAndSectionID?.map((subject, ind) => {
                return (
                  <button
                    key={ind}
                    onClick={(e) => {
                      updateLineChart(ind);
                    }}
                    style={subjectButton}
                    type="button"
                    className="btn btn-dark mx-1 mb-1 btn-sm"
                  >
                    {subject.subjectName}
                  </button>
                );
              })}

              {
                (isSectionHead && !isHod) && sectionHeadSubjects?.map((subject, ind) => {
                  return (
                    <button
                      key={ind}
                      onClick={(e) => {
                        updateLineChart(ind);
                      }}
                      style={subjectButton}
                      type="button"
                      className="btn btn-dark mx-1 mb-1 btn-sm"
                    >
                      {subject.subjectName} ({subject.subjectCode})
                    </button>
                  );
                })
              }

              <Line options={lastFiveDaysOptions} data={lastFiveDaysData} />
            </Card.Body>
          </Card>

          <Card className='mb-3' style={{ minHeight: "350px" }}>
            <Card.Body>
              <Line options={allTimeOptions} data={alltimeData} />
            </Card.Body>
          </Card>

          {/* <Card>


      <Card.Body>
      
     
      
      <Card.Img src="https://resources.cdn.yaclass.in/24adf49a-f4f3-4706-9302-ee944efad647/pic12.svg" />
      
      </Card.Body>
    </Card> */}

        </div>


      </div>

    </div>
  )
}


const subjectButton = {
  borderRadius: "20px",
};
