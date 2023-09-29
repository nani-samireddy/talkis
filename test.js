


// // Backend (Node.js)

// const express = require('express');
// const http = require('http');
// const socketio = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// const rooms = {}; // track rooms

// io.on('connection', socket => {

//   socket.on('join-room', roomId => {
//     if (!rooms[roomId]) {
//       rooms[roomId] = { users: {} }; // init empty room 
//     }
//     rooms[roomId].users[socket.id] = socket; // add user
    
//     socket.join(roomId);
    
//     // emit current users
//     io.to(roomId).emit('all-users', Object.keys(rooms[roomId].users));
//   });

//   socket.on('offer', (offer, roomId) => {
//     socket.to(rooms[roomId].users[offer.target]).emit('offer', offer); 
//   });

//   socket.on('answer', (answer, roomId) => {
//     socket.to(rooms[roomId].users[answer.target]).emit('answer', answer);
//   });

//   socket.on('ice-candidate', (candidate, roomId) => {
//     socket.to(rooms[roomId].users[candidate.target]).emit('ice-candidate', candidate);
//   });

// });

// server.listen(8000, () => {
//   console.log('Server listening on port 8000');
// });
// ```

// ```jsx
// // Frontend (React)

// import { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:8000');

// function VideoChat({roomId}) {

//   const [users, setUsers] = useState([]);
//   const [streams, setStreams] = useState([]);

//   useEffect(() => {

//     socket.emit('join-room', roomId);
    
//     socket.on('all-users', users => {
//       setUsers(users); 
//     });

//     socket.on('offer', handleOffer);
//     socket.on('answer', handleAnswer);
//     socket.on('ice-candidate', handleCandidate);

//   }, []);

//   function handleOffer(offer) {
//     // Set remote description etc.. 
//   }

//   // Other WebRTC handling..

//   return (
//     <div>
//       {/* Render video streams */}
//     </div>
//   )
// }

// export default VideoChat;