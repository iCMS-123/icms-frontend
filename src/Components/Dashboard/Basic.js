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
     <div style = {{  display : 'flex'}} >
    <div className="basic-left" style={{ flex : 1, border: '1px solid black', padding : '10px'}}>

      <Card style={{margin : '10px'}}>
      <Card.Img style={{objectFit:'contain', padding:'5px', width:'200px',margin:'0 auto',height:'175px'}} variant="top" src="https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png" />
      <Card.Body>
        <Card.Title>Welcome { userData.firstName || userData.user.firstName} !</Card.Title>
        <Card.Text>
          This page can give you a quick overview of your upcoming tasks and classes.
        </Card.Text>
         
      </Card.Body>
    </Card>

    {/* My students */}
      <Card style={{ margin : '10px'}}>
            <Card.Body>
            <Card.Title>My Students</Card.Title>
 {/* Student */}

     <Card style={{marginBottom : '5px'}}>
      <Card.Body style={{padding: '0px'}}>
      <div  style={{display: 'flex', justifyContent : 'space-between', alignItems:'center',padding : '0 5px'}}>

      <Card.Img style={{objectFit:'contain',display:'block', padding:'4px', width:'60px',}} variant="top" src="https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png" />
      <Card.Text>
      { userData.firstName || userData.user.firstName} { userData.lastName || userData.user.lastName}
        </Card.Text>
      </div>
       
      <div style={{display: 'flex', justifyContent : 'space-between', alignItems:'center', padding : '0 5px'}}>

      <p>
      StudentRollNo 
        </p>  
        <p style={{float:'right'}}>Phone</p> 
      </div>

      
      </Card.Body>
    </Card>
     <Card>
      <Card.Body style={{padding: '0px'}}>
      <div  style={{display: 'flex', justifyContent : 'space-between', alignItems:'center',padding : '0 5px'}}>

      <Card.Img style={{objectFit:'contain',display:'block', padding:'4px', width:'60px',}} variant="top" src="https://res.cloudinary.com/abhistrike/image/upload/v1626953029/avatar-370-456322_wdwimj.png" />
      <Card.Text>
      { userData.firstName || userData.user.firstName} { userData.lastName || userData.user.lastName}
        </Card.Text>
      </div>
       
      <div style={{display: 'flex', justifyContent : 'space-between', alignItems:'center', padding : '0 5px'}}>

      <p>
      StudentRollNo 
        </p>  
        <p style={{float:'right'}}>Phone</p> 
      </div>

      
      </Card.Body>
    </Card>
   


  
  
      </Card.Body>
    </Card>

 

    {/* Graph for attendance */}
 
</div>

<div className="basic-right"  style={{flex : 2}}>

<Card>


      <Card.Body>
      
      <h4>Attendance Overview</h4>
      
      <Card.Img src="https://resources.cdn.yaclass.in/24adf49a-f4f3-4706-9302-ee944efad647/pic12.svg" />
      
      </Card.Body>
    </Card>

</div>


</div>
   
    </div>
  )
}

 