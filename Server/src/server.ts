import { createServer } from "node:http";
import { createApp } from "./app.js";
import { createWebSocketServer } from "./infrastructure/websocket.server.js";

const app = createApp();
const server = createServer(app);

const wss = createWebSocketServer(server);

server.listen(5000, () => {
  console.log("HTTP server: http://localhost:5000");
  console.log("WebSocket: ws://localhost:5000/chat");
});

function shutdown() {
  wss.close();
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);