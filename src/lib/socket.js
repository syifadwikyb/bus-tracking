import { io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const socket = io(API_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  transports: ["websocket"],
});