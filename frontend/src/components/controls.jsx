import { useState } from "react";
import { ButtonGroup, Button, Card, CardBody } from "@nextui-org/react";
import Microphone from "../icons/microphone";
import Camera from "../icons/camera";
import MenuIcon from "../icons/menu";
import InfoIcon from "../icons/info";
import ChatIcon from "../icons/chat";
import { useControls } from "../contexts/controlsContext";

export default function Controls() {
  const controls = useControls();

  const handleMenuToggle = () => {
    console.log("menu toggle");
    controls.setIsSettingsOn(!controls.isSettingsOn);
  };

  const handleInfoToggle = () => {
    console.log("info toggle");
  };

  const handleChatToggle = () => {
    console.log("chat toggle");
    controls.setIsChatOn(!controls.isChatOn);
  };

  const handleMicToggle = () => {
    console.log("mic toggle");
    controls.setIsMicOn(!controls.isMicOn);
  };

  const handleCameraToggle = () => {
    console.log("camera toggle");
    controls.setIsVideoOn(!controls.isVideoOn);
  };
  return (
    <Card isBlurred shadow="sm" className="p-2">
      <ButtonGroup>
        <Button
          className="mx-2"
          isIconOnly
          variant="light"
          onPress={handleMicToggle}
        >
          <Microphone status={controls.isMicOn} />
        </Button>
        <Button
          className="mx-2"
          isIconOnly
          variant="light"
          onPress={handleCameraToggle}
        >
          <Camera status={controls.isVideoOn} />
        </Button>

        <Button
          className="mx-2"
          isIconOnly
          variant="light"
          onPress={handleMenuToggle}
        >
          <MenuIcon />
        </Button>
        <Button
          className="mx-2"
          isIconOnly
          variant="light"
          onPress={handleInfoToggle}
        >
          <InfoIcon />
        </Button>
      </ButtonGroup>
    </Card>
  );
}
