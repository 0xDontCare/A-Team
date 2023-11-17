import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Oglas from "./Oglas.tsx";
import "./Home.css";

interface Advertisement {
  adId: number;
  petName: string;
}

function Home({ isLoggedIn }) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  document.title = "Nestali ljubimci";

  useEffect(() => {
    fetch("/api/advertisements")
      .then((response) => response.json())
      .then((data) => {
        setAdvertisements(data);
      })
      .catch((error) => {
        console.error("Error fetching advertisement data:", error);
      });
  }, []);

  return (
    <Container>
      {isLoggedIn && (
        <Row className="mb-3">
          <Col className="text-center">
            <div className="btnContainer mt-3 p-3 rounded border border-dark border-2">
              <Link to="/addAd" className="oglasBtn btn me-2">
                Dodajte oglas
              </Link>
              <button className="oglasBtn btn me-2">Izmijenite oglas</button>
              <button className="oglasBtn btn ">Izbrišite oglas</button>
            </div>
          </Col>
        </Row>
      )}
      <Row xs={1} md={2} lg={4} className="g-4">
        {advertisements.map((advertisement) => (
          <Col key={advertisement.adId}>
            <Oglas id={advertisement.adId} title={advertisement.petName} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
