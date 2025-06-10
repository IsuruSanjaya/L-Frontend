import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getStatistics, getConversations } from "../services/api/api";

vi.mock("axios");

describe("API functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getStatistics fetches data correctly", async () => {
    const lawyerId = "123";
    const mockData = { totalCases: 5 };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await getStatistics(lawyerId);

    expect(axios.get).toHaveBeenCalledWith(
      `https://ai-lawyers-lawggle.thematchbot.com/api/statistics/${lawyerId}`
    );
    expect(result).toEqual(mockData);
  });

  it("getConversations fetches data correctly", async () => {
    const lawyerId = "456";
    const mockData = [{ conversationId: "abc" }];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await getConversations(lawyerId);

    expect(axios.get).toHaveBeenCalledWith(
      `https://ai-lawyers-lawggle.thematchbot.com/api/conversation/conversations`,
      { params: { lawyer_id: lawyerId } }
    );
    expect(result).toEqual(mockData);
  });

  it("getStatistics throws error on failure", async () => {
    const lawyerId = "errorId";
    const error = new Error("Network error");
    axios.get.mockRejectedValue(error);

    await expect(getStatistics(lawyerId)).rejects.toThrow("Network error");
  });

  it("getConversations throws error on failure", async () => {
    const lawyerId = "errorId";
    const error = new Error("Network error");
    axios.get.mockRejectedValue(error);

    await expect(getConversations(lawyerId)).rejects.toThrow("Network error");
  });
});
