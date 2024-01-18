import { useState, useEffect } from "react";
import { over } from "stompjs";
import * as Stomp from "stompjs";
import SockJS from "sockjs-client";

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
  disappearanceLocationLat: string;
  disappearanceLocationLng: string;
  image: string | null;
  linkToImage: string;
  phoneNumber: string;
  email: string;
}

interface Payload {
  body: string;
}

var stompClient: Stomp.Client | null = null;

function ChatRoom({ advertisementId, loginStatus, userData }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => []);
  const [newMessage, setNewMessage] = useState<ChatMessage>({
    senderUsername: "",
    advertisementId: "",
    messageText: "",
    disappearanceLocationLat: "",
    disappearanceLocationLng: "",
    image: null,
    linkToImage: "",
    phoneNumber: "",
    email: "",
  });

  const [publicChats, setPublicChats] = useState([]);

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
                <div className="card mb-4">
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
                  </div>
                </div>
              ))}

              {publicChats.map((chat) => (
                <div className="card mb-4">
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
                  </div>
                </div>
              ))}
              <div className="chat-content">
                {loginStatus && (
                  <div className="send-message">
                    <input
                      type="text"
                      className="input-message"
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
                      className="input-message"
                      placeholder="Disappearance Location Lat"
                      value={newMessage?.disappearanceLocationLat || ""}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          disappearanceLocationLat: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="input-message"
                      placeholder="Disappearance Location Lng"
                      value={newMessage?.disappearanceLocationLng || ""}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          disappearanceLocationLng: e.target.value,
                        })
                      }
                    />
                    {/* <input
                      type="file"
                      className="input-message"
                      onChange={handleImageChange}
                    /> */}
                    <input
                      type="text"
                      className="input-message"
                      placeholder="Link To Image"
                      value={newMessage?.linkToImage || ""}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          linkToImage: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="send-button"
                      onClick={sendValue}
                    >
                      send
                    </button>
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
