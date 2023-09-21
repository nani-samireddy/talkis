const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});
const uuidv4 = require("uuid");

// MIDDLE WARE
app.use(express.json());
app.use(bodyParser);

// ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to the TELEMA server API");
});

// app.get("/new", (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });

app.get("/:roomId", (req, res) => {
  res.send({ roomId: req.params.roomId });
});

// DATA
const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

// SOCKET
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("join-meet", ({ name, email, code }) => {
    socket.join(code);
    emailToSocketMapping.set(email, socket.id);
    socketToEmailMapping.set(socket.id, email);
    io.to(code).emit("user-joined", { name, email, id: socket.id });
    socket.join(code);
    io.to(socket.id).emit("join-meet", { name, email, code });
  });
});

io.listen(3001);
// SERVER
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
