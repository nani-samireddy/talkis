import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../contexts/socketContext";
import Navbar from "../components/navbar";
import Controls from "../components/controls";
import MenuCard from "../components/menuCard";
import { Button } from "@nextui-org/react";
import { useControls } from "../contexts/controlsContext";
import peer from "../services/peerService";
import VideoPlayer from "../components/videoPlayer";

export default function Meet() {
  const socket = useSocket();
  //controls has isMicOn, setIsMicOn, isVideoOn, setIsVideoOn, isScreenShareOn, setIsScreenShareOn, isChatOn, setIsChatOn, isParticipantsOn, setIsParticipantsOn, isSettingsOn, setIsSettingsOn
  const controls = useControls();
  const [remoteSocketIds, setRemoteSocketIds] = useState([]); // [id1, id2, ...]
  const [myStream, setMyStream] = useState(null);

  const handleUserCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    // const offer = await peer.getOffer();
    // socket.emit("call-user", {
    //   offer,
    //   to: remoteSocketIds[0],
    // });
  }, [remoteSocketIds, socket, controls.isMicOn, controls.isVideoOn]);

  const handleUserJoined = useCallback(({ name, email, id }) => {
    console.log("user " + name, email, id);
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    handleUserCall();
    return () => {
      socket.off("user-joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  useEffect(() => {
    if (myStream) {
      myStream.getTracks().find((track) => track.kind === "video").enabled =
        controls.isVideoOn;
      myStream.getTracks().find((track) => track.kind === "audio").enabled =
        controls.isMicOn;
    }
  }, [controls.isMicOn, controls.isVideoOn, myStream]);

  return (
    <div className="relative h-screen">
      <Navbar />
      {/* video */}
      <div className="flex p-2">
        <VideoPlayer stream={myStream} name="You" />
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
