import React, { useState } from "react";
import { useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import "./Register.css";
import axios from 'axios';

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
  // let regForm = document.querySelector("#reg-form");
  // let modalForm = document.querySelector("#checkModal");
   
  
  // For modal
  const [show, setShow] = useState(false);

 

  // This should be false for first time when user checks the data
  // And also if after checking the data he makes any change
  

 
 
  const handleClose = () => {
    setShow(false);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setShow(true) ;
  }

  const onProceed = async () =>{
// make a post request
let collegeRole = collegeRoleRef['current']?.value;
try{

  const dataObj = await axios.post(`http://localhost:8002/api/v1/${collegeRole}/register`,{
  firstName: `${ firstNameRef['current']?.value }`,
  lastName : `${ lastNameRef['current']?.value }` ,
  email : `${ emailRef['current']?.value }`,
  password: `${passwordRef['current']?.value}`,
  branchName : `${ branchRef['current']?.value }`,
  collegeIdCard : `${ collegeIdRef['current']?.value }`
  
});

console.log(dataObj.data.data);
let icmsUserInfo = JSON.stringify(dataObj.data.data);
localStorage.setItem('icmsUserInfo', JSON.stringify(icmsUserInfo));
// Sucess :: Redirect to dashboard
navigate('/dashboard');

}catch(e){

  console.log( e );
  alert(e.response.data.error);
}
};
   
 
  return (
    <div>
      <h1 style={{ fontWeight: "900" }} className="text-center">
        Registration Form
      </h1>
      <Form onSubmit={handleSubmit} id="reg-form">
        <Form.Group className="mb-2" controlId="formRoleSelection">
          <Form.Label>Role</Form.Label>
          <Form.Select ref={collegeRoleRef} aria-label="Default select example">
            <option defaultValue value="student">
              Student
            </option>
            <option value="teacher">Teacher</option>
          </Form.Select>
        </Form.Group>

        {/* First Name */}

        <Form.Group className="mb-2" controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control ref={firstNameRef} required type="text" placeholder="Enter First Name" />
        </Form.Group>

        {/* Last name */}
        <Form.Group className="mb-2" controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control ref={lastNameRef} required type="text" placeholder="Enter Last Name" />
        </Form.Group>

        <Form.Group className="mb-2" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control ref={emailRef} required type="email" autoComplete="username" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-2" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control ref={passwordRef} required type="password" autoComplete="current-password" placeholder="Password" />
        </Form.Group>

        {/* Branch */}

        <Form.Group className="mb-2" controlId="formBranchSelection">
          <Form.Label>Branch</Form.Label>
          <Form.Select ref={branchRef} aria-label="Default select example">
            <option defaultValue value="it">
              IT
            </option>
            <option value="cse">CSE</option>
          </Form.Select>
        </Form.Group>

        {/* Link for College ID */}

        <Form.Group className="mb-3" controlId="formCollegeIdLink">
          <Form.Label>College ID Google Drive Link</Form.Label>
          <Form.Control ref={collegeIdRef} required name="collegeID" type="url"/>
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
          
          <h4 className="modalData" style={{'textTransform' : 'capitalize'}}><strong>Role</strong> :  {collegeRoleRef['current']?.selectedOptions[0].value}  </h4>
          <h4 className="modalData"><strong>First Name</strong> :  { firstNameRef['current']?.value } </h4>
          <h4 className="modalData"><strong>Last Name</strong> : { lastNameRef['current']?.value } </h4>
          <h4 className="modalData"><strong>Email</strong> :  { emailRef['current']?.value } </h4>
          <h4 className="modalData"><strong>Branch</strong> :  { branchRef['current']?.value }</h4>  
          <h4 className="modalData"><strong>College ID</strong> : <a href={ collegeIdRef['current']?.value} target="_blank" rel="noreferrer"><Button variant="info">Preview</Button></a>    </h4>
          
         
         
         
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
