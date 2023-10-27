import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./App.css";
import Login from "./Login";
import { useStore } from "./hooks/useStore";
import UserLoginProvider from "./UserLogin";
import Home from "./Home";
import Api from "./Api";
import AddAdmins from "./AddAdmins";
import Blacklist from "./Blacklist";
import Whitelist from "./Whitelist";

function App() {  
  return (
    <BrowserRouter>
    <UserLoginProvider>
    <Routes>
      <Route path="/" element={<Login />} />  
      <Route path="/Landing" element={<Home />} />
      <Route path="/Api" element={<Api />} />
      <Route path="/AddAdmins" element={<AddAdmins />} />
      <Route path="/Blacklist" element={<Blacklist />} />
      <Route path="/Whitelist" element={<Whitelist />} />
    </Routes>
    </UserLoginProvider>
    </BrowserRouter>
  );
}

export default App;
