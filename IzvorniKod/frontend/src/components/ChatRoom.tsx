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
  image: string;
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
  const [newMessage, setNewMessage] = useState<ChatMessage>();

  const [publicChats, setPublicChats] = useState([]);

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderUsername: userData.username,
        advertisementId: advertisementId,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        advertisementId: newMessage?.advertisementId,
        messageText: newMessage?.messageText,
        disappearanceLocationLat: newMessage?.disappearanceLocationLat,
        disappearanceLocationLng: newMessage?.disappearanceLocationLng,
        image: newMessage?.image,
        linkToImage: newMessage?.linkToImage,
      };

      console.log(chatMessage);
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
      stompClient.subscribe("/chatroom/public", onPublicMessageReceived);
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
                <div key={message.advertisementId} className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-row align-items-center">
                        <p className="small mb-0 ms-2">
                          {message.senderUsername} {message.email}{" "}
                          {message.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <p>{message.messageText}</p>
                  </div>
                </div>
              ))}

              <div className="chat-content">
                <ul className="chat-messages">
                  {publicChats.map((chat, index) => (
                    <li key={index}>
                      {chat.senderUserName !== userData.username && (
                        <div>
                          <div>{chat.senderUserName}</div>
                          <div>{chat.phoneNumber}</div>
                          <div>{chat.email}</div>
                        </div>
                      )}
                      {chat.senderUserName === userData.username && (
                        <div>
                          <div className="avatar self">
                            {chat.senderUserName}
                          </div>
                          <div>{userData.phoneNumber}</div>
                          <div>{userData.email}</div>
                        </div>
                      )}
                      <div className="message-data">{chat.messageText}</div>
                    </li>
                  ))}
                </ul>

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
                    <input
                      type="text"
                      className="input-message"
                      placeholder="Image"
                      value={newMessage?.image || ""}
                      onChange={(e) =>
                        setNewMessage({ ...newMessage, image: e.target.value })
                      }
                    />
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
