import { Link } from "react-router-dom";
import {
  Scan,
  TrendingUp,
  CloudSun,
  Bot,
  Sprout,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
} from "lucide-react";
import heroImg from "../assets/hero.jpg";

const HIGHLIGHTS = [
  {
    title: "AI Foliage Disease Scanner",
    icon: Scan,
    badge: "MobileNetV2 Vision",
    desc: "Computer vision diagnosis of plant leaf infections with actionable organic and chemical treatment advice.",
  },
  {
    title: "Crop Harvest Yield Estimation",
    icon: TrendingUp,
    badge: "FAO ML Regressor",
    desc: "Predict harvest yields per hectare based on historical rainfall, climate, and pesticide inputs.",
  },
  {
    title: "Live Weather Advisory",
    icon: CloudSun,
    badge: "Open-Meteo Radar",
    desc: "Real-time field weather observations and 3-day customized recommendations to optimize spraying & irrigation.",
  },
  {
    title: "Multilingual Farmer AI",
    icon: Bot,
    badge: "AgriAI LLM",
    desc: "Instant agricultural consultation in English, Hindi, and Bengali for crop health and fertilizer questions.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Input Farm & Soil Data",
    desc: "Upload a crop leaf photograph or input your local soil N-P-K, pH, and climate parameters into our secure portal.",
    icon: Layers,
  },
  {
    step: "02",
    title: "AI Neural Network Evaluation",
    desc: "Our MobileNetV2 computer vision and Random Forest ML models process your input in real time.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Receive Smart Action Plan",
    desc: "Get instant disease diagnoses, yield forecasts, market price trends, and customized farming advice.",
    icon: CheckCircle2,
  },
];

export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
      {/* Hero Showcase Banner */}
      <section
        className="glass-card hero-card"
        style={{
          padding: "52px 36px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div className="page-badge">
            <Sparkles size={14} />
            <span>AI-Powered Smart Agriculture Platform</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "20px",
              letterSpacing: "-1.5px",
            }}
          >
            Smarter Farming with <br />
            <span style={{ color: "var(--primary-500)" }}>Artificial Intelligence</span>
          </h1>

          <p
            style={{
              fontSize: "17px",
              color: "var(--text-muted)",
              marginBottom: "32px",
              lineHeight: 1.65,
            }}
          >
            AgriAI combines deep learning computer vision, random forest yield predictors, live meteorological forecasts, and interactive AI consultation to maximize crop yields.
          </p>

          {/* Primary CTA Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <Link to="/signup" className="btn-primary" style={{ width: "auto", padding: "14px 36px", fontSize: "16px" }}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div
            style={{
              display: "flex",
              gap: "28px",
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <div>
              <p style={{ fontSize: "26px", fontWeight: 800, color: "var(--primary-500)" }}>99.5%</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>ML Accuracy</p>
            </div>
            <div style={{ width: "1px", background: "var(--border-color)" }} />
            <div>
              <p style={{ fontSize: "26px", fontWeight: 800, color: "var(--accent-lime)" }}>20k+</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>PlantVillage Dataset</p>
            </div>
            <div style={{ width: "1px", background: "var(--border-color)" }} />
            <div>
              <p style={{ fontSize: "26px", fontWeight: 800, color: "#3b82f6" }}>3 Lang</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Multilingual AI</p>
            </div>
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
              border: "2px solid var(--border-color)",
            }}
          >
            <img
              src={heroImg}
              alt="AgriAI Smart Agriculture"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "440px",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 50%, rgba(6, 21, 16, 0.85) 100%)",
              }}
            />

            {/* Badge overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                right: "20px",
                background: "rgba(15, 41, 32, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "var(--primary-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  flexShrink: 0,
                }}
              >
                <Sprout size={24} />
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>AgriAI Precision Platform</p>
                <p style={{ fontSize: "12.5px", color: "var(--primary-400)" }}>Real-Time Field Intelligence & Advisory</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Details */}
      <section>
        <div style={{ textAlign: "left", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>
            Platform Details & Core Intelligence
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            Explore how artificial intelligence optimizes every phase of agricultural decision making.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {HIGHLIGHTS.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  textAlign: "left",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
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
                        width: "44px",
                        height: "44px",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary-500)",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-color)",
                        color: "var(--primary-400)",
                      }}
                    >
                      {h.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "19px", fontWeight: 700, marginBottom: "8px" }}>
                    {h.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.55 }}>
                    {h.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto 36px" }}>
          <div className="page-badge" style={{ margin: "0 auto 12px" }}>
            <ShieldCheck size={14} />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
            How AgriAI Works
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            From diagnosis to harvest predictions, get actionable agricultural guidance in seconds.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  textAlign: "left",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "var(--primary-500)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 800,
                        color: "var(--primary-500)",
                        opacity: 0.5,
                      }}
                    >
                      {s.step}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Footer Banner */}
      <section
        className="glass-card hero-card"
        style={{
          padding: "48px 32px",
          textAlign: "center",
          border: "1px solid var(--primary-500)",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Award size={36} style={{ color: "var(--primary-500)", marginBottom: "16px" }} />
          <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px" }}>
            Ready to Transform Your Harvest Yields?
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "28px" }}>
            Join thousands of farmers using artificial intelligence to optimize field health and decision making.
          </p>

          <Link
            to="/signup"
            className="btn-primary"
            style={{ width: "auto", padding: "14px 36px", fontSize: "16px", margin: "0 auto" }}
          >
            <span>Get Started Free Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
