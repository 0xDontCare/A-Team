import { useState, useEffect } from "react";
import { over } from "stompjs";
import * as Stomp from "stompjs";
import SockJS from "sockjs-client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button, Collapse, Card } from "react-bootstrap";
import "./AddAdChangeAd.css";
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
  senderUsername: string;
  advertisementId: string;
  messageText: string;
  disappearanceLocationLat: number | null;
  disappearanceLocationLng: number | null;
  image: string | null;
  linkToImage: string;
  phoneNumber: string;
  email: string;
  messageId: number | null;
}

interface Payload {
  body: string;
}

var stompClient: Stomp.Client | null = null;

function ChatRoom({ advertisementId, loginStatus, userData }: ChatRoomProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([44.5, 16.0]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => []);
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
    messageId: null,
  });

  const [publicChats, setPublicChats] = useState([]);

  const [isOpenAddLocation, setIsOpenAddLocation] = useState(false);

  const handleToggleAddLocation = () =>
    setIsOpenAddLocation(!isOpenAddLocation);

  const [openMessageId, setOpenMessageId] = useState(null);

  const handleToggle = (messageId) => {
    setOpenMessageId((prevId) => (prevId === messageId ? null : messageId));
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

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderUsername: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        advertisementId: advertisementId,
        messageText: newMessage?.messageText,
        disappearanceLocationLat: newMessage?.disappearanceLocationLat,
        disappearanceLocationLng: newMessage?.disappearanceLocationLng,
        image: newMessage?.image,
        linkToImage: newMessage?.linkToImage,
      };

      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setNewMessage({ ...newMessage, messageText: "" });
      if (isOpenAddLocation) handleToggleAddLocation();
    }
  };

  const registerUser = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    if (stompClient) {
      stompClient.subscribe(
        `/chatroom/${advertisementId}`,
        onPublicMessageReceived
      );
    } else {
      console.error("stompClient is null");
    }
  };

  const onPublicMessageReceived = (payload: Payload) => {
    try {
      let payloadData = JSON.parse(payload.body) as any;
      publicChats.push(payloadData);
      setPublicChats([...publicChats]);
    } catch (error) {
      console.error("Error parsing payload:", error);
    }
  };

  const onError = (err: any) => {
    console.error(err);
  };

  useEffect(() => {
    registerUser();
  }, []);

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
  }, [advertisementId]);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const previewUrl = reader.result;

  //     setNewMessage({ ...newMessage, image: previewUrl });
  //   };
  //   reader.readAsDataURL(file);
  // };

  return (
    <div className="chatContainer">
      <div className="row d-flex justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div
            className="card shadow-0 border"
            style={{ backgroundColor: "f0f2f5" }}
          >
            <div className="card-body p-4">
              {messages.map((message) => (
                <div key={message.messageId} className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-row align-items-center">
                        <p className="small mb-0 ms-2">
                          {message.senderUsername}
                        </p>
                        <p className="small mb-0 ms-2">{message.senderEmail}</p>
                        <p className="small mb-0 ms-2">
                          {message.senderPhoneNumber}
                        </p>
                      </div>
                    </div>
                    <p>{message.messageText}</p>
                    {message.disappearanceLocationLat !== null && (
                      <div>
                        <p>
                          <Button
                            className="ms-2"
                            variant="primary"
                            onClick={() => handleToggle(message.messageId)}
                            aria-controls={`collapseExample-${message.messageId}`}
                            aria-expanded={openMessageId === message.messageId}
                          >
                            Lokacija
                          </Button>
                        </p>
                        <Collapse
                          in={openMessageId === message.messageId}
                          id={`collapseExample-${message.messageId}`}
                        >
                          <div id="collapseExample">
                            <Card>
                              <Card.Body>
                                <MapContainer
                                  center={[
                                    message.disappearanceLocationLat,
                                    message.disappearanceLocationLng,
                                  ]}
                                  zoom={7}
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
                        </Collapse>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {publicChats.map((chat) => (
                <div key={chat.messageId} className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      {chat.senderUsername !== userData.username && (
                        <div className="d-flex flex-row align-items-center">
                          <p className="small mb-0 ms-2">
                            {chat.senderUsername}
                          </p>
                          <p className="small mb-0 ms-2">{chat.phoneNumber}</p>
                          <p className="small mb-0 ms-2">{chat.email}</p>
                        </div>
                      )}
                      {chat.senderUsername === userData.username && (
                        <div className="d-flex flex-row align-items-center">
                          <p className="small mb-0 ms-2">
                            {chat.senderUsername}
                          </p>
                          <p className="small mb-0 ms-2">
                            {userData.phoneNumber}
                          </p>
                          <p className="small mb-0 ms-2">{userData.email}</p>
                        </div>
                      )}
                    </div>
                    <p>{chat.messageText}</p>
                    {chat.disappearanceLocationLat !== null && (
                      <div>
                        <p>
                          <Button
                            className="ms-2"
                            variant="primary"
                            onClick={() => handleToggle(chat.messageId)}
                            aria-controls={`collapseExample-${chat.messageId}`}
                            aria-expanded={openMessageId === chat.messageId}
                          >
                            Lokacija
                          </Button>
                        </p>
                        <Collapse
                          in={openMessageId === chat.messageId}
                          id={`collapseExample-${chat.messageId}`}
                        >
                          <div id="collapseExample">
                            <Card>
                              <Card.Body>
                                <MapContainer
                                  center={[
                                    chat.disappearanceLocationLat,
                                    chat.disappearanceLocationLng,
                                  ]}
                                  zoom={7}
                                >
                                  <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  />
                                  <Marker
                                    position={[
                                      chat.disappearanceLocationLat,
                                      chat.disappearanceLocationLng,
                                    ]}
                                  ></Marker>
                                </MapContainer>
                              </Card.Body>
                            </Card>
                          </div>
                        </Collapse>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="chat-content">
                {loginStatus && (
                  <div className="send-message d-flex flex-column border border-2 rounded p-3">
                    <p className="font-weight-bold">New message</p>
                    <input
                      type="text"
                      className="input-message mb-3"
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
                    {/* <input
                        type="file"
                        className="input-message"
                        onChange={handleImageChange}
                      /> */}

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
