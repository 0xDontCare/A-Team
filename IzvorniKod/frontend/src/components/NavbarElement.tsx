import {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarElement() {
    const [isBrandHovered, setIsBrandHovered] = useState(false);

    const handleBrandMouseEnter = () => {
        setIsBrandHovered(true);
    };

    const handleBrandMouseLeave = () => {
        setIsBrandHovered(false);
    };

    return (
        <Navbar expand="lg" className="bg-primary">
            <Container>
                <Navbar.Brand
                    href="/"
                    onMouseEnter={handleBrandMouseEnter}
                    onMouseLeave={handleBrandMouseLeave}
                    style={{fontWeight: isBrandHovered ? 'bold' : 'normal', transition: 'font-weight 0.1s'}}
                >
                    Nestali ljubimci
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/login">Prijava</Nav.Link>
                        <Nav.Link href="/register">Registracija</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarElement;