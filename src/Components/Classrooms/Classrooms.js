import { useEffect, useRef, useState } from "react";
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
  // setClassroomList(classroomList);
// classroomList.data.data.sectionData.sectionYear;
  let [classroomList, setClassroomList] = useState(null);
  const [classroomCardModalShow, setClassroomCardModalShow] = useState(false);
  const [classroomCardDetailsForModal, setClassroomCardDetailsForModal] =
    useState(false);
  const [showCreateClassroomModal, setModalCreateClassroomShow] =
    useState(false);

// Refs

  const modalYearRef = useRef(null);
  const modalBranchRef = useRef(null);
  const modalSectionRef = useRef(null);
  const modalClassCoordinatorRef = useRef(null);
  
  const branchName =
    JSON.parse(localStorage.getItem("icmsUserInfo")).data.user.branchName || "";
  console.log(branchName);

  useEffect(() => {
    const getClassroomsList = async () => {
      try {
        console.log(branchName);
        const { data } = await axios.get(`http://localhost:8002/api/v1/hod/get-list-section?branchName=${branchName}`);

        if (data && data.success) {
          setClassroomList([data.firstYear, data.secondYear, data.thirdYear, data.fourthYear]);
          console.log([data.firstYear, data.secondYear, data.thirdYear, data.fourthYear]);
          console.log(classroomList, "Classroom LIST");
        }
      } catch (e) {
        console.log(e, "e");
      }
    };

    getClassroomsList();

  }, []);
  let years = ["First Year", "Second Year", "Third Year", "Fourth Year"];

  async function showClassroomCardModal(idx, index){
    console.log(classroomList[idx][index], "classroomList[idx][index]");
    setClassroomCardDetailsForModal(classroomList[idx][index]);
    setClassroomCardModalShow(true);
  }

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
  async function handleModalForm(e) {
    e.preventDefault();
    console.log(modalSectionRef?.current);
    console.log(JSON.parse(localStorage.getItem("icmsUserInfo")).data._id);
    try{
      let {data} = await axios.post("http://localhost:8002/api/v1/hod/create-section", {
        year : modalYearRef?.current?.value,
        branchName : (modalBranchRef?.current?.value).toLowerCase(),
        sectionName : modalSectionRef?.current?.value,
        sectionHead : modalClassCoordinatorRef?.current?.value,
        sectionCreatedBy : JSON.parse(localStorage.getItem("icmsUserInfo")).data._id,
      });
       
      setModalCreateClassroomShow(false);
       
      let year = data.data.sectionData.sectionYear;
      classroomList[year-1].push(data.data.sectionData);
      setClassroomList(classroomList);
    }catch(err){
      alert(err.message);
    }
   

}

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

        {/* Year Wise Classroom Cards */}

        {years.map((yr, idx) => (

          <Row xs={1} md={4} className="">
            {classroomList != null && classroomList[idx].length !== 0 &&
              classroomList[idx].map((classRoom, index) => (
                <Col className="mb-2">
                  <Card
                    className={styles.branchCards}
                    onClick={(e) => showClassroomCardModal(idx, index)}
                  >
                    <Card.Body>
                      <Card.Title>{classRoom?.sectionName?.toUpperCase() || ""}</Card.Title>
                      <Badge bg="dark" style={{ position: 'absolute', top: '10px', right: '30px' }}>
                        {classRoom?.sectionBranchName?.toUpperCase() || ""}
                      </Badge>
                      <Badge bg="dark" style={{ position: 'absolute', bottom: '10px', right: '30px' }}>
                        {yr}
                      </Badge>
                      <div className={styles.gocorner} href="#">
                        <div className={styles.goarrow}>→</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        ))}

        {/* Modal (for classroom details) code starts */}
        <Modal
          show={classroomCardModalShow}
          fullscreen={true}
          onHide={() => setClassroomCardModalShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Classroom Details</Modal.Title>
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
                    Classroom Head
                  </Badge>
                </h5>
                <Image
                  src={classroomCardDetailsForModal.sectionHead?.profileImg}
                  roundedCircle={true}
                  style={{ height: "100px", width: "100px" }}
                  className="mb-3"
                />
                <h5>
                  {classroomCardDetailsForModal.sectionHead?.firstName +
                    " " +
                    classroomCardDetailsForModal.sectionHead?.lastName}
                </h5>

                {classroomCardDetailsForModal.sectionHead?.isVerified && (
                  <p>
                    VERIFIED
                    <FaUserCheck
                      style={{ marginLeft: "10px", color: "green" }}
                    />
                  </p>
                )}
                {!classroomCardDetailsForModal.sectionHead?.isVerified && (
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
                      <h6>Section</h6>
                      <p className="text-muted">
                        {classroomCardDetailsForModal?.sectionName?.toUpperCase() || ""}
                      </p>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column" }}>
                      <h6>Branch</h6>
                      <p className="text-muted">
                        {classroomCardDetailsForModal?.sectionBranchName?.toUpperCase() || ""}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ display: "flex", flexDirection: "column" }}>
                      <h6>Students</h6>
                      <p className="text-muted">
                        {classroomCardDetailsForModal.sectionStudents?.length}
                      </p>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column" }}>
                      <h6>Teachers </h6>
                      <p className="text-muted">
                        {classroomCardDetailsForModal.sectionTeachers?.length}
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
        {/* Modal (for classroom details) code ends */}

        <Button
          key={true}
          className="me-2 mt-4 mb-2"
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
                    controlId="modalFormYear"
                  >
                    <Form.Label>Year</Form.Label>
                    <Form.Select ref={modalYearRef} aria-label="Default select example">
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
                  <Form.Group className="mb-2" controlId="modalFormBranch">
                    <Form.Label>Branch Name</Form.Label>
                    <Form.Control
                      value={branchName?.toUpperCase() || ""}
                      ref = {modalBranchRef}
                      readOnly
                      required
                      type="text"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group

                    className="mb-2"
                    controlId="modalFormSectionSelection"
                  >
                    <Form.Label>Section</Form.Label>
                    <Form.Select ref = {modalSectionRef} aria-label="Default select example">
                      <option defaultValue value={`${branchName}-1`}>
                        {branchName?.toUpperCase() || ""}-1
                      </option>
                      <option value={`${branchName}-2`}>{branchName?.toUpperCase() || ""}-2</option>
                      <option value={`${branchName}-3`}>{branchName?.toUpperCase() || ""}-3</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group
                    className="mb-2"
                    controlId="modalFormCoordinatorSelection"
                  >
                    <Form.Label>Assign a class coordinator</Form.Label>
                    <Form.Select ref={modalClassCoordinatorRef} aria-label="Default select example">

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
            <Button onClick={handleModalForm} variant="success" className="mt-2">
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
  padding: "1% 6% 0%",
  width: "95%"
};
