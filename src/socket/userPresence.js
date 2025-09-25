let onlineUsers = 0;

export default function userPresence(io) {
  io.on("connection", (socket) => {
    onlineUsers++;
    io.emit("userCount", onlineUsers);

    socket.on("disconnect", () => {
      onlineUsers--;
      io.emit("userCount", onlineUsers);
    });
  });
}
