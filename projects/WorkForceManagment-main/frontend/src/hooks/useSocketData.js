import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const useSocketData = (ws) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle incoming socket messages
  const handleSocketMessage = useCallback((message) => {
    try {
      const parsedMessage = JSON.parse(message);
      setData((prevData) => {
        // Update existing item or add new item
        const updatedData = prevData.filter(item => item.employeeId !== parsedMessage.employeeId);
        return [parsedMessage, ...updatedData];
      });



      setLoading(false);
    } catch (err) {
      console.error("Error processing socket message:", err);
      setError(err);
    }
  }, []);

  useEffect(() => {
    // Initialize and manage the socket connection
    const socket = io(ws);
    socketRef.current = socket;

    const handleConnect = () => setConnected(!connected);
    const handleError = (err) => {
      console.error("Socket connection error:", err);
      setError(err);
    };

    // Setup event listeners
    socket.on("connect", handleConnect);
    socket.on("error", handleError);
    socket.emit("subscribe", "mqtt-message");
    socket.on("mqtt-message", handleSocketMessage);

    // Cleanup socket events and disconnect on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("error", handleError);
      socket.off("message", handleSocketMessage);
      socket.disconnect();
    };
  }, [ws, handleSocketMessage]);

  return { data, loading, error, connected };
};

export default useSocketData;
