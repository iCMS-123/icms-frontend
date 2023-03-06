import React, { useEffect, useState } from "react";
import { useRef } from "react";
import axios from 'axios';
import { Button, Form, Modal, Row, Col, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import ICMSTitle from "../ICMSTitle/ICMSTitle";
import "./Register.css";
import CloudinaryUploadWidget from "../CloudinaryWidget/CloudinaryUploadWidget";
import CloudinaryIdCardWidget from "../CloudinaryWidget/CloudinaryIdCardWidget";
import { FaTimesCircle } from "react-icons/fa"
import Message from "../Message/index";


const Register = () => {
  useDocumentTitle("Register");
  const navigate = useNavigate();
  // Referenced Variables
  const collegeRoleRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const branchRef = useRef(null);
  const [collegeId, setCollegeId] = useState(null);
  const yearRef = useRef(null);
  const sectionRef = useRef(null);
  const universityRollNumberRef = useRef(null);
  const admissionNumberRef = useRef(null);
  // let regForm = document.querySelector("#reg-form");
  // let modalForm = document.querySelector("#checkModal");

  // For modal
  const [show, setShow] = useState(false);
  const [collegeRole, setCollegeRole] = useState("student");

  // For toast
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  //page counter
  const [pageNumber, setPageNumber] = useState(0);
  const [uploadedUserImages, setUploadedUserImages] = useState([]);

  function handleOnUpload(error, result, widget) {
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
    let currUrl = result?.info?.secure_url;

    setUploadedUserImages(uploadedUserImages => [...uploadedUserImages, currUrl])

    setSuccess(true);
    setSuccessMessage("Your images uploaded successfully!");
    setTimeout(() => setSuccess(false), 5000);
  }
  
  function handleOnIdCardUpload(error, result, widget) {
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
    let currUrl = result?.info?.secure_url;
    setCollegeId(currUrl);

    setSuccess(true);
    setSuccessMessage("ID card uploaded successfully!");
    setTimeout(() => setSuccess(false), 5000);
  }

  function removeThisImg(url) {
    console.log("remove triggered");
    let uploadedImgCopy = uploadedUserImages.filter(img => img != url);
    setUploadedUserImages(uploadedImgCopy);
  }

  // This should be false for first time when user checks the data
  // And also if after checking the data he makes any change
  const handleClose = () => {
    setShow(false);
  };

  const [firstYearSections, setFirstYearSections] = useState([]);
  const [secondYearSections, setSecondYearSections] = useState([]);
  const [thirdYearSections, setThirdYearSections] = useState([]);
  const [fourthYearSections, setFourthYearSections] = useState([]);


  const fetchSectionData = async () => {
    try {
      console.log(branchRef.current.value)
      const sectionData = await axios.get(`http://localhost:8002/api/v1/hod/get-list-section?branchName=${branchRef.current.value}`)
      if (sectionData) {
        setFirstYearSections(sectionData.data.firstYear)
        setSecondYearSections(sectionData.data.secondYear)
        setThirdYearSections(sectionData.data.thirdYear)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchSectionData();
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    setShow(true);
    console.log(yearRef.current?.selectedOptions[0].innerText)
  }

  const onProceed = async () => {
    // make a post request
    let collegeRole = collegeRoleRef['current']?.value;
    let details;
    if (collegeRole === "teacher") {
      details = {
        firstName: `${firstNameRef['current']?.value}`,
        lastName: `${lastNameRef['current']?.value}`,
        email: `${emailRef['current']?.value}`,
        password: `${passwordRef['current']?.value}`,
        branchName: `${branchRef['current']?.value}`,
        collegeIdCard: `${collegeId}`
      }
    } else {
      details = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        branchName: branchRef.current.value,
        year: yearRef.current.value,
        sectionRef: sectionRef.current.value,
        collegeIdCard: collegeId,
        admissionNumber: admissionNumberRef.current.value,
        universityRollNumber: universityRollNumberRef.current.value
      }
    }

    try {

      console.log(details);
      const { data } = await axios.post(`http://localhost:8002/api/v1/${collegeRole}/register`, details);

      console.log(data);
      let icmsUserInfo = JSON.stringify(data);
      localStorage.setItem('icmsUserInfo', icmsUserInfo);
      // Success :: Redirect to dashboard
      if (collegeRole === "teacher") {
        navigate("/dashboard");
      } else {

        navigate("/studentdashboard")
      }

    } catch (e) {
      console.log(e);
    }
  };


  return (
    <div>
      {error && <Message variant={"danger"} style={{paddingTop : "15px"}}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}
      {/* <ICMSTitle /> */}
      <h3 className="sidebar-header fw-bold mb-0 py-2 mb-4 text-center">
        <Link to={"/"}>
          <img src='/images/icms-logo.png' alt='logo' style={{ height: '40px', filter: 'invert(1)' }} />
        </Link>
      </h3>
      <Form onSubmit={handleSubmit} id="reg-form">
        <h4 style={{ fontWeight: "600" }} className="text-muted">
          Register
        </h4>

        {
          (pageNumber == 0) &&
          <>
            <Form.Group className="mb-2" controlId="formRoleSelection">
              <Form.Label>Role</Form.Label>
              <Form.Select onChange={() => { setCollegeRole(collegeRoleRef.current.value) }} ref={collegeRoleRef} aria-label="Default select example">
                <option defaultValue value="student">
                  Student
                </option>
                <option value="teacher">Teacher</option>
              </Form.Select>
            </Form.Group>

            {/* First Name */}
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control ref={firstNameRef} required type="text" placeholder="Enter First Name" />
                </Form.Group>
              </Col>

              <Col>
                {/* Last name */}
                <Form.Group className="mb-2" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control ref={lastNameRef} required type="text" placeholder="Enter Last Name" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control ref={emailRef} required type="email" autoComplete="username" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control ref={passwordRef} required type="password" autoComplete="current-password" placeholder="Enter Password" />
            </Form.Group>

            {/* Branch */}
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formBranchSelection">
                  <Form.Label>Branch</Form.Label>
                  <Form.Select onChange={fetchSectionData} ref={branchRef} aria-label="Default select example">
                    <option defaultValue value="it">
                      IT
                    </option>
                    <option value="cse">CSE</option>
                  </Form.Select>
                </Form.Group>
                {/* year, section, collegeIdCard, admissionNumber, universityRollNumber */}
              </Col>
              <Col>
                {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formYearSelection">
                  <Form.Label>Year</Form.Label>
                  <Form.Select ref={yearRef} aria-label="Default select example">
                    <option defaultValue value="1">
                      1st
                    </option>
                    <option value="2">
                      2nd
                    </option>
                    <option value="3">
                      3rd
                    </option>
                    <option value="4">
                      4th
                    </option>

                  </Form.Select>
                </Form.Group>}
              </Col>
            </Row>
            {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formSectionSelection">
              <Form.Label>Section</Form.Label>
              <Form.Select ref={sectionRef} aria-label="Default select example">
                {yearRef?.current?.value === "1" && (firstYearSections.map(item => <option defaultValue value={item._id}>
                  {item.sectionName}
                </option>))}
                {yearRef?.current?.value === "2" && (secondYearSections.map(item => <option defaultValue value={item._id}>
                  {item.sectionName}
                </option>))}
                {yearRef?.current?.value === "3" && (thirdYearSections.map(item => <option defaultValue value={item._id}>
                  {item.sectionName}
                </option>))}
                {yearRef?.current?.value === "4" && (fourthYearSections.map(item => <option defaultValue value={item._id}>
                  {item.sectionName}
                </option>))}

              </Form.Select>
            </Form.Group>}
            <Row>
              <Col>

                {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formUniversityRoleNumber">
                  <Form.Label>University Role Number</Form.Label>
                  <Form.Control ref={universityRollNumberRef} required type="text" placeholder="Enter University Role Number" />
                </Form.Group>}
              </Col>
              <Col>
                {(collegeRole === "student") && <Form.Group className="mb-2" controlId="formAdmissionNumber">
                  <Form.Label>Admission Number</Form.Label>
                  <Form.Control ref={admissionNumberRef} required type="text" placeholder="Enter Admission Number" />
                </Form.Group>}
                {/* Link for College ID */}
              </Col>
            </Row>
            <Form.Group className="mb-4" controlId="formCollegeIdLink">
              <Form.Label>College ID photo</Form.Label>
              <CloudinaryIdCardWidget onUpload={handleOnIdCardUpload} multipleAllowed={false}>
                {({ open }) => {
                  function handleOnClickId(e) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <Button variant="outline-primary" id="btnId" onClick={handleOnClickId} className="mb-3" style={{ display: 'block' }}>
                      Upload Id Card Image
                    </Button>
                  )
                }}
              </CloudinaryIdCardWidget>
              {
                (collegeId != null) && (
                  <div style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                    <Image thumbnail style={{ height: '100%' }} src={collegeId} alt="User" />
                  </div>
                )
              }
            </Form.Group>

          </>
        }
        {
          (pageNumber == 1) &&
          <>
            <Form.Group className="mb-2" controlId="formYearSelection">
              <Form.Label>Images for Automated Attendance System</Form.Label>
              <CloudinaryUploadWidget onUpload={handleOnUpload} multipleAllowed={true}>
                {({ open }) => {
                  function handleOnClick(e) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <Button variant="outline-primary" id="btnImg" onClick={handleOnClick} className="mb-3" style={{ display: 'block' }}>
                      Upload Images
                    </Button>
                  )
                }}
              </CloudinaryUploadWidget>

              <Form.Text className="text-muted">
                Upload your atleast 3 images captured in well-lit environment for training our Attendance system.
              </Form.Text>
              <div className="mt-2 mb-4">
                {
                  (uploadedUserImages != []) && uploadedUserImages.map((img, index) => (
                    <div style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                      <FaTimesCircle className="deleteImgBtn" onClick={(e) => removeThisImg(img)} />
                      <Image thumbnail style={{ height: '100%' }} src={img} alt="User" />
                    </div>
                  ))
                }
              </div>
            </Form.Group>
          </>
        }

        {/* show modal on first click */}
        {(collegeRole === "teacher" || ((collegeRole === "student") && pageNumber == 1)) &&
          <Button className="reg-btn" variant="primary" type="submit">
            Register
          </Button>
        }
        {(collegeRole === "student") && (pageNumber == 0) &&
          <Button className="next-btn" variant="secondary" onClick={(e) => setPageNumber(1)}>
            Next
          </Button>
        }
        {(collegeRole === "student") && (pageNumber == 1) &&
          <Button className="prev-btn" variant="secondary" onClick={(e) => setPageNumber(0)}>
            Previous
          </Button>
        }



        <hr className="mt-4" />
        <p className="text-center fw-bold">Already Registered ?</p>
        <Link style={{ textDecoration: "none" }} to="/login">
          <Button className="reg-btn" variant="success">
            Login
          </Button>
        </Link>


      </Form>

      {/* Modal */}

      <Modal id="checkModal" size="lg" show={show} onHide={handleClose} centered backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Check Details Again Before You Proceeed</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <h4 className="modalData" style={{ 'textTransform': 'capitalize' }}><strong>Role</strong> :  {collegeRoleRef['current']?.selectedOptions[0].value}  </h4>
          <h4 className="modalData"><strong>First Name</strong> :  {firstNameRef['current']?.value} </h4>
          <h4 className="modalData"><strong>Last Name</strong> : {lastNameRef['current']?.value} </h4>
          <h4 className="modalData"><strong>Email</strong> :  {emailRef['current']?.value} </h4>
          {(collegeRole === "student") && <h4 className="modalData"><strong>Year</strong> :  {yearRef.current?.selectedOptions[0]?.innerText}</h4>}
          <h4 className="modalData"><strong>Branch</strong> :  {branchRef['current']?.selectedOptions[0]?.innerText}</h4>
          {(collegeRole === "student") && <h4 className="modalData"><strong>Section</strong> :  {sectionRef['current']?.selectedOptions[0]?.innerText}</h4>}
          {(collegeRole === "student") && <h4 className="modalData"><strong>Admission Number</strong> :  {admissionNumberRef['current']?.value}</h4>}
          {(collegeRole === "student") && <h4 className="modalData"><strong>University Roll Number</strong> :  {universityRollNumberRef['current']?.value}</h4>}
          <h4 className="modalData"><strong>College ID</strong> : <a href={collegeId} target="_blank" rel="noreferrer"><Button variant="info">Preview</Button></a>    </h4>




        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onProceed}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
