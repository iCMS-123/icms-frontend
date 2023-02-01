import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import "./Profile.css"
function Profile() {
    useDocumentTitle("Profile");
    const icmsUserInfo = JSON.parse(localStorage.getItem('icmsUserInfo'));
    const userData = icmsUserInfo['user'];
    useEffect(() => {
        firstNameRef.current.value = userData.firstName;
        lastNameRef.current.value = userData.lastName;
        emailRef.current.value = userData.email;
        collegeIdRef.current.value = userData.collegeIdCard;
        profileImgRef.current.src = userData.profileImg;
        // lastNameRef

    }, [])

    // Referenced Variables
    const collegeRoleRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const branchRef = useRef(null);
    const collegeIdRef = useRef(null);
    const profileImgRef = useRef(null);


    async function handleSubmit(e) {
        e.preventDefault();
        console.log('imma');
        try {


            const response = await axios.post('', {

            });



        } catch {



        }





    }


return (<div className="profile-section">
    <div id="profile-img">
        <Image className="img img-fluid" src="" ref={profileImgRef} alt="profile-img" />
    </div>
    <div className="profile-details">
        <Form onSubmit={handleSubmit} id="update-profile-form">


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
                <Form.Control ref={emailRef} required type="email" disabled placeholder="Enter email" />
            </Form.Group>




            <Form.Group className="mb-2" controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control ref={phoneRef} defaultValue="123" required type="tel" placeholder="Enter Phone Number" />
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

            <Form.Group className="mb-3" controlId="formCollegeIdLink">
                <Form.Label>College ID Google Drive Link</Form.Label>
                <Form.Control ref={collegeIdRef} required name="collegeID" type="url" />
            </Form.Group>

            {/* show modal on first click */}
            <Button className="save-btn" variant="success" type="submit">
                Save
            </Button>
        </Form>
    </div>




</div>



)

}


export default Profile;