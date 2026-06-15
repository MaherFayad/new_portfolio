"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatProjectCard from "./ChatProjectCard";

interface Message {
  role: "user" | "assistant";
  content: string;
  thoughts?: string[];
  status?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_CHAT_AGENT_URL || "https://maher-fayad-portfolio-agent.hf.space";

const SUGGESTED_CHIPS = [
  "What did he design for Al Rajhi Bank?",
  "Tell me about his mobile design outcomes",
  "How can I contact or hire him?",
];

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentThoughts, setCurrentThoughts] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentThoughts, currentStatus]);

  // Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Reset input
    setInputValue("");
    setIsTyping(true);
    setCurrentThoughts([]);
    setCurrentStatus("Connecting to representative board...");

    // 1. Append User Message
    const updatedMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);

    // 2. Format Chat History
    const historyText = updatedMessages
      .map((msg) => `${msg.role === "user" ? "User" : "Representative"}: ${msg.content}`)
      .join("\n");

    try {
      // 3. Make POST SSE stream request
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text,
          history: historyText,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before sending another message.");
        }
        throw new Error("Failed to communicate with representative server.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Unable to read streaming response.");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let thoughtsList: string[] = [];

      // Read SSE stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in buffer
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("event: ")) {
            currentEvent = trimmed.replace("event: ", "").trim();
          } else if (trimmed.startsWith("data: ")) {
            const data = trimmed.replace("data: ", "").trim();

            if (currentEvent === "status") {
              setCurrentStatus(data);
            } else if (currentEvent === "thought") {
              thoughtsList = [...thoughtsList, data];
              setCurrentThoughts(thoughtsList);
            } else if (currentEvent === "result") {
              assistantText += data;
            } else if (currentEvent === "error") {
              throw new Error(data);
            }
          }
        }
      }

      // 4. Append Assistant Final Response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantText || "Response drafted successfully.",
          thoughts: thoughtsList,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err.message || "An unexpected error occurred. Please try again.",
          status: "Error",
        },
      ]);
    } finally {
      setIsTyping(false);
      setCurrentStatus("");
      setCurrentThoughts([]);
    }
  };

  // Helper to parse project tags [ProjectCard: slug]
  const renderMessageContent = (text: string) => {
    const regex = /\[ProjectCard:\s*(.+?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({ type: "text", content: textBefore });
      }
      parts.push({ type: "card", slug: match[1].trim() });
      lastIndex = regex.lastIndex;
    }

    const textAfter = text.substring(lastIndex);
    if (textAfter.trim()) {
      parts.push({ type: "text", content: textAfter });
    }

    if (parts.length === 0) {
      return <p className="text-sm leading-relaxed text-[#c5c5c5] font-medium whitespace-pre-wrap">{text}</p>;
    }

    return (
      <div className="flex flex-col gap-2">
        {parts.map((part, idx) => {
          if (part.type === "card" && part.slug) {
            return <ChatProjectCard key={idx} slug={part.slug} />;
          }
          return (
            <p key={idx} className="text-sm leading-relaxed text-[#c5c5c5] font-medium whitespace-pre-wrap">
              {part.content}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* 1. Floating Widget Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Representative Chat"
        className="fixed bottom-6 right-6 z-40 bg-[#c5c5c5] hover:bg-white text-black w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer hover:scale-105 active:scale-95"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* 2. Chat Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop filter blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />

            {/* Chat Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 z-50 w-[440px] max-w-[95vw] h-full bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-2xl"
            >
              {/* Header Grid - Experience style */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 leading-none">
                    Studio representative
                  </span>
                  <h3 className="text-base font-semibold text-[#c5c5c5] mt-1.5 leading-none">
                    Maher's Digital Double
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Chat"
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/35 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10"
              >
                {messages.length === 0 ? (
                  <div className="my-auto text-center flex flex-col items-center gap-4 px-4">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                      Chat with Maher's AI Agent
                    </h4>
                    <p className="text-xs text-white/40 leading-relaxed max-w-[280px]">
                      Ask about design systems, Al Rajhi Bank payroll revamp, case study outcomes, or scheduling a call.
                    </p>

                    {/* Suggested Chips */}
                    <div className="flex flex-col gap-2 w-full mt-4">
                      {SUGGESTED_CHIPS.map((chip, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(chip)}
                          className="text-left text-xs text-[#c5c5c5] bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.04] p-3 transition-colors rounded-none font-medium cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col gap-1 max-w-[85%] ${
                        msg.role === "user" ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                        {msg.role === "user" ? "You" : "Representative"}
                      </span>
                      <div
                        className={`p-3.5 rounded-none border text-left ${
                          msg.role === "user"
                            ? "bg-white/[0.04] border-white/20 text-[#c5c5c5]"
                            : "bg-[#0f0f0f] border-white/10 text-white"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          renderMessageContent(msg.content)
                        ) : (
                          <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* SSE Live Streaming thoughts console */}
                {isTyping && (
                  <div className="self-start max-w-[85%] flex flex-col gap-1 w-full">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                      Representative (Thinking)
                    </span>
                    <div className="w-full bg-[#0d0d0d] border border-white/10 p-3 flex flex-col gap-2 font-mono text-[10px] text-white/50 rounded-none">
                      {/* Active Status */}
                      {currentStatus && (
                        <div className="flex items-center gap-2 text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span>{currentStatus}</span>
                        </div>
                      )}
                      {/* Streaming Thoughts */}
                      {currentThoughts.length > 0 && (
                        <div className="flex flex-col gap-1 border-t border-white/5 pt-2 max-h-[80px] overflow-y-auto">
                          {currentThoughts.slice(-2).map((thought, idx) => (
                            <div key={idx} className="text-white/40">
                              &gt; {thought}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Loading pulse */}
                      {!currentStatus && !currentThoughts.length && (
                        <span className="animate-pulse">Connecting to board...</span>
                      )}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-4 border-t border-white/10 bg-[#070707]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                    placeholder={isTyping ? "Agent is drafting..." : "Ask Maher's AI double..."}
                    className="flex-1 bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-white/40 text-sm p-3 text-white placeholder-white/25 rounded-none outline-none transition-colors duration-300 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !inputValue.trim()}
                    className="bg-white hover:bg-[#c5c5c5] text-black font-semibold text-xs tracking-wider uppercase px-5 py-3 transition-colors duration-300 disabled:opacity-30 cursor-pointer"
                  >
                    SEND
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
