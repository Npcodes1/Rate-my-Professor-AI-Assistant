"use client";

import { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Rate My Professor support assistant. How can I help you today?",
    },
  ]);

  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return; // Prevent sending empty messages

    const newMessages = [
      ...messages,
      { role: "user", content: userInput },
      { role: "assistant", content: "" },
    ];

    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch("/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessages),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value || new Uint8Array(), { stream: true });

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastMessageIndex = updatedMessages.length - 1;
          updatedMessages[lastMessageIndex].content += result;
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <video autoPlay loop muted className="background-video">
        <source src="/blue.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="chat-content">
        <div className="chat-header">
          <h2>Rate My Professor</h2>
        </div>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }
        .background-video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          z-index: -1;
          transform: translate(-50%, -50%);
          object-fit: cover;
        }
        .chat-content {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          z-index: 1;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .chat-header {
          background: black;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 10px 10px 0 0;
          width: 100%;
        }
        .chat-box {
          padding: 10px;
          height: 300px;
          overflow-y: auto;
          border: 2px solid black;
          border-radius: 0 0 10px 10px;
          margin-bottom: 10px;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .message {
          margin: 5px 0;
          padding: 10px;
          border-radius: 30px;
          display: inline-block;
          max-width: 80%;
          word-wrap: break-word;
        }
        .user {
          background: #5a2c4d;
          color: white;
          align-self: flex-end;
          padding-right: 15px;
          padding-left: 15px;
        }
        .assistant {
          background: #62221c;
          color: white;
          align-self: flex-start;
          padding-left: 15px;
          padding-right: 15px;
        }
        .input-container {
          display: flex;
          width: 100%;
        }
        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: calc(100% - 100px);
          margin-right: 10px;
        }
        button {
          background: #2575fc;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          width: 90px;
        }
        button:hover {
          background: #6a11cb;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
