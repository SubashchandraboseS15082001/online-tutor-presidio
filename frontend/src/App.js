import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import Home from "./routes/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
