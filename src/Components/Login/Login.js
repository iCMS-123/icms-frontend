import React from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import "./Login.css";

const LoginForm = () => {
  useDocumentTitle("Login");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

   
    navigate("/dashboard");
  };
  return (
    <div>
      <h1 style={{ fontWeight: "900" }} className="mb-3 text-center">
        Good to see you again
      </h1>
      <Form id="login-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="formRoleSelection">
          <Form.Label>Role</Form.Label>
          <Form.Select aria-label="Default select example">
            <option defaultValue value="student">
              Student
            </option>
            <option value="teacher">Teacher</option>
          </Form.Select>
        </Form.Group>

        <Form.Group required className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" required placeholder="Enter email" />
          <Form.Control.Feedback type="invalid">
            Please enter valid email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control  type="password" required placeholder="Password" />
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
