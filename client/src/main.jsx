import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { io } from "socket.io-client";

// Create a single socket instance
const socket = io("http://localhost:3000");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
