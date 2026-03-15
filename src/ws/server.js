import { WebSocket, WebSocketServer } from "ws";

const payloadsize = "1024 * 1024";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: payloadsize,
  });

  wss.on("connection", (socket) => {
    sendJson(socket, { type: "welcome" });

    socket.on("error", console.error);
  });
}
