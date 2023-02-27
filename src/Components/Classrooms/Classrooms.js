import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk } from "react-icons/fa";
import styles from "./Classroom.module.css";
import Loader1 from "../Loader/Loader-1/index";
import axios from "axios";

const Classrooms = () => {
  const [loading, setLoading] = useState(false);

  const [classroomList, setClassroomList] = useState(null);
  const [classroomCardModalShow, setClassroomCardModalShow] = useState(false);
  const [classroomCardDetailsForModal, setClassroomCardDetailsForModal] =
    useState(false);
  const [showCreateClassroomModal, setModalCreateClassroomShow] =
    useState(false);
  const branchName =
    JSON.parse(localStorage.getItem("icmsUserInfo")).data.user.branchName || "";
  console.log(branchName);

  const [notSectionHeadList, setNotSectionHeadList] = useState([]);

  const getNotSectionHeadList = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8002/api/v1/hod/get-availabel-section-head?branchName=${branchName}&isSectionHead=false`
      );

      if (data && data.success) {
        setNotSectionHeadList(data.data);
        console.log(data.data, "setNotSectionHeadList");
      }
    } catch (e) {
      console.log(e, "e");
    }
  };

  return (
    <div className="container">
      <div id={styles.currentClassrooms}>
        {/* branch fetch logic will come here */}
        <h5 style={{ fontWeight: "bold" }} className="pt-4">
          Current Classrooms
        </h5>
        {classroomList == null && (
          <p>Currently there are no classrooms added.</p>
        )}
        <Row xs={1} md={4} className="g-4">
          {classroomList != null &&
            classroomList.map((branch, index) => (
              <Col>
                <Card
                  className={styles.branchCards}
                  onClick={(e) => setClassroomCardModalShow(index)}
                >
                  <Card.Body>
                    <Card.Title>{branch.name.toUpperCase()}</Card.Title>
                    <div style={{ display: "flex" }}>
                      <Image
                        src={branch.hodRef.profileImg}
                        roundedCircle={true}
                        style={{ height: "40px", width: "40px" }}
                        className="me-3"
                      />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <b>
                          {branch.hodRef.firstName +
                            " " +
                            branch.hodRef.lastName}
                        </b>
                        <b className="mb-2 text-muted">HOD </b>
                      </span>
                    </div>
                    {/* <Card.Text>
                                            Some quick example text to build on the card title and make up the
                                            bulk of the card's content.
                                        </Card.Text>
                                        <Card.Link href="#">Card Link</Card.Link>
                                        <Card.Link href="#">Another Link</Card.Link> */}
                    <div className={styles.gocorner} href="#">
                      <div className={styles.goarrow}>→</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>

        {/* Modal (For branch details and HOD update) code starts */}
        <Modal
          show={classroomCardModalShow}
          fullscreen={true}
          onHide={() => setClassroomCardModalShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Branch Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* {classroomCardDetailsForModal} */}
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
              <div
                id="left-section"
                style={{
                  width: "30%",
                  background:
                    "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <h5>
                  <Badge bg="secondary" style={{ marginBottom: "20px" }}>
                    HOD
                  </Badge>
                </h5>
                <Image
                  src={classroomCardDetailsForModal.hodRef?.profileImg}
                  roundedCircle={true}
                  style={{ height: "100px", width: "100px" }}
                  className="mb-3"
                />
                <h5>
                  {classroomCardDetailsForModal.hodRef?.firstName +
                    " " +
                    classroomCardDetailsForModal.hodRef?.lastName}
                </h5>

                {classroomCardDetailsForModal.hodRef?.isVerified && (
                  <p>
                    VERIFIED
                    <FaUserCheck
                      style={{ marginLeft: "10px", color: "green" }}
                    />
                  </p>
                )}
                {!classroomCardDetailsForModal.hodRef?.isVerified && (
                  <p>
                    NOT VERIFIED
                    <FaUserTimes style={{ marginLeft: "10px", color: "red" }} />
                  </p>
                )}
              </div>
              <div
                id="right-section"
                style={{ width: "70%", padding: "10px 20px" }}
              >
                <h6>Information</h6>
                <hr />
                <div style={{ padding: "10px 20px" }}>
                  <Row>
                    <Col style={{ display: "flex", flexDirection: "column" }}>
                      <h6>Branch</h6>
                      <p className="text-muted">
                        {classroomCardDetailsForModal.name?.toUpperCase()}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ display: "flex", flexDirection: "column" }}>
                      <h6>Students</h6>
                      <p className="text-muted">
                        {classroomCardDetailsForModal.students?.length}
                      </p>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column" }}>
                      <h6>Teachers </h6>
                      <p className="text-muted">
                        {classroomCardDetailsForModal.teachers?.length}
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
                        
                    </Modal.Footer> */}
        </Modal>
        {/* Modal (for branch details) code ends */}

        <Button
          key={true}
          className="me-2 mt-2 mb-2"
          onClick={() => {
            setModalCreateClassroomShow(true);

            getNotSectionHeadList();
          }}
          variant="success"
        >
          Add New Classroom
        </Button>

        {/* Modal code starts */}
        <Modal
          show={showCreateClassroomModal}
          fullscreen={true}
          onHide={() => setModalCreateClassroomShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Classroom</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? <Loader1></Loader1> : ""}

            <Form style={formStyles}>
              <Row xs={2} md={2}>
                <Col>
                  <Form.Group
                    
                    className="mb-2"
                    controlId="formPassword"
                  >
                    <Form.Label>Year</Form.Label>
                    <Form.Select aria-label="Default select example">
                      <option defaultValue value="1">
                        {" "}
                        1st Year
                      </option>
                      <option value="2"> 2nd Year</option>
                      <option value="3"> 3rd Year</option>
                      <option value="4"> 4th Year</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2" controlId="formPassword">
                    <Form.Label>Branch Name</Form.Label>
                    <Form.Control
                      value={branchName.toUpperCase()}
                      readOnly
                      required
                      type="text"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    
                    className="mb-2"
                    controlId="modalSectionSelection"
                  >
                    <Form.Label>Section</Form.Label>
                    <Form.Select aria-label="Default select example">
                      <option defaultValue value="1">
                        {branchName.toUpperCase()}-1
                      </option>
                      <option value="2">{branchName.toUpperCase()}-2</option>
                      <option value="3">{branchName.toUpperCase()}-3</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group
                    className="mb-2"
                    controlId="modalCoordinatorSelection"
                  >
                    <Form.Label>Assign a class coordinator</Form.Label>
                    <Form.Select aria-label="Default select example">
                      
                      {notSectionHeadList.map((option, index) => (
                        <option key={index} value={option._id}>
                          {option.firstName + " " + option.lastName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="success" className="mt-2" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal code ends */}
      </div>
    </div>
  );
};

export default Classrooms;

const formStyles = {
  // display: "flex",
  // justifyContent: "space-around",
  // border : "1px solid black",
  padding : "1% 6% 0%",
  width : "95%"
};
