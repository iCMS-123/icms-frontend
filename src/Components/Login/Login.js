import axios from "axios";
import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import "./Login.css";

const LoginForm = () => {
  useDocumentTitle("Login");
  const navigate = useNavigate();
  // Refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const collegeRoleRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let collegeRole = collegeRoleRef["current"].value;
    try {
      const {data} = await axios.post(
        `http://localhost:8002/api/v1/${collegeRole}/auth`,
        {
          email: `${emailRef["current"].value}`,
          password: `${passwordRef["current"].value}`,
        }
      );
      console.log(data);
      console.log('i am here');
      if(data.success===false)
      {
        alert("Email or Password is wrong");
      }else{
        let icmsUserInfo = JSON.stringify(data);
        if(icmsUserInfo){
          localStorage.setItem("icmsUserInfo", icmsUserInfo);
          // Success :: Redirect to dashboard
          if(collegeRole === "teacher"){
            navigate("/dashboard");
            console.log('ia m on');
          }else{
            navigate("/studentdashboard");
            console.log("Student")
          }
        }
      }
      
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h1 style={{ fontWeight: "900" }} className="mb-3 text-center">
        Good to see you again
      </h1>
      <Form id="login-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="formRoleSelection">
          <Form.Label>Role</Form.Label>
          <Form.Select ref={collegeRoleRef} aria-label="Default select example">
            <option defaultValue value="student">
              Student
            </option>
            <option value="teacher">Teacher</option>
          </Form.Select>
        </Form.Group>

        <Form.Group required className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            ref={emailRef}
            type="email"
            required
            placeholder="Enter email"
            autoComplete="username"
          />
          <Form.Control.Feedback type="invalid">
            Please enter valid email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            ref={passwordRef}
            type="password"
            required
            placeholder="Password"
            autoComplete="current-password"
          />
        </Form.Group>

        <Button className="lgn-btn" variant="success" type="submit">
          Login
        </Button>

        <hr />
        <p className="text-center fw-bold">Not Registered yet ?</p>
        <Link style={{ textDecoration: "none" }} to="/register">
          <Button className="reg-btn" variant="primary" type="submit">
            Register here
          </Button>
        </Link>
      </Form>
    </div>
  );
};

export default LoginForm;
