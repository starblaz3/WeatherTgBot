import { useContext, useState } from "react";
import { userLoginContext } from "./UserLogin";
import NavbarComponent from "./Navbar";
import { Container, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

function Api() {
  const [userLogin, setUserLogin] = useContext(userLoginContext);
  const [show, setShow] = useState(false);
  const [apiKey, setApiKey] = useState<any|null>();
  const handleChange = (e: any) => {
    setApiKey(e.target.value);
  };
  const submitButton = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api", {
        apiKey: apiKey,
      });
      console.log(res.data);
      setApiKey("");
    } catch (err) {
      console.log(err);
    }
  };
  if (userLogin != undefined) {
    return (
      <Container>        
        <NavbarComponent />
        <Form onSubmit={submitButton}>
          <Form.Group className="mb-3" controlId="formApi">
            <Form.Label className="d-inline-flex" style={{ width: "100%" }}>
              Enter API Key to overwrite
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Submitting this form will overwrite the existing API Key.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    );
  } else {
    return (
      <Container>
        <NavbarComponent />
        <Button href="/">Login</Button>
      </Container>
    );
  }
}
export default Api;
