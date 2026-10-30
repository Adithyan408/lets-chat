import WebSocket from "ws";
import type { WebSocketServer } from "ws";
import type { ClientMessage } from "../domain/chat.types.js";
import { ChatService } from "../application/chat.service.js";

export function registerChatHandlers(
  wss: WebSocketServer,
  service: ChatService
) {
  const usernames = new Map<WebSocket, string>();

  function send(ws: WebSocket, data: unknown) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  function broadcast(data: unknown) {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    }
  }

  wss.on("connection", (ws) => {
    let joined = false;

    send(ws, {
      type: "system",
      content: "Connected. Choose a username.",
    });

    ws.on("message", (raw) => {
      try {
        if (raw.toString().length > 16 * 1024) {
          ws.close(1009, "Payload too large");
          return;
        }

        const data: unknown = JSON.parse(raw.toString());

        if (!data || typeof data !== "object") {
          throw new Error("Invalid message format");
        }

        const input = data as Record<string, unknown>;

        if (!joined) {
          if (input.type !== "join") {
            throw new Error("Join with a username first");
          }

          const username = service.validateUsername(input.username);

          const duplicate = [...usernames.values()].some(
            (name) => name.toLowerCase() === username.toLowerCase()
          );

          if (duplicate) {
            throw new Error("Username is already taken");
          }

          usernames.set(ws, username);
          joined = true;

          send(ws, {
            type: "system",
            content: `Welcome, ${username}!`,
          });

          broadcast(
            service.systemMessage(`${username} joined the chat`)
          );

          return;
        }

        if (input.type !== "chat") {
          throw new Error("Unknown message type");
        }

        const username = usernames.get(ws)!;
        const content = service.validateContent(input.content);

        broadcast(service.createMessage(username, content));
      } catch (error) {
        send(ws, {
          type: "error",
          content:
            error instanceof Error
              ? error.message
              : "Invalid message",
        });
      }
    });

    ws.on("close", () => {
      const username = usernames.get(ws);

      if (username) {
        usernames.delete(ws);
        broadcast(
          service.systemMessage(`${username} left the chat`)
        );
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error.message);
    });
  });
}