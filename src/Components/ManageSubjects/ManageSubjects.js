import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge, Table } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk, FaRegCalendarAlt, FaUsers } from 'react-icons/fa';
import CloudinaryMarkAttendanceWidget from "../CloudinaryWidget/CloudinaryMarkAttendanceWidget";
import Loader1 from "../Loader/Loader-1/index";
import Message from "../Message/index";
import styles from './index.module.css'
import { FaTimesCircle } from "react-icons/fa"
import moment from "moment"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { url } from '../url'

const ManageSubjects = () => {
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    let userData = icmsLocalStorageData.data;
    console.log(userData);
    let userID = userData._id;
    console.log(userID);

    let yearMap = ["First Year", "Second Year", "Third Year", "Fourth Year"];

    // For toast
    const [error, seterror] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const currUser = JSON.parse(localStorage.getItem("icmsUserInfo")).data._id;
    // console.log(currUser);
    const [sectionData, setSectionData] = useState(null);
    const [sectionBranch, setSectionBranch] = useState(JSON.parse(localStorage.getItem("icmsUserInfo")).data.user.branchName);
    const [sectionId, setSectionId] = useState(JSON.parse(localStorage.getItem("icmsUserInfo")).data.sectionHeadRef);
    const [subjectList, setSubjectList] = useState(null);
    const [subjectCardModalShow, setSubjectCardModalShow] = useState(false);
    const [subjectCardDetailsForModal, setSubjectCardDetailsForModal] =
        useState(false);
    const [showCreateSubjectModal, setModalCreateSubjectShow] =
        useState(false);

    const getClassroomData = async () => {
        try {
            const { data } = await axios.get(`${url}/api/v1/section/get-section-data/${currUser}`);

            if (data && data.success) {
                setSectionData(data.data);
                setSectionBranch(data.data.sectionBranchName)
                setSectionId(data.data.id)
                console.log(data.data, "section data");
            }
        } catch (e) {
            console.log(e, "e");
        }
    };

    const getSubjectsList = async () => {
        try {
            const { data } = await axios.get(`${url}/api/v1/section/get-section-subject-list/${sectionId}`);

            if (data && data.success)
                setSubjectList(data.data);
        } catch (e) {
            console.log(e, "e");
        }
    }

    const [departmentTeachersList, setDepartmentTeachersList] = useState([]);

    const getDepartmentTeachersList = async () => {
        try {
            const { data } = await axios.get(
                `${url}/api/v1/teacher/get-list?branch=${sectionBranch}&isSubjectCreation=true`
            );

            if (data && data.success) {
                setDepartmentTeachersList(data.data.teacherList);
                console.log(data.data.teacherList, "DepartmentTeachersList");
            }

        } catch (e) {
            console.log(e, "e");
        }
    };

    useEffect(() => {
        getClassroomData();
        getSubjectsList()
        getDepartmentTeachersList()
    }, []);


    async function showSubjectCardModal(idx) {
        setSubjectCardDetailsForModal(subjectList[idx]);
        displayAttendanceData(subjectList[idx].attendance)
        setSubjectCardModalShow(true);
    }

    // Refs
    const modalSubjectNameRef = useRef(null);
    const modalSubjectCodeRef = useRef(null);
    const modalSubjectTeacherIdRef = useRef(null);
    const modalSubjectCodeForUpdateRef = useRef(null);
    const modalSubjectTeacherIdForUpdateRef = useRef(null);

    async function handleModalForm(e) {
        e.preventDefault();
        console.log(JSON.parse(localStorage.getItem("icmsUserInfo")).data._id);
        try {
            let { data } = await axios.post(`${url}/api/v1/section/create-subject/${sectionId}`, {
                subjectName: modalSubjectNameRef?.current?.value,
                subjectTeacherId: modalSubjectTeacherIdRef?.current?.value,
                subjectCode: modalSubjectCodeRef?.current?.value,
                subjectCreatedBy: JSON.parse(localStorage.getItem("icmsUserInfo")).data._id,
            });

            setModalCreateSubjectShow(false);

            getSubjectsList()

            console.log(data, "Subject created");

            setSuccess(true);
            setSuccessMessage("Subject created successfully !");
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            console.log(err, "Subject not created");
            seterror(err.response.data.error);
            setTimeout(() => seterror(null), 3000);
            // alert(err.message);
        }
    }

    const submitUpdateSubjectTeacherForm = async (e) => {
        e.preventDefault();
        console.log("submitUpdateSubjectTeacherForm called");
        try {
            const { data } = await axios.post(`${url}/api/v1/section/update-subject-teacher/${sectionId}`, {
                subjectId: modalSubjectCodeForUpdateRef.current.value,
                newSubjectTeacherId: modalSubjectTeacherIdForUpdateRef.current.value
            });
            console.log(data, "ddaattaa");
            if (data && data.success) {
                await getSubjectsList();
                setSubjectCardModalShow(false)
                setSuccessMessage("Subject Teacher updated successfully!")
                setSuccess(true);
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (e) {
            console.log(e, "e");
            seterror(e.response.data.msg);
            setTimeout(() => seterror(null), 3000);
        }
    };

    // Attendance Code Starts here
    // For attendance
    const [attendanceCountLabels, setAttendanceCountLabels] = useState([]);
    const [dateLabels, setDateLabels] = useState([]);

    function displayAttendanceData(data){
        let attendanceData = data;
        attendanceData = attendanceData.sort((a, b) => moment(a.date).diff(moment(b.date)));
        let temp1 = [];
        let temp2 = [];
        attendanceData.map((item, idx) => {
            temp1.push(item.date);
            temp2.push(item.presentStudents.length);
        })
        setDateLabels(temp1);
        setAttendanceCountLabels(temp2);
    }

    // Chart.js code
    // for chartjs
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const allTimeOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Attendance of last 30 days',
            },
        },
    };
    const allTimeLabels = dateLabels.slice(-30);
    const alltimeData = {
        labels: allTimeLabels,
        datasets: [
            {
                label: 'Number of students',
                data: attendanceCountLabels.slice(-30),
                borderColor: "rgba(0, 191, 160, 1)",
                backgroundColor: "rgba(0, 191, 160, 0.5)",
            },
        ],
    };

    // Attendance Code Ends here

    return (
        <div>

            {/* Attendance */}
            {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}

            <section className="student-count">
                {(sectionData != null) && <>
                    <h5>
                        <strong className="text-muted">
                            {sectionData?.sectionName?.toUpperCase()}
                        </strong>
                        <Badge bg="success" style={{ float: 'right', margin: '0 10px' }}>
                            {yearMap[sectionData.sectionYear - 1]}
                        </Badge>
                        <Badge bg="dark" style={{ float: 'right', margin: '0 10px' }}>
                            {sectionData?.sectionBranchName?.toUpperCase() || ""}
                        </Badge>
                    </h5>
                </>}
            </section>

            <div id={styles.currentSubjects}>
                {/* branch fetch logic will come here */}
                <h5 style={{ fontWeight: "bold" }} className="pt-4">
                    Current Subjects
                </h5>
                {subjectList == null && (
                    <p>Currently there are no subjects added.</p>
                )}

                <Row xs={1} md={3} className="">
                    {subjectList != null && subjectList.length !== 0 &&
                        subjectList?.map((subject, index) => (
                            <Col className="mb-2" key={index}>
                                <Card
                                    className={styles.subjectCards}
                                    onClick={(e) => showSubjectCardModal(index)}
                                >
                                    <Card.Body>
                                        <Card.Title>{subject?.subjectName || ""}</Card.Title>
                                        <div style={{ display: 'flex' }}>
                                            <Image src={subject?.subjectTeacher?.profileImg} roundedCircle={true} style={{ height: "40px", width: '40px' }} className="me-3" />
                                            <span style={{ display: 'flex', flexDirection: 'column' }}>
                                                <b>{subject?.subjectTeacher?.firstName + " " + subject?.subjectTeacher?.lastName}</b>
                                                <b className="mb-2 text-muted">Subject Teacher </b>
                                            </span>
                                        </div>
                                        <Badge bg="dark" style={{ position: 'absolute', top: '10px', right: '30px' }}>
                                            {subject?.subjectId || ""}
                                        </Badge>
                                        <Badge bg="info" style={{ position: 'absolute', bottom: '10px', right: '30px' }}>
                                            {subject?.subjectCode || ""}
                                        </Badge>
                                        <div className={styles.gocorner} href="#">
                                            <div className={styles.goarrow}>→</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                </Row>

                {/* Modal (for subject details) code starts */}
                <Modal
                    show={subjectCardModalShow}
                    fullscreen={true}
                    onHide={() => setSubjectCardModalShow(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Subject Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* {subjectCardDetailsForModal} */}
                        <div style={{ display: "flex", width: "100%", height: "100%" }}>
                            <div
                                id="left-section"
                                style={{
                                    width: "30%",
                                    background:
                                        "linear-gradient(90deg, #FDBB2D 0%, #3A1C71 100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                }}
                            >
                                <h5>
                                    <Badge bg="secondary" style={{ marginBottom: "20px" }}>
                                        Subject Teacher
                                    </Badge>
                                </h5>
                                <Image
                                    src={subjectCardDetailsForModal.subjectTeacher?.profileImg}
                                    roundedCircle={true}
                                    style={{ height: "100px", width: "100px" }}
                                    className="mb-3"
                                />
                                <h5>
                                    {subjectCardDetailsForModal.subjectTeacher?.firstName +
                                        " " +
                                        subjectCardDetailsForModal.subjectTeacher?.lastName}
                                </h5>

                                {subjectCardDetailsForModal.subjectTeacher?.isVerified && (
                                    <p>
                                        VERIFIED
                                        <FaUserCheck
                                            style={{ marginLeft: "10px", color: "green" }}
                                        />
                                    </p>
                                )}
                                {!subjectCardDetailsForModal.subjectTeacher?.isVerified && (
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
                                            <h6>Subject Id</h6>
                                            <p className="text-muted">
                                                {subjectCardDetailsForModal?.subjectId || ""}
                                            </p>
                                        </Col>
                                        <Col style={{ display: "flex", flexDirection: "column" }}>
                                            <h6>Subject Name</h6>
                                            <p className="text-muted">
                                                {subjectCardDetailsForModal?.subjectName || ""}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ display: "flex", flexDirection: "column" }}>
                                            <h6>Subject Code</h6>
                                            <p className="text-muted">
                                                {subjectCardDetailsForModal?.subjectCode || ""}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col style={{ display: "flex", flexDirection: "column", marginBottom : "20px" }}>
                                            <h6>Attendance </h6>

                                            <Line options={allTimeOptions} data={alltimeData} style={{ maxHeight : "250px", maxWidth : "70%" }}/>
                                        </Col>
                                    </Row>

                                    <Col>

                                        <Form onSubmit={submitUpdateSubjectTeacherForm}>
                                            <Form.Control
                                                ref={modalSubjectCodeForUpdateRef}
                                                value={subjectCardDetailsForModal?.subjectId}
                                                required
                                                type="text"
                                                hidden
                                            />
                                            <Form.Group
                                                className="mb-2"
                                                controlId="modalFormCoordinatorSelection"
                                            >
                                                <Form.Label>Update Subject Teacher</Form.Label>
                                                {(!departmentTeachersList.length) && <p className="text-muted">No teacher available currently!</p>}
                                                <Form.Select ref={modalSubjectTeacherIdForUpdateRef} style={{ display: (departmentTeachersList.length) ? '' : 'none' }} aria-label="Default select example">
                                                    <option value="">Select Subject Teacher</option>
                                                    {departmentTeachersList?.length != 0 && departmentTeachersList?.map((option, index) => (
                                                        <option key={index} value={option._id}>
                                                            {option.firstName + " " + option.lastName}
                                                        </option>
                                                    ))}

                                                </Form.Select>
                                            </Form.Group>
                                            <Button variant="dark" type="submit" disabled={departmentTeachersList?.length < 1} className="mt-2">
                                                Submit
                                            </Button>

                                        </Form>
                                    </Col>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        
                    </Modal.Footer> */}
                </Modal>
                {/* Modal (for subject details) code ends */}

                <Button
                    key={true}
                    className="me-2 mt-4 mb-2"
                    style={{ position: "absolute", top: "10px", right: "10px" }}
                    onClick={() => {
                        setModalCreateSubjectShow(true);

                        getDepartmentTeachersList();
                    }}
                    variant="success"
                >
                    Add New Subject
                </Button>

                {/* Modal code starts */}
                <Modal
                    show={showCreateSubjectModal}
                    fullscreen={true}
                    onHide={() => setModalCreateSubjectShow(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Subject</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loading ? <Loader1></Loader1> : ""}

                        <Form>
                            <Row xs={2} md={2}>
                                <Col>
                                    <Form.Group

                                        className="mb-2"
                                        controlId="modalSubjectName"
                                    >
                                        <Form.Label>Subject Name</Form.Label>
                                        {/* <Form.Select ref={modalYearRef} aria-label="Default select example">
                                            <option defaultValue value="1">
                                                {" "}
                                                1st Year
                                            </option>
                                            <option value="2"> 2nd Year</option>
                                            <option value="3"> 3rd Year</option>
                                            <option value="4"> 4th Year</option>
                                        </Form.Select> */}
                                        <Form.Control
                                            ref={modalSubjectNameRef}
                                            required
                                            type="text"
                                            placeholder="Enter Subject Name"
                                            maxLength="200"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-2" controlId="modalSubjectCode">
                                        <Form.Label>Subject Code</Form.Label>
                                        <Form.Control
                                            ref={modalSubjectCodeRef}
                                            required
                                            type="text"
                                            placeholder="Enter Subject Code"
                                            maxLength="10"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group

                                        className="mb-2"
                                        controlId="modalFormSectionSelection"
                                    >
                                        <Form.Label>Subject Teacher</Form.Label>
                                        {(!departmentTeachersList.length) && <p className="text-muted">No teacher available currently!</p>}
                                        <Form.Select ref={modalSubjectTeacherIdRef} style={{ display: (departmentTeachersList.length) ? '' : 'none' }} aria-label="Default select example">
                                            <option value="">Select Subject Teacher</option>
                                            {departmentTeachersList?.length != 0 && departmentTeachersList?.map((option, index) => (
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
                        <Button onClick={handleModalForm} variant="success" disabled={departmentTeachersList?.length < 1} className="mt-2">
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Modal code ends */}
            </div>





        </div>
    );
};

export default ManageSubjects;
