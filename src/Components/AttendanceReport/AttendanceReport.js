import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge, Table } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk, FaBookOpen, FaCalendar, FaUsers, FaBookmark } from 'react-icons/fa';
import CloudinaryMarkAttendanceWidget from "../CloudinaryWidget/CloudinaryMarkAttendanceWidget";
import Loader1 from "../Loader/Loader-1/index";
import Message from "../Message/index";
import styles from './index.module.css'
import { FaTimesCircle } from "react-icons/fa"
import moment from "moment"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AttendanceReport = () => {
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    let userData = icmsLocalStorageData.data;
    console.log(userData);
    let userID = userData._id;
    console.log(userID);
    const [sectionData, setSectionData] = useState(null);
    const [sectionStudents, setSectionStudents] = useState([]);
    let yearMap = ["First Year", "Second Year", "Third Year", "Fourth Year"];

    // For toast
    const [error, seterror] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const currUser = JSON.parse(localStorage.getItem("icmsUserInfo")).data._id;
    // console.log(currUser);

    const [uploadedGroupPhotos, setUploadedGroupPhotos] = useState([]);

    // For Manual Attendance
    let todaysDate = moment().format('YYYY-MM-DD');
    const isUserSectionHead = JSON.parse(localStorage.getItem("icmsUserInfo")).data.user.isSectionHead;
    const [selectedDate, setSelectedDate] = useState(todaysDate);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    const sectionId = JSON.parse(localStorage.getItem("icmsUserInfo")).data.sectionHeadRef;
    const [selectedSectionId, setSelectedSectionId] = useState(sectionId);
    const [selectedSubjectTeacherId, setSelectedSubjectTeacherId] = useState(null);
    const [fetchedAttendanceData, setFetchedAttendanceData] = useState([]);
    const [currentAttendance, setCurrentAttendance] = useState([]);
    const [todaysAttendanceUploaded, setTodaysAttendanceUploaded] = useState(false);

    async function selectedDateChanged(e) {
        await setSelectedDate(moment(e.target.value).format('YYYY-MM-DD'));
        fetchAttendanceForSelectedDetails(selectedSectionId, selectedSubjectId, moment(e.target.value).format('YYYY-MM-DD'));
    }
    async function selectedSubjectChanged(sId, tId) {
        console.log(sId, tId, "sID, tId");
        await setSelectedSubjectId(sId);
        await setSelectedSubjectTeacherId(tId)
        fetchAttendanceForSelectedDetails(selectedSectionId, sId, selectedDate)
    }
    async function selectedSectionChanged(sId) {
        await setSelectedSectionId(sId);
        await getListOfStudents(sId);
        await fetchSubjectsForSection(sId);
        fetchAttendanceForSelectedDetails(sId, selectedSubjectId, selectedDate)
    }
    async function fetchAttendanceForSelectedDetails(secId, subId, selDate) {
        const sectionId = JSON.parse(localStorage.getItem("icmsUserInfo")).data.sectionHeadRef;
        // const sectionId = "64006b64a96106bdcef99406";
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-attendance-subject-section-id?sectionId=${secId}&subjectId=${subId}`);

            if (data && data.success) {
                console.log(data.data[0], "attendanceForDate");
                let attendanceForDate = data.data[0].attendance.filter(item => item.date == ('' + new Date(selDate)).slice(0, 15))
                console.log(attendanceForDate, "attendanceForDate after filter");
                setFetchedAttendanceData(attendanceForDate);
                if (attendanceForDate.length == 0)
                    setCurrentAttendance([]);
                else
                    setCurrentAttendance(attendanceForDate[0]?.presentStudents);
            }
        } catch (e) {
            console.log(e, "e");
        }
    }

    const getListOfStudents = async (secId) => {
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/teacher/get-list-of-students/${secId}`);

            if (data && data.success) {
                setSectionStudents(data.data.verifiedStudents);
            }
        } catch (e) {
            console.log(e, "e");
        }
    };

    useEffect(() => {
        getClassroomData();
    }, [selectedDate])

    function unmarkThisStudent(id) {
        setCurrentAttendance(currentAttendance.filter(item => item != id));
    }

    function markThisStudent(id) {
        setCurrentAttendance(currentAttendance => [...currentAttendance, id]);
    }

    const getClassroomData = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-data/${currUser}`);

            if (data && data.success) {
                setSectionData(data.data);
                setSectionStudents(data.data.verifiedStudents);
            }
        } catch (e) {
            console.log(e, "e");
        }
    };

    useEffect(() => {
        if(isUserSectionHead)
            getClassroomData();
    }, []);

    async function handleOnGroupPhotoUpload(error, result, widget) {
        if (error) {
            seterror(error);
            setTimeout(() => seterror(null), 3000);
            console.log(error, "img upload error");
            widget.close({
                quiet: true
            });
            return;
        }
        console.log(result?.info?.secure_url, "img url");
        let currUrl = await result?.info?.secure_url;
        await setUploadedGroupPhotos(uploadedGroupPhotos => [...uploadedGroupPhotos, currUrl]);
        // setShowMarkButton(true);
        setSuccess(true);
        setSuccessMessage("Your images uploaded successfully!");
        setTimeout(() => setSuccess(false), 5000);
    }

    function removeThisImg(url) {
        let uploadedImgCopy = uploadedGroupPhotos.filter(img => img != url);
        setUploadedGroupPhotos(uploadedImgCopy);
    }

    const [subjectList, setSubjectList] = useState([]);

    const [sectionList, setSectionList] = useState([]);
    const [subjectListForSection, setSubjectListForSection] = useState([]);

    const getSubjectsList = async () => {
        const sectionId = JSON.parse(localStorage.getItem("icmsUserInfo")).data.sectionHeadRef;
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-subject-list/${sectionId}`);

            if (data && data.success)
                setSubjectList(data.data);
        } catch (e) {
            console.log(e, "e");
        }
    }

    const getSectionList = async () => {
        const branchName = JSON.parse(localStorage.getItem("icmsUserInfo")).data.user.branchName;
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/hod/get-list-section?branchName=${branchName}`);

            if (data && data.success) {
                setSectionList(data);
                console.log(data, "section list");
            }
        } catch (e) {
            console.log(e, "e");
        }
    }

    const fetchSubjectsForSection = async (sId) => {
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-subject-list/${sId}`);

            if (data && data.success)
                setSubjectListForSection(data.data);
        } catch (e) {
            console.log(e, "e");
        }
    }

    useEffect(() => {
        getSubjectsList()
        getSectionList()
    }, [])

    async function handleMarkAttendance() {
        // logic to mark attendance
        // a post request to backend with the list of uploaded images

        const sectionId = JSON.parse(localStorage.getItem("icmsUserInfo")).data.sectionHeadRef;
        const current_timestamp = moment().valueOf();

        console.log(`attandanceAtModel${sectionId}`)
        const testingData = Number(localStorage.getItem(`attandanceAtModel${sectionId}`));
        if (testingData && testingData + 3600000 > current_timestamp) {
            seterror("You have already requested for marking attendance! You can only request again after 60 minutes only if request fails.");
            setTimeout(() => seterror(null), 3000);
            return
        }

        if (new Date().toDateString() == new Date(selectedDate).toDateString) {
            seterror("You can request for marking attendance via Face recognition only for same date! You can mark via manual marking otherwise.");
            setTimeout(() => seterror(null), 3000);
        }

        try {
            axios.post("http://localhost:8002/api/v1/task/create-task", {
                sectionId: sectionId,
                taskId: current_timestamp,
                date: new Date().toDateString()
            })
                .then((res) => {
                    console.log(res, "response");
                    if (res.data.success) {
                        axios.post("https://7258-34-90-13-120.ngrok-free.app/mark_attendance", {
                            "sectionId": sectionId,
                            "activityTimeStamp": current_timestamp,
                            "date": new Date().toDateString(),
                            "image-links": uploadedGroupPhotos
                        });
                        setTodaysAttendanceUploaded(true)
                        setUploadedGroupPhotos([])
                        setSuccessMessage("Images uploaded for marking attendance successfully!")
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 3000);

                        localStorage.setItem(`attandanceAtModel${sectionId}`, current_timestamp);
                    }
                    else {
                        console.log(res.data?.error, "error from backend");
                        seterror("Request not processed! Try again!");
                        setTimeout(() => seterror(null), 3000);
                    }
                }).catch((err) => {
                    console.log(err.response?.data?.error, "Error from create-task endpoint");
                    seterror(err.response?.data?.error);
                    setTimeout(() => seterror(null), 3000);
                });
        } catch (err) {
            console.log(err, "Request not processed! Try again!");
            seterror(err.msg);
            setTimeout(() => seterror(null), 3000);
        }
    }

    async function uploadUpdatedAttendance() {
        // logic to mark attendance manually
        // a post request to backend with the list of selected students
        console.log(currentAttendance, "Marking Attendance manually")
        const sectionId = JSON.parse(localStorage.getItem("icmsUserInfo")).data.sectionHeadRef;
        try {
            let { data } = await axios.post("http://localhost:8002/api/v1/section/upload-section-attendance", {
                date: ('' + new Date(selectedDate)).slice(0, 15),
                presentStudents: currentAttendance,
                sectionId: sectionId,
                subjectId: selectedSubjectId,
                subjectTeacherId: selectedSubjectTeacherId
            });

            console.log(data, "manual attendance submitted");
            fetchAttendanceForSelectedDetails(selectedSectionId, selectedSubjectId, selectedDate);

            setSuccess(true);
            setSuccessMessage("Your updated attendance submitted successfully!");
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            console.log(err, "Updated attendance not submitted! Please retry.");
            seterror(err.response.data.error);
            setTimeout(() => seterror(null), 3000);
        }
    }

    function getPdf() {
        let input = document.querySelector("#elementForPDF")
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                });
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`attendance_report_${selectedSectionId}_${selectedSubjectId}_${selectedDate}.pdf`);
            });
    }

    return (
        <div>

            {/* Attendance */}
            {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}

            <button type="button" class="btn btn-labeled btn-warning ms-auto d-block mb-2" onClick={e => getPdf()}
                disabled={!selectedSectionId || !selectedSubjectId || !selectedDate} >
                <span class="btn-label"><FaBookmark /> </span> Print Attendance Report as PDF</button>

            <div id="elementForPDF" className="p-3">
                {
                    isUserSectionHead &&
                    <>
                        <section className="student-count">
                            {(sectionData != null) && <>
                                <h5>
                                    <strong className="text-muted">
                                        {sectionData.sectionName?.toUpperCase()}
                                    </strong>
                                    <Badge bg="success" style={{ float: 'right', margin: '0 10px' }}>
                                        {yearMap[sectionData.sectionYear - 1]}
                                    </Badge>
                                    <Badge bg="dark" style={{ float: 'right', margin: '0 10px' }}>
                                        {sectionData.sectionBranchName?.toUpperCase() || ""}
                                    </Badge>
                                </h5>
                            </>}
                        </section>


                        {/* Subject Picker */}
                        <Form.Group className="mb-2" controlId="formFirstName">
                            <Form.Label className="text-muted">Subject For Attendance Report</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1"><FaBookOpen /></InputGroup.Text>

                                {(!subjectList.length) && <p className="text-muted m-1">No subject created yet!</p>}
                                <Form.Select style={{ display: (subjectList.length) ? '' : 'none' }}
                                    onChange={e => selectedSubjectChanged(e.target.value, e.target.selectedOptions[0].attributes[1].value)}
                                    aria-label="Default select example" required>
                                    <option value="">Select Subject</option>
                                    {subjectList?.length != 0 && subjectList?.map((option, index) => (
                                        <option key={index} value={option.subjectId} teacherid={option.subjectTeacher._id}>
                                            {option.subjectName + " (" + option.subjectCode + ")"}
                                        </option>
                                    ))}

                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </>
                }

                {
                    !isUserSectionHead && <>
                        {/* Section Picker */}
                        <Form.Group className="mb-2" controlId="formFirstName">
                            <Form.Label className="text-muted">Section for viewing attendance</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1"><FaUsers /></InputGroup.Text>

                                {((sectionList?.firstYear?.length + sectionList?.secondYear?.length + sectionList?.thirdYear?.length + sectionList?.fourthYear?.length) < 1) && <p className="text-muted m-1">No section available!</p>}

                                <Form.Select style={{ display: ((sectionList?.firstYear?.length + sectionList?.secondYear?.length + sectionList?.thirdYear?.length + sectionList?.fourthYear?.length) > 0) ? '' : 'none' }}
                                    onChange={e => selectedSectionChanged(e.target.value)}
                                    aria-label="Default select example" required>

                                    <option value="">Select Section</option>
                                    <option disabled>First Year</option>
                                    {sectionList?.firstYear?.length != 0 && sectionList?.firstYear?.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.sectionName}
                                        </option>
                                    ))}
                                    <option disabled>Second Year</option>
                                    {sectionList?.secondYear?.length != 0 && sectionList?.secondYear?.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.sectionName}
                                        </option>
                                    ))}
                                    <option disabled>Third Year</option>
                                    {sectionList?.thirdYear?.length != 0 && sectionList?.thirdYear?.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.sectionName}
                                        </option>
                                    ))}
                                    <option disabled>Fourth Year</option>
                                    {sectionList?.fourthYear?.length != 0 && sectionList?.fourthYear?.map((option, index) => (
                                        <option key={index} value={option._id}>
                                            {option.sectionName}
                                        </option>
                                    ))}

                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                        {/* Subject Picker */}
                        <Form.Group className="mb-2" controlId="formFirstName">
                            <Form.Label className="text-muted">Subject</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1"><FaBookOpen /></InputGroup.Text>

                                {(!subjectListForSection.length) && <p className="text-muted m-1">No subject available for selected section yet!</p>}
                                <Form.Select style={{ display: (subjectListForSection.length) ? '' : 'none' }}
                                    onChange={e => selectedSubjectChanged(e.target.value, e.target.selectedOptions[0].attributes[1].value)}
                                    aria-label="Default select example" required>
                                    <option value="">Select Subject</option>
                                    {subjectListForSection?.length != 0 && subjectListForSection?.map((option, index) => (
                                        <option key={index} value={option.subjectId} teacherid={option.subjectTeacher._id}>
                                            {option.subjectName + " (" + option.subjectCode + ")"}
                                        </option>
                                    ))}

                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                    </>
                }

                {/* Date Picker */}
                <Form.Group className="mb-2" style={{ maxWidth: '220px', marginLeft: 'auto' }} controlId="formFirstName">
                    <Form.Label className="text-muted">Date For Attendance</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1"><FaCalendar /></InputGroup.Text>
                        <Form.Control
                            type="date"
                            onChange={e => selectedDateChanged(e)}
                            value={selectedDate}
                            max={moment().format('YYYY-MM-DD')}
                            placeholder="Choose Date"
                            aria-label="Date"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </Form.Group>

                <div className={styles.attendanceStats}>
                    <h6>Selected Date's Attendance Statistics</h6>
                    {
                        (fetchedAttendanceData.length == 0) && <h6 className="text-info mt-3">You have not marked attendance for selected date! <Link to="/dashboard/MarkAttendance" style={{ textDecoration: 'underline', color: 'green' }}>Mark Attendance Now</Link>. </h6>
                    }

                    {
                        (fetchedAttendanceData.length != 0) &&
                        <>
                            <p className="mt-2 text-success">You have marked attendance for selected date! If you wish, you can still update it.</p>
                            <Badge bg="dark" style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                {fetchedAttendanceData[0].date}
                            </Badge>
                            <span>
                                <h6><FaUsers className="me-2" />Total Students Present</h6>
                                <p className="ms-4">{fetchedAttendanceData[0].presentStudents.length}</p>
                            </span>

                        </>
                    }

                </div>


                {/* Attendance Report section starts */}
                <section className={styles.manualAttendance}>
                    <h5 className="mb-2 mt-3">Present Students</h5>

                    <div className={styles.studentsListBox}>
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Student Name</th>
                                    <th>Roll Number</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    (sectionStudents?.length != 0) && sectionStudents?.map((student, index) => {
                                        if (currentAttendance.includes(student._id))
                                            return (
                                                <>
                                                    <tr>
                                                        <td>
                                                            <b className="text-success"> Present </b>
                                                        </td>
                                                        <td>{student.firstName + " " + student.lastName}</td>
                                                        <td>{student.universityRollNumber}</td>
                                                        <td>{student.email}</td>
                                                    </tr>

                                                </>
                                            )
                                        else
                                            return (
                                                <>
                                                    <tr>
                                                        <td>
                                                            <b className="text-danger"> Absent </b>
                                                        </td>
                                                        <td>{student.firstName + " " + student.lastName}</td>
                                                        <td>{student.universityRollNumber}</td>
                                                        <td>{student.email}</td>
                                                    </tr>

                                                </>
                                            )
                                    })
                                }
                                {
                                    !selectedSectionId && <tr className="text-warning mt-4">
                                        <td style={{ textAlign: 'center' }}>
                                            Please select section first!
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                }
                                {
                                    !selectedSubjectId && <tr className="text-warning mt-4">
                                        <td style={{ textAlign: 'center' }}>
                                            Please select subject first!
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                }


                            </tbody>
                        </Table>

                    </div>


                </section>
                {/* Attendance Report section ends */}




            </div>
        </div>
    );
};

export default AttendanceReport;
