import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import PortfolioPage from "./components/PortfolioPage";
import PortfolioAnalytics from "./components/PortfolioAnalytics";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import TradePage from "./components/TradePage";
import TransactionHistory from "./components/TransactionHistory";

function App() {
  const [user, setUser] = useState(
    localStorage.getItem("token") ? "user" : null
  );

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route
              path="/portfolio/analytics"
              element={<PortfolioAnalytics />}
            />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
