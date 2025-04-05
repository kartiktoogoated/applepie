import http from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import express from 'express';

// Secret key for JWT verification
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

const notiRouter = Router();
notiRouter.get('/', (req: Request, res:Response) => {
    res.send('hello from notiRouter');
});

const app = express();
app.use('/noti', notiRouter);

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Set up Socket.IO server with CORS allowed for demonstration
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// Middleware to verify JWT during socket connection
io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: token missing'));
    } 
    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET);
        next();
    } catch(err) {
        next(new Error('Authentication error: invalid token'));
    }
});


// Handle connection events
io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);

    // Listen for 'message' events from clients
    socket.on('message', (msg: string) => {
        console.log(`Message from ${socket.id}:`, msg);
        // Broadcast the message to all other connected clients
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

const PORT = process.env.SOCKET_PORT || 5000;
server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
});
