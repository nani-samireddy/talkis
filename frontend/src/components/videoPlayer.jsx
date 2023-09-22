import { Card } from "@nextui-org/react";
import React, { forwardRef } from "react";

const VideoPlayer = forwardRef(({ stream, name, mute }, ref) => {
  const handleRefs = (videoRef) => {
    if (videoRef) {
      videoRef.srcObject = stream;
    }
  };

  return (
    <Card className="w-60 h-36 object-cover rounded-lg">
      <video
        className="w-60 h-36 object-cover rounded-lg"
        autoPlay
        playsInline
        muted={mute}
        ref={(videoRef) => {
          handleRefs(videoRef);
          if (ref) {
            ref.current = videoRef;
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
});

export default VideoPlayer;
