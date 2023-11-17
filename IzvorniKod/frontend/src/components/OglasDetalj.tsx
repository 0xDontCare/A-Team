import {useParams} from "react-router-dom";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import {useEffect, useState} from "react";
import './OglasDetalj.css';

function OglasDetalj() {
    const {id} = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from /api/advertisements/{id}
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
                <Card.Body className="custom-card bg-warning bg-gradient">
                    <Card.Title className="text-center">{card.petName}</Card.Title>
                    {card.images && card.images.length > 0 && (
                        <Carousel touch={true} className="mb-4">
                            {card.images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        src={`/api/images/${image}`}
                                        alt={`Slide ${index}`}
                                        className="d-block mx-auto img-fluid"
                                        style={{width: '900px', height: '600px'}}
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
                                {card.disappearanceDateTime}
                            </p>
                            <p className="mb-2">
                                <strong>Mjesto nestanka :</strong>{" "}
                                {card.disappearanceLocation}
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
