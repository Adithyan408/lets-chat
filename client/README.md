# Real-Time Chat Application

A simple real-time chat application built using **React, Vite, Node.js, TypeScript, and WebSocket** to understand real-time communication and layered architecture in a MERN-style application.

## Overview

This project demonstrates how multiple browser clients can communicate instantly through a persistent WebSocket connection.

Users can join the chat with a username, exchange messages in real time, view connection status, and handle disconnect and reconnect scenarios.

The project follows a simple layered architecture to separate responsibilities and improve maintainability.

## Features

- Real-time messaging between multiple browser tabs
- Username-based chat registration
- Server-side username and message validation
- Duplicate username prevention for active sessions
- Connection status indicator
- Automatic reconnection with exponential backoff
- Join and leave notifications
- Message timestamps
- Basic message size limits
- Responsive chat interface

## Tech Stack

**Frontend**
- React
- Vite
- TypeScript
- CSS
- Native WebSocket API

**Backend**
- Node.js
- TypeScript
- Express.js
- `ws` WebSocket library

## Architecture

The backend follows a simple layered architecture.

```text
server/src/
├── domain/
│   └── chat.types.ts
├── application/
│   └── chat.service.ts
├── infrastructure/
│   └── websocket.server.ts
├── presentation/
│   └── chat.handler.ts
├── app.ts
└── server.ts
```

### Layer Responsibilities

- **Domain:** Defines chat message types and protocol contracts.
- **Application:** Handles chat business rules, validation, and message creation.
- **Infrastructure:** Configures and initializes the WebSocket server.
- **Presentation:** Handles WebSocket events, client connections, and message delivery.
- **Bootstrap:** Initializes Express and starts the HTTP server.

### Communication Flow

```text
React Client
    |
    | WebSocket
    v
WebSocket Handler
    |
    v
Chat Application Service
    |
    v
Validation and Message Creation
    |
    v
Broadcast to Connected Clients
```

## Project Structure

```text
realtime-chat/
├── client/
│   └── src/
│       ├── components/
│       │   ├── Chat.tsx
│       │   └── MessageList.tsx
│       ├── hooks/
│       │   └── useChatSocket.ts
│       ├── types/
│       │   └── chat.ts
│       ├── App.tsx
│       ├── main.tsx
│       └── style.css
│
└── server/
    ├── src/
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   ├── app.ts
    │   └── server.ts
    ├── package.json
    └── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Visual Studio Code (recommended)

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd realtime-chat
```

### 2. Setup the frontend

```bash
cd client
npm install
```

### 3. Setup the backend

Open another terminal:

```bash
cd server
npm install
```

### 4. Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend runs at:

- HTTP: `http://localhost:5000`
- WebSocket: `ws://localhost:5000/chat`

Health check:

`http://localhost:5000/health`

### 5. Start the frontend

From the `client` directory:

```bash
npm run dev
```

Open the Vite development URL, usually:

`http://localhost:5173`

## How to Test

1. Open the application in your browser.
2. Join the chat using a username.
3. Open another browser tab.
4. Join with a different username.
5. Send messages between both tabs.
6. Verify that messages appear in real time.
7. Try joining with a duplicate username.
8. Close a tab and observe the disconnect notification.
9. Stop and restart the backend to test reconnection.

## WebSocket Message Protocol

### Client → Server

Join the chat:

```json
{
  "type": "join",
  "username": "Adi"
}
```

Send a message:

```json
{
  "type": "chat",
  "content": "Hello everyone!"
}
```

### Server → Client

Chat message:

```json
{
  "type": "chat",
  "id": "message-uuid",
  "username": "Adi",
  "content": "Hello everyone!",
  "timestamp": "2026-10-30T12:00:00.000Z"
}
```

System notification:

```json
{
  "type": "system",
  "content": "Adi joined the chat"
}
```

Error response:

```json
{
  "type": "error",
  "content": "Username is already taken"
}
```

## Key Concepts Learned

- WebSocket connection lifecycle
- HTTP Upgrade handshake
- Bidirectional communication
- Client-server messaging
- Event-driven programming
- Connection management
- Message broadcasting
- Server-side validation
- Automatic reconnection
- Separation of concerns
- Layered backend architecture

## Current Limitations

- No database persistence
- No user authentication
- No private messaging or chat rooms
- Usernames are unique only among active sessions on one server
- Messages are not stored or recovered after reconnection
- No shared connection state across multiple server instances

## Future Improvements

- MongoDB message persistence
- User authentication and authorization
- Online users list
- Private chat rooms
- Typing indicators
- Message delivery acknowledgments
- Heartbeat and connection health monitoring
- Rate limiting and enhanced security
- Multi-instance scaling using Redis Pub/Sub

## Learning Objective

The primary objective of this project is to understand how WebSocket enables real-time, bidirectional communication and how to organize a Node.js backend using a simple layered architecture.
