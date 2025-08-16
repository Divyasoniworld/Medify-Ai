"use client";

import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";

export default function Test() {
  const [displayText, setDisplayText] = useState("");
  const [isStreaming, setIsStreaming] = useState(true); // for cursor

  useEffect(() => {
    async function runChat() {
      const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      });

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
          { role: "user", parts: [{ text: "Hello" }] },
          { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
        ],
      });

      const stream = await chat.sendMessageStream({
        message: "How many paws are in my house?",
      });

      for await (const chunk of stream) {
        const text = chunk.text || "";
        await typeTextSmooth(text); // type it slowly
      }

      setIsStreaming(false); // stop cursor after done
    }

    // Smooth typing function
    async function typeTextSmooth(text) {
      for (let char of text) {
        setDisplayText((prev) => prev + char);
        await new Promise((resolve) => setTimeout(resolve, 20)); // speed control
      }
    }

    runChat();
  }, []);

  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      {displayText}
      {isStreaming && <span className="blinking-cursor">|</span>}
      <style jsx>{`
        .blinking-cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
