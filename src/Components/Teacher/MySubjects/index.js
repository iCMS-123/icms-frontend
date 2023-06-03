import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import styles from './styles.module.css';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge, Table } from 'react-bootstrap'
import Loader1 from "../../Loader/Loader-1/index";
import Message from "../../Message/index";
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk, FaRegCalendarAlt, FaUsers } from 'react-icons/fa';
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

const MySubject = () => {
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    let userData = icmsLocalStorageData.data;
    console.log(userData);
    let userID = userData._id;
    console.log(userID);
    const navigate = useNavigate()

    const isUserSectionHead = JSON.parse(localStorage.getItem("icmsUserInfo")).data.user.isSectionHead;
    const isUserHod = JSON.parse(localStorage.getItem("icmsUserInfo")).data.isHod;

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

    const [departmentTeachersList, setDepartmentTeachersList] = useState([]);

    const getDepartmentTeachersList = async () => {
        try {
            const { data } = await axios.get(
                `${url}/api/v1/teacher/get-list?branch=${sectionBranch}`
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
        getDepartmentTeachersList()
    }, []);


    async function showSubjectCardModal(idx) {
        setSubjectCardDetailsForModal(subjectList[idx]);
        fetchAttendanceData(subjectList[idx].sectionId._id, subjectList[idx].subjectId)
        setSubjectCardModalShow(true);
    }

    async function fetchAttendanceData(secId, subId) {
        try {
            const { data } = await axios.get(`${url}/api/v1/section/get-attendance-subject-section-id?sectionId=${secId}&subjectId=${subId}`);

            if (data && data.success) {
                displayAttendanceData(data?.data[0].attendance)
            }
        } catch (e) {
            console.log(e, "e");
        }
    }

    // Refs
    const modalSubjectNameRef = useRef(null);
    const modalSubjectCodeRef = useRef(null);
    const modalSubjectTeacherIdRef = useRef(null);
    const modalSubjectCodeForUpdateRef = useRef(null);
    const modalSubjectTeacherIdForUpdateRef = useRef(null);

    // Attendance Code Starts here
    // For attendance
    const [attendanceCountLabels, setAttendanceCountLabels] = useState([]);
    const [dateLabels, setDateLabels] = useState([]);

    function displayAttendanceData(data) {
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

    const fetchSubjectList = async () => {
        try {
            const subjectList = await axios.get(`${url}/api/v1/teacher/fetch-subjects/${userID}`)
            console.log(subjectList?.data.data, "subjectList?.data.data");
            setSubjectList(subjectList?.data?.data)
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (userData === null) {
            navigate("/login");
        }
        fetchSubjectList();
    }, [])

    return (
        <div>

            {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}
            {/* {subjectList == null && (
                <p>Currently there are no subjects added.</p>
            )}

            <Row xs={1} md={3} className="">
                {subjectList != null && subjectList.length !== 0 &&
                    subjectList?.map((subject, index) => (
                        <Col className="mb-2" key={index}>
                            <Card
                                className={styles.subjectCards}
                            // onClick={(e) => showSubjectCardModal(index)}
                            >
                                <Card.Body>
                                    <Card.Title>{subject?.subjectName || ""}</Card.Title>
                                    <div className='flex'>
                                        <div className='flex flex-column w-50'>
                                            <Badge bg="dark" className='mb-1 left pa0-5'>
                                                Year: {subject?.sectionId?.sectionYear || ""}
                                            </Badge>
                                            <Badge bg="dark" className='left pa0-5'>
                                                Branch: {subject?.sectionId?.sectionBranchName || ""}
                                            </Badge>
                                        </div>
                                        <div className='flex flex-column items-center justify-center mx-2'>
                                             {subject?.sectionId?.sectionStudents?.length} students
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
            </Row> */}

            <div id={styles.currentSubjects}>
                {/* branch fetch logic will come here */}
                <h5 style={{ fontWeight: "bold" }}>
                    Subjects Assigned
                </h5>
                {(subjectList == null || subjectList.length == 0) && (
                    <p className='mt-3'>Currently there are no subjects assigned to you.</p>
                )}
                {(subjectList == null || subjectList.length == 0) && isUserSectionHead && (
                    <span className='text-info'>But you are Section Head! Go ahead and do the honours.</span>
                )}
                {(subjectList == null || subjectList.length == 0) && isUserHod && (
                    <span className='text-info'>You may request the respective section heads to do so!</span>
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
                                        {/* <div style={{ display: 'flex' }}>
                                            <Image src={subject?.subjectTeacher?.profileImg} roundedCircle={true} style={{ height: "40px", width: '40px' }} className="me-3" />
                                            <span style={{ display: 'flex', flexDirection: 'column' }}>
                                                <b>{subject?.subjectTeacher?.firstName + " " + subject?.subjectTeacher?.lastName}</b>
                                                <b className="mb-2 text-muted">Subject Teacher </b>
                                            </span>
                                        </div> */}
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
                            {/* <div
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
                            </div> */}
                            <div
                                id="right-section"
                                style={{ width: "100%", padding: "10px 20px" }}
                                // style={{ width: "70%", padding: "10px 20px" }}
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
                                        <Col style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
                                            <h6>Attendance </h6>

                                            <Line options={allTimeOptions} data={alltimeData} style={{ maxHeight: "250px", maxWidth: "70%" }} />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        
                    </Modal.Footer> */}
                </Modal>
                {/* Modal (for subject details) code ends */}
            </div>

        </div>
    )
}


export default MySubject;