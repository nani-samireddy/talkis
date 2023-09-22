import { useState } from "react";
import Home from "./screens/home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Meet from "./screens/meet";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Meet />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
