import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import userPresence from "./socket/userPresence.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // frontend URL
    methods: ["GET", "POST"],
  },
});

userPresence(io);

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
