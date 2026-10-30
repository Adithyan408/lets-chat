import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientMessage, ServerMessage } from "../types/chat";

type Status = "connecting" | "connected" | "disconnected";

const WS_URL = "ws://localhost:5000/chat";

export function useChatSocket(username: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number | undefined>(undefined);
  const retryCount = useRef(0);
  const mounted = useRef(false);

  const [status, setStatus] = useState<Status>("connecting");
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [joined, setJoined] = useState(false);

  const send = useCallback((data: ClientMessage) => {
    const ws = socketRef.current;

    if (ws?.readyState !== WebSocket.OPEN) {
      return false;
    }

    ws.send(JSON.stringify(data));
    return true;
  }, []);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    let ws: WebSocket;
    let manuallyClosed = false;

    const connect = () => {
      if (!active) return;

      setStatus("connecting");
      setJoined(false);

      ws = new WebSocket(WS_URL);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!active) return;

        retryCount.current = 0;
        setStatus("connected");
        setJoined(false);

        ws.send(JSON.stringify({
          type: "join",
          username,
        }));
      };

      ws.onmessage = (event) => {
        if (!active) return;

        try {
          const data: unknown = JSON.parse(event.data);

          if (!data || typeof data !== "object") return;

          const message = data as ServerMessage;

          if (message.type === "system" &&
              message.content.startsWith("Welcome,")) {
            setJoined(true);
          }

          if (message.type === "error") {
            setJoined(false);
          }

          setMessages((prev) => [...prev, message]);
        } catch {
          console.error("Invalid server response");
        }
      };

      ws.onclose = () => {
        if (!active) return;

        setStatus("disconnected");
        setJoined(false);

        if (!manuallyClosed) {
          const delay = Math.min(
            1000 * 2 ** retryCount.current,
            10000
          );

          retryCount.current++;

          retryRef.current = window.setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        // Browser will generally fire close after connection failure.
        ws.close();
      };
    };

    connect();

    return () => {
      active = false;
      manuallyClosed = true;
      mounted.current = false;

      window.clearTimeout(retryRef.current);

      ws?.close();
      socketRef.current = null;
    };
  }, [username]);

  return {
    status,
    joined,
    messages,
    send,
  };
}