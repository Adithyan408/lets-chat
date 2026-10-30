import type { ServerMessage } from "../types/chat";

interface Props {
  messages: ServerMessage[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div key={"id" in msg ? msg.id : index}
             className={`message ${msg.type}`}>
          {msg.type === "chat" ? (
            <>
              <strong>{msg.username}</strong>
              <p>{msg.content}</p>
              <small>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </>
          ) : (
            <small>{msg.content}</small>
          )}
        </div>
      ))}
    </div>
  );
}