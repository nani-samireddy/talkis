class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  getOffer = async () => {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  };

  setAnswer = async (answer) => {
    if (this.peer) {
      await this.peer.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  }

  setCandidate = async (candidate) => {
    if (this.peer) {
      await this.peer.addIceCandidate(candidate);
    }
  }

  
}

export default new PeerService();
