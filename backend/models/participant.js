class Participant {
  name = "";
  email = "";
  socketId = "";
  userId = "";
  constructor(name, email, socketId, userId) {
    this.name = name;
    this.email = email;
    this.socketId = socketId;
    this.userId = userId;
  }
  getParticipantInfo() {
    return {
      name: this.name,
      email: this.email,
      socketId: this.socketId,
      userId: this.userId,
    };
  }
}

module.exports = Participant;
