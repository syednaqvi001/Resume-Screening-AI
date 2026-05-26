// API Client for Resume Screening

import axios from "axios";

// Use Vite's import.meta.env for browser environment
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
      message: "Failed to connect to server",
    };
  }
};

export default client;
