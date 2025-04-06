import "reflect-metadata"; // Ensure this is imported at the very top
import { initDB } from "./src/db";


const ws = new WebSocket("ws://localhost:3001");

ws.onopen = () => {
  console.log("Connected to server");
  ws.send("Hello from client");
};

ws.onmessage = (event) => {
  console.log("Received:", event.data);
};

ws.onclose = () => console.log("Disconnected from server");


import express from "express";
import { initKafka } from "./utils/kafka"; // Adjust import path as needed
import { errorHandler } from "./src/middleware/errorHandler";

const app = express();
const PORT = 3003;

app.use(errorHandler) // Global handler

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Call the init function once the server is ready
  await initKafka();
  console.log("Kafka producer/consumer initialized!");
});

app.get("/", (req, res) => {
  res.send("Hello from TypeORM + Express!");
});

initDB().then(() => {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});

