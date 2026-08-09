import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Scan,
  TrendingUp,
  CloudSun,
  Bot,
  FlaskConical,
  LineChart,
  Sprout,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    to: "/disease",
    key: "disease",
    icon: Scan,
    badge: "AI Vision",
    desc: "Detect plant diseases instantly from leaf photos with actionable treatment advice.",
  },
  {
    to: "/yield",
    key: "yield",
    icon: TrendingUp,
    badge: "ML Regressor",
    desc: "Predict harvest yield (t/ha) based on country, rainfall, temperature, and inputs.",
  },
  {
    to: "/weather",
    key: "weather",
    icon: CloudSun,
    badge: "Live Meteo",
    desc: "Real-time weather insights & 3-day farming recommendations based on your location.",
  },
  {
    to: "/chatbot",
    key: "chatbot",
    icon: Bot,
    badge: "AgriAI Advisor",
    desc: "Multilingual AI assistant for instant answers on irrigation, pests, and soil health.",
  },
  {
    to: "/soil",
    key: "soil",
    icon: FlaskConical,
    badge: "Soil Rules",
    desc: "Analyze N-P-K & pH values to get custom fertilizer recommendations.",
  },
  {
    to: "/market",
    key: "market",
    icon: LineChart,
    badge: "Trends",
    desc: "Track 7-day crop market prices and view next-day trend predictions.",
  },
  {
    to: "/crop",
    key: "crop",
    icon: Sprout,
    badge: "Smart Classifier",
    desc: "Find the optimal crop suited for your specific soil and climatic conditions.",
  },
];

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Banner */}
      <section
        className="glass-card hero-card"
        style={{
          padding: "48px 32px",
          textAlign: "center",
          marginBottom: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="page-badge">
          <Sparkles size={14} />
          <span>Next-Gen Smart Agriculture Platform</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}
        >
          Empowering Farmers with <span style={{ color: "var(--primary-500)" }}>AI Intelligence</span>
        </h1>

        <p
          style={{
            maxWidth: "680px",
            margin: "0 auto 32px",
            fontSize: "18px",
            color: "var(--text-muted)",
          }}
        >
          Precision machine learning tools for crop disease identification, yield estimation,
          soil nutrient balance, and real-time market insights.
        </p>

        {/* Quick Stats Pill Bar */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "24px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            padding: "12px 24px",
            borderRadius: "var(--radius-full)",
            fontSize: "14px",
            fontWeight: 600,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={18} style={{ color: "var(--primary-500)" }} />
            <span>MobileNetV2 Plant Diagnosis</span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border-color)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={18} style={{ color: "var(--primary-400)" }} />
            <span>FAO Real Dataset Yield Model</span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border-color)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Bot size={18} style={{ color: "var(--accent-lime)" }} />
            <span>AgriAI Multilingual Assistant</span>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section>
        <h2 style={{ fontSize: "24px", marginBottom: "24px", textAlign: "left" }}>
          Agricultural Decision Tools
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="glass-card glass-card-interactive"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(16, 185, 129, 0.12)",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--primary-500)",
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-input)",
                          border: "1px solid var(--border-color)",
                          color: "var(--primary-400)",
                        }}
                      >
                        {f.badge}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        marginBottom: "8px",
                        textAlign: "left",
                      }}
                    >
                      {t(`nav.${f.key}`)}
                    </h3>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        textAlign: "left",
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--primary-500)",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    <span>Launch Tool</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
