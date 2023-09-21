import { createContext, useState, useContext } from "react";

const ControlsContext = createContext(null);

export const useControls = () => {
  const controls = useContext(ControlsContext);
  return controls;
};

export const ControlsProvider = (props) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const [isChatOn, setIsChatOn] = useState(false);
  const [isParticipantsOn, setIsParticipantsOn] = useState(false);
  const [isSettingsOn, setIsSettingsOn] = useState(false);

  return (
    <ControlsContext.Provider
      value={{
        isMicOn,
        setIsMicOn,
        isVideoOn,
        setIsVideoOn,
        isScreenShareOn,
        setIsScreenShareOn,
        isChatOn,
        setIsChatOn,
        isParticipantsOn,
        setIsParticipantsOn,
        isSettingsOn,
        setIsSettingsOn,
      }}
    >
      {props.children}
    </ControlsContext.Provider>
  );
};
