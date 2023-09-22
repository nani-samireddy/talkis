import React from "react";
import {
  Card,
  Tabs,
  Tab,
  User,
  CardBody,
  CardHeader,
  Avatar,
  Input,
} from "@nextui-org/react";
import { useRoomInfo } from "../contexts/roomInfoContext";

export default function MenuCard() {
  const { participants, messages } = useRoomInfo();

  return (
    <Card className="p-4 m-2 flex flex-col">
      <Tabs aria-label="Menu">
        <Tab key={"Chat"} title="Chat">
          <div className="flex flex-col items-start justify-center">
            {messages.map((message) => (
              <div
                key={message.message}
                className=" text-black w-max"
              >
                {message.type === "ALERT" ? (
                  <p className="text-tiny w-full text-center  py-3">
                    {message.message}
                  </p>
                ) : (
                  <div className="flex items-center justify-start gap-1">
                    <Avatar name={message.userName} size="sm" />
                    <p className="text-sm p-2">{message.message}</p>
                  </div>
                )}
              </div>
            ))}
            <Input placeholder="Enter your message here"/>
          </div>
        </Tab>
        <Tab key={"Participants"} title="Participants">
          <div className="flex flex-col gap-2 items-start">
            {participants.map((participant) => (
              <User
                key={participant.socketId}
                name={participant.name}
                description={participant.email}
                avatarProps={{
                  name: participant.name,
                }}
              />
            ))}
          </div>
        </Tab>
        <Tab key={"Settings"} title="Settings">
          <div className="p-4">
            <p>Settings</p>
          </div>
        </Tab>
      </Tabs>
    </Card>
  );
}
