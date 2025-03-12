import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserBalance } from "../services/api";

const Navbar = ({ user, setUser }) => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBalance = async () => {
      const balance = await getUserBalance(username);
      setBalance(balance);
    };

    loadBalance();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">🚀 CryptoApp</Link>
      </div>
      <div className="flex space-x-6 items-center">
        {user ? (
          <>
            <Link to="/" className="hover:text-gray-400 transition">
              🏠 Home
            </Link>
            <Link to="/portfolio" className="hover:text-gray-400 transition">
              📊 Portfolio
            </Link>
            <Link
              to="/portfolio/analytics"
              className="hover:text-gray-400 transition"
            >
              📈 Analytics
            </Link>
            <Link to="/trade" className="hover:text-gray-400 transition">
              💹 Trade
            </Link>
            <Link to="/transactions" className="hover:text-gray-400 transition">
              📜 Transactions
            </Link>
            <div>💰 Balance: ${balance.toFixed(2)}</div>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded transition hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-400 transition">
              🔑 Login
            </Link>
            <Link to="/register" className="hover:text-gray-400 transition">
              📝 Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
