import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../utilities";
import TaskItem from "./util/task-item";
const MyTask = () => {
    const titleRef = useRef('');
    const descRef = useRef('');
    const deadLineRef = useRef('');
    const [taskList, setTaskList] = useState(null)
    const icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
    const userId = icmsUserInfo?.data?._id;
    const handleFormSubmit = useCallback(async (ev) => {
        try {
            ev.preventDefault();
            const payload = {
                title: titleRef?.current?.value,
                desc: descRef?.current?.value,
                deadline: deadLineRef?.current?.value,
                createdBy: icmsUserInfo?.data?._id,
                status: '0'
            }
            const assignedUserId = icmsUserInfo?.data?._id
            const savedTaskData = await axios.put(`${BASE_URL}/teacher/create-task/${assignedUserId}`, payload)
            console.log('saved', savedTaskData)
            setTaskList([...taskList, payload])
            titleRef.current.value = ''
            descRef.current.value = ''
            deadLineRef.current.value = ''
        }
        catch (err) {
            console.log(err)
        }
    }, [titleRef, descRef, deadLineRef])
    const fetchTaskList = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/teacher/fetch-task-list/${userId}`)
            console.log('taskList', data.data)
            setTaskList(data.data);
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchTaskList()
    }, [])
    return (
        <div className="flex">
            <div className="w-50 flex flex-column px-4 py-4 me-5 shadow-lg h-50">
                <h4 class="fw-bold">Add New Task</h4>
                <form onSubmit={handleFormSubmit} className="flex flex-column content-center w-100">
                    <p>
                        <label className="text-muted form-label my-2">Enter Title</label>
                        <input ref={titleRef} required type="text" placeholder="Enter Title" className="form-control p-3" />
                    </p>
                    <p>
                        <label className="text-muted form-label my-2">Enter Description</label>
                        <textarea ref={descRef} type="text" placeholder="desc" className="form-control p-3" />
                    </p>
                    <p>
                        <label className="text-muted form-label my-2">Enter Description</label>
                        <input ref={deadLineRef} type="date" placeholder="Select Deadling" className="form-control p-3" />
                    </p>
                    <button className="btn btn-primary" type="submit">Create Task</button>
                </form>
            </div>
            <div className="w-50 flex flex-column shadow-lg p-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h4 class="fw-bold">Your Current Tasks</h4>
                {taskList && taskList?.map((item, idx) => (<TaskItem key={idx} id={item?._id} title={item?.title} desc={item?.desc} createdBy={item?.createdBy} deadline={item?.deadline} status={item?.status} />)
                )}
            </div>
        </div>
    )
}

export default MyTask