import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { SocketProvider } from "./contexts/socketContext.jsx";
import { ControlsProvider } from "./contexts/controlsContext.jsx";
import { RoomInfoProvider } from "./contexts/roomInfoContext.jsx";
import { UserDetailsProvider } from "./contexts/userContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <UserDetailsProvider>
        <SocketProvider>
          <RoomInfoProvider>
            <ControlsProvider>
              <App />
            </ControlsProvider>
          </RoomInfoProvider>
        </SocketProvider>
      </UserDetailsProvider>
    </NextUIProvider>
  </React.StrictMode>
);
