const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  console.log("Connected to server");
  ws.send("Hello from client");
};

ws.onmessage = (event) => {
  console.log("Received:", event.data);
};

ws.onclose = () => console.log("Disconnected from server");
