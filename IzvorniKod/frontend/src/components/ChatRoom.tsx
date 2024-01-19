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
  image: string | null;
  linkToImage: string;
  phoneNumber: string;
  email: string;
}

function ChatRoom({ advertisementId, loginStatus, userData }: ChatRoomProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([44.5, 16.0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<ChatMessage>({
    senderUsername: "",
    advertisementId: "",
    messageText: "",
    disappearanceLocationLat: null,
    disappearanceLocationLng: null,
    image: null,
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

  const handleToggleAddLocation = () =>
    setIsOpenAddLocation(!isOpenAddLocation);

  const handleToggle = (id: number) => {
    setOpenMessageId((prevId) => (prevId === id ? null : id));
  };

  function MapClickHandler() {
    const map = useMapEvents({
      click: (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setNewMessage({
          ...newMessage,
          disappearanceLocationLat: lat,
          disappearanceLocationLng: lng,
        });

        setMapCenter([lat, lng]);
      },
    });

    return newMessage.disappearanceLocationLat ? (
      <Marker
        position={[
          newMessage.disappearanceLocationLat,
          newMessage.disappearanceLocationLng,
        ]}
      />
    ) : null;
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
      image: newMessage.image,
      linkToImage: newMessage.linkToImage,
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

      if (res.ok) {
        alert("Komentar uspješno dodan!");
      } else {
        alert("Komentar nije uspješno dodan!");
      }
    } catch (error) {
      console.error("Error while sending message:", error);
      alert("Error while sending message");
    }

    setNewMessage({ ...newMessage, messageText: "" });
    if (isOpenAddLocation) handleToggleAddLocation();
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result;

      setNewMessage({ ...newMessage, image: previewUrl });
    };
    reader.readAsDataURL(file);
  };

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
              <div className="chat-content ">
                {loginStatus && (
                  <div className="send-message d-flex flex-column border border-2 rounded p-3 bg-white">
                    <h4>New message</h4>
                    <input
                      type="text"
                      className="input-message my-3"
                      placeholder="Message Text"
                      value={newMessage?.messageText || ""}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          messageText: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="input-message mb-3"
                      placeholder="Link To Image"
                      value={newMessage?.linkToImage || ""}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          linkToImage: e.target.value,
                        })
                      }
                    />
                    <input
                      type="file"
                      className="input-message"
                      onChange={handleImageChange}
                    />

                    <div>
                      <div className="d-flex flex-row justify-content-between">
                        <Button
                          variant="primary"
                          onClick={handleToggleAddLocation}
                          aria-controls="collapseExample"
                          aria-expanded={isOpenAddLocation}
                        >
                          Add location
                        </Button>
                        <Button
                          type="button"
                          className="send-button btn-success"
                          onClick={sendValue}
                        >
                          Send
                        </Button>
                      </div>
                      <Collapse in={isOpenAddLocation} className="mt-3">
                        <div id="collapseExample">
                          <Card>
                            <Card.Body>
                              <MapContainer
                                center={mapCenter}
                                zoom={7}
                                minZoom={7}
                              >
                                <MapClickHandler />
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                              </MapContainer>
                            </Card.Body>
                          </Card>
                        </div>
                      </Collapse>
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
