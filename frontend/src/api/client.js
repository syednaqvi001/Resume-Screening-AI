// API Client for Resume Screening

import axios from "axios";

// Use Vite's import.meta.env for browser environment
let API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Try to find backend if port 5000 is unavailable
const findBackendPort = async () => {
  const basePort = 5000;
  for (let i = 0; i < 5; i++) {
    const port = basePort + i;
    try {
      const response = await axios.get(`http://localhost:${port}/health`, {
        timeout: 1000,
      });
      if (response.status === 200) {
        API_BASE_URL = `http://localhost:${port}`;
        console.log(`✅ Backend found on port ${port}`);
        return port;
      }
    } catch (error) {
      // Port not available, try next
    }
  }
  return basePort; // Fallback to original port
};

// Initialize port discovery
await findBackendPort();

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const screenResume = async (resume, jobDescription = "") => {
  try {
    const response = await client.post("/api/screen", {
      resume,
      jobDescription,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || "UNKNOWN_ERROR",
        message: error.response.data.message || "An error occurred",
        detectedPII: error.response.data.detectedPII,
        instruction: error.response.data.instruction,
      };
    }
    return {
      success: false,
      error: "NETWORK_ERROR",
      message: "Failed to connect to backend server. Make sure backend is running.",
    };
  }
};

export default client;
