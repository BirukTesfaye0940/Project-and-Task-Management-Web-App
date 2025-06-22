import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:5003", {
      withCredentials: true,
      query: { userId }, // optional: if you want to send on connect
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected", socket?.id);
      socket?.emit("join", userId);  // Tell backend to join room
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
