import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import { Bot, User, Send, Sparkles, RefreshCw, MessageSquare } from "lucide-react";

const sessionId = crypto.randomUUID();

const PROMPT_SUGGESTIONS = [
  "What fertilizer is best for wheat in acidic soil?",
  "How can I prevent early blight in potatoes?",
  "What is the ideal sowing temperature for maize?",
  "How to manage whitefly infestation on tomato crops?",
];

export default function Chatbot() {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: messageText }]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const data = await api.sendChatMessage(
        messageText,
        sessionId,
        i18n.language,
      );
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I ran into an issue processing your request. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className="page-header">
        <div className="page-badge">
          <Bot size={14} />
          <span>AgriAI Expert Assistant</span>
        </div>
        <h1 className="page-title">Farmer Assistant</h1>
        <p className="page-subtitle">
          Ask any question regarding crop diseases, fertilizers, weather protection, or market decisions in your language.
        </p>
      </div>

      <div className="glass-card" style={{ padding: "0", overflow: "hidden", display: "flex", flexDirection: "column", height: "620px" }}>
        {/* Chat Messages Container */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--bg-app)",
          }}
        >
          {messages.length === 0 && (
            <div style={{ margin: "auto", textAlign: "center", maxWidth: "480px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "var(--primary-500)",
                }}
              >
                <Sparkles size={32} />
              </div>
              <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Welcome to AgriAI Assistant</h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                Select a suggested topic below or type your question in the box to get started.
              </p>

              {/* Prompt Suggestions Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    style={{
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-full)",
                      padding: "8px 14px",
                      fontSize: "13px",
                      color: "var(--text-main)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary-500)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                  >
                    <MessageSquare size={13} style={{ display: "inline", marginRight: "6px", color: "var(--primary-500)" }} />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-start",
              }}
            >
              {m.role === "bot" && (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--primary-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={20} />
                </div>
              )}

              <div
                style={{
                  maxWidth: "75%",
                  padding: "14px 18px",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)"
                      : "var(--bg-input)",
                  color: m.role === "user" ? "#ffffff" : "var(--text-main)",
                  border: m.role === "user" ? "none" : "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-sm)",
                  fontSize: "14.5px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>

              {m.role === "user" && (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary-400)",
                    flexShrink: 0,
                  }}
                >
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--primary-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <Bot size={20} />
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <RefreshCw size={16} className="spinner" />
                <span>AgriAI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div
          style={{
            padding: "16px 20px",
            background: "var(--bg-card)",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything about farming, crops, fertilizer, pest control..."
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "var(--bg-input)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "var(--radius-full)",
              color: "var(--text-main)",
              fontSize: "15px",
              outline: "none",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              padding: "0",
              flexShrink: 0,
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
