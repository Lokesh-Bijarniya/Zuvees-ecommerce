import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
