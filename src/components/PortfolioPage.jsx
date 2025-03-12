import { useEffect, useState } from "react";
import { fetchPortfolio } from "../services/api";
import { Link } from "react-router-dom";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const token = localStorage.getItem("token");
  const username = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

  useEffect(() => {
    if (!username) return;
    const loadData = async () => {
      try {
        const data = await fetchPortfolio(username);
        setPortfolio(data);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      }
    };
    loadData();
  }, [username]);

  if (!username)
    return (
      <p className="text-center text-red-500">
        Please log in to view your portfolio.
      </p>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">💰 Your Portfolio</h1>
      {portfolio.length === 0 ? (
        <p className="text-center">No assets in your portfolio yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div
              key={item.symbol}
              className="bg-gray-800 text-white p-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold">
                {item.name} ({item.symbol})
              </h2>
              <p>Total: {item.totalAmount.toFixed(6)} coins</p>
              <p>Avg Price: ${item.avgPurchasePrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Link to="/portfolio/analytics">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-blue-600 transition">
            📊 View Analytics
          </button>
        </Link>
        <Link to="/trade">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
            💹 Trade
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PortfolioPage;
