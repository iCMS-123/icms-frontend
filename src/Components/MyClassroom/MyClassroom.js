import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk } from 'react-icons/fa';
import CloudinaryMarkAttendanceWidget from "../CloudinaryWidget/CloudinaryMarkAttendanceWidget";
import Loader1 from "../Loader/Loader-1/index";
import Message from "../Message/index";
import styles from './styles.module.css'
import { FaTimesCircle } from "react-icons/fa"

const MyClassroom = () => {
  const [sectionData, setSectionData] = useState(null);
  let yearMap = ["First Year", "Second Year", "Third Year", "Fourth Year"];

  // For toast
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const currUser = JSON.parse(localStorage.getItem("icmsUserInfo")).data._id;
  console.log(currUser);

  // For students list
  const [studentsList, setStudentsList] = useState(null);
  const [verifiedStudentsList, setVerifiedStudentsList] = useState(null);
  const [unverifiedStudentsList, setUnverifiedStudentsList] = useState(null);
  const [studentsListCopy, setStudentsListCopy] = useState([]);
  const [filterSelected, setFilterSelected] = useState('');

  //For student details modal
  const [studentDetailsModalShow, setStudentDetailsModalShow] = useState(false);
  const [studentDetailsForModal, setStudentDetailsForModal] = useState(false);
  const [loadingForFilter, setLoadingForFilter] = useState(false);
  const [uploadedGroupPhotos, setUploadedGroupPhotos] = useState([]);

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

          console.log(data, "Classroom Data");
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
    if (myStudentsList.length)
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

  async function handleOnGroupPhotoUpload(error, result, widget) {

    if (error) {  
      seterror(error);
      setTimeout(() => seterror(null), 3000);
      console.log(error, "img upload error");
      widget.close({
        quiet: true
      });
      return;
    }
    console.log(result?.info?.secure_url, "img url");
    let currUrl = await result?.info?.secure_url;
    await setUploadedGroupPhotos(uploadedGroupPhotos => [...uploadedGroupPhotos, currUrl]);  
    // setShowMarkButton(true);
    setSuccess(true);
    setSuccessMessage("Your images uploaded successfully!");
    setTimeout(() => setSuccess(false), 5000);
  }
  function removeThisImg(url) {
    console.log("remove triggered");
    let uploadedImgCopy = uploadedGroupPhotos.filter(img => img != url);
    setUploadedGroupPhotos(uploadedImgCopy);
  }
  async function handleMarkAttendance(){
    // logic to mark attendance
    // a post request to backend with the list of uploaded images
    console.log("Marking Attendance")
  }

  return (
    <div>
      {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}
      <section className="take-attendance mb-4 text-center">
        <div>
          <h4 className="fw-bold">Mark Attendance with a Class Group Photo!</h4> 
          
                
          {/* uploaded photos preview here */}
              <div className="mt-2 mb-4">
                {
                   
                  (uploadedGroupPhotos != []) && uploadedGroupPhotos?.map((img, index) => (
                    <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                      <FaTimesCircle className="deleteImgBtn" onClick={(e) => removeThisImg(img)} />
                      <Image thumbnail style={{ height: '100%' }} src={img} alt="User" />
                    </div>
                  ))
                }
            </div>
             
        
          <div >
          <CloudinaryMarkAttendanceWidget onUpload={handleOnGroupPhotoUpload} multipleAllowed={true}>
                {({ open }) => {
                  function handleOnClick(e) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <>
                    
                      <div className="upload-mark-btn-container">
                      {uploadedGroupPhotos?.length != 0 && <div className="mark-attendance-btn">
                    <button  id="mark-btn" onClick={handleMarkAttendance} className="btn btn-lg btn-success mb-2">Click to Mark Attendance</button>            
                    <p>It's quick, easy, and accurate!</p>  

                     <h4 className="fw-bolder mb-3">OR</h4>            
                    </div>}
                      <div className="upload-group-photo-btn">
                    <button  id="upload-btn" onClick={handleOnClick} className="btn btn-lg btn-success mb-2">Upload {uploadedGroupPhotos?.length !== 0 && <span>More</span>} Photos</button>            
                    <p>The more the photos, the better the accuracy!</p>
                     
                    </div>
                    
                    </div>
                    
                    </>

                  )
                }}
                
              </CloudinaryMarkAttendanceWidget>
              
          </div>
        </div>

        
      </section>
      <section className="student-count">
        {(sectionData != null) && <>
          <h5>
            <strong className="text-muted">
              {sectionData.sectionName.toUpperCase()}
            </strong>
            <Badge bg="success" style={{ float: 'right', margin: '0 10px' }}>
              {yearMap[sectionData.sectionYear - 1]}
            </Badge>
            <Badge bg="dark" style={{ float: 'right', margin: '0 10px' }}>
              {sectionData.sectionBranchName.toUpperCase() || ""}
            </Badge>
          </h5>
        </>}


        {/* second sec starts */}
        <div id={styles.currentStudents}>
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
                              <b className="text-muted">{student.branchName.toUpperCase()}</b>
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
                          {yearMap[studentDetailsForModal.year-1]}
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
                  { (!studentDetailsForModal.isVerified) &&
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


      </section>
    </div>
  );
};

export default MyClassroom;
