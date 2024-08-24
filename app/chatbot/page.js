"use client"
import { useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const sendMessage = () => {
        if (userInput.trim()) {
            setMessages([...messages, { text: userInput, sender: 'user' }]);
            setUserInput('');
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'Thank you for your feedback!', sender: 'bot' },
                ]);
            }, 1000);
        }
    };

    return (
        <div className="chat-container">
            <video autoPlay loop muted className="background-video">
                <source src="/bgvideo1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="chat-content">
                <div className="chat-header">
                    <h2>Rate My Professor</h2>
                </div>
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
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
                    height: 100vh; /* Full height of the viewport */
                    overflow: hidden; /* Hide overflow */
                }
                .background-video {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    min-width: 100%;
                    min-height: 100%;
                    width: auto;
                    height: auto;
                    z-index: -1; /* Place the video behind the chat content */
                    transform: translate(-50%, -50%);
                    object-fit: cover; /* Cover the entire area */
                }
                .chat-content {
                    position: relative; /* Position relative to allow centering */
                    display: flex;
                    flex-direction: column;
                    justify-content: center; /* Center vertically */
                    align-items: center; /* Center horizontally */
                    height: 100%; /* Full height of the container */
                    z-index: 1; /* Ensure chat content is above the video */
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
                    width: 100%; /* Full width */
                }
                .chat-box {
                    padding: 10px;
                    height: 300px;
                    overflow-y: auto;
                    border: 2px solid black;
                    border-radius: 0 0 10px 10px;
                    margin-bottom: 10px;
                    width: 100%; /* Full width */
                    display: flex;
                    flex-direction: column; /* Stack messages vertically */
                }
                .message {
                    margin: 5px 0; /* Space between messages */
                    padding: 10px; /* Increased padding for better appearance */
                    border-radius: 30px; /* Rounded corners */
                    display: inline-block; /* Allow width to fit content */
                    max-width: 80%; /* Optional: limit the maximum width */
                    word-wrap: break-word; /* Allow long words to break */
                }
                .user {
                    background: #5a2c4d;
                    color: white; 
                    align-self: flex-end; 
                    padding-right: 15px; 
                    padding-left: 15px; 
                }
                .bot {
                    background: #62221c; 
                    color: white; 
                    align-self: flex-start;
                    padding-left: 15px; 
                    padding-right: 15px; 
                }
                .input-container {
                    display: flex; /* Use flexbox to align input and button */
                    width: 100%; /* Full width */
                }
                input {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    width: calc(100% - 100px); /* Adjust width to account for button */
                    margin-right: 10px; /* Space between input and button */
                }
                button {
                    background: #2575fc;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 90px; /* Fixed width for the button */
                }
                button:hover {
                    background: #6a11cb;
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
