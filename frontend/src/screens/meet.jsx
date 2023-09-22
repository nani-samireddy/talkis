import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSocket } from "../contexts/socketContext";
import Navbar from "../components/navbar";
import Controls from "../components/controls";
import MenuCard from "../components/menuCard";
import { Card } from "@nextui-org/react";
import { useControls } from "../contexts/controlsContext";
import { useRoomInfo } from "../contexts/roomInfoContext";
import VideoPlayer from "../components/videoPlayer";

import { useUserDetails } from "../contexts/userContext";

export default function Meet() {
  const socket = useSocket();
  //controls has isMicOn, setIsMicOn, isVideoOn, setIsVideoOn, isScreenShareOn, setIsScreenShareOn, isChatOn, setIsChatOn, isParticipantsOn, setIsParticipantsOn, isSettingsOn, setIsSettingsOn
  const controls = useControls();
  const roomInfo = useRoomInfo();
  const userDetails = useUserDetails();
  const [myStream, setMyStream] = useState(null);
  const remoteVideoRefs = useRef({});

  // const handleUserCall = useCallback(async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   setMyStream(stream);
  // }, []);

  const handleUserJoined = useCallback(({ roomId, participants, author }) => {
    console.log("user-joined", participants, author);
    roomInfo.updateRoomInfo({ roomId, participants, author });
  }, []);
  const handleUserLeft = useCallback(({ participants, user }) => {
    console.log("user-left", user);
    roomInfo.setParticipants(participants);
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

  useEffect(() => {
    socket.on("signal", ({ userId, signal }) => {
      console.log("signal recived", userId, signal);
      console.log(remoteVideoRefs.current);
      if (signal.type === "stream") {
        const remoteVideoRef = remoteVideoRefs.current[userId];
        if (remoteVideoRef) {
          remoteVideoRef.srcObject = new MediaStream([signal.data]);
        }
      }
    });
    return () => {
      socket.off("signal");
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

  const handleRemoteVideoRef = (userId, ref) => {
    remoteVideoRefs.current[userId] = ref;
  };

  return (
    <div className="relative h-screen">
      <Navbar />
      {/* video */}
      <div className="flex p-2">
        <VideoPlayer stream={myStream} name="You" mute={true} />
      </div>

      <div className="flex flex-wrap justify-center">
        {roomInfo.participants
          .filter((p) => p.userId !== userDetails.userId)
          .map((p) => (
            <div key={p.socketId} className="flex p-2">
              <Card className="w-60 h-36 object-cover rounded-lg">
                <video
                  className="w-60 h-36 object-cover rounded-lg"
                  autoPlay
                  playsInline
                  ref={(ref) => handleRemoteVideoRef(p.userId, ref)}
                />
                <Card
                  shadow="none"
                  isBlurred
                  className="absolute bottom-0 left-0   text-xs m-2 text-black px-2"
                >
                  {p.name}
                </Card>
              </Card>
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
