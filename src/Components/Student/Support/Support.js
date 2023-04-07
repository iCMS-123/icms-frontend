import React from 'react'
import { useRef } from "react";
import { Button, Form } from "react-bootstrap"
import "./Support.css"
import axios from "axios";

const Support = () => {
    const issueTypeRef = useRef(null);
    const priorityRef = useRef(null);
    const issueDescriptionRef = useRef(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        return;
        const { data } = await axios.post("", {
            issueType: issueTypeRef["current"]?.value,
            priority: priorityRef["current"]?.value,
            issueDescription: issueDescriptionRef["current"]?.value
        })

        console.log(data);

    }
    return (
        <div>
           <section className="ticker-form-container">
                <Form id="support-form" onSubmit={handleSubmit}>
                  <h3>Create a ticket</h3>
                    <Form.Group className="mb-2" controlId="formIssueTypeSelection">
                        <Form.Label>Select Type of Issue</Form.Label>
                        <Form.Select ref={issueTypeRef} aria-label="Default select example">
                            <option defaultValue value="tech">
                                Technical
                            </option>
                            <option value="nontech">Non-Technical</option>
                            <option value="others">Others</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="formPrioritySelection">
                        <Form.Label>Select Priority</Form.Label>
                        <Form.Select ref={priorityRef} aria-label="Default select example">
                            <option defaultValue value="low">
                                Low
                            </option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
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