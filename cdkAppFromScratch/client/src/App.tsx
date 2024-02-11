import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import { AuthService } from "./services/AuthService";
import { useState } from "react";
import Profile from "./components/Profile";
import { DataService } from "./services/DataService";
import CreateSpace from "./components/spaces/CreateSpace";

const authService = new AuthService();
const dataService = new DataService();

function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  return (
    <BrowserRouter>
      <NavBar userName={userName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login authService={authService} setUserNameCb={setUserName} />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/spaces" element={<Spaces />} /> */}
        <Route path="/createSpace" element={<CreateSpace dataService={dataService} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
