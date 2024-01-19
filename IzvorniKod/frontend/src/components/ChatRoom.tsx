import {useState, useEffect} from "react";
import {over} from "stompjs";
import * as Stomp from "stompjs";
import SockJS from "sockjs-client";
import {MapContainer, TileLayer, Marker, useMapEvents} from "react-leaflet";
import {Button, Collapse, Card} from "react-bootstrap";
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

interface Payload {
    body: string;
}

var stompClient: Stomp.Client | null = null;

function ChatRoom({advertisementId, loginStatus, userData}: ChatRoomProps) {
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
        id: null,
    });

    const [publicChats, setPublicChats] = useState([]);

    const [isOpenAddLocation, setIsOpenAddLocation] = useState(false);

    const handleToggleAddLocation = () =>
        setIsOpenAddLocation(!isOpenAddLocation);

    const [openMessageId, setOpenMessageId] = useState(null);

    const handleToggle = (id) => {
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

    const [index, setIndex] = useState(1000);
    const [assignedIds, setAssignedIds] = useState<number[]>([]);

    const sendValue = () => {
        if (stompClient) {
            // Pronađi prvi slobodni id koji nije dodijeljen
            let uniqueId = index;
            while (
                assignedIds.includes(uniqueId) ||
                messages.some((message) => message.id === uniqueId)
                ) {
                uniqueId++;
            }

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
                id: uniqueId,
            };

            setAssignedIds((prevIds) => [...prevIds, uniqueId]);
            setIndex(uniqueId + 1); // Povećava index
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setNewMessage({...newMessage, messageText: ""});
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
            let indexNovi = payloadData.id;

            const alreadyAdded = publicChats.some((chat) => chat.id === indexNovi);

            if (alreadyAdded) {
                console.log("it was already added");
                console.log(payloadData);
            }
            if (!alreadyAdded) {
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                console.log("ovo su poruke pocetak------------------");
                console.log(payloadData);
                console.log(publicChats);
                console.log("ovo su poruke kraj------------------");
            }
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
                console.log(messages);
                const maxId = Math.max(...data.map((message) => message.id || 0));
                setIndex(maxId + 1); // Postavi početni index
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
                                            <p className="small mb-0 me-3">
                                                {message.senderUsername}
                                            </p>
                                            <p className="small mb-0 me-3">{message.senderEmail}</p>
                                            <p className="small mb-0 me-3">
                                                {message.senderPhoneNumber}
                                            </p>
                                        </div>

                                        <p className="mt-2">{message.messageText}</p>
                                        {message.disappearanceLocationLat !== null && (
                                            <div>
                                                <p className="mb-0">
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleToggle(message.id)}
                                                        aria-expanded={openMessageId === message.id}
                                                    >
                                                        Lokacija
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

                            {publicChats.map((chat) => (
                                <div key={chat.id} className="card mb-4">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            {chat.senderUsername !== userData.username && (
                                                <div className="d-flex flex-row align-items-center">
                                                    <p className="small mb-0 me-3">
                                                        {chat.senderUsername}
                                                    </p>
                                                    <p className="small mb-0 me-3">{chat.phoneNumber}</p>
                                                    <p className="small mb-0 me-3">{chat.email}</p>
                                                </div>
                                            )}
                                            {chat.senderUsername === userData.username && (
                                                <div className="d-flex flex-row align-items-center">
                                                    <p className="small mb-0 me-3">
                                                        {chat.senderUsername}
                                                    </p>
                                                    <p className="small mb-0 me-3">
                                                        {userData.phoneNumber}
                                                    </p>
                                                    <p className="small mb-0 me-3">{userData.email}</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-2">{chat.messageText}</p>
                                        {chat.disappearanceLocationLat !== null && (
                                            <div>
                                                <p className="mb-0">
                                                    <Button
                                                        className="ms-2"
                                                        variant="primary"
                                                        onClick={() => handleToggle(chat.messageId)}
                                                        aria-expanded={openMessageId === chat.messageId}
                                                    >
                                                        Lokacija
                                                    </Button>
                                                </p>
                                                {openMessageId === chat.messageId && (
                                                    <div className="mt-3">
                                                        <Card>
                                                            <Card.Body>
                                                                <MapContainer
                                                                    center={[
                                                                        chat.disappearanceLocationLat,
                                                                        chat.disappearanceLocationLng,
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
                                                                            chat.disappearanceLocationLat,
                                                                            chat.disappearanceLocationLng,
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
                                    <div
                                        className="send-message d-flex flex-column border border-2 rounded p-3 bg-white">
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