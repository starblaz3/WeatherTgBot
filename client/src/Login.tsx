import { useContext, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useStore } from "./hooks/useStore";
import { userLoginContext } from "./UserLogin";
import { useNavigate } from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap";
import NavbarComponent from "./Navbar";

function Login() {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useContext(userLoginContext);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const handleClose = () => setShow(!show);
  let serverId = import.meta.env.VITE_SERVER_ID;
  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
      </Modal>
      <NavbarComponent />
      <h1> Admin Login </h1>
      <GoogleOAuthProvider clientId={serverId}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {          
                console.log(credentialResponse);                      
                const res = await axios.post("http://localhost:5000/login", {
                  token: credentialResponse.credential,
                });                
                const data = res.data;                
                if (data.message === "success") {                  
                  localStorage.setItem("token", JSON.stringify(data.data));                  
                  setUserLogin(data.data);
                  navigate("/Landing");
                }
                else{
                  setShow(true);
                  setError(data.message ? data.message : "Login Failed");                  
                } 
              } catch (err) {
                setShow(true);
                setError("Login Failed");
                console.log("Login Failed");
              }
            }}
            onError={() => {
              setShow(true);
              setError("Login Failed");
              console.log("Login Failed");
            }}
          />
        </div>
      </GoogleOAuthProvider>
    </Container>
  );
}

export default Login;
