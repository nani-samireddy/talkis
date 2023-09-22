import { createContext, useContext, useState } from "react";
import io from "socket.io-client";
const RoomInfoContext = createContext(null);

export const useRoomInfo = () => {
  return useContext(RoomInfoContext);
};

export const RoomInfoProvider = (props) => {
  const [participants, setParticipants] = useState([]); // [participant1, participant2, ...]
  const [author, setAuthor] = useState(null); // participant
  const [roomId, setRoomId] = useState(null); // string
  const [messages, setMessages] = useState([
    { type: "ALERT", message: "Welcome to the meeting" },
  ]); // [message1, message2, ...

  const userAddedMessage = ({ userName }) => {
    setMessages([
      ...messages,
      { type: "ALERT", message: `${userName} joined the meeting` },
    ]);
  };

  const userLeftMessage = ({ userName }) => {
    setMessages([
      ...messages,
      { type: "ALERT", message: `${userName} left the meeting` },
    ]);
  };

  const recivedMessage = ({ userName, message }) => {
    setMessages([
      ...messages,
      { type: "MESSAGE", message: message, username: userName },
    ]);
  };

  const updateRoomInfo = (roomInfo) => {
    setParticipants(roomInfo.participants);
    setAuthor(roomInfo.author);
    setRoomId(roomInfo.roomId);
  };

  return (
    <RoomInfoContext.Provider
      value={{
        participants,
        setParticipants,
        author,
        setAuthor,
        roomId,
        setRoomId,
        messages,
        setMessages,
        updateRoomInfo,
      }}
    >
      {props.children}
    </RoomInfoContext.Provider>
  );
};
