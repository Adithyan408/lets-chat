export type ClientMessage =
  | { type: "join"; username: string }
  | { type: "chat"; content: string };

export type ServerMessage =
  | {
      type: "chat";
      id: string;
      username: string;
      content: string;
      timestamp: string;
    }
  | { type: "system"; content: string }
  | { type: "error"; content: string };