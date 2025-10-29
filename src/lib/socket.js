// src/lib/socket.js
import { io } from "socket.io-client";

// Ganti URL ini dengan URL backend Anda
// Jika backend di port 5000, ini adalah alamatnya
const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false // Kita akan konek manual nanti
});