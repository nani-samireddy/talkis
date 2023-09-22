import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Image,
} from "@nextui-org/react";
import { useSocket } from "../contexts/socketContext";
import { useNavigate } from "react-router-dom";
import { useRoomInfo } from "../contexts/roomInfoContext";
import { useUserDetails } from "../contexts/userContext";

export default function Home() {
  const socket = useSocket();
  const navigate = useNavigate();
  const roomInfo = useRoomInfo();
  const userDetails = useUserDetails();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roomId, setCode] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formType, setFormType] = React.useState("join"); // ["join", "create"]
  const [modalDetails, setModalDetails] = useState({
    header: "",
    body: "",
    footer: {
      cancel: "",
      ok: "",
    },
  });

  const handleButtonClick = (e) => {
    if (e.target.id === "join") {
      setFormType("join");
      setModalDetails({
        header: "Join Meet",
        body: "Enter your name, email and the meeting roomId to join the meet",
        footer: {
          cancel: "Cancel",
          ok: "Join",
        },
      });
    } else if (e.target.id === "create") {
      setFormType("create");
      setModalDetails({
        header: "Create Meet",
        body: "Enter your name and email to create a new meet",
        footer: {
          cancel: "Cancel",
          ok: "Create",
        },
      });
    }
    onOpen();
  };

  const handleRoomJoinedClick = (e) => {
    socket.emit("join-room", {
      name,
      email,
      roomId,
      userId: userDetails.userId,
    });
    onClose();
  };

  const handleCreateMeetClick = (e) => {
    socket.emit("create-room", { name, email, userId: userDetails.userId });
    onClose();
  };

  const handleRoomJoined = useCallback(
    ({ roomId, participants, author }) => {
      console.log("room joined", roomId, participants, author);
      roomInfo.updateRoomInfo({ roomId, participants, author });
      userDetails.setName(name);
      userDetails.setEmail(email);
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    const uid = Math.random().toString(36).substring(7);
    userDetails.setUserId(uid);
    socket.on("room-joined", handleRoomJoined);
    return () => {
      socket.off("room-joined", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  return (
    <div className="h-screen">
      <Navbar />
      <div className=" h-[90%] -w-full flex flex-col items-center justify-center gap-3">
        <Button
          variant="solid"
          color="primary"
          size="md"
          id="join"
          onPress={handleButtonClick}
        >
          Join Meet
        </Button>
        <Button
          variant="ghost"
          color="secondary"
          size="md"
          id="create"
          onPress={handleButtonClick}
        >
          Create a new Meet
        </Button>

        {/* Join meet modal */}
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>{modalDetails.header}</ModalHeader>
            <ModalBody>
              <p className="text-sm">{modalDetails.body}</p>
              <Input
                type="text"
                label="Name"
                labelPlacement="outside"
                placeholder="Enter your name here."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
              <Input
                type="email"
                label="Email"
                labelPlacement="outside"
                placeholder="Enter your email here."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {formType === "join" && (
                <Input
                  type="text"
                  label="Code"
                  labelPlacement="outside"
                  placeholder="Enter the roomId here."
                  value={roomId}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                color="secondary"
                size="small"
                onPress={onClose}
              >
                {modalDetails.footer.cancel}
              </Button>
              <Button
                variant="solid"
                color="primary"
                size="small"
                onPress={
                  formType === "join"
                    ? handleRoomJoinedClick
                    : handleCreateMeetClick
                }
              >
                {modalDetails.footer.ok}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
