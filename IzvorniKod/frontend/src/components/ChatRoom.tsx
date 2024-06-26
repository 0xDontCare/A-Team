import { useState, useEffect, useRef} from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button, Card } from "react-bootstrap";
import "./ChatRoom.css";
import "leaflet/dist/leaflet.css";

interface ChatRoomProps {
  advertisementId: string;
  loginStatus: boolean;
  userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    shelterName: string;
    phoneNumber: string;
  };
}

interface ChatMessage {
  id: number | null;
  senderUsername: string;
  advertisementId: string;
  messageText: string;
  disappearanceLocationLat: number | null;
  disappearanceLocationLng: number | null;
  images: string | null;
  linkToImage: string;
  phoneNumber: string;
  email: string;
}

function ChatRoom({ advertisementId, loginStatus, userData }: ChatRoomProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([44.5, 16.0]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
      null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessage>({
    senderUsername: "",
    advertisementId: "",
    messageText: "",
    disappearanceLocationLat: null,
    disappearanceLocationLng: null,
    images: null,
    linkToImage: "",
    phoneNumber: "",
    email: "",
    id: null,
  });

  const [isOpenAddLocation, setIsOpenAddLocation] = useState(false);
  const [openMessageId, setOpenMessageId] = useState<number | null>(null);

  const bottomRef = useRef(null);

  const handleToggleAddLocation = () => {
    setIsOpenAddLocation(!isOpenAddLocation);
    // Get the height of the entire document
    bottomRef.current.scrollIntoView({behavior: 'smooth'});
  };

  const handleToggle = (id: number) => {
    setOpenMessageId((prevId) => (prevId === id ? null : id));
  };

  function MapClickHandler() {
    const map = useMapEvents({
      click: (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setMarkerPosition([lat, lng]);
        setNewMessage({
          ...newMessage,
          disappearanceLocationLat: lat,
          disappearanceLocationLng: lng,
        });

        setMapCenter([lat, lng]);
      },
    });

    return markerPosition ? <Marker position={markerPosition}></Marker> : null;
  }

  const sendValue = async () => {
    const chatMessage = {
      senderUsername: userData.username,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      advertisementId: advertisementId,
      messageText: newMessage.messageText,
      disappearanceLocationLat: newMessage.disappearanceLocationLat,
      disappearanceLocationLng: newMessage.disappearanceLocationLng,
  };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatMessage),
    };

    try {
      const res = await fetch("/api/messages/", options);

    } catch (error) {
      console.error("Error while sending message:", error);
      alert("Error while sending message");
    }

    setNewMessage({ ...newMessage, messageText: "" });
    if (isOpenAddLocation) handleToggleAddLocation();

    // Inside your component function
    setMarkerPosition(null);
    setNewMessage({
      ...newMessage,
      messageText: "",
      disappearanceLocationLat: null,
      disappearanceLocationLng: null,
    });

  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${advertisementId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Greška pri dohvatu poruka:", error);
      }
    };

    fetchMessages();

    const messagesIntervalId = setInterval(() => {
      fetchMessages();
    }, 4000);

    return () => clearInterval(messagesIntervalId);
  }, [advertisementId]);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //
  //   if (file) {
  //     const reader = new FileReader();
  //
  //     reader.onloadend = () => {
  //       const base64Image = reader.result.split(",")[1]; // Dobavi samo Base64 dio
  //       setNewMessage({
  //         ...newMessage,
  //         // images: [base64Image],
  //       });
  //     };
  //
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
      <div className="chatContainer mt-3 w-705">
        <h1 className="text-center">Chat</h1>
        <div className="row d-flex justify-content-center">
          <div>
            <div className="card bg-transparent">
              <div className="card-body p-4 ">
                {messages.map((message) => (
                    <div key={message.id} className="card mb-4">
                      <div className="card-body d-flex flex-column justify-content-between">
                        <div className="d-flex flex-row align-items-center">
                          <p className="mb-0 me-3"
                             style={{marginLeft: "5px", fontWeight: "bold", fontSize: "15px"}}>
                            Korisničko ime : <span style={{
                            fontWeight: "normal",
                            fontSize: "15px"
                          }}>{message.senderUsername}</span>
                          </p>
                          <p className="small mb-0 me-3"
                             style={{marginLeft: "5px", fontWeight: "bold", fontSize: "15px"}}>E-pošta
                            : <span style={{
                              fontWeight: "normal",
                              fontSize: "15px"
                            }}>{message.senderEmail}</span>
                          </p>
                          <p className="small mb-0 me-3"
                             style={{marginLeft: "5px", fontWeight: "bold", fontSize: "15px"}}>
                            Broj telefona : <span style={{
                            fontWeight: "normal",
                            fontSize: "15px"
                          }}>{message.senderPhoneNumber}</span>
                          </p>
                        </div>

                        <div className="mt-2">
                          <div className="form-control">
                            {message.messageText}
                          </div>
                        </div>
                        {/*{message.images && (*/}
                        {/*    <div>*/}
                        {/*      <img*/}
                        {/*          src={message.images} // Assuming message.image is the image URL*/}
                        {/*          alt="Message Image"*/}
                        {/*          style={{ maxWidth: "100%", maxHeight: "200px" }} // Adjust the styling as needed*/}
                        {/*      />*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {message.disappearanceLocationLat !== null && (
                            <div>
                              <p className="mb-0">
                                <Button
                                    className="mt-3"
                                    variant="primary"
                                    onClick={() => handleToggle(message.id)}
                                    aria-expanded={openMessageId === message.id}
                                >
                                  Prikažite lokaciju
                                </Button>
                              </p>
                              {openMessageId === message.id && (
                                  <div className="mt-3">
                                    <Card>
                                      <Card.Body>
                                        <MapContainer
                                            center={[
                                              message.disappearanceLocationLat,
                                              message.disappearanceLocationLng,
                                            ]}
                                            zoom={9}
                                            minZoom={6}
                                            style={{height: "400px"}}
                                            dragging={false}
                                            doubleClickZoom={false}
                                            scrollWheelZoom={false}
                                            touchZoom={false}
                                        >
                                          <TileLayer
                                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                          />
                                          <Marker
                                              position={[
                                                message.disappearanceLocationLat,
                                                message.disappearanceLocationLng,
                                              ]}
                                          ></Marker>
                                        </MapContainer>
                                      </Card.Body>
                                    </Card>
                                  </div>
                              )}
                            </div>
                        )}
                      </div>
                    </div>
                ))}
                {messages.length > 0 && <hr />}

                <div className="chat-content">
                  {loginStatus && (
                      <div
                          className="send-message d-flex flex-column border border-2 rounded p-3 bg-white">
                        <h3 style={{marginLeft: '15px'}}>Dodajte novu poruku</h3>
                        <div className="container">
                          <div className="row">
                            <div className="col-lg-12">
            <textarea
                rows="4"
                className="form-control input-message my-3"
                placeholder="Napišite nešto..."
                value={newMessage?.messageText || ""}
                onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      messageText: e.target.value,
                    })
                }
            />
                            </div>
                          </div>
                        </div>

                        <input
                            type="file"
                            className="form-control my-3"
                            style={{
                              width: "98%",
                              marginLeft: "10px"
                            }} // Adjust the marginLeft value as needed
                            value={newMessage?.linkToImage || ""}
                            onChange={(e) =>
                                setNewMessage({
                                  ...newMessage,
                                  linkToImage: e.target.value,
                                })
                            }
                        />

                          <div>
                            <div className="d-flex flex-row justify-content-between">
                              <Button
                                  variant="primary"
                                  onClick={handleToggleAddLocation}
                                  style={{marginLeft: "10px"}}
                                  aria-expanded={isOpenAddLocation}
                                  className="mt-2"
                              >
                                Dodajte lokaciju
                              </Button>
                              <div ref={bottomRef}></div>
                              <Button
                                  type="button"
                                  className="send-button btn-success mt-2"
                                  style={{marginRight: "10px"}}
                                  onClick={sendValue}
                              >
                                Pošaljite poruku
                              </Button>
                            </div>
                            {isOpenAddLocation && (
                                <div className="mt-3">
                                  <Card>
                                    <Card.Body>
                                      <MapContainer
                                          center={mapCenter}
                                          zoom={7}
                                          minZoom={7}
                                      >
                                        <MapClickHandler/>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                      </MapContainer>
                                    </Card.Body>
                                  </Card>
                                </div>
                            )}
                          </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
);
}

export default ChatRoom;