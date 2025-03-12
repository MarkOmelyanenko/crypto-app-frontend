let socket = null;

export const connectWebSocket = (onMessage) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("🔄 WebSocket already connected");
    return;
  }

  socket = new WebSocket("ws://localhost:8080/ws/prices");

  socket.onopen = () => console.log("✅ Connected to WebSocket");
  socket.onmessage = (event) => {
    const newPrices = JSON.parse(event.data);
    onMessage(newPrices);
  };
  socket.onerror = (error) => console.error("❌ WebSocket Error:", error);
  socket.onclose = (event) => {
    console.log(
      "❌ WebSocket Disconnected. Code:",
      event.code,
      "Reason:",
      event.reason
    );
    setTimeout(() => connectWebSocket(onMessage), 5000);
  };
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
