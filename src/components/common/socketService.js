import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = localStorage.getItem("token");

    this.socket = io("https://44kb593x-5004.inc1.devtunnels.ms", {
      auth: {
        token,
      },
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

   
    this.socket.onAny((event, ...args) => {
      console.log("📨 Event received:", event, args);
    });

    return this.socket;
  }

  on(event, callback) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }

    this.socket.on(event, callback);

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);

    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.socket) {
      console.error("Socket not connected");
      return;
    }
    this.socket.emit(event, data);
  }
  subscribeToUserNotifications(callback) {
    const event = "newNotification";
    console.log("🎯 Subscribing to:", event);
    this.on(event, callback);
  }

  unsubscribeFromUserNotifications(callback) {
    const event = "newNotification";
    this.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.listeners.clear();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();