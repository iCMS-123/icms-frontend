import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge } from 'react-bootstrap'
import { FaSearch, FaUserCheck, FaUserTimes, FaAsterisk, FaRegCalendarAlt } from 'react-icons/fa';
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
    const [selectedDate, setSelectedDate] = useState(todaysDate);

    function selectedDateChanged(e) {
        setSelectedDate(moment(e.target.value).format('YYYY-MM-DD'));
    }

    useEffect(() => {
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
        console.log("remove triggered");
        let uploadedImgCopy = uploadedGroupPhotos.filter(img => img != url);
        setUploadedGroupPhotos(uploadedImgCopy);
    }

    async function handleMarkAttendance() {
        // logic to mark attendance
        // a post request to backend with the list of uploaded images
        console.log("Marking Attendance")
    }

    async function uploadUpdatedAttendance() {
        // logic to mark attendance manually
        // a post request to backend with the list of selected students
        console.log("Marking Attendance manually")
    }

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
                            {sectionData.sectionName.toUpperCase()}
                        </strong>
                        <Badge bg="success" style={{ float: 'right', margin: '0 10px' }}>
                            {yearMap[sectionData.sectionYear - 1]}
                        </Badge>
                        <Badge bg="dark" style={{ float: 'right', margin: '0 10px' }}>
                            {sectionData.sectionBranchName.toUpperCase() || ""}
                        </Badge>
                    </h5>
                </>}
            </section>

            <section className="take-attendance mb-4 text-center">
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


            </section>

            <div className={styles.attendanceStats}>
                <h6>Today's Attendance Statistics</h6>
                {
                    false && <h6 className="text-muted mt-3">You have not marked today's Attendance! <span style={{ textDecoration: 'underline', cursor: 'pointer', color: 'green' }} onClick={e => setSelectedDate(moment().format('YYYY-MM-DD'))}>Let's do this</span>. </h6>
                }

                {
                    true && (
                        <>
                            Nothing
                        </>
                    )
                }

            </div>


            {/* Manual Attendance section starts */}
            <section className={styles.manualAttendance}>
                <h5 className="mb-2 mt-3">Manual Attendance</h5>

                {/* Date Picker */}
                <Form.Group className="mb-2" style={{ maxWidth: '220px', marginLeft: 'auto' }} controlId="formFirstName">
                    <Form.Label className="text-muted">Date For Attendance</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1"><FaRegCalendarAlt /></InputGroup.Text>
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

                <div className={styles.studentsListBox}>

                    <Form.Check
                        type="checkbox"
                        label={`Student 1`}
                    />
                    <Form.Check
                        type="checkbox"
                        label={`Student 2`}
                    />
                    <Form.Check
                        type="checkbox"
                        label={`Student 3`}
                    />
                    <Form.Check
                        type="checkbox"
                        label={`Student 4`}
                    />
                    <Form.Check
                        type="checkbox"
                        label={`Student 5`}
                    />

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