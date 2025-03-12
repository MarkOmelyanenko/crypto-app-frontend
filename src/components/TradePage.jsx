import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  buyAsset,
  sellAsset,
  fetchAssets,
  getUserBalance,
} from "../services/api";

const TradePage = () => {
  const username = localStorage.getItem("username");
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const selectedAssetFromUrl = searchParams.get("asset");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const loadAssets = async () => {
      const data = await fetchAssets();
      const sortedAssets = data
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      setAssets(sortedAssets);

      if (selectedAssetFromUrl) {
        const foundAsset = sortedAssets.find(
          (asset) => asset.symbol === selectedAssetFromUrl
        );
        if (foundAsset) {
          setSelectedAsset(foundAsset.symbol);
          setCurrentPrice(foundAsset.price);
        }
      } else if (sortedAssets.length > 0) {
        setSelectedAsset(sortedAssets[0].symbol);
        setCurrentPrice(sortedAssets[0].price);
      }
    };

    const loadBalance = async () => {
      const balance = await getUserBalance(username);
      setBalance(balance);
    };

    loadAssets();
    loadBalance();
  }, [username, selectedAssetFromUrl]);

  useEffect(() => {
    const selected = assets.find((asset) => asset.symbol === selectedAsset);
    if (selected) {
      setCurrentPrice(selected.price);
    }
  }, [selectedAsset, assets]);

  useEffect(() => {
    if (amount && !isNaN(amount) && currentPrice > 0) {
      setTotalCost(parseFloat(amount) * currentPrice);
    } else {
      setTotalCost(0);
    }
  }, [amount, currentPrice]);

  const handleBuy = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage("❌ Please enter a valid amount!");
      return;
    }

    try {
      const result = await buyAsset(
        username,
        selectedAsset,
        parseFloat(amount)
      );
      setMessage(`✅ Successfully bought ${amount} ${selectedAsset}!`);
      setBalance(balance - result.amount * result.priceAtPurchase);
      window.location.reload(false);
    } catch (error) {
      setMessage("❌ Transaction failed. Not enough balance!");
      console.error(error);
    }
  };

  const handleSell = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage("❌ Please enter a valid amount!");
      return;
    }

    try {
      const result = await sellAsset(
        username,
        selectedAsset,
        parseFloat(amount)
      );
      setMessage(`✅ Successfully sold ${amount} ${selectedAsset}!`);
      setBalance(balance - result.amount * result.priceAtPurchase);
      // window.location.reload(false);
    } catch (error) {
      setMessage("❌ Transaction failed. Not enough assets!");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">💹 Trade Cryptocurrencies</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-semibold">
          💰 Balance: ${balance.toFixed(2)}
        </p>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Select Asset:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
        >
          {assets
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.name} ({asset.symbol})
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Current Price:</label>
        <p className="text-lg font-semibold">💰 ${currentPrice.toFixed(2)}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Amount:</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Total Cost:</label>
        <p className="text-lg font-semibold">💲 {totalCost.toFixed(2)}</p>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={handleBuy}
        >
          🛒 Buy
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={handleSell}
        >
          💸 Sell
        </button>
      </div>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default TradePage;
