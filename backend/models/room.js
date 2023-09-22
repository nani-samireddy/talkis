const { v4 } = require("uuid");

class Room {
  participants = [];
  roomId = null;
  author = null;
  constructor(author) {
    this.author = author;
    this.roomId = v4();
    this.participants.push(author);
  }
  addParticipant(participant) {
    this.participants.push(participant);
  }
  removeParticipant(participant) {
    this.participants = this.participants.filter(
      (p) => p.email !== participant.email
    );
  }
  getParticipants() {
    return this.participants;
  }
  getRoomId() {
    return this.roomId;
  }
  getAuthor() {
    return this.author;
  }
  getParticipantByEmail(email) {
    return this.participants.find((p) => p.email === email);
  }
  getParticipantBySocketId(socketId) {
    return this.participants.find((p) => p.socketId === socketId);
  }
  getRoomInfo() {
    return {
      roomId: this.roomId,
      participants: this.participants.map((p) => p.getParticipantInfo()),
      author: this.author.getParticipantInfo(),
    };
  }
}

module.exports = Room;
