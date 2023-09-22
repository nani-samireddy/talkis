const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const Room = require("./models/room");
const Participant = require("./models/participant");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});
const uuidv4 = require("uuid");

// MIDDLE WARE
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to the TELEMA server API");
});

app.get("/all-rooms", (req, res) => {
  res.send(rooms);
});

// app.get("/new", (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });

app.get("/:roomId", (req, res) => {
  res.send({ roomId: req.params.roomId });
});

// DATA
const rooms = [];

// SOCKET
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");

    rooms.forEach((room) => {
      // remove participant from room
      const participant = room.getParticipantBySocketId(socket.id);
      if (participant) {
        room.removeParticipant(participant);
        io.to(room.getRoomId()).emit("user-left", participant);
      }
      // remove room if no participants
      if (room.getParticipants().length === 0) {
        rooms.splice(rooms.indexOf(room), 1);
      }
    });
  });

  // create room only
  socket.on("create-room", ({ name, email, userId }) => {
    console.log("Creating room");
    const author = new Participant(name, email, socket.id, userId);
    const room = new Room(author);
    rooms.push(room);
    socket.join(room.getRoomId());
    io.to(socket.id).emit("room-joined", room.getRoomInfo());
    io.to(room.getRoomId()).emit("user-joined", room.getRoomInfo());
    // socket.on("signal", (data) => {
    //   io.to(data.to).emit("signal", {
    //     from: socket.id,
    //     data: data.data,
    //   });
    // });
  });

  // join room or create room
  socket.on("join-room", ({ roomId, name, email, userId }) => {
    console.log("Joining room");
    const participant = new Participant(name, email, socket.id, userId);
    const room = rooms.find((room) => room.getRoomId() === roomId);
    if (room) {
      room.addParticipant(participant);
    } else {
      room = new Room(participant);
      rooms.push(room);
    }
    socket.join(room.getRoomId());
    io.to(socket.id).emit("room-joined", room.getRoomInfo());
    io.to(room.getRoomId()).emit("user-joined", room.getRoomInfo());
    // socket.on("signal", (data) => {
    //   io.to(data.to).emit("signal", {
    //     from: socket.id,
    //     data: data.data,
    //   });
    // });
  });

  // Handle signaling messages
  socket.on("signal", ({ roomId, userId, signal }) => {
    // Broadcast the signaling message to all participants in the room except the sender
    io.to(roomId).emit("signal", { userId, signal });
  });

  socket.on("leave-room", ({ roomId, name, email, userId }) => {
    const participant = new Participant(name, email, socket.id, userId);
    const room = rooms.find((room) => room.getRoomId() === roomId);
    if (room) {
      room.removeParticipant(participant);

      socket.leave(roomId);
      io.to(roomId).emit("user-left", {
        participants: room.getParticipants(),
        user: participant,
      });
    }
  });
});

io.listen(3001);
// SERVER
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
