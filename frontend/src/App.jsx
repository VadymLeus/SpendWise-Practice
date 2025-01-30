import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Records from "./pages/Records/Records";
import Profile from "./pages/Profile/Profile";
import Error404 from "./pages/Errors/404-error";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Records />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default App;
