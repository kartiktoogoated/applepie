import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import express from "express";

const app = express();
const weebRouter = express.Router();

// Define a simple route for testing (optional)
weebRouter.get("/", (req, res) => {
  res.send("Hello from the Express Router!");
});
app.use(weebRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received", message.toString());

    // Broadcast message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

server.listen(3001, () => console.log("Websocket running on port 3001"));
