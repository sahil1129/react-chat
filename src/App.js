import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Generate a unique ID for the current user
const userId = Math.random().toString(36).substring(2, 15);

const socket = io("http://localhost:3000"); // Replace with your server URL

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("recived message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("recived message");
    };
  }, []);

  // Handle sending a message
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = { text: message, sender: userId }; // Use the unique ID as the sender
      socket.emit("send message", messageData); // Send message to server
      setMessage(""); // Clear input field
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React Chat App</h1>
      <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {messages.map((msg, index) => (
            <li
              key={index}
              style={{
                margin: "10px 0",
                padding: "10px",
                borderRadius: "5px",
                color: "#fff",
                backgroundColor: msg.sender === userId ? "green" : "#3498db", // Use the userId to identify the sender
                textAlign: msg.sender === userId ? "right" : "left",
                alignSelf: msg.sender === userId ? "flex-end" : "flex-start",
              }}
            >
              {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
