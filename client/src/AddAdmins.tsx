import { Container, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NavbarComponent from "./Navbar";
import { useContext, useState } from "react";
import { userLoginContext } from "./UserLogin";
import axios from "axios";

function AddAdmins() {
    const [userLogin, setUserLogin] = useContext(userLoginContext);
    const [emailState, setEmailState] = useState<any|null>();
    const [show, setShow] = useState(false);
    const [error, setError] = useState<any|null>({title:"",message:""});
    const handleClose = () => setShow(!show);
    const handleChange =(e:any)=>{           
      setEmailState(e.target.value);
    }
    const submitButton = async (e:any) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:5000/addAdmin", {
          email: emailState,
        });
        console.log(res.data);
        if(res.data.message==="success"){
          setShow(true);
          setError({title:"Success",message:"User added as admin."});
        }
        else 
        {
          setShow(true);
          setError({title:"Failed!",message:res.data.message});
        }
        setEmailState("");
      } catch (err) {
        console.log(err);
      }
    }
if(userLogin!=undefined){
  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{error.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error.message}</Modal.Body>
      </Modal>
      <NavbarComponent/>
      <Form onSubmit={submitButton}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{ width: "100%" }} className="d-inline-flex">
            Email address
          </Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={handleChange} value={emailState}/>
          <Form.Text className="text-muted">
            This will add the user as an admin.
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" >
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
    )
  }
}
export default AddAdmins;
