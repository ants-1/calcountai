// utils/pingChatbot.ts
import Constants from "expo-constants";

let intervalId: any = null;

// Pings chatbot on Render every 14 minutes while application is running
export const startChatbotPing = () => {
  const CHATBOT_API_URL = Constants.expoConfig?.extra?.CHATBOT_API_URL;

  if (!CHATBOT_API_URL) {
    return;
  }

  // Prevent multiple intervals
  if (intervalId) return;

  intervalId = setInterval(() => {
    fetch(`${CHATBOT_API_URL}/ping`)
      .then((res) => {
        if (!res.ok) throw new Error("Ping failed");
        console.log("Chatbot pinged successfully");
      })
      .catch((err) => {
        return
      });
  }, 14 * 60 * 1000); // 14 minutes
};

export const stopChatbotPing = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
