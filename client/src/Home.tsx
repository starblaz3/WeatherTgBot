import { useContext } from "react";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";

import { userLoginContext } from "./UserLogin";
import NavbarComponent  from "./Navbar";

function Home() {
  const [userLogin, setUserLogin] = useContext(userLoginContext);  
  return (
    <Container>      
        <NavbarComponent />
      { userLogin ? (<Container><h1>Home</h1>
      <p> Hello {userLogin.name}</p></Container>) : (<Button href="/">Login</Button>)}    
    </Container>
  );
}
export default Home;
