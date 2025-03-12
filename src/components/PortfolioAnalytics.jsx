import { useEffect, useState } from "react";
import { fetchPortfolioAnalytics } from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF4560",
  "#795548",
  "#4CAF50",
];

const PortfolioAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const loadAnalytics = async () => {
      setAnalytics(null);
      try {
        const data = await fetchPortfolioAnalytics(username);
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch portfolio analytics:", error);
        setAnalytics(null);
      }
    };
    loadAnalytics();
  }, [username]);

  if (!analytics || Object.keys(analytics).length === 0)
    return (
      <p className="text-center text-red-500 text-lg">
        ❌ No data available for asset distribution.
      </p>
    );

  const data = Object.entries(analytics.profitDistribution || {}).map(
    ([symbol, value], index) => ({
      name: symbol,
      value: parseFloat(value.toFixed(2)),
      color: COLORS[index % COLORS.length],
    })
  );

  return (
    <div className="container mx-auto p-6 flex flex-col items-center bg-white shadow-lg rounded-lg max-w-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        📊 Portfolio Analytics
      </h2>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full text-center mb-4">
        <p className="text-lg font-semibold text-gray-700">
          💰 Total Value:{" "}
          <span className="text-blue-500">
            ${analytics.totalValue.toFixed(2)}
          </span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          💵 Total Invested:{" "}
          <span className="text-green-500">
            ${analytics.totalInvested.toFixed(2)}
          </span>
        </p>
        <p
          className={`text-lg font-semibold ${
            analytics.profitLoss >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          📈 Profit/Loss: ${analytics.profitLoss.toFixed(2)} (
          {analytics.profitPercentage.toFixed(2)}%)
        </p>
      </div>

      {data.length > 0 ? (
        <PieChart width={400} height={400} className="mt-4">
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={140}
            fill="#8884d8"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      ) : (
        <p className="text-gray-600 text-lg">
          ⚠ No assets to display in the portfolio.
        </p>
      )}
    </div>
  );
};

export default PortfolioAnalytics;
