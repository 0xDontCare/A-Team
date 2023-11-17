import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";
import "./OglasDetalj.css";

function OglasDetalj() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Europe/Berlin",
  };
  const formattedDateTimeWithU = card?.disappearanceDateTime
    ? new Date(card.disappearanceDateTime)
        .toLocaleString("en-GB", options)
        .replace(/,/g, " u")
    : "";

  useEffect(() => {
    fetch(`/api/advertisements/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCard(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching advertisement details:", error);
        setLoading(false);
      });

    return () => {
      document.title = "";
    };
  }, [id]);

  useEffect(() => {
    if (card) {
      document.title = card.petName;
    }
  }, [card]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!card) {
    return <div>Card not found</div>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body className="custom-card bg-gradient customCard">
          <Card.Title className="text-center">{card.petName}</Card.Title>
          {card.images && card.images.length > 0 && (
            <Carousel touch={true} className="mb-4">
              {card.images.map((image, index) => (
                <Carousel.Item interval={null} key={index}>
                  <img
                    src={`/api/images/${image}`}
                    alt={`Slide ${index}`}
                    className="oglasSlika d-block mx-auto img-fluid"
                    style={{ width: "900px", height: "600px" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
          <div className="row">
            <div className="col-md-6">
              <p className="mb-2">
                <strong>Vrsta :</strong> {card.species}
              </p>
              <p className="mb-2">
                <strong>Datum i vrijeme nestanka :</strong>{" "}
                {formattedDateTimeWithU}
              </p>
              <p className="mb-2">
                <strong>Mjesto nestanka :</strong> {card.disappearanceLocation}
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-2">
                <strong>Boja :</strong> {card.color}
              </p>
              <p className="mb-2">
                <strong>Starost :</strong> {card.age}
              </p>
              <p className="mb-2">
                <strong>Opis :</strong> {card.petDescription}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default OglasDetalj;
