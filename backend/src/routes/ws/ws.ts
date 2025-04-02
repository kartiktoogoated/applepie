import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import { Router, Request, Response } from "express";

const weebRouter = Router();
const server = http.createServer(weebRouter);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("New client connected");


    ws.on("message", (message) => {
        console.log("Recieved", message.toString());

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
