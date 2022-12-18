import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import "./Register.css";
const Register = () => {
  useDocumentTitle("Register");
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const [invalid, setInvalid] = useState(false);

  function checkValidity(e) {
    let fileName = document.getElementById("formFile").value.toLowerCase();
    if (!fileName.endsWith(".jpg") && !fileName.endsWith(".png")) {
      alert("Please upload jpg/jpeg/png file only.");
      setValid(false);
      setInvalid(true);
    } else {
      setValid(true);
      setInvalid(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (invalid) {
      alert("Please upload jpg/jpeg/png file only.");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div>
      <h1 style={{ fontWeight: "900" }} className="text-center">
        Registration Form
      </h1>
      <Form onSubmit={handleSubmit} id="reg-form">
        <Form.Group className="mb-2" controlId="formRoleSelection">
          <Form.Label>Role</Form.Label>
          <Form.Select aria-label="Default select example">
            <option defaultValue value="student">
              Student
            </option>
            <option value="teacher">Teacher</option>
          </Form.Select>
        </Form.Group>

        {/* First Name */}

        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>First Name</Form.Label>
          <Form.Control required type="text" placeholder="Enter First Name" />
        </Form.Group>

        {/* Last name */}
        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type="text" placeholder="Enter Last Name" />
        </Form.Group>

        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control required type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-2" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" placeholder="Password" />
        </Form.Group>

        {/* Branch */}

        <Form.Group className="mb-2" controlId="formRoleSelection">
          <Form.Label>Branch</Form.Label>
          <Form.Select aria-label="Default select example">
            <option defaultValue value="it">
              IT
            </option>
            <option value="cse">CSE</option>
          </Form.Select>
        </Form.Group>

        {/* College ID */}

        <Form.Group className="mb-3" controlId="formFile">
          <Form.Label>Upload College ID</Form.Label>
          <Form.Control
            required
            onChange={(e) => {
              checkValidity(e);
            }}
            isValid={valid}
            isInvalid={invalid}
            name="collegeID"
            accept="image/png, image/jpeg"
            type="file"
          />
        </Form.Group>

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
    </div>
  );
};

export default Register;
