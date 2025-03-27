import React, { useState, useEffect } from "react";

const ChatBox = ({ socket, eventId, userName }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join the event room
    socket.emit("joinEvent", { eventId, userName });

    // Listen for new messages
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on component unmount
    return () => {
      socket.emit("leaveEvent", { eventId });
      socket.off("newMessage");
    };
  }, [socket, eventId, userName]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { eventId, userName, message });
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white text-center">Live Chat</h2>

      <div className="h-64 overflow-y-auto p-2 border border-gray-600 rounded bg-gray-700 text-white">
        {messages.map((msg, index) => (
          <p key={index} className="p-2 my-1 bg-gray-600 rounded">
            <strong>{msg.userName}: </strong> {msg.message}
          </p>
        ))}
      </div>

      <div className="flex mt-3 space-x-2">
        <input
          type="text"
          className="w-full p-2 border border-gray-500 bg-gray-600 text-white rounded"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
