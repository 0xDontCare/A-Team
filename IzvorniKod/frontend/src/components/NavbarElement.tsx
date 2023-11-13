import {useState} from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./NavbarElement.css";

function NavbarElement({isLoggedIn, userData}) {
    const [isBrandHovered, setIsBrandHovered] = useState(false);

    const handleBrandMouseEnter = () => {
        setIsBrandHovered(true);
    };

    const handleBrandMouseLeave = () => {
        setIsBrandHovered(false);
    };

    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand
                    href="/"
                    onMouseEnter={handleBrandMouseEnter}
                    onMouseLeave={handleBrandMouseLeave}
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
                        style={{marginRight: "6px"}}
                        className="d-inline-block align-top"
                    />
                    {""}
                    Nestali ljubimci
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!isLoggedIn && <Nav.Link href="/login">Prijava</Nav.Link>}
                        {!isLoggedIn && <Nav.Link href="/register">Registracija</Nav.Link>}
                        {isLoggedIn && (
                            <Nav.Link disabled className="text-dark fs-4 fw-bold">
                                Pozdrav, {userData.firstName || userData.shelterName}! 👋
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarElement;
