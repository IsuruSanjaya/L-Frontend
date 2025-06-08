import axios from "axios";
import { useState, useEffect, useRef, useLocation } from "react";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}
// Base API URL
const BASE_URL = "https://ai-lawyers-lawggle.thematchbot.com/api";

  const lawyerId = query.get("lawyerId");

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
