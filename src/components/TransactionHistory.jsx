import { useEffect, useState } from "react";
import { fetchTransactionHistory } from "../services/api";

const TransactionHistory = () => {
  const username = localStorage.getItem("username");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchTransactionHistory(username);
        setTransactions(data.reverse());
      } catch (err) {
        setError("Failed to fetch transaction history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [username]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📜 Transaction History
      </h1>

      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow-md rounded-lg p-4">
        {transactions.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Asset</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Price at Purchase</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b">
                  <td
                    className={`p-2 font-semibold ${
                      tx.type === "BUY" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td className="p-2">{tx.asset.symbol}</td>
                  <td className="p-2">{tx.amount.toFixed(4)}</td>
                  <td className="p-2">${tx.priceAtPurchase.toFixed(2)}</td>
                  <td className="p-2">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
