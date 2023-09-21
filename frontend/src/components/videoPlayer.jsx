import { Card } from "@nextui-org/react";
import React from "react";

export default function VideoPlayer({ stream, name }) {
  return (
    <Card className="w-60 h-36 object-cover rounded-lg">
      <video
        className="w-60 h-36 object-cover rounded-lg"
        autoPlay
        playsInline
        ref={(ref) => {
          if (ref) {
            ref.srcObject = stream;
          }
        }}
      />
      <Card
        shadow="none"
        isBlurred
        className="absolute bottom-0 left-0   text-xs m-2 text-black px-2"
      >
        {name}
      </Card>
    </Card>
  );
}
