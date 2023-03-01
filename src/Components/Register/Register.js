import React, { useState } from "react";
import { useRef } from "react";
import axios from 'axios';
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import ICMSTitle from "../ICMSTitle/ICMSTitle";
import "./Register.css";

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
  const collegeIdRef = useRef(null);
  const yearRef = useRef(null);
  const sectionRef = useRef(null);
  const universityRollNumberRef = useRef(null);
  const admissionNumberRef = useRef(null);
  // let regForm = document.querySelector("#reg-form");
  // let modalForm = document.querySelector("#checkModal");

  // For modal
  const [show, setShow] = useState(false);
  const [collegeRole, setCollegeRole] = useState("student");

  // This should be false for first time when user checks the data
  // And also if after checking the data he makes any change
  const handleClose = () => {
    setShow(false);
  };

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
        collegeIdCard: `${collegeIdRef['current']?.value}`
      }
    } else {
      details = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        branchName: branchRef.current.value,
        year: yearRef.current.value,
        section: sectionRef.current.value,
        collegeIdCard: collegeIdRef.current.value,
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
              <Form.Select ref={branchRef} aria-label="Default select example">
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
            <option defaultValue value="it-1">
              IT-1
            </option>
            <option value="it-2">
              IT-2
            </option>
            <option value="it-3">
              IT-3
            </option>


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
        <Form.Group className="mb-3" controlId="formCollegeIdLink">
          <Form.Label>College ID Google Drive Link</Form.Label>
          <Form.Control ref={collegeIdRef} required name="collegeID" type="url" />
        </Form.Group>

        {/* show modal on first click */}
        <Button className="reg-btn" variant="primary" type="submit">
          Register
        </Button>

        <hr />
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
          {(collegeRole === "student") && <h4 className="modalData"><strong>Year</strong> :  {yearRef.current?.selectedOptions[0].innerText}</h4>}
          <h4 className="modalData"><strong>Branch</strong> :  {branchRef['current']?.selectedOptions[0].innerText}</h4>
          {(collegeRole === "student") && <h4 className="modalData"><strong>Section</strong> :  {sectionRef['current']?.selectedOptions[0].innerText}</h4>}
          {(collegeRole === "student") && <h4 className="modalData"><strong>Admission Number</strong> :  {admissionNumberRef['current']?.value}</h4>}
          {(collegeRole === "student") && <h4 className="modalData"><strong>University Roll Number</strong> :  {universityRollNumberRef['current']?.value}</h4>}
          <h4 className="modalData"><strong>College ID</strong> : <a href={collegeIdRef['current']?.value} target="_blank" rel="noreferrer"><Button variant="info">Preview</Button></a>    </h4>




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
