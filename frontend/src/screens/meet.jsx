import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSocket } from "../contexts/socketContext";
import Navbar from "../components/navbar";
import Controls from "../components/controls";
import MenuCard from "../components/menuCard";
import { Card } from "@nextui-org/react";
import { useControls } from "../contexts/controlsContext";
import { useRoomInfo } from "../contexts/roomInfoContext";
import VideoPlayer from "../components/videoPlayer";
import Peer from "simple-peer";
import { useUserDetails } from "../contexts/userContext";

export default function Meet() {
  const socket = useSocket();
  //controls has isMicOn, setIsMicOn, isVideoOn, setIsVideoOn, isScreenShareOn, setIsScreenShareOn, isChatOn, setIsChatOn, isParticipantsOn, setIsParticipantsOn, isSettingsOn, setIsSettingsOn
  const controls = useControls();
  const roomInfo = useRoomInfo();
  const userDetails = useUserDetails();
  const [myStream, setMyStream] = useState(null);
  const remoteVideoRefs = useRef({});
  const [peers, setPeers] = useState([]);

  // const handleUserCall = useCallback(async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   setMyStream(stream);
  // }, []);

  const handleUserJoined = useCallback(
    ({ roomId, participants, author, user }) => {
      console.log("user-joined", participants, author);
      roomInfo.updateRoomInfo({ roomId, participants, author });
      // creating peer connection with initiator as true
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: myStream,
        config: {
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        },
      });
      // adding stream to peer connection
      peer.on("signal", (offer) => {
        console.log("offer", offer);
        socket.emit("signal", {
          roomId,
          userId: userDetails.userId,
          signal: { type: "offer", data: offer },
        });
      });

      peer.on("stream", (userStream) => {
        setPeers((peers) => [
          ...peers,
          { peerId: user.userId, stream: userStream },
        ]);
      });

      peer.on("close", () => {
        const index = remoteVideoRefs.current.findIndex(
          (p) => p.peerId === user.userId
        );
        if (index !== -1) {
          remoteVideoRefs.current.splice(index, 1);
          setPeers(remoteVideoRefs.current);
        }
      });

      remoteVideoRefs.current.push({ peerId: user.userId, peer });
    },
    []
  );
  const handleUserLeft = useCallback(({ participants, user }) => {
    console.log("user-left", user);
    roomInfo.setParticipants(participants);
    const index = remoteVideoRefs.current.findIndex(
      (p) => p.peerId === user.userId
    );
    if (index !== -1) {
      remoteVideoRefs.current[index].peer.destroy();
      remoteVideoRefs.current.splice(index, 1);
    }
    setPeers((peers) => peers.filter((p) => p.peerId !== user.userId));
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    //handleUserCall();

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
  }, [socket, handleUserJoined, handleUserLeft]);

  // useEffect(() => {
  //   socket.on("signal", ({ userId, signal }) => {
  //     console.log("signal recived", userId, signal);
  //     console.log(remoteVideoRefs.current);
  //     if (signal.type === "stream") {
  //       const remoteVideoRef = remoteVideoRefs.current[userId];
  //       if (remoteVideoRef) {
  //         remoteVideoRef.srcObject = new MediaStream([signal.data]);
  //       }
  //     }
  //   });
  //   return () => {
  //     socket.off("signal");
  //     remoteVideoRefs.current = {};
  //   };
  // }, []);

  useEffect(() => {
    socket.on("receive-offer", ({ userId, offer }) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: myStream,
        config: {
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        },
      });
      peer.on("signal", (answer) => {
        console.log("answer", answer);
        socket.emit("signal", {
          roomId: roomInfo.roomId,
          userId: userDetails.userId,
          signal: { type: "answer", data: answer },
        });
      });

      peer.on("stream", (userStream) => {
        setPeers((peers) => [...peers, { peerId: userId, stream: userStream }]);
      });

      peer.on("close", () => {
        const index = remoteVideoRefs.current.findIndex(
          (p) => p.peerId === userId
        );
        if (index !== -1) {
          remoteVideoRefs.current.splice(index, 1);
          setPeers((peers) => peers.filter((p) => p.peerId !== userId));
        }
      });

      peer.signal(offer);
      remoteVideoRefs.current.push({ peerId: userId, peer });
    });

    socket.on("receive-answer", ({ userId, answer }) => {
      const peer = remoteVideoRefs.current.find((p) => p.peerId === userId);
      if (peer) {
        peer.signal(answer);
      }
    });

    socket.on("receive-ice-candidate", ({ userId, candidate }) => {
      const peer = remoteVideoRefs.current.find((p) => p.peerId === userId);
      if (peer) {
        peer.signal(candidate);
      }
    });

    return () => {
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidate");
      remoteVideoRefs.current = {};
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (stream) {
          stream.getTracks().find((track) => track.kind === "video").enabled =
            controls.isVideoOn;
          stream.getTracks().find((track) => track.kind === "audio").enabled =
            controls.isMicOn;

          setMyStream(stream);

          stream.getTracks().forEach((track) => {
            socket.emit("signal", {
              roomId: roomInfo.roomId,
              userId: userDetails.userId,
              signal: { type: "stream", data: track },
            });
          });
        }
      });
  }, [socket, controls.isMicOn, controls.isVideoOn]);

  return (
    <div className="relative h-screen">
      <Navbar />
      {/* video */}
      <div className="flex p-2">
        <VideoPlayer stream={myStream} name="You" mute={true} />
      </div>

      <div className="flex flex-wrap justify-center">
        {peers.map((peer) => (
          <div className="flex p-2" key={peer.peerId}>
            <video
              ref={(ref) => {
                if (ref) {
                  ref.srcObject = peer.stream;
                }
              }}
              autoPlay
              playsInline
              className="w-64 h-48"
            ></video>
          </div>
        ))}
      </div>
      {/* chat and participants */}
      {controls.isSettingsOn && (
        <div className="absolute top-0 right-0">
          <MenuCard />
        </div>
      )}
      {/* controls */}
      <div className=" absolute bottom-0 left-0 w-full flex items-center justify-center mb-6">
        <Controls />
      </div>
    </div>
  );
}
