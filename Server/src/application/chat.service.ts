import { randomUUID } from "node:crypto";
import type {
  ChatMessage,
  ServerMessage,
} from "../domain/chat.types.js";

export class ChatService {
  validateUsername(value: unknown): string {
    if (typeof value !== "string") {
      throw new Error("Username must be a string");
    }

    const username = value.trim();

    if (username.length < 2 || username.length > 20) {
      throw new Error("Username must be 2-20 characters");
    }

    if (!/^[a-zA-Z0-9_ ]+$/.test(username)) {
      throw new Error("Username contains invalid characters");
    }

    return username;
  }

  validateContent(value: unknown): string {
    if (typeof value !== "string") {
      throw new Error("Message must be a string");
    }

    const content = value.trim();

    if (!content || content.length > 1000) {
      throw new Error("Message must be 1-1000 characters");
    }

    return content;
  }

  createMessage(
    username: string,
    content: string
  ): ChatMessage {
    return {
      type: "chat",
      id: randomUUID(),
      username,
      content,
      timestamp: new Date().toISOString(),
    };
  }

  systemMessage(content: string): ServerMessage {
    return { type: "system", content };
  }
}