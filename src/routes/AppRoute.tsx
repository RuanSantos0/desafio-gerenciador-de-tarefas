import { BrowserRouter, Routes, Route} from "react-router-dom";

import { Auth } from "../pages/Auth";
import {Home} from "../pages/Home"

function AppRoute() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
        
    </div>
  );
}

export default AppRoute;
