import React, { useState } from "react";
import ChatBox from "./components/ChatBox";

function App({ socket }) {
  const [eventId, setEventId] = useState("");
  const [userName, setUserName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {!isJoined ? (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Join a Live Event</h1>
          <input
            type="text"
            className="w-full p-2 border border-gray-600 bg-gray-700 rounded mb-2"
            placeholder="Event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border border-gray-600 bg-gray-700 rounded mb-2"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => setIsJoined(true)}
          >
            Join Event
          </button>
        </div>
      ) : (
        <ChatBox socket={socket} eventId={eventId} userName={userName} />
      )}
    </div>
  );
}

export default App;
