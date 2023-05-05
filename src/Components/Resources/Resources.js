import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

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

    return (
        <div>
            <h5 class="modal-title">Add Resource Details </h5>

            <form action="/api/v1/course/update-course/620cd84bca82d7241c91729e" id="addNewResource"
                method="POST">

                <div class="col-9 mt-3 mb-3">
                    <label for="resoName" class="form-label p-0">Resource Name</label>

                    <div class="input-group">
                        <input type="text" class="form-control"
                            placeholder="Enter name for current resource" id="resourceName"
                            name="resourceName" />
                    </div>

                    <div class="form-text">Please note that this name will be visible to the students.</div>

                </div>
                <div class="col-9 mt-3 mb-3">
                    <label for="resoType" class="form-label p-0">Type of Resource</label>

                    <span class="badge rounded-pill bg-primary ms-3 p-2" id="resoTypePill">PDF</span>

                    <input type="text" id="resourceType" name="resourceType" value="pdf" hidden/>

                        <select class="form-select" onchange="addThisResoType(this.value)" required>
                            <option value="pdf">PDF</option>
                            <option value="word">Word</option>
                            <option value="image">Image (jpg, jpeg)</option>
                            <option value="video">Video</option>
                        </select>
                </div>

                <div class="mt-4">

                    <h5 class="mb-3 text-muted text-uppercase" id="uploadMessage"></h5>

                    <input type="text" name="resourceUrl" id="resourceUrl" hidden/>
                        <Button type="button" class="btn btn-primary" className="upload_resource_widget"
                            onclick="uploadResource()">
                            Upload Resources
                        </Button>
                </div>

            </form>
        </div>
    )
}

export default Resources