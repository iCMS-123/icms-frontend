import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge, Table } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk, FaBookOpen, FaCalendar, FaUsers } from 'react-icons/fa';
import CloudinaryMarkAttendanceWidget from "../CloudinaryWidget/CloudinaryMarkAttendanceWidget";
import Loader1 from "../Loader/Loader-1/index";
import Message from "../Message/index";
import styles from './index.module.css'
import { FaTimesCircle } from "react-icons/fa"
import moment from "moment"

const MarkAttendance = () => {
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
    const isUserHod = JSON.parse(localStorage.getItem("icmsUserInfo")).data.isHod;
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
        console.log(sId, "sel sec changed");
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
            }
        } catch (e) {
            console.log(e, "e");
        }
    };

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
        getListOfStudents(selectedSectionId)
        if (isUserSectionHead)
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
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-subject-list/${selectedSectionId}`);

            if (data && data.success)
                setSubjectList(data.data);
        } catch (e) {
            console.log(e, "e");
        }
    }

    const getSectionList = async () => {
        const userId = JSON.parse(localStorage.getItem("icmsUserInfo")).data._id;
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/teacher/fetch-subjects/${userId}`);

            if (data && data.success) {
                let sectionListDB = data.data;
                let listOfSections = {
                    firstYear: [],
                    secondYear: [],
                    thirdYear: [],
                    fourthYear: [],
                }
                let listOfSections1 = {
                    firstYear: [],
                    secondYear: [],
                    thirdYear: [],
                    fourthYear: [],
                }
                data.data.map(item => {
                    if (item.sectionId.sectionYear == 1)
                        listOfSections.firstYear.push(item.sectionId._id)
                    else if (item.sectionId.sectionYear == 2)
                        listOfSections.secondYear.push(item.sectionId._id)
                    else if (item.sectionId.sectionYear == 3)
                        listOfSections.thirdYear.push(item.sectionId._id)
                    else if (item.sectionId.sectionYear == 4)
                        listOfSections.fourthYear.push(item.sectionId._id)
                })
                
                listOfSections.firstYear = [...new Set(listOfSections.firstYear)]
                listOfSections.secondYear = [...new Set(listOfSections.secondYear)]
                listOfSections.thirdYear = [...new Set(listOfSections.thirdYear)]
                listOfSections.fourthYear = [...new Set(listOfSections.fourthYear)]

                listOfSections.firstYear.map(item => 
                    listOfSections1.firstYear.push(sectionListDB.filter(it => it.sectionId._id == item)[0].sectionId)
                )
                listOfSections.secondYear.map(item => 
                    listOfSections1.secondYear.push(sectionListDB.filter(it => it.sectionId._id == item)[0].sectionId)
                )
                listOfSections.thirdYear.map(item => 
                    listOfSections1.thirdYear.push(sectionListDB.filter(it => it.sectionId._id == item)[0].sectionId)
                )
                listOfSections.fourthYear.map(item => 
                    listOfSections1.fourthYear.push(sectionListDB.filter(it => it.sectionId._id == item)[0].sectionId)
                )

                setSectionList(listOfSections1);
                console.log(data, listOfSections1, "section subject list");
            }
        } catch (e) {
            console.log(e, "e");
        }
    }


    const getSectionListForHOD = async () => {
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
        let fetchedSubjects = [];
        try {
            const { data } = await axios.get(`http://localhost:8002/api/v1/section/get-section-subject-list/${sId}`);

            if (data && data.success) {
                setSubjectListForSection(data.data);
                fetchedSubjects = data.data;
            }
        } catch (e) {
            console.log(e, "e");
            return
        }

        if (!isUserSectionHead && !isUserHod) {
            const userId = JSON.parse(localStorage.getItem("icmsUserInfo"))?.data?._id;
            console.log(fetchedSubjects, "fetchedSubjects 1");
            fetchedSubjects = fetchedSubjects.filter(item => item.subjectTeacher._id == userId)
            setSubjectListForSection(fetchedSubjects)
            console.log(fetchedSubjects, "fetchedSubjects 2");
        }
    }

    useEffect(() => {
        if (isUserHod || isUserSectionHead)
            getSubjectsList()
        if (isUserHod)
            getSectionListForHOD();
        else
            getSectionList();
    }, [])

    async function handleMarkAttendance() {
        // logic to mark attendance
        // a post request to backend with the list of uploaded images
        const current_timestamp = moment().valueOf();

        console.log(`attandanceAtModel${selectedSectionId}`)
        const testingData = Number(localStorage.getItem(`attandanceAtModel_${selectedSectionId}_${selectedSubjectId}`));
        if (testingData && testingData + 3600000 > current_timestamp) {
            seterror("You have already requested for marking attendance for this section! You can request again after 60 minutes, only if request fails.");
            setTimeout(() => seterror(null), 3000);
            return
        }

        if (new Date().toDateString() == new Date(selectedDate).toDateString) {
            seterror("You can request for marking attendance via Face recognition only for same date! You can mark via manual marking otherwise.");
            setTimeout(() => seterror(null), 3000);
        }

        try {
            axios.post("http://localhost:8002/api/v1/task/create-task", {
                sectionId: selectedSectionId,
                taskId: current_timestamp,
                date: new Date(selectedDate).toDateString(),
                subjectTeacherId: selectedSubjectTeacherId
            })
                .then((res) => {
                    console.log(res, "response");
                    if (res.data.success) {
                        axios.post("https://07a7-35-233-234-62.ngrok-free.app/mark_attendance", {
                            "sectionId": selectedSectionId,
                            "subjectId": selectedSubjectId,
                            "subjectTeacherId": selectedSubjectTeacherId,
                            "activityTimeStamp": current_timestamp,
                            "date": new Date(selectedDate).toDateString(),
                            "image-links": uploadedGroupPhotos
                        });
                        setTodaysAttendanceUploaded(true)
                        setUploadedGroupPhotos([])
                        setSuccessMessage("Images uploaded for marking attendance successfully!")
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 3000);

                        localStorage.setItem(`attandanceAtModel_${selectedSectionId}_${selectedSubjectId}`, current_timestamp);
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
                sectionId: selectedSectionId,
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

    return (
        <div>

            {/* Attendance */}
            {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}

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
                        <Form.Label className="text-muted">Subject for marking attendance</Form.Label>
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
                        <Form.Label className="text-muted">Section for marking attendance</Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><FaUsers /></InputGroup.Text>

                            {(sectionList.length == 0 || (sectionList?.firstYear?.length + sectionList?.secondYear?.length + sectionList?.thirdYear?.length + sectionList?.fourthYear?.length) < 1) && <p className="text-muted m-1">No section available!</p>}

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
                    (fetchedAttendanceData.length == 0) && <h6 className="text-info mt-3">You have not marked attendance for selected date! <span style={{ color: 'green' }}>Let's do this</span>. </h6>
                }

                {
                    (fetchedAttendanceData.length != 0) &&
                    <>
                        <p className="mt-2 text-success">You have already marked attendance for selected date! You can still update it.</p>
                        <Badge bg="dark" style={{ position: 'absolute', top: '15px', right: '15px' }}>
                            {fetchedAttendanceData[0].date}
                        </Badge>
                        <span>
                            <h6><FaUsers className="me-2" />Total Students Marked Present</h6>
                            <p className="ms-4">{fetchedAttendanceData[0].presentStudents.length}</p>
                        </span>

                    </>
                }

            </div>

            <section className="take-attendance mb-4 text-center">
                {!todaysAttendanceUploaded &&
                    <div>
                        <h4 className="text-muted">Mark Attendance with a Class Group Photo!</h4>


                        {/* uploaded photos preview here */}
                        <div className="mt-2 mb-4">
                            {

                                (uploadedGroupPhotos != []) && uploadedGroupPhotos?.map((img, index) => (
                                    <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                        <FaTimesCircle className="deleteImgBtn" onClick={(e) => removeThisImg(img)} />
                                        <Image thumbnail style={{ height: '100%' }} src={img} alt="User" />
                                    </div>
                                ))
                            }
                        </div>


                        <div >
                            <CloudinaryMarkAttendanceWidget onUpload={handleOnGroupPhotoUpload} multipleAllowed={true}>
                                {({ open }) => {
                                    function handleOnClick(e) {
                                        e.preventDefault();
                                        open();
                                    }
                                    return (
                                        <>

                                            <div className="upload-mark-btn-container">
                                                {uploadedGroupPhotos?.length !== 0 && <div className="mark-attendance-btn">
                                                    <button id="mark-btn" onClick={handleMarkAttendance} className="btn btn-lg btn-success mb-2">Click to Mark Attendance</button>
                                                    <p>It's quick, easy, and accurate!</p>

                                                    <h4 className="fw-bolder mb-3">OR</h4>
                                                </div>}
                                                <div className="upload-group-photo-btn">
                                                    <button id="upload-btn" onClick={handleOnClick} className="btn btn-lg btn-success mb-2">Upload {uploadedGroupPhotos?.length !== 0 && <span>More</span>} Photos</button>
                                                    <p>The more the photos, the better the accuracy!</p>

                                                </div>

                                            </div>

                                        </>

                                    )
                                }}

                            </CloudinaryMarkAttendanceWidget>

                        </div>
                    </div>
                }
                {todaysAttendanceUploaded &&
                    <h6 className="text-muted">
                        You have already uploaded images for marking today's attendance! Please wait for response. It may take upto 5 to 10 minutes.
                    </h6>
                }

            </section>

            {/* Manual Attendance section starts */}
            <section className={styles.manualAttendance}>
                <h5 className="mb-2 mt-3">Manual Attendance</h5>

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
                                (selectedSubjectId && sectionStudents?.length != 0) && sectionStudents?.map((student, index) => {
                                    if (currentAttendance.includes(student._id))
                                        return (
                                            <>
                                                <tr>
                                                    <td>
                                                        <Form.Check
                                                            key={index}
                                                            type="checkbox"
                                                            checked
                                                            onChange={(e) => {
                                                                if (e.target.checked)
                                                                    markThisStudent(e.target.id);
                                                                else
                                                                    unmarkThisStudent(e.target.id);
                                                            }}
                                                            id={`${student._id}`}
                                                        />
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
                                                        <Form.Check
                                                            key={index}
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                if (e.target.checked)
                                                                    markThisStudent(e.target.id);
                                                                else
                                                                    unmarkThisStudent(e.target.id);
                                                            }}
                                                            id={`${student._id}`}
                                                        />
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

                <Button variant="dark" className="mt-4 float-end"
                    onClick={e => uploadUpdatedAttendance()}
                >
                    Save Now
                </Button>


            </section>
            {/* Manual Attendance section ends */}




        </div>
    );
};

export default MarkAttendance;
