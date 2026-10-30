export type ClientMessage =
  | {
      type: "join";
      username: string;
    }
  | {
      type: "chat";
      content: string;
    };

export interface ChatMessage {
  type: "chat";
  id: string;
  username: string;
  content: string;
  timestamp: string;
}

export type ServerMessage =
  | ChatMessage
  | {
      type: "system";
      content: string;
    }
  | {
      type: "error";
      content: string;
    };