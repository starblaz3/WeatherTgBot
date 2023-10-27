import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { userLoginContext } from "./UserLogin";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";


function NavbarComponent() {
  const [userLogin, setUserLogin] = useContext(userLoginContext);
  const navigate=useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    googleLogout();
    setUserLogin(null);
    navigate("/");
  };
  const logIn = () => {
    navigate("/");
  }
  return (
    <Navbar fixed="top" className="bg-body-tertiary" expand="sm">
      <Container fluid>
        <Navbar.Brand href="/Landing">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {userLogin ? (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/Api">API Keys</Nav.Link>
              <Nav.Link href="/AddAdmins">Add Admins</Nav.Link>
              <Nav.Link href="/Blacklist">Blacklist Users</Nav.Link>
              <Nav.Link href="/Whitelist">Whitelist Users</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Button variant="primary" onClick={logOut}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        ):
        (
          <Navbar.Collapse id="basic-navbar-nav">            
            <Nav className="ms-auto">
              <Button variant="primary" onClick={logIn}>
                Log In
              </Button>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
}
export default NavbarComponent;
