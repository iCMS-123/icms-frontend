import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
const StudentsInfo = () => {
  const [firstYearVal, setFirstYearVal] = useState(0);
  const [secondYearVal, setSecondYearVal] = useState(0);
  const [thirdYearVal, setThirdYearVal] = useState(0);
  const [fourthYearVal, setFourthYearVal] = useState(0);
  useEffect(() => {
    try {
      const response = axios.get('');
      console.log(response);

    //   setFirstYearVal(response.firstYear);
    //   setSecondYearVal(response.secondYear);
    //   setThirdYearVal(response.thirdYear);
    //   setFourthYearVal(response.fourthYear);


    }
     catch (err) {

    }
  }, []);

  return (
    <div>
      <section className="student-count">
        
      </section>
    </div>
  );
};

export default StudentsInfo;
