import React, { useEffect, useState } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const FormStyle = {
  width: "50%",
  margin: "auto",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxShadow: "0 0 10px #ccc",
};

const registerBtnStyles = {
  float:'right'
}

const LoginForm = () => {
  // const [role, setRole] = useState("student")

  // useEffect(() => {
  //   console.log('chnages')
  //   let registerBtn = document.querySelector('.reg-btn')

  //    return;
  // }, [role])

  function handleRoleChange(e) {
    let role = e.target.selectedOptions[0].value;
    let registerBtn = document.querySelector(".reg-btn");

    if(role === "teacher")
    {
      registerBtn.style.setProperty('display','none');
    }
    else{
      registerBtn.style.setProperty('display','inline');
    }
  }

  return (
    <div>
      <Form style={FormStyle}>
        {/* <div className="input-group mb-3">
          <label className="input-group-text" for="inputGroupSelect01">
            Role
          </label>
          <select className="form-select" id="inputGroupSelect01">
            <option selected value="student">
              Student
            </option>
            <option value="teacher">Teacher</option>
          </select>
        </div> */}

        <Form.Group controlId="formRoleSelection">
          <Form.Label>Role</Form.Label>
          <Form.Select
            onChange={(e) => {
              handleRoleChange(e);
            }}
            aria-label="Default select example"
          >
            <option defaultValue value="student">
              Student
            </option>
            <option value="teacher">Teacher</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

            
        <Button variant="success" type="submit">
          Login
        </Button>
        
        <Link to='/register'><Button style={registerBtnStyles} className="reg-btn" variant="primary" type="submit">
          Register
        </Button></Link>
        
      </Form>
    </div>
  );
};

export default LoginForm;
