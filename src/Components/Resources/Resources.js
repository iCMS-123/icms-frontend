import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { Button, Card, Form, Badge, Modal, Image } from "react-bootstrap";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import styles from "./index.module.css";

import Message from "../Message/index";
import CloudinaryUploadWidget from "../CloudinaryWidget/CloudinaryUploadWidget";

const Resources = () => {
    useDocumentTitle("Resources");
    const navigate = useNavigate();
    let userData;
    let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
    if (icmsLocalStorageData === null) {
        navigate("/login");
    } else {

        userData = icmsLocalStorageData?.data;

    }

    // For toast
    const [error, seterror] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const [addResourceModalShow, setAddResourceModalShow] = useState(false);
    const [resourcesArray, setResourcesArray] = useState([]);
    const [currentResourceUrl, setCurrentResourceUrl] = useState(null);
    const [currentResourceType, setCurrentResourceType] = useState('pdf');

    async function handleOnUpload(error, result, widget) {
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

        await setCurrentResourceUrl(currUrl);

        setSuccess(true);
        setSuccessMessage("Your resource uploaded successfully!");
        setTimeout(() => setSuccess(false), 5000);
    }

    async function addResourceAppend() {
        setAddResourceModalShow(false);
        setResourcesArray(resourcesArray => [...resourcesArray, {
            "resourceType": currentResourceType,
            "resourceLink": currentResourceUrl,
        }])
    }

    return (
        <div>
            {error && <Message variant={"danger"} style={{ paddingTop: "15px" }}>{error}</Message>}
            {success && (
                <Message variant={"success"}>{successMessage}</Message>
            )}
            <h5 className="modal-title">Add New Resource </h5>

            <Form action="/api/v1/course/update-course/620cd84bca82d7241c91729e" method="POST">
                <Form.Group className="mb-3" controlId="resourceName">
                    <Form.Label>Resource Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name for current resource" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="resourceDescription">
                    <Form.Label>Resource Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter description for current resource" />
                    <Form.Text className="text-muted">
                        Please note that this name and description will be visible to the students.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-2" controlId="resourcePriority">
                    <Form.Label>Resource Priority</Form.Label>
                    <Form.Select aria-label="resourcePriority">
                        <option defaultValue value="0">Low</option>
                        <option value="1"> Mid</option>
                        <option value="2"> High</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-2" controlId="resourceType">
                    <Form.Label>Resource Type</Form.Label>
                    <Form.Select aria-label="resourceType">
                        <option defaultValue value="notice">Notice</option>
                        <option defaultValue value="subject">Subject</option>
                        <option defaultValue value="important">Important</option>
                    </Form.Select>
                </Form.Group>

                <div className="mt-4 mb-4">
                    <Button className="btn btn-primary" onClick={e => setAddResourceModalShow(true)}>
                        {resourcesArray.length == 0 && "Add Resource"}
                        {resourcesArray.length != 0 && "Add More Resources"}
                    </Button>
                </div>

                <div>
                    {
                        (resourcesArray != []) && resourcesArray.map((resource, index) => (
                            ((resource.resourceType == 'pdf') &&
                                    <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                        <Image thumbnail style={{ height: '100%' }} src='/images/pdfSnip.png' alt="User" />
                                    </div>)
                            ||
                            ((resource.resourceType == 'word') &&
                                    <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                        <Image thumbnail style={{ height: '100%' }} src='/images/wordSnip.png' alt="User" />
                                    </div>)
                            ||
                            ((resource.resourceType == 'image') &&
                                    <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                        <Image thumbnail style={{ height: '100%' }} src={resource.resourceLink} alt="User" />
                                    </div>)
                            ||
                            ((resource.resourceType == 'video') &&
                                    <div key={index} style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                        <Image thumbnail style={{ height: '100%' }} src='/images/videoSnip.png' alt="User" />
                                    </div>)
                        ))
                    }
                </div>

                <Button variant="success" className="mt-3 mb-4">
                    {/* <Button variant="success" onClick={e => uploadResourcesToBackend()}> */}
                    Submit Resources
                </Button>

            </Form>

            {/* Modal (for add resource) code starts */}
            <Modal
                show={addResourceModalShow}
                fullscreen={true}
                onHide={() => setAddResourceModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Resource Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form.Group className="mb-3" controlId="resourceName">
                        <Form.Label>Type of Resource</Form.Label>
                        <Badge bg="dark" className='rounded-pill ms-3 p-2'>
                            {currentResourceType.toUpperCase()}
                        </Badge>

                        <Form.Select aria-label="resourceType" onChange={e => setCurrentResourceType(e.target.value)}>
                            <option defaultValue value="pdf">PDF</option>
                            <option value="word">Word</option>
                            <option value="image">Image (jpg, jpeg)</option>
                            <option value="video">Video</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="resourceUrl">
                        <Form.Label>Upload Resource</Form.Label>
                        <CloudinaryUploadWidget onUpload={handleOnUpload} multipleAllowed={false}>
                            {({ open }) => {
                                function handleOnClick(e) {
                                    e.preventDefault();
                                    open();
                                }
                                return (
                                    <Button variant="outline-primary" id="btnImg" onClick={handleOnClick} className="mb-3" style={{ display: 'block' }}>
                                        Upload Now
                                    </Button>
                                )
                            }}
                        </CloudinaryUploadWidget>

                        <Form.Text className="text-muted">
                            Upload your resource in the above selected format only.
                        </Form.Text>
                        <div className="mt-2 mb-4">
                            {
                                (currentResourceUrl != null) && (
                                    ((currentResourceType == 'pdf') &&
                                            <div style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                                <Image thumbnail style={{ height: '100%' }} src='/images/pdfSnip.png' alt="User" />
                                            </div>)
                                    ||
                                    ((currentResourceType == 'word') &&
                                            <div style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                                <Image thumbnail style={{ height: '100%' }} src='/images/wordSnip.png' alt="User" />
                                            </div>)
                                    ||
                                    ((currentResourceType == 'image') &&
                                            <div style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                                <Image thumbnail style={{ height: '100%' }} src={currentResourceUrl} alt="User" />
                                            </div>)
                                    ||
                                    ((currentResourceType == 'video') &&
                                            <div style={{ display: "inline-block", height: '150px', marginRight: '10px', position: 'relative' }}>
                                                {/* <FaTimesCircle className="deleteImgBtn" onClick={(e) => removeThisImg(img)} /> */}
                                                <Image thumbnail style={{ height: '100%' }} src='/images/videoSnip.png' alt="User" />
                                            </div>)
                                )
                            }
                        </div>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={e => setAddResourceModalShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={e => addResourceAppend()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal (for add resource) code ends */}

        </div>
    )
}

export default Resources