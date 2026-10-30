import { useState } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import MessageList from "./MessageList";

export default function Chat() {
  const [username, setUsername] = useState("");
  const [draftName, setDraftName] = useState("");
  const [content, setContent] = useState("");
  const [active, setActive] = useState(false);

  const chat = useChatSocket(active ? username : "");

  function joinChat() {
    const name = draftName.trim();

    if (name.length < 2 || name.length > 20) return;

    setUsername(name);
    setActive(true);
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!chat.joined || !content.trim()) return;

    const sent = chat.send({
      type: "chat",
      content: content.trim(),
    });

    if (sent) setContent("");
  }

  if (!active) {
    return (
      <main className="container">
        <h1>Real-Time Chat</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinChat();
          }}
        >
          <input
            placeholder="Enter username"
            value={draftName}
            maxLength={20}
            onChange={(e) => setDraftName(e.target.value)}
          />
          <button type="submit">Join Chat</button>
        </form>
      </main>
    );
  }

  return (
    <main className="container">
      <header>
        <h1>Real-Time Chat</h1>

        <p>
          User: <strong>{username}</strong>
        </p>

        <p>
          Status:{" "}
          <strong className={chat.status}>
            {chat.status}
          </strong>
        </p>

        {!chat.joined && (
          <p>
            {chat.status === "connected"
              ? "Joining chat..."
              : "Waiting for connection..."}
          </p>
        )}
      </header>

      <MessageList messages={chat.messages} />

      <form onSubmit={sendMessage}>
        <input
          value={content}
          maxLength={1000}
          disabled={!chat.joined}
          placeholder={
            chat.joined
              ? "Type a message..."
              : "Not ready to send messages"
          }
          onChange={(e) => setContent(e.target.value)}
        />

        <button disabled={!chat.joined || !content.trim()}>
          Send
        </button>
      </form>
    </main>
  );
}