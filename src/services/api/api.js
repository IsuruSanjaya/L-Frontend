import axios from "axios";

// Base API URL
const BASE_URL = "https://ai-lawyers-lawggle.thematchbot.com/api";

// Get statistics by lawyer ID
export const getStatistics = async (lawyerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/statistics/${lawyerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};

// Get conversations by lawyer ID
export const getConversations = async (lawyerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/conversation/conversations`, {
      params: { lawyer_id: lawyerId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};
