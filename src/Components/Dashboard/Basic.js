import React, {useEffect} from 'react'
import { Button, Card } from "react-bootstrap";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
 

export const Basic = () => {
  useDocumentTitle("Dashboard");
  let icmsLocalStorageData = JSON.parse(localStorage.getItem("icmsUserInfo"));
  let userData = icmsLocalStorageData.data;  
  // for reference 
  // let branchName = userData.branchName || userData.user.branchName; 
   
 

  return (
    <div>
     <div>
<div className="basic-left">

 <Card style={{ width: '16rem' }}>
      <Card.Img style={{objectFit:'contain', padding:'5px', width:'200px',margin:'0 auto',height:'175px'}} variant="top" src="https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png" />
      <Card.Body>
        <Card.Title>Welcome { userData.firstName || userData.user.firstName} !</Card.Title>
        <Card.Text>
          This page can give you a quick overview of your upcoming tasks and classes.
        </Card.Text>
         
      </Card.Body>
    </Card>


    <Card style={{ width: '16rem' , padding: '20px'}}>
      <Card.Body>
      <canvas id="myChart"></canvas>
      
         
      </Card.Body>
    </Card>

    {/* Graph for attendance */}
 
</div>

<div className="basic-right">


</div>


</div>
   
    </div>
  )
}
