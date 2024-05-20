import axios from "axios";

const BASE_URL = "http://192.168.1.11:3001";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add any other headers if needed
  },
});

export const fetchIndiaMartData = async (location, industry) => {
  const apiUrl = `${BASE_URL}/indiaMart?ss=${encodeURIComponent(
    industry
  )}&cq=${encodeURIComponent(location)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching IndiaMart data:", error);
    throw error;
  }
};

export const fetchJustDialData = async (location, industry) => {
  const apiUrl = `${BASE_URL}/justDial?search=${encodeURIComponent(
    industry
  )}&location=${encodeURIComponent(location)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching IndiaMart data:", error);
    throw error;
  }
};
export const fetchTradeIndiaData = async (location, industry) => {
  const apiUrl = `${BASE_URL}/tradeindia?searchTerm=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching IndiaMart data:", error);
    throw error;
  }
};
export const fetchExportersIndiaData = async (location, industry) => {
  const apiUrl = `${BASE_URL}/exportersIndia?searchTerm=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching IndiaMart data:", error);
    throw error;
  }
};
export const fetchAliBabaData = async (industry) => {
  const apiUrl = `${BASE_URL}/alibabaData?searchTerm=${encodeURIComponent(industry)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching IndiaMart data:", error);
    throw error;
  }
};

export const fetchTradeWheelData = async (industry) => {
  const apiUrl = `${BASE_URL}/tradewheelData?searchTerm=${encodeURIComponent(industry)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching IndiaMart data:", error);
    throw error;
  }
};

// Function to fetch data based on selected channel
export const fetchDataFromBackend = async (channel = "indiamart",location,industry) => {
  try {
    console.log(channel);
    if (channel === "indiamart") {
      return await fetchIndiaMartData(location, industry);
    }
    if (channel === "justdial") {
      return await fetchJustDialData(location, industry);
    }
    if (channel === "tradeindia") {
      return await fetchTradeIndiaData(location, industry);
    }
    if (channel === "exportersindia") {
      return await fetchExportersIndiaData(location, industry);
    }
    if (channel === "alibaba") {
      return await fetchAliBabaData(industry);
    }
    if (channel === "tradewheel") {
      return await fetchTradeWheelData(industry);
    }

    // For other channels (to be implemented later)

    // If no specific implementation for a channel, return a user-friendly message
    return { message: "For This Channel Work Under Development..." };
  } catch (error) {
    console.error("Error fetching channel data:", error);
    throw error;
  }
};

export default api;
