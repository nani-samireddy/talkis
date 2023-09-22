import { useState } from "react";
import {
  ButtonGroup,
  Button,
  Card,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Snippet,
} from "@nextui-org/react";
import Microphone from "../icons/microphone";
import Camera from "../icons/camera";
import MenuIcon from "../icons/menu";
import InfoIcon from "../icons/info";
import { useControls } from "../contexts/controlsContext";
import { useRoomInfo } from "../contexts/roomInfoContext";

export default function Controls() {
  const controls = useControls();
  const { roomId } = useRoomInfo();

  const handleMenuToggle = () => {
    console.log("menu toggle");
    controls.setIsSettingsOn(!controls.isSettingsOn);
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
        <Popover>
          <PopoverTrigger>
            <Button className="mx-2" isIconOnly variant="light">
              <InfoIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <div className=" text-base font-bold">Meeting info</div>
              <div className="text-sm p-2">
                Meeting ID:
                <Snippet hideSymbol="true" size="sm" variant="flat">
                  {roomId}
                </Snippet>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </ButtonGroup>
    </Card>
  );
}
