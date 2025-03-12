import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCryptoPrices } from "../services/api";
import { connectWebSocket, disconnectWebSocket } from "../services/socket";

const Home = () => {
  const [cryptos, setCryptos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const data = await fetchCryptoPrices();
      if (isMounted) setCryptos(data);
    };
    loadData();

    const onMessage = (newPrices) => {
      setCryptos((prevCryptos) =>
        prevCryptos.map((crypto) => {
          const updated = newPrices.find(
            (item) => item.symbol === crypto.symbol
          );
          return updated ? { ...crypto, price: updated.price } : crypto;
        })
      );
    };

    connectWebSocket(onMessage);

    return () => {
      isMounted = false;
      disconnectWebSocket();
    };
  }, []);

  const handleClick = (symbol) => {
    navigate(`/trade?asset=${symbol}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📈 Live Crypto Prices
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cryptos
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((crypto) => (
            <div
              key={crypto.symbol}
              className="bg-white shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => handleClick(crypto.symbol)}
            >
              <h2 className="text-xl font-semibold">
                {crypto.name} ({crypto.symbol})
              </h2>
              <p className="text-gray-600">💰 ${crypto.price.toFixed(2)}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
