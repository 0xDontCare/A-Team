import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";
import "./AdDetail.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import ChatRoom from "./ChatRoom.tsx";
import ChatRoomA from "./ChatRoomA.tsx";

interface AdDetailProps {
  loginStatus: boolean;
  userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    shelterName: string;
    phoneNumber: string; // ovo treba dodati u backend
  };
}

function AdDetail({ loginStatus, userData }: AdDetailProps) {
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

  const userFirstName = card.firstName || "";
  const userLastName = card.lastName || "";
  const shelterName = card.shelterName || "";

  const displayUserDetails =
    (userFirstName && userLastName) ||
    (!userFirstName && !userLastName && shelterName);

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body className="custom-card bg-gradient customCard">
          <Card.Title className="text-center">{card.petName}</Card.Title>
          {card.images && card.images.length > 0 && (
            <Carousel data-bs-theme="dark" touch={true} className="mb-4">
              {card.images.map((image, index) => (
                <Carousel.Item interval={null} key={index}>
                  <img
                    src={`/api/images/${image}`}
                    alt={`Slide ${index}`}
                    className="oglasSlika d-block mx-auto img-fluid"
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
                <strong>
                  {card.categoryDescription === "U_SKLONISTU"
                    ? "Datum i vrijeme pronalaska :"
                    : "Datum i vrijeme nestanka :"}
                </strong>{" "}
                {formattedDateTimeWithU}
              </p>
              <p className="mb-2">
                <strong>
                  {card.categoryDescription === "U_SKLONISTU"
                    ? "Lokacija skloništa :"
                    : "Mjesto nestanka :"}
                </strong>{" "}
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
            <div className="mb-3">
              <MapContainer
                center={[
                  card.disappearanceLocationLat,
                  card.disappearanceLocationLng,
                ]}
                zoom={9}
                minZoom={6}
                style={{ height: "400px" }}
                dragging={false}
                doubleClickZoom={false}
                scrollWheelZoom={false}
                touchZoom={false}
              >
                <Marker
                  position={[
                    card.disappearanceLocationLat,
                    card.disappearanceLocationLng,
                  ]}
                ></Marker>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </div>
          </div>
          {displayUserDetails && (
            <div className="mt-4">
              <h4>Podaci o korisniku:</h4>
              <div className="row">
                {userFirstName && userLastName && (
                  <>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Ime:</strong> {userFirstName}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Prezime:</strong> {userLastName}
                      </p>
                    </div>
                  </>
                )}

                {(!userFirstName || !userLastName) && (
                  <>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Ime skloništa:</strong> {shelterName}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Korisničko ime:</strong> {card.username}
                      </p>
                    </div>
                  </>
                )}
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>E-pošta:</strong> {card.email}
                  </p>
                </div>

                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Broj telefona:</strong> {card.phoneNumber}
                  </p>
                </div>

                <div className="row">
                  {userFirstName && userLastName && (
                    <>
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Korisničko ime:</strong> {card.username}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <ChatRoom
            advertisementId={id}
            loginStatus={loginStatus}
            userData={userData}
          />
          {/* <ChatRoomA /> */}
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdDetail;
