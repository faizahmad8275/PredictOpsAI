import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

import Dashboard1 from "./pages/Dashboard/Dashboard1";
import Dashboard2 from "./pages/Dashboard/Dashboard2";
import Dashboard3 from "./pages/Dashboard/Dashboard3";
import Dashboard4 from "./pages/Dashboard/Dashboard4";




function App() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/dashboard3" element={<Dashboard3 />} />
        <Route path="/dashboard4" element={<Dashboard4 />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;