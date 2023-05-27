import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './styles.module.css';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Button, Form, Modal, Card, Image, Col, Row, InputGroup, Badge, Table } from 'react-bootstrap'
const MySubject = () => {
    const [subjectList, setSubjectList] = useState(null)
    const icmsUserInfo = JSON.parse(localStorage.getItem("icmsUserInfo"));
    const teacherId = icmsUserInfo?.data._id;
    const navigate = useNavigate()
    const fetchSubjectList = async () => {
        try {
            console.log('teacherId', teacherId)
            const subjectList = await axios.get(`http://localhost:8002/api/v1/teacher/fetch-subjects/${teacherId}`)
            setSubjectList(subjectList?.data?.data)
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (icmsUserInfo === null) {
            navigate("/login");
        }
        fetchSubjectList();
    }, [])
    return (
        <div>
            {subjectList == null && (
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
            </Row>

        </div>
    )
}


export default MySubject;