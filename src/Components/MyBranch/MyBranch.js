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
import styles from "./MyBranch.module.css";
import Loader1 from "../Loader/Loader-1/index";
import axios from "axios";
import Message from "../Message/index";

const MyBranch = (props) => {
  const [loading, setLoading] = useState(false);
  // setClassroomList(classroomList);
  // classroomList.data.data.sectionData.sectionYear;
  let [classroomList, setClassroomList] = useState(null);
  const [classroomCardModalShow, setClassroomCardModalShow] = useState(false);
  const [classroomCardDetailsForModal, setClassroomCardDetailsForModal] =
    useState(false);
  const [showCreateClassroomModal, setModalCreateClassroomShow] =
    useState(false);
  // For toast
  const [show, setShow] = useState(false);
  // Refs

  const modalYearRef = useRef(null);
  const modalBranchRef = useRef(null);
  const modalSectionRef = useRef(null);
  const modalClassCoordinatorRef = useRef(null);

  let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
  console.log(icmsLocalStorageData);
  let userData = icmsLocalStorageData.data;
  let branchName = userData.branchName || userData.user.branchName;
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);


  const [issuesData, setIssuesData] = useState([]); // for issues data
  // For issue Modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueModalData, setIssueModalData] = useState({});
  const handleIssueModalClose = () => setShowIssueModal(false);
  const handleIssueModalShow = () => setShowIssueModal(true);


  function handleIssueModal(studentID) {
    const target = issuesData.find((obj) => {
      return obj._id == studentID;
    })
    setIssueModalData(target);
    handleIssueModalShow(true);
  }

  useEffect(() => {
    const getClassroomsList = async () => {
      try {
        console.log(branchName);
        const { data } = await axios.get(`http://localhost:8002/api/v1/hod/get-list-section?branchName=${branchName}`);

        if (data && data.success) {
          setClassroomList([data.firstYear, data.secondYear, data.thirdYear, data.fourthYear]);
          // setIssuesData(data.issues); // for issues data

          console.log([data.firstYear, data.secondYear, data.thirdYear, data.fourthYear]);
          console.log(classroomList, "Classroom LIST");
        }
      } catch (e) {
        console.log(e, "e");
      }
    };

    getClassroomsList();

  }, []);

  useEffect(() => {
    const getIssuesList = async () => {
      try {
        console.log(branchName);
        const { data } = await axios.get(`http://localhost:8002/api/v1/branch/get-branch-detail?branchName=${branchName}`);

        if (data && data.success) {
          console.log(data, "issues data");
          setIssuesData(data.data.branchData[0].issues); // for issues data
        }
      } catch (e) {
        console.log(e, "e");
      }
    };

    getIssuesList();

  }, []);
  let years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
  let yearWiseColors = ["info", "warning", "danger", "success"];

  async function showClassroomCardModal(idx, index) {
    console.log(classroomList[idx][index], "classroomList[idx][index]");

    try {
      const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-data/${classroomList[idx][index].sectionHead}`);

      if (data && data.success) {
        console.log(data, "section data");
        setClassroomCardDetailsForModal(data.data);
      }
    } catch (e) {
      console.log(e, "e");
    }

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
    try {
      let { data } = await axios.post("http://localhost:8002/api/v1/hod/create-section", {
        year: modalYearRef?.current?.value,
        branchName: (modalBranchRef?.current?.value).toLowerCase(),
        sectionName: modalSectionRef?.current?.value,
        sectionHead: modalClassCoordinatorRef?.current?.value,
        sectionCreatedBy: JSON.parse(localStorage.getItem("icmsUserInfo")).data._id,
      });

      setModalCreateClassroomShow(false);

      let year = data.data.sectionData.sectionYear;
      classroomList[year - 1].push(data.data.sectionData);
      setClassroomList(classroomList);

      console.log(data, "classroom created");

      setSuccess(true);
      setSuccessMessage("Classroom created successfully !");
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.log(err, "classroom not created");
      seterror(err.msg);
      setTimeout(() => seterror(null), 3000);
      // alert(err.message);
    }
  }

  
  const submitUpdateSectionHeadForm = async () => {
    try {
        const { data } = await axios.post(`${url}/api/v1/admin/update-section-data`, {
            sectionId: sectionId,
            id: sectionHeadIdForUpdate
        });
        console.log(data, "ddaattaa");
        if (data && data.success) {
            setClassroomCardModalShow(false)
            let otherSections = sectionData.filter((item) => item._id !== data.data._id);
            setBranchList([...otherBranches, data.data.sectionData])
            setSuccessMessage("Classroom Head updated successfully!")
            setSuccess(true);
        }
    } catch (e) {
        console.log(e, "e");
        seterror(e.response.data.msg);
        setTimeout(() => seterror(null), 3000);
    }
};

  return (
    <div className="container" style={{ position: "relative" }}>
      {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
      {success && (
        <Message variant={"success"}>{successMessage}</Message>
      )}
      <div id={styles.currentClassrooms}>
        {/* branch fetch logic will come here */}
        <h5 style={{ fontWeight: "bold" }} className="pt-4">
          Current Classrooms
        </h5>
        {classroomList == null && (
          <p>Currently there are no classrooms added.</p>
        )}

        {/* Year Wise Classroom Cards */}

        {years?.map((yr, idx) => (
          <>
            {/* <h5>{yr}</h5> */}
            <Row xs={1} md={4} className="" key={idx}>
              {classroomList != null && classroomList[idx].length !== 0 &&
                classroomList[idx]?.map((classRoom, index) => (
                  <Col className="mb-2" key={index}>
                    <Card
                      className={styles.branchCards}
                      onClick={(e) => showClassroomCardModal(idx, index)}
                    >
                      <Card.Body>
                        <Card.Title>{classRoom?.sectionName?.toUpperCase() || ""}</Card.Title>
                        <Badge bg="dark" style={{ position: 'absolute', top: '10px', right: '30px' }}>
                          {classRoom?.sectionBranchName?.toUpperCase() || ""}
                        </Badge>
                        <Badge bg={yearWiseColors[idx]} style={{ position: 'absolute', bottom: '10px', right: '30px' }}>
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
          </>
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
                  
                  <Col>
                  
                  <Form onSubmit={e => submitUpdateSectionHeadForm}>
                  <Form.Group
                    className="mb-2"
                    controlId="modalFormCoordinatorSelection"
                  >
                    <Form.Label>Update class coordinator</Form.Label>
                    {(!notSectionHeadList.length) && <p className="text-muted">No teacher available currently!</p>}
                    <Form.Select ref={modalClassCoordinatorRef} style={{ display: (notSectionHeadList.length) ? '' : 'none' }} aria-label="Default select example">

                      {notSectionHeadList?.map((option, index) => (
                        <option key={index} value={option._id}>
                          {option.firstName + " " + option.lastName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  </Form>
                </Col>
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
          style={{ position: "absolute", top: "10px", right: "10px" }}
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
                      ref={modalBranchRef}
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
                    <Form.Select ref={modalSectionRef} aria-label="Default select example">
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
                    {(! notSectionHeadList.length) && <p className="text-muted">No teacher available currently!</p>}
                    <Form.Select ref={modalClassCoordinatorRef} style={{display : (notSectionHeadList.length) ? '' : 'none' }} aria-label="Default select example">

                      {notSectionHeadList?.map((option, index) => (
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
            <Button onClick={handleModalForm} variant="success" disabled={notSectionHeadList.length ? 'false' : 'true'} className="mt-2">
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal code ends */}
      </div>


      {/* Issues */}
      <h4>Active Issues</h4>
      <section className="active-issues-section">
        <div className="active-issues-container" >

          {(issuesData == null) && <h6 className="text-muted">No issue posted currently!</h6>}
          {(issuesData != null) && (issuesData.length == 0) && <h6 className="text-muted">No issues posted currently!</h6>}
          {
            issuesData?.map((issue, idx) => {

              return <div key={idx} className="card issue-card">
                <div className="card-body">
                  <Badge style={{ float: 'right' }} bg={(issue.priority == 1 && "danger") || (issue.priority == 2 && "primary") || (issue.priority == 3 && "warning")}>{(issue.priority == 1 && "High") || (issue.priority == 2 && "Low") || (issue.priority == 3 && "Medium")}</Badge>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img

                        src={issue.issueSubmittedByStudent?.profileImg || 'https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png'}
                        alt="profile"
                        className="rounded-circle"
                        style={{ width: "60px", height: "60px" }}
                      />
                      <div className="ms-3">
                        <p className="mb-0">  {issue.issueSubmittedByStudent?.firstName + " " + issue.issueSubmittedByStudent?.lastName || 'Full Name'}</p>
                      </div>
                    </div>
                  </div>
                  <h5 className="card-title"> {issue.title || 'title to be added'}</h5>
                  <p className="card-text">
                    {issue.issueMsg.slice(0, 50) + '...'}   </p>
                  <a href="#" className="btn btn-primary" onClick={() => { handleIssueModal(issue._id) }}>
                    View Issue
                  </a>


                </div>
              </div>
            })
          }

        </div>

        {/* View Issue Card Modal*/}

        <Modal show={showIssueModal} onHide={handleIssueModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{issueModalData.issueTitle || 'Title'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Submitted By : {issueModalData.issueSubmittedByStudent?.firstName + " " + issueModalData.issueSubmittedByStudent?.lastName || 'Full Name'}</h6>
            <p>Description : {issueModalData.issueMsg || 'Issue Description'}</p>


          </Modal.Body>

        </Modal>
      </section>

      {/* Issues end */}

    </div>
  );
};

export default MyBranch;

const formStyles = {
  // display: "flex",
  // justifyContent: "space-around",
  // border : "1px solid black",
  padding: "1% 6% 0%",
  width: "95%"
};
