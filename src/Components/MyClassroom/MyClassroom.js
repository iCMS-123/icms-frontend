import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk } from 'react-icons/fa';
import CloudinaryMarkAttendanceWidget from "../CloudinaryWidget/CloudinaryMarkAttendanceWidget";
import Loader1 from "../Loader/Loader-1/index";
import Message from "../Message/index";
import styles from './styles.module.css'
import './styles.css'
import { FaTimesCircle } from "react-icons/fa"
import moment from "moment"

const MyClassroom = () => {
  let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
  let userData = icmsLocalStorageData.data;
  console.log(userData);
  let userID = userData._id;
  console.log(userID);
  const [sectionData, setSectionData] = useState(null);
  let yearMap = ["First Year", "Second Year", "Third Year", "Fourth Year"];

  // For toast
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const currUser = JSON.parse(localStorage.getItem("icmsUserInfo")).data._id;
  // console.log(currUser);

  // For students list
  const [studentsList, setStudentsList] = useState(null);
  const [verifiedStudentsList, setVerifiedStudentsList] = useState(null);
  const [unverifiedStudentsList, setUnverifiedStudentsList] = useState(null);
  const [studentsListCopy, setStudentsListCopy] = useState([]);
  const [filterSelected, setFilterSelected] = useState('');
  const [issuesData, setIssuesData] = useState([]); // for issues data
  const [activeIssues, setActiveIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  //For student details modal
  const [studentDetailsModalShow, setStudentDetailsModalShow] = useState(false);
  const [studentDetailsForModal, setStudentDetailsForModal] = useState(false);
  const [loadingForFilter, setLoadingForFilter] = useState(false);
  // For attendance
  const [sectionAttendance, setSectionAttendance] = useState([]);
  // For issue Modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueModalData, setIssueModalData] = useState({});
  const handleIssueModalClose = () => setShowIssueModal(false);
  const handleIssueModalShow = () => setShowIssueModal(true);

  // for model training
  const [modelTrainBtnShow, setModelTrainBtnShow] = useState(true);
  const [remainingTrainTime, setRemainingTrainTime] = useState(0);
  const [lastTrainTime, setLastTrainTime] = useState("More than an hour back");
  const [lastSuccessfulTrainTime, setLastSuccessfulTrainTime] = useState("No Information saved yet!");

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  useEffect(() => {
    let sectionId = JSON.parse(localStorage.getItem("icmsUserInfo")).data?.sectionHeadRef;
    const trainingData = Number(localStorage.getItem(`trainingData${sectionId}`));
    console.log(trainingData + 3600000 - moment().valueOf(), "see you in hell");
    if (trainingData) {
      setLastTrainTime(new Date(trainingData).toUTCString());
      if (trainingData + 3600000 > moment().valueOf()) {
        console.log("greater toh hai");
        setModelTrainBtnShow(false);
        // setRemainingTrainTime((trainingData + 3600000 - moment().valueOf()) % 60); 
        setRemainingTrainTime(millisToMinutesAndSeconds(trainingData + 3600000 - moment().valueOf())); 
      }
      else{
        setModelTrainBtnShow(true);
        setRemainingTrainTime(0);
      }
    }
  }, [])

  async function handleTrainAttendanceModel() {
    // logic to train attendance model
    // a post request to backend with the list of students details
    let sectionId = JSON.parse(localStorage.getItem("icmsUserInfo")).data?.sectionHeadRef;
    console.log(`trainingData${sectionId}`)

    const current_timestamp = moment().valueOf();
    console.log(moment().valueOf() , "moment value");

    const trainingData = Number(localStorage.getItem(`trainingData${sectionId}`));
    if (trainingData && trainingData + 3600000 > current_timestamp) {
      seterror("You have already requested for training attendance model! You can only request again after 60 minutes only if request fails.");
      setTimeout(() => seterror(null), 3000);
      
      setModelTrainBtnShow(false);
      setRemainingTrainTime(60);
      return
    }

    if(! window.confirm("You must ensure that your class strength is full. Do you wish to continue?"))
      return;

    let payload = {
      'sectionId': sectionId,
      'persons': []
    }

    sectionData.verifiedStudents.map(student => {
      student.sampleImages = student.sampleImages.filter(img =>
        img != undefined)

      payload['persons'].push({
        "id": student._id,
        "image_links": student.sampleImages
      })
    })

    console.log(payload, "payload");

    try {
      axios.post(`http://localhost:8002/api/v1/section/train-attendance/${sectionId}`)
        .then((res) => {
          if (res.data.success) {
            console.log(res, "response");
            axios.post("https://7258-34-90-13-120.ngrok-free.app/train_model",
              payload
            );

            setSuccessMessage("Images uploaded for training attendance model successfully!")
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            localStorage.setItem(`trainingData${sectionId}`, current_timestamp);
            setLastTrainTime(new Date(current_timestamp).toUTCString());
          }
          else {
            seterror("Request not processed! Try again!");
            setTimeout(() => seterror(null), 3000);
          }
        })
    } catch (err) {
      console.log(err, "Request not processed! Try again!");
      seterror(err.msg);
      setTimeout(() => seterror(null), 3000);
    }
  }

  function handleIssueModal(index) {
    const target = issuesData[index];
    console.log(target);
    setIssueModalData(target);
    handleIssueModalShow(true);
  }

  useEffect(() => {
    const getClassroomData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-data/${currUser}`);

        if (data && data.success) {
          setSectionData(data.data);
          setStudentsList(data.data.sectionStudents);
          setStudentsListCopy(data.data.sectionStudents);
          setVerifiedStudentsList(data.data.verifiedStudents);
          setUnverifiedStudentsList(data.data.unverifiedStudents);
          setSectionAttendance(data.data.sectionAttendance)
          if (data.data?.sectionAttendanceStatus) 
            setLastSuccessfulTrainTime(new Date(Number(data.data?.lastAttendanceRequest)).toUTCString());

          let allIssues = data.data.sectionIssues;
          setIssuesData(allIssues); // for issues data    
          setActiveIssues(allIssues.filter((issue) => !issue.isAttended))
          setResolvedIssues(allIssues.filter((issue) => issue.isAttended))
          // console.log(data, "Classroom Data");
        }
      } catch (e) {
        console.log(e, "e");
      }
    };

    getClassroomData();

  }, []);

  useEffect(() => {
    setLoadingForFilter(true);

    const getStudentListFilterWise = async () => {
      if (filterSelected == "verified") {
        setStudentsListCopy(verifiedStudentsList);
      }
      else if (filterSelected == "unverified") {
        setStudentsListCopy(unverifiedStudentsList);
      }
      else {
        setStudentsListCopy(studentsList);
      }

      setLoadingForFilter(false);
    };

    getStudentListFilterWise();
  }, [filterSelected]);

  const filterByName = async (filter) => {
    setFilterSelected(filterSelected);
    let myStudentsList = studentsList.filter((student) => {
      return ((student.firstName + " " + student.lastName).toUpperCase().indexOf(filter.toUpperCase()) > -1)
    })

    console.log(myStudentsList, "myStudentsList");
    if (myStudentsList?.length)
      setStudentsListCopy(myStudentsList);
    else
      setStudentsListCopy([]);
  }

  async function getStudentDetailsAndShowInModal(idx) {
    console.log('getStudentDetailsAndShowInModal');
    console.log(studentsListCopy, "studentsListCopy");
    setStudentDetailsForModal(studentsListCopy[idx]);
    setStudentDetailsModalShow(true);
  }

  async function setStudentVerified(student_id) {
    //function to verify student's account
    console.log(student_id, 'student_id for verification');

    try {
      const { data } = await axios.put(`http://localhost:8002/api/v1/section/verify-section-student/${student_id}`);
      if (data && data.success) {
        console.log(data.data, "verified student response");
        setSuccess(true);
        setSuccessMessage("Student verified successfully!");
        setStudentDetailsModalShow(false);

        // update student list here 
        let updatedList = unverifiedStudentsList.filter((item) => {
          return item._id != student_id;
        });

        setUnverifiedStudentsList(updatedList)
        setVerifiedStudentsList([...verifiedStudentsList, data.data]);

        let tempList = studentsList.filter((item) => {
          return item._id != student_id;
        });
        setStudentsList([...tempList, data.data]);

        if (filterSelected == "verified") {
          setStudentsListCopy([...verifiedStudentsList, data.data]);
        }
        else if (filterSelected == "unverified") {
          setStudentsListCopy(updatedList);
        }
        else {
          setStudentsListCopy([...tempList, data.data]);
        }

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.log(e, "e");
      seterror(e.response.data.msg);
      setTimeout(() => seterror(null), 3000);
    }
  }

  async function terminateAccount(student_id) {
    //function to terminate student's account
    console.log(student_id, 'student_id for termination');
  }

  function getStudentName(studentID) {
    console.log(studentID);
    console.log(verifiedStudentsList, "verifiedStudentsList");
    for (let i = 0; i < verifiedStudentsList?.length; i++) {
      if (verifiedStudentsList[i]._id == studentID) {
        return verifiedStudentsList[i].firstName + " " + verifiedStudentsList[i].lastName;
      }
    }
  }

  async function handleIssueStatusModal(decision) {
    try {
      const { data } = await axios.put(`http://localhost:8002/api/v1/section/resolve-issue/${userID}`, {
        issueId: issueModalData._id,
        status: decision
      })
      if (data.success) {
        if (decision === true) {
          setSuccess(true);
          setSuccessMessage("Issue Resolved!");
          setTimeout(() => setSuccess(false), 5000);
        } else {
          seterror("Issue Rejected!");
          setTimeout(() => seterror(null), 3000);
        }
      }
      console.log(data.data.issues, 'heloo');
      setIssuesData(data.data.issues);
    } catch (err) {
      console.log(error);
    }
    handleIssueModalClose();
  }

  return (
    <div>

      {/* Attendance */}
      {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}
      <section className="student-count">
        {(sectionData != null) && <>
          <h5>
            <strong className="text-muted">
              {sectionData?.sectionName?.toUpperCase()} (Total Verified Students : {verifiedStudentsList?.length})
            </strong>
            <Badge bg="success" style={{ float: 'right', margin: '0 10px' }}>
              {yearMap[sectionData.sectionYear - 1]}
            </Badge>
            <Badge bg="dark" style={{ float: 'right', margin: '0 10px' }}>
              {sectionData?.sectionBranchName?.toUpperCase() || ""}
            </Badge>
          </h5>
        </>}
      </section>

      <section className="take-attendance mb-4 text-center">
        <h4 className="text-muted">Train Attendance Marking System for your Section Students Now</h4>
        {modelTrainBtnShow
          &&
          <Button variant="dark" className="mt-2 mb-3" onClick={() => handleTrainAttendanceModel()}>
            Train Now
          </Button>
        }
        {!modelTrainBtnShow
          &&
          <Button variant="danger" disabled className="mt-2 mb-3">
            Train After {remainingTrainTime} minutes
          </Button>
        }
        <p>You can do this operation only once every 60 minutes! Please be wise with this.</p>
        <Badge bg="success" style={{ float: 'right', margin: '0 10px' }}>
          Last Successfully Trained at : {lastSuccessfulTrainTime}
        </Badge>
        <Badge bg="info" style={{ float: 'right', margin: '0 10px' }}>
          Last Request at : {lastTrainTime}
        </Badge>
      </section>

      {/* Issues */}
      <h4>Active Issues</h4>
      <section className="active-issues-section">
        <div className="active-issues-container" >
          {activeIssues?.length < 1 && <p>No active issues, Hurray!</p>}
          {
            activeIssues?.map((issue, idx) => {

              return <div key={idx} className="card issue-card">
                <div className="card-body">
                  <Badge style={{ float: 'right' }} bg={(issue.priority == 1 && "danger") || (issue.priority == 2 && "primary") || (issue.priority == 3 && "warning")}>{(issue.priority == 1 && "High") || (issue.priority == 2 && "Low") || (issue.priority == 3 && "Medium")}</Badge>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img

                        src={issue.issueSubmittedByStudent?.profileImg || 'https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png'}
                        alt="profile"
                        className="rounded-circle"
                        style={{ width: "60px", height: "60px" }}
                      />
                      <div className="ms-3">
                        <p className="mb-0">  {issue.issueSubmittedByStudent?.firstName + " " + issue.issueSubmittedByStudent?.lastName || 'Full Name'}</p>
                      </div>
                    </div>
                  </div>
                  <h5 className="card-title"> {issue.title || 'title to be added'}</h5>
                  <p className="card-text">
                    {issue.issueMsg.slice(0, 50) + '...'}   </p>
                  <a href="#" className="btn btn-primary" onClick={() => { handleIssueModal(idx) }}>
                    View Issue
                  </a>


                </div>
              </div>
            })
          }

        </div>

        {/* View Issue Card Modal*/}

        <Modal id="unresolved-issues" show={showIssueModal} onHide={handleIssueModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{issueModalData.title || 'Title'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Submitted By : {issueModalData.issueSubmittedByStudent?.firstName + " " + issueModalData.issueSubmittedByStudent?.lastName || 'Full Name'}</h6>
            <p>Description : {issueModalData.issueMsg || 'Issue Description'}</p>


          </Modal.Body>
          {!issueModalData.isAttended && <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => { handleIssueStatusModal(true) }} variant="success">Resolve</Button>
            <Button onClick={() => { handleIssueStatusModal(false) }} variant="danger">Reject</Button>
          </Modal.Footer>}

        </Modal>


      </section>

      <h4>Resolved Issues</h4>
      <section className="active-issues-section">
        <div className="active-issues-container" >
          {resolvedIssues?.length < 1 && <p>No resolved issue, checkout active issues</p>}
          {
            resolvedIssues?.map((issue, idx) => {

              return <div key={idx} className="card issue-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <Badge bg="success">Resolved</Badge>
                    <Badge bg={(issue.priority == 1 && "danger") || (issue.priority == 2 && "primary") || (issue.priority == 3 && "warning")}>{(issue.priority == 1 && "High") || (issue.priority == 2 && "Low") || (issue.priority == 3 && "Medium")}</Badge>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img

                        src={issue.issueSubmittedByStudent?.profileImg || 'https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png'}
                        alt="profile"
                        className="rounded-circle"
                        style={{ width: "60px", height: "60px" }}
                      />
                      <div className="ms-3">
                        <p className="mb-0">  {issue.issueSubmittedByStudent?.firstName + " " + issue.issueSubmittedByStudent?.lastName || 'Full Name'}</p>
                      </div>
                    </div>
                  </div>
                  <h5 className="card-title"> {issue.title || 'title to be added'}</h5>
                  <p className="card-text">
                    {issue.issueMsg.slice(0, 50) + '...'}   </p>
                  <a href="#" className="btn btn-primary" onClick={() => { handleIssueModal(idx) }}>
                    View Issue
                  </a>


                </div>
              </div>
            })
          }

        </div>
        {/* Same modal is being used to show details of resolved issues */}
      </section>


      {/* second sec starts */}
      <div id={styles.currentStudents} className="pb-5 mb-5">
        {/* branch fetch logic will come here */}
        <h5 className="mb-2 mt-3">Students Enrolled</h5>

        <Row>
          <Col xs={9}>
            {(studentsListCopy == []) && <p className='mt-3' style={{ display: 'inline-block' }}>Currently there are no such registered students.</p>}
            {loadingForFilter ? (
              <Loader1></Loader1>
            ) : ('')}

            <Row xs={1} md={2} className="g-4" id={styles.studentsDiv}>

              {(studentsListCopy != []) &&

                studentsListCopy?.map((student, index) => (
                  <Col key={index}>
                    <Card>
                      <Card.Body>
                        <div style={{ display: 'flex', }}>
                          {student.isHod && <Badge bg="dark" style={{ position: 'absolute', top: '10px', right: '30px' }}>
                            HOD
                          </Badge>}
                          {student.isVerified && <FaUserCheck style={{ position: 'absolute', top: '10px', right: '10px', color: 'green' }} />}
                          {!student.isVerified && <FaUserTimes style={{ position: 'absolute', top: '10px', right: '10px', color: 'red' }} />}

                          <Image src={student.profileImg} rounded={true} style={{ height: "90px", width: 'auto' }} className="me-3" />
                          <span style={{ display: 'flex', flexDirection: 'column' }}>
                            <b className="text-muted">{student?.branchName?.toUpperCase()}</b>
                            <b className="mb-2">{student.firstName + " " + student.lastName}</b>
                            <Button variant="outline-info" size="sm"
                              onClick={e => getStudentDetailsAndShowInModal(index)}
                            >
                              View Details
                            </Button>
                          </span>
                        </div>
                        {/* <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
        </Card.Text>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link> */}
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              }
            </Row>
            {/* Modal code starts */}
            <Modal show={studentDetailsModalShow} fullscreen={true} onHide={() => setStudentDetailsModalShow(false)}>
              <Modal.Header closeButton>
                {/* <Modal.Title>Student's Details</Modal.Title> */}
              </Modal.Header>
              <Modal.Body>
                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                  <div id='left-section' style={{ width: '30%', background: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <h5>
                      <Badge bg="secondary" style={{ marginBottom: '20px' }}>
                        {yearMap[studentDetailsForModal.year - 1]}
                      </Badge>
                    </h5>
                    <Image src={studentDetailsForModal.profileImg} roundedCircle={true} style={{ height: "100px", width: '100px' }} className="mb-3" />
                    <h5>{studentDetailsForModal.firstName + " " + studentDetailsForModal.lastName}</h5>
                    <h5> {studentDetailsForModal.branchName?.toUpperCase()}</h5>
                  </div>
                  <div id='right-section' style={{ width: '70%', padding: '10px 20px' }}>
                    <h6>Information</h6>
                    <hr />
                    <div style={{ padding: '10px 20px' }}>
                      <Row>
                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                          <h6>First Name </h6>
                          <p className='text-muted'>{studentDetailsForModal.firstName}</p>
                        </Col>
                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                          <h6>Last Name </h6>
                          <p className='text-muted'>{studentDetailsForModal.lastName}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                          <h6>Email </h6>
                          <p className='text-muted'>{studentDetailsForModal.email}</p>
                        </Col>
                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                          <h6>Admission Number</h6>
                          <p className='text-muted'>{studentDetailsForModal.admissionNumber}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                          <h6>University Roll Number </h6>
                          <p className='text-muted'>{studentDetailsForModal.universityRollNumber}</p>
                        </Col>
                        <Col style={{ display: 'flex', flexDirection: 'column' }}>
                          <h6>Verification Status</h6>

                          {studentDetailsForModal.isVerified &&
                            <p className='text-muted'>Verified
                              <FaUserCheck style={{ marginLeft: '10px', color: 'green' }} />
                            </p>
                          }
                          {!studentDetailsForModal.isVerified &&
                            <p className='text-muted'>Not Verified
                              <FaUserTimes style={{ marginLeft: '10px', color: 'red' }} />
                            </p>
                          }

                        </Col>
                      </Row>
                      <Col style={{ display: 'flex', flexDirection: 'column' }}>
                        <h6>College ID</h6>
                        <Image src={studentDetailsForModal.collegeIdCard || 'https://picturedensity.com/wp-content/uploads/2019/06/Polytechnicollege-id-card.jpg'} style={{ height: "auto", width: 'auto', maxWidth: '300px' }} className="mt-2" />
                      </Col>
                      <Col style={{ display: 'flex', flexDirection: 'column' }}>
                        <h6 className="mt-3">Images for Attendance System</h6>
                        <div>
                          {
                            (studentDetailsForModal.sampleImages != []) && studentDetailsForModal?.sampleImages?.map((img, index) => (
                              <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px' }}>
                                <Image thumbnail style={{ height: '100%' }} src={img} alt="User" />
                              </div>
                            ))
                          }
                        </div>
                      </Col>

                    </div>

                  </div>
                </div>

              </Modal.Body>
              <Modal.Footer>
                {(!studentDetailsForModal.isVerified) &&
                  <Button variant="success" onClick={e => setStudentVerified(studentDetailsForModal._id)}>Verify Account</Button>
                }
                <Button variant="dark" onClick={e => terminateAccount(studentDetailsForModal._id)}>Terminate Account</Button>
              </Modal.Footer>
            </Modal>
            {/* Modal code ends */}

          </Col>
          <Col className="ms-2">
            <h6>Search Students</h6>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Enter Student's Name"
                aria-label="searchBox"
                aria-describedby="basic-addon2"
                onChange={e => { filterByName(e.target.value) }}
              />
              <InputGroup.Text id="basic-addon2"> <FaSearch /> </InputGroup.Text>
            </InputGroup>

            <h6>Filter </h6>
            <div>
              <Form.Check
                type={`radio`}
                id={`all`}
                name={`filter`}
                label={`All Students`}
                onChange={(e) => { setFilterSelected(e.target.id) }}
              />
              <Form.Check
                type={`radio`}
                id={`verified`}
                name={`filter`}
                label={`Verified`}
                onChange={(e) => { setFilterSelected(e.target.id) }}
              />
              <Form.Check
                type={`radio`}
                id={`unverified`}
                name={`filter`}
                label={`Unverified`}
                onChange={(e) => { setFilterSelected(e.target.id) }}
              />

            </div>

          </Col>
        </Row>

      </div>
      {/* students list ends */}


    </div>
  );
};

export default MyClassroom;
