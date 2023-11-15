import {useState} from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link, useNavigate} from "react-router-dom";
import "./NavbarElement.css";
import axios from "axios";

function NavbarElement({isLoggedIn, userData, setLoginStatus}) {
    const [isBrandHovered, setIsBrandHovered] = useState(false);
    const navigate = useNavigate();

    const handleBrandMouseEnter = () => {
        setIsBrandHovered(true);
    };

    const handleBrandMouseLeave = () => {
        setIsBrandHovered(false);
    };

    const handleNestaliLjubimciClick = () => {
        navigate("/", {state: {isLoggedIn}});
    };

    async function handleLogout()  {
        await axios.get("/api/logout");
        setLoginStatus(false);
    };

    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    onMouseEnter={handleBrandMouseEnter}
                    onMouseLeave={handleBrandMouseLeave}
                    onClick={handleNestaliLjubimciClick}
                    style={{
                        fontWeight: isBrandHovered ? "bold" : "normal",
                        transition: "font-weight 0.1s",
                    }}
                    className="d-flex align-items-center"
                >
                    <img
                        src="src/icons/logo.png"
                        alt="logo"
                        width="20"
                        height="20"
                        className="d-inline-block align-top"
                    />
                    Nestali ljubimci
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!isLoggedIn && <Nav.Link as={Link} to="/login">Prijava</Nav.Link>}
                        {!isLoggedIn && <Nav.Link as={Link} to="/register">Registracija</Nav.Link>}
                        {isLoggedIn && (
                            <Nav className="text-center flex-grow-1 justify-content-center">
                                <Nav.Item className="text-dark fs-4 fw-bold">
                                    Pozdrav, {userData.firstName || userData.shelterName}! 👋
                                </Nav.Item>
                            </Nav>
                        )}
                        {isLoggedIn && <Nav.Link as={Link} to="/" onClick={handleLogout}>Odjava</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarElement;