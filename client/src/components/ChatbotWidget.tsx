import { useEffect } from "react";

declare global {
  interface Window {
    RUSKINS_CONFIG?: {
      agentId: string;
      mode: string;
      position: string;
    };
  }
}

export default function ChatbotWidget() {
  useEffect(() => {
    // Configure the Ruskins Conversational AI widget
    window.RUSKINS_CONFIG = {
      agentId: import.meta.env.VITE_CHATBOT_AGENT_ID || "agent_kevian",
      mode: "voice_and_text",
      position: "bottom-right",
    };

    // Load widget script
    const widgetUrl = import.meta.env.VITE_CHATBOT_WIDGET_URL;
    if (widgetUrl) {
      const script = document.createElement("script");
      script.src = widgetUrl;
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return null;
}
