import { WebSocketServer } from "ws";
import type { Server } from "node:http";
import { ChatService } from "../application/chat.service.js";
import { registerChatHandlers } from "../presentation/chat.handler.js";

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({
    server,
    path: "/chat",
    maxPayload: 16 * 1024,
  });

  const chatService = new ChatService();

  registerChatHandlers(wss, chatService);

  return wss;
}