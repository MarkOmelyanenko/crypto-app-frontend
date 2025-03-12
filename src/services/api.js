import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchPortfolio = async (username) => {
  const response = await axios.get(
    `${API_BASE_URL}/transactions/${username}/portfolio`
  );
  return response.data;
};

export const fetchCryptoPrices = async () => {
  const response = await axios.get(`${API_BASE_URL}/assets`);
  return response.data;
};

export const fetchPortfolioAnalytics = async (username) => {
  const response = await fetch(
    `${API_BASE_URL}/users/${username}/portfolio/analytics`
  );
  return response.json();
};

export const buyAsset = async (username, symbol, amount) => {
  const response = await fetch(
    `${API_BASE_URL}/transactions/${username}/buy?symbol=${symbol}&amount=${amount}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ symbol, amount }),
    }
  );
  return response.json();
};

export const sellAsset = async (username, symbol, amount) => {
  const response = await fetch(
    `${API_BASE_URL}/transactions/${username}/sell?symbol=${symbol}&amount=${amount}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ symbol, amount }),
    }
  );
  return response.json();
};

export const fetchAssets = async () => {
  const response = await fetch(`${API_BASE_URL}/assets`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getUserBalance = async () => {
  const username = localStorage.getItem("username");
  if (!username) {
    console.error("No username found in localStorage!");
    return 0;
  }

  const response = await fetch(`${API_BASE_URL}/users/${username}/balance`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.json();
};

export const fetchTransactionHistory = async (username) => {
  const response = await fetch(
    `${API_BASE_URL}/transactions/${username}/history`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
