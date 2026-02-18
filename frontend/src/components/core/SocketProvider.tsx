import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket, getSocket } from "../../services/socket";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if there is an existing socket
    const existingSocket = getSocket();
    if (existingSocket) {
      setSocket(existingSocket);
      setIsConnected(existingSocket.connected);
      
      existingSocket.on("connect", () => setIsConnected(true));
      existingSocket.on("disconnect", () => setIsConnected(false));
      
      return () => {
        existingSocket.off("connect");
        existingSocket.off("disconnect");
      };
    }
  }, []);

  const connect = (token: string) => {
    const newSocket = connectSocket(token);
    setSocket(newSocket);
    
    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));
  };

  const disconnect = () => {
    disconnectSocket();
    setSocket(null);
    setIsConnected(false);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};
