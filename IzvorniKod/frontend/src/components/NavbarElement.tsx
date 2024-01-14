import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link} from "react-router-dom";
import axios from "axios";
import "./NavbarElement.css";

interface HomeProps {
    isLoggedIn: boolean;
    userData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        shelterName: string;
    } | null;
    setLoginStatus: (isLoggedIn: boolean) => void;
}

function NavbarElement({isLoggedIn, userData, setLoginStatus}: HomeProps) {
    async function handleLogout() {
        await axios.get("/api/logout");
        setLoginStatus(false);
        window.location.reload();
    }

    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand
                    className="d-flex align-items-center"
                    as={Link}
                    to="/"
                >
                    <img
                        src="../../src/icons/logo.png"
                        alt="Nestali ljubimci logo"
                        className="logo d-inline-block align-top"
                    />
                    <span className="brandName">Nestali ljubimci</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse className="containerPrijReg" id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!isLoggedIn && (
                            <>
                                <Nav.Link className="navButtons" as={Link} to="/login">
                                    Prijava
                                </Nav.Link>
                                <Nav.Link className="navButtons" as={Link} to="/register">
                                    Registracija
                                </Nav.Link>
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/"
                                    className="navButtons"
                                    onClick={handleLogout}
                                >
                                    Odjava
                                </Nav.Link>
                                <Nav className="text-center flex-grow-1 align-items-center justify-content-center">
                                    <Nav.Item className="text-dark fs-4 fw-bold">
                                        {userData?.firstName || userData?.shelterName}
                                    </Nav.Item>
                                </Nav>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarElement;