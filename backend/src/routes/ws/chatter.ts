import WebSocket, { WebSocketServer} from "ws";

//Create a WebSocket Server on port 8080;
const wss = new WebSocketServer({port: 8080});

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    //Send a welcome message when a client joins
    ws.send('Welcome to the Websocket server!');

    //Listen for messages from the client 
    ws.on('message', (message: string) => {
        console.log(`Recieved ${message}`);

        //Echo the message back to the client
        ws.send(`Server echo: ${message}`);
    });

    //Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('Websocket server is running on ws://localhost:8080');