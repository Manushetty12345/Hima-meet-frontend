import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://10.0.2.2:5000'; // Or your deployed backend URL

let socket: Socket | null = null;

export const initSocket = async () => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = await AsyncStorage.getItem('userToken');
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
