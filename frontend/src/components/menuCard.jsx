import React from "react";
import { Card, Tabs, Tab } from "@nextui-org/react";

export default function MenuCard() {
  return (
    <Card className="p-4 m-2">
      <Tabs>
        <Tab key={1} label="Chat">
          <div className="p-4">
            <p>Chat</p>
          </div>
        </Tab>
        <Tab key={2} label="Participants">
          <div className="p-4">
            <p>Participants</p>
          </div>
        </Tab>
        <Tab key={3} label="Settings">
          <div className="p-4">
            <p>Settings</p>
          </div>
        </Tab>
      </Tabs>
    </Card>
  );
}
