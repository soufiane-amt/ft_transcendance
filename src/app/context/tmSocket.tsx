import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Initialize the socket.io connection
const socket: Socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling', 'flashsocket'],
  withCredentials: true,
});

type SocketContextType = Socket | undefined;
const SocketContext = createContext<SocketContextType>(undefined);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  // Add any socket.io event listeners or custom logic here
  useEffect(() => {
    socket.on('someEvent', (data) => {
      console.log('Socket event received:', data);
    });

    return () => {
      // Clean up event listeners when the component unmounts
      socket.off('someEvent');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
