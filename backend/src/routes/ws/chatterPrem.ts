import WebSocket, { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

const wss = new WebSocketServer({ port:8080 });

wss.on('connection', (ws,req) => {
    //For example, expect a token in query string
    const params = new URLSearchParams(req.url?.split('?')[1]);
    const token = params.get('token');
    if (!token) {
        ws.close(1008, 'Token required');
        return;
    }
    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET); 
    } catch (err) {
        ws.close(1008, 'Invalid token');
    }
    ws.on('message', (message) => {
        console.log('Recieved', message.toString());
        //Echo the message back
        ws.send(`Echo ${message}`);
    });
});

console.log('WebSocket server running on ws://localhost:8080');
