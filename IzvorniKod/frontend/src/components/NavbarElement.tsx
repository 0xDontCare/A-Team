import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link, useNavigate} from "react-router-dom";
import "./NavbarElement.css";
import axios from "axios";

function NavbarElement({isLoggedIn, userData, setLoginStatus}) {
    const navigate = useNavigate();

    const handleNestaliLjubimciClick = () => {
        navigate("/", {state: {isLoggedIn}});
    };

    async function handleLogout() {
        await axios.get("/api/logout");
        setLoginStatus(false);
    }

    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    onClick={handleNestaliLjubimciClick}
                    className="d-flex align-items-center"
                >
                    <img
                        src="src/icons/logo.png"
                        alt="logo"
                        className="logo d-inline-block align-top"
                    />
                    <span className="brandName">Nestali ljubimci</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse className="containerPrijReg" id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!isLoggedIn && (
                            <Nav.Link className="navBtns" as={Link} to="/login">
                                Prijava
                            </Nav.Link>
                        )}
                        {!isLoggedIn && (
                            <Nav.Link className="navBtns" as={Link} to="/register">
                                Registracija
                            </Nav.Link>
                        )}
                        {isLoggedIn && (
                            <Nav.Link
                                as={Link}
                                to="/"
                                className="navBtns"
                                onClick={handleLogout}
                            >
                                Odjava
                            </Nav.Link>
                        )}
                        {isLoggedIn && (
                            <Nav className="text-center flex-grow-1 align-items-center justify-content-center">
                                <Nav.Item className="text-dark fs-4 fw-bold">
                                    {userData.firstName || userData.shelterName}
                                </Nav.Item>
                            </Nav>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarElement;