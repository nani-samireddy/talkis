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

export default function Home() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
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
        body: "Enter your name, email and the meeting code to join the meet",
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

  const handleJoinMeetClick = (e) => {
    socket.emit("join-meet", { name, email, code });
    onClose();
  };

  const handleCreateMeetClick = (e) => {
    const socket = useSocket();
    socket.emit("create-meet", { name, email });
    onClose();
  };

  const handleJoinMeet = useCallback(
    ({ name, email, code }) => {
      navigate(`/meet/${code}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("join-meet", handleJoinMeet);
    return () => {
      socket.off("join-meet", handleJoinMeet);
    };
  }, [socket, handleJoinMeet]);

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
                  placeholder="Enter the code here."
                  value={code}
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
                    ? handleJoinMeetClick
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
