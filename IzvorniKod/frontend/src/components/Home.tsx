import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Oglas from "./Oglas.tsx";

function Home({ isLoggedIn }) {
  const cardData = [
    { id: 1, title: "Oglas 1", content: "This is some content for Card 1." },
    { id: 2, title: "Oglas 2", content: "This is some content for Card 2." },
    { id: 3, title: "Oglas 3", content: "This is some content for Card 3." },
    { id: 4, title: "Oglas 4", content: "This is some content for Card 4." },
  ];

  return (
    <Container>
      <br />
      <Row xs={1} md={2} lg={4} className="g-4">
        {cardData.map((card) => (
          <Col key={card.id}>
            <Oglas id={card.id} title={card.title} content={card.content} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
