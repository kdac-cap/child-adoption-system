import { useState } from "react";
import Navbar from "../../components/layout/Navbar";

function Chat() {
  const [messages, setMessages] = useState([
    { sender: "Parent", text: "Hello, I have a question" },
    { sender: "Staff", text: "Sure, how can I help?" },
  ]);

  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text) return;

    setMessages([...messages, { sender: "You", text }]);
    setText("");
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Chat</h2>

        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          {messages.map((m, i) => (
            <p key={i}>
              <b>{m.sender}:</b> {m.text}
            </p>
          ))}
        </div>

        <br />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
}

export default Chat;
