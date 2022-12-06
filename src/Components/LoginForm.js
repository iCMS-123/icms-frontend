import React from 'react'
import { Button ,InputGroup, Form} from 'react-bootstrap'

const FormStyle = {
    width: '50%',
    margin: 'auto',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px #ccc'
}

 const LoginForm = () => {
  return (
    <div>
        
        <Form style={FormStyle}>

            <Form.Group id="radio-grp" controlId="forRoleSelection">
                <Form.Label>Select Role</Form.Label>
                <InputGroup className="mb-3">
                <InputGroup.Radio name="role" aria-label="Radio Button for Selecting Role" />
                <Form.Control aria-label="Text input with checkbox" placeholder="Student"/>
                </InputGroup>
                <InputGroup>
                <InputGroup.Radio name="role" aria-label="Radio button for following text input" />
                <Form.Control aria-label="Text input with radio button" placeholder="Teacher" />
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>


     </Form>

        
    </div>
  )
}

export default LoginForm