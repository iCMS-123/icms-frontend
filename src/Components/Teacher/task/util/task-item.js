import React from "react";

const statusText = ['Pending', 'Ongoing', 'Completed']
const backgroundColor = ['bg-danger', 'bg-primary', 'bg-success']

const TaskItem = ({ title, desc, createdBy, id, status }) => {
    const currentStatus = statusText[Number(status)]
    const bgColor = backgroundColor[Number(status)]

    return (
        <div className="card my-1 flex flex-column pt-3 pb-1 px-3">
            <p className="text-muted fw-bold text-capitalize mb-0">{title} <span className={`${bgColor} badge badge-pill float-end`}>{currentStatus}</span></p>
            <p className="lead mb-0">{desc}</p>
            <p className="flex mt-3">
                <button className="me-2 btn btn-outline-success">Complete</button>
                <button className="btn btn-outline-danger">Delete</button>
            </p>
        </div>
    )
}

export default TaskItem;