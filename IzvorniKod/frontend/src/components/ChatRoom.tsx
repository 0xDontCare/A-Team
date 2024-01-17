import { useState, useEffect } from "react";
import { over } from "stompjs";
import * as Stomp from "stompjs";
import SockJS from "sockjs-client";

interface ChatRoomProps {
  advertisementId: string | undefined;
  loginStatus: boolean | undefined;
}

interface ChatMessage {
  id: string;
  text: string;
  messageSender: {
    username: string;
    email: string;
    phoneNumber: string;
  };
}

interface Payload {
  body: string;
}

var stompClient: Stomp.Client | null = null;

function ChatRoom({ advertisementId, loginStatus }: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => []);

  const [publicChats, setpublicChats] = useState([]);

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
      setpublicChats([...publicChats]);
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
              {loginStatus && (
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="addANote">
                    + Add a note
                  </label>
                  <input
                    type="text"
                    id="newMessage"
                    className="form-control"
                    placeholder="Napišite poruku..."
                  />
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-row align-items-center">
                        <p className="small mb-0 ms-2">
                          {message.messageSender.username}{" "}
                          {message.messageSender.email}{" "}
                          {message.messageSender.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

