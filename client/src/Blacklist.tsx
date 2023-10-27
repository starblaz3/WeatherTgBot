import { Container, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import NavbarComponent from "./Navbar";
import { useContext, useState } from "react";
import { userLoginContext } from "./UserLogin";
import axios from "axios";

function Blacklist() {
  const [userLogin, setUserLogin] = useContext(userLoginContext);
  const [userIdState, setUserIdState] = useState<any|null>();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<any|null>({title:"",message:""});
  const handleChange = (e: any) => {
    setUserIdState(e.target.value);
  };
  const handleClose = () => setShow(!show);
  const submitButton = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/blacklist", {
        tgId: userIdState,
      });
      if(res.data.message==="success"){
        setShow(true);
        setError({title:"Success",message:"User blacklisted."});
      }
      else{
        setShow(true);
        setError({title:"Failed!",message:res.data.message});
      }
      setUserIdState("");
    } catch (err) {
      console.log(err);
    }
    setUserIdState("");
  };
  if (userLogin != undefined) {
    return (
      <Container>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{error.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error.message}</Modal.Body>
      </Modal>
        <NavbarComponent />
        <Form onSubmit={submitButton}>
          <Form.Group className="mb-3" controlId="formBlacklist">
            <Form.Label className="d-inline-flex" style={{ width: "100%" }}>
              Enter TG User ID to blacklist
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="TG User ID"
              value={userIdState}
              onChange={handleChange}
            />
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
        <NavbarComponent loginState={userLogin} />
        <Button href="/">Login</Button>
      </Container>
    );
  }
}
export default Blacklist;
