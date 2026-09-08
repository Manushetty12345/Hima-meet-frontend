import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';
import { getSavedToken } from './apiClient';

const SOCKET_URL = Config.API_BASE_URL || 'https://himameet-backend.onrender.com';

let socket: Socket | null = null;

export const initSocket = async () => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = await getSavedToken();
  if (!token) return null;

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  socket.on('disconnect', () => {
    console.log('⚠️ Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
