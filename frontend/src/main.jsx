import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { SocketProvider } from "./contexts/socketContext.jsx";
import { ControlsProvider } from "./contexts/controlsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <SocketProvider>
        <ControlsProvider>
          <App />
        </ControlsProvider>
      </SocketProvider>
    </NextUIProvider>
  </React.StrictMode>
);
