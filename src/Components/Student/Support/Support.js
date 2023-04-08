import React from 'react'
import { useRef } from "react";
import { Button, Form } from "react-bootstrap"
import "./Support.css"
import axios from "axios";

const Support = () => {
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    console.log(icmsLocalStorageData);
    let userData = icmsLocalStorageData.data;
    console.log(userData);
    let userID = userData.user._id;
    console.log(userID);
    const issueTitleRef = useRef(null);
    const issueTypeRef = useRef(null);
    const priorityRef = useRef(null);
    const issueDescriptionRef = useRef(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { data } = await axios.post("http://localhost:8080/api/v1/student/support", {
            studentId: userID,
            issueMsg: issueDescriptionRef["current"]?.value,
            typeOfIssue: issueTypeRef["current"]?.value,
            priority: priorityRef["current"]?.value
        })

        console.log(data);

    }
    return (
        <div>
           <section className="ticker-form-container">
                <Form id="support-form" onSubmit={handleSubmit}>
                <h3>Create a ticket</h3>
                <Form.Group className="mb-2" controlId="formIssueTitle">
                <Form.Label>Enter title of Issue</Form.Label>
                <Form.Control
                  ref={issueTitleRef}
                  required
                  type="text"
                />
              </Form.Group>
                    <Form.Group className="mb-2" controlId="formIssueTypeSelection">
                        <Form.Label>Select Type of Issue</Form.Label>
                        <Form.Select ref={issueTypeRef} aria-label="Default select example">
                            <option defaultValue value="1">
                                Technical
                            </option>
                            <option value="3">Non-Technical/Attendance Related</option>
                            <option value="2">Others</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formPrioritySelection">
                        <Form.Label>Select Priority</Form.Label>
                        <Form.Select ref={priorityRef} aria-label="Default select example">
                            <option defaultValue value="3">
                                Low
                            </option>
                            <option value="2">Medium</option>
                            <option value="1">High</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group required className="mb-2" controlId="formIssueDescription">
                        <Form.Label>Describe your issue</Form.Label>
                        <br />
                        <textarea ref={issueDescriptionRef} style={{ width: '100%', height: '140px', outline: 'none' }} name="Issue Description" id="issue-description"></textarea>
                    </Form.Group>
                    <Button className="lgn-btn" variant="success" type="submit">
                        Submit
                    </Button>
                </Form>
            </section>
        </div>
    )
}

export default Support