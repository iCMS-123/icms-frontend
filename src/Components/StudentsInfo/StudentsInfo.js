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
        <Table className="text-center" striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Number of Students</th>
              {/* <th>Username</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                1<sup>st</sup> Year
              </td>
              <td>{firstYearVal}</td>
              {/* <td>@mdo</td> */}
            </tr>
            <tr>
              <td>2</td>
              <td>
                2<sup>nd</sup> Year
              </td>
              <td>{secondYearVal}</td>
              {/* <td>@fat</td> */}
            </tr>
            <tr>
              <td>3</td>
              <td>
                3<sup>rd</sup> Year
              </td>
              <td>{thirdYearVal}</td>
              {/* <td>@twitter</td> */}
            </tr>
            <tr>
              <td>4</td>
              <td>
                4<sup>th</sup> Year
              </td>
              <td>{fourthYearVal}</td>
              {/* <td>@twitter</td> */}
            </tr>
          </tbody>
        </Table>
      </section>
    </div>
  );
};

export default StudentsInfo;
