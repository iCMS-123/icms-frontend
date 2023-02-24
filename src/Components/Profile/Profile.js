import axios from "axios";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Button, Form, Image, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import "./Profile.css";
function Profile() {
  useDocumentTitle("Profile");
  // A variable that will help to re-render by using it as inverter
  // let [updateFormFields, setUpdateFormFields] = useState(false);
  // Referenced Variables
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const collegeIdRef = useRef(null);
  const profileImgRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const navigate = useNavigate();
  // For toast
  const [show, setShow] = useState(false);

  useEffect(() => {
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    if(icmsLocalStorageData == null)
    {
      navigate("../login");
    }else{
      let userData = icmsLocalStorageData["data"]["user"];
      if(userData == null){
        userData = icmsLocalStorageData["data"]
      }   
      console.log(userData);
      firstNameRef.current.value = userData.firstName;
      lastNameRef.current.value = userData.lastName;
      emailRef.current.value = userData.email;
      collegeIdRef.current.value = userData.collegeIdCard;
      profileImgRef.current.src = userData.profileImg;
      phoneRef.current.value = userData.mobileNumber;


    }
    
     
  }, []);


  async function updateProfile(e) {
    e.preventDefault();
    let passwordValue = passwordRef.current.value;
    let confirmPasswordValue = confirmPasswordRef.current.value;
     
    // both values are present(not NULL)
    if(passwordValue !== confirmPasswordValue){
        // console.log("Password and Confirm Password do not match!");
        alert("Password and Confirm Password do not match!");
    }
    else{   
    
    // Getting userID  
    let userData = JSON.parse(localStorage.getItem("icmsUserInfo"))["data"]["user"];
    if(userData == null){
      userData = JSON.parse(localStorage.getItem("icmsUserInfo"))["data"]
    }
    let userID = JSON.parse(localStorage.getItem("icmsUserInfo"))["data"]["_id"];
    console.log(userID);
    const updatedDetails = {
          userId :  userID,
          firstName :  firstNameRef.current.value,
          lastName : lastNameRef.current.value,
          mobileNumber : phoneRef.current.value,
          password : passwordRef.current.value,
          // profileImg : profileImgRef["current"].src,

    }
    // console.log(updatedDetails)
    try {
      const response = await axios.put("http://localhost:8002/api/v1/teacher/update", updatedDetails);
      console.log(response);
      localStorage.setItem("icmsUserInfo", JSON.stringify(response.data));  
      if(response.data.success){
        // show toast
        setShow(true)
      }   
    } catch(err) {
        console.log(err);
    }
  }
}

  return (
    <div className="profile-section">
      <div id="profile-img">
        <Image
          className="img img-fluid"
          src=""
          ref={profileImgRef}
          alt="profile-img"
        />
      </div>
      <div className="profile-details">
        <Form onSubmit={updateProfile} id="update-profile-form">
          {/* First Name */}

          <Form.Group className="mb-2" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              ref={firstNameRef}
              required
              type="text"
              placeholder="Enter First Name"
            />
          </Form.Group>

          {/* Last name */}
          <Form.Group className="mb-2" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              ref={lastNameRef}
              required
              type="text"
              placeholder="Enter Last Name"
            />

            
          </Form.Group>
          {/* <FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3"
      >
        <Form.Control type="email" placeholder="name@example.com" />
      </FloatingLabel> */}
          <Form.Group className="mb-2" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              ref={emailRef}
              required
              type="email"
              disabled
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formPassword">
            <Form.Label>Update Password</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              placeholder="Enter New Password"
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              ref={confirmPasswordRef}
              type="password"
              placeholder="Enter New Password Again"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              ref={phoneRef}
              required
              type="tel"
              placeholder="Enter Phone Number"
            />
          </Form.Group>



          {/* Branch */}

          {/* <Form.Group className="mb-2" controlId="formBranchSelection">
          <Form.Label>Branch</Form.Label>
          <Form.Select ref={branchRef} aria-label="Default select example">
            <option defaultValue value="it">
              IT
            </option>
            <option value="cse">CSE</option>
          </Form.Select>
        </Form.Group> */}

          {/* Link for College ID */}
          {/* We are not updating this for now */}
          <Form.Group className="mb-3" controlId="formCollegeIdLink">
            <Form.Label>College ID Google Drive Link</Form.Label>
            <Form.Control
              ref={collegeIdRef}
              name="collegeID"
              type="url"
            />
          </Form.Group>

          {/* show modal on first click */}
          <Button className="save-btn" variant="success" type="submit">
            Save
          </Button>
                  {/* Profile Details Updated Successfully */}   
     <ToastContainer style={{top:'150px', right:'0px'}} className="p-3">  
      <Toast className = {'text-white'} bg = {'success'} onClose={() => setShow(false)} show={show} delay={3000} autohide>    
       
        <Toast.Body>Profile Updated Successfully !</Toast.Body>
      </Toast>
     </ToastContainer>
        </Form>


      </div>
    </div>
  );
}

export default Profile;
