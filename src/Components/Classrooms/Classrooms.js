import { Form } from "react-bootstrap";

const Classrooms = () => {
  return (
    <div className="container">
      <h1 className="py-4"> Create a class</h1>
      <Form style={formStyles}>
        <div style={selectTagStyles}>
          <p>Select Year</p>
          <Form.Select aria-label="Default select example">
            <option defaultValue value="1">
              {" "}
              1st Year
            </option>
            <option value="2"> 2nd Year</option>
            <option value="3"> 3rd Year</option>
            <option value="4"> 4th Year</option>
          </Form.Select>
        </div>
        <div style={selectTagStyles}>
          <p>Name of the class</p>

          <Form.Group className="mb-2" controlId="formClassName">
            <Form.Control required type="text" placeholder="Enter Class Name" />
          </Form.Group>
        </div>

        <div style={selectTagStyles}>
          <p>Assign a class coordinator</p>
          <Form.Select aria-label="Default select example">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </div>
      </Form>
    </div>
  );
};

export default Classrooms;

const formStyles = {
  display: "flex",
  justifyContent: "space-around",
};

let selectTagStyles = { marginRight: "10px" };
selectTagStyles = {
  width: "30%",
};
