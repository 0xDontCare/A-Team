import {Link} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Oglas from "./Oglas.tsx";

function Home({isLoggedIn}) {
    const cardData = [
        {id: 1, title: "Oglas 1", content: "This is some content for Card 1."},
        {id: 2, title: "Oglas 2", content: "This is some content for Card 2."},
        {id: 3, title: "Oglas 3", content: "This is some content for Card 3."},
        {id: 4, title: "Oglas 4", content: "This is some content for Card 4."},
    ];

    return (
        <Container>
            {isLoggedIn && (
                <Row className="mb-3">
                    <Col className="text-center">
                        <div
                            className="mt-3 p-3 rounded border border-dark border-2 bg-info"> {/* Changed background color to light blue */}
                            <Link to="/addAd" className="btn btn-success me-2">
                                Dodajte oglas
                            </Link>
                            <button className="btn btn-warning me-2">Izmijenite oglas</button>
                            <button className="btn btn-danger">Izbrišite oglas</button>
                        </div>
                    </Col>
                </Row>
            )}
            <Row xs={1} md={2} lg={4} className="g-4">
                {cardData.map((card) => (
                    <Col key={card.id}>
                        <Oglas id={card.id} title={card.title} content={card.content}/>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Home;