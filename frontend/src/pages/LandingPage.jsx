import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Scan,
  TrendingUp,
  CloudSun,
  Bot,
  Sprout,
  ArrowRight,
  ArrowUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
  Mail,
  Lock,
  Globe,
  X,
  FileText,
  Check,
  Home,
  Info,
  BookOpen,
  GitBranch,
  HelpCircle,
  Compass,
} from "lucide-react";
import heroImg from "../assets/hero.jpg";

const HIGHLIGHTS = [
  {
    title: "AI Foliage Disease Scanner",
    icon: Scan,
    badge: "Computer Vision Model",
    desc: "Computer vision diagnosis of plant leaf infections with actionable organic and chemical treatment advice.",
  },
  {
    title: "Crop Harvest Yield Estimation",
    icon: TrendingUp,
    badge: "Harvest Yield Predictor",
    desc: "Predict harvest yields per hectare based on historical rainfall, climate, and pesticide inputs.",
  },
  {
    title: "Live Weather Advisory",
    icon: CloudSun,
    badge: "Real-Time Meteo Radar",
    desc: "Real-time field weather observations and 3-day customized recommendations to optimize spraying & irrigation.",
  },
  {
    title: "Multilingual Farmer AI",
    icon: Bot,
    badge: "Multilingual AI Advisor",
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
    desc: "Our computer vision and intelligent machine learning models process your input in real time.",
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
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
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
              <span style={{ color: "var(--primary-500)" }}>
                Artificial Intelligence
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                color: "var(--text-muted)",
                marginBottom: "32px",
                lineHeight: 1.65,
              }}
            >
              AgriAI combines deep learning computer vision, random forest yield
              predictors, live meteorological forecasts, and interactive AI
              consultation to maximize crop yields.
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link
                to="/signup"
                className="btn-primary"
                style={{ width: "auto", padding: "14px 36px", fontSize: "16px" }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
            </div>

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
                <p
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "var(--primary-500)",
                  }}
                >
                  99.5%
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  ML Accuracy
                </p>
              </div>
              <div className="desktop-only" style={{ width: "1px", background: "var(--border-color)" }} />
              <div>
                <p
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "var(--accent-lime)",
                  }}
                >
                  20k+
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  PlantVillage Dataset
                </p>
              </div>
              <div className="desktop-only" style={{ width: "1px", background: "var(--border-color)" }} />
              <div>
                <p
                  style={{ fontSize: "26px", fontWeight: 800, color: "#3b82f6" }}
                >
                  3 Lang
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Multilingual AI
                </p>
              </div>
            </div>
          </div>

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
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(6, 21, 16, 0.85) 100%)",
                }}
              />

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
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    AgriAI Precision Platform
                  </p>
                  <p style={{ fontSize: "12.5px", color: "var(--primary-400)" }}>
                    Real-Time Field Intelligence & Advisory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div style={{ textAlign: "left", marginBottom: "28px" }}>
            <h2
              style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}
            >
              Platform Details & Core Intelligence
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
              Explore how artificial intelligence optimizes every phase of
              agricultural decision making.
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

                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      {h.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        lineHeight: 1.55,
                      }}
                    >
                      {h.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ textAlign: "center" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto 36px" }}>
            <div className="page-badge" style={{ margin: "0 auto 12px" }}>
              <ShieldCheck size={14} />
              <span>Simple 3-Step Process</span>
            </div>
            <h2
              style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}
            >
              How AgriAI Works
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
              From diagnosis to harvest predictions, get actionable agricultural
              guidance in seconds.
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

                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          className="glass-card hero-card"
          style={{
            padding: "48px 32px",
            textAlign: "center",
            border: "1px solid var(--primary-500)",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <Award
              size={36}
              style={{ color: "var(--primary-500)", marginBottom: "16px" }}
            />
            <h2
              style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px" }}
            >
              Ready to Transform Your Harvest Yields?
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "var(--text-muted)",
                marginBottom: "28px",
              }}
            >
              Join thousands of farmers using artificial intelligence to optimize
              field health and decision making.
            </p>

            <Link
              to="/signup"
              className="btn-primary"
              style={{
                width: "auto",
                padding: "14px 36px",
                fontSize: "16px",
                margin: "0 auto",
              }}
            >
              <span>Get Started Free Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <footer className="agri-footer">
          <div className="footer-glow-bg" />

          <div className="footer-main-grid">
            <div className="footer-col footer-brand-col">
              <Link to="/" className="footer-brand-logo" onClick={scrollToTop}>
                <div className="footer-logo-icon">
                  <Sprout size={22} />
                </div>
                <span className="footer-logo-text">
                  Agri<span>AI</span>
                </span>
              </Link>

              <p className="footer-brand-desc">
                {t(
                  "footer.desc",
                  "Next-generation precision agriculture platform integrating deep learning foliage diagnostics, climate-informed yield forecasting, and multilingual AI advisory.",
                )}
              </p>

              <div className="footer-status-badge">
                <span className="status-dot-pulse" />
                <span>
                  {t(
                    "footer.status_operational",
                    "All AI Diagnostics Operational",
                  )}
                </span>
              </div>

              <div className="footer-social-wrapper">
                <p className="footer-social-title">
                  {t("footer.connect_with_us", "Connect With Us")}
                </p>
                <div className="footer-social-links">
                  <a
                    href="https://github.com/Aniruddhasain7"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn"
                    title="AgriAI on GitHub"
                    aria-label="AgriAI on GitHub"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>

                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn"
                    title="AgriAI on X / Twitter"
                    aria-label="AgriAI on X"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  <a
                    href="https://lnkd.in/p/dU7YySH5"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn"
                    title="AgriAI on LinkedIn"
                    aria-label="AgriAI on LinkedIn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>

                  <a
                    href="https://github.com/Aniruddhasain7/AgriAI"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-social-btn"
                    title="AgriAI Community"
                    aria-label="AgriAI Community"
                  >
                    <Globe size={17} />
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-col footer-nav-col">
              <h4 className="footer-col-title">
                <Compass size={16} />
                <span>{t("footer.nav_title", "Navigation")}</span>
              </h4>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <Link to="/" onClick={scrollToTop}>
                    <Home size={14} />
                    <span>{t("footer.home", "Home")}</span>
                  </Link>
                </li>
                <li className="footer-link-item">
                  <Link to="/dashboard" onClick={scrollToTop}>
                    <Sprout size={14} />
                    <span>{t("footer.tools_dashboard", "Tools Dashboard")}</span>
                  </Link>
                </li>
                <li className="footer-link-item">
                  <Link to="/weather" onClick={scrollToTop}>
                    <CloudSun size={14} />
                    <span>
                      {t("footer.weather_advisory", "Weather Advisory")}
                    </span>
                  </Link>
                </li>
                <li className="footer-link-item">
                  <Link to="/chatbot" onClick={scrollToTop}>
                    <Bot size={14} />
                    <span>{t("footer.ai_chatbot", "AI Chatbot")}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-col footer-about-col">
              <h4 className="footer-col-title">
                <Info size={16} />
                <span>{t("footer.about_title", "About")}</span>
              </h4>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <button onClick={() => setActiveModal("data")}>
                    <Info size={14} />
                    <span>{t("footer.about_project", "About Project")}</span>
                  </button>
                </li>
                <li className="footer-link-item">
                  <button onClick={() => setActiveModal("security")}>
                    <BookOpen size={14} />
                    <span>{t("footer.how_it_works", "How It Works")}</span>
                  </button>
                </li>
                <li className="footer-link-item">
                  <a
                    href="https://github.com/Aniruddhasain7/AgriAI"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitBranch size={14} />
                    <span>{t("footer.github_repo", "GitHub Repo")}</span>
                  </a>
                </li>
                <li className="footer-link-item">
                  <button onClick={() => setActiveModal("data")}>
                    <FileText size={14} />
                    <span>{t("footer.documentation", "Documentation")}</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col footer-contact-col">
              <h4 className="footer-col-title">
                <Mail size={16} />
                <span>{t("footer.contact_title", "Contact")}</span>
              </h4>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <a href="mailto:aniruddhasain94@gmail.com">
                    <Mail size={14} />
                    <span>{t("footer.contact_us", "Contact Us")}</span>
                  </a>
                </li>
                <li className="footer-link-item">
                  <button onClick={() => setActiveModal("terms")}>
                    <HelpCircle size={14} />
                    <span>{t("footer.faqs", "FAQs")}</span>
                  </button>
                </li>
                <li className="footer-link-item">
                  <button onClick={() => setActiveModal("terms")}>
                    <FileText size={14} />
                    <span>{t("footer.terms_use", "Terms & Use")}</span>
                  </button>
                </li>
                <li className="footer-link-item">
                  <button onClick={() => setActiveModal("privacy")}>
                    <Lock size={14} />
                    <span>{t("footer.privacy_policy", "Privacy Policy")}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-trust-strip">
            <div className="trust-item">
              <div className="trust-icon-box">
                <Lock size={16} />
              </div>
              <div>
                <p>{t("footer.trust_secure", "Secure & Private")}</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Cpu size={16} />
              </div>
              <div>
                <p>{t("footer.trust_fast", "Fast ML Inference")}</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Globe size={16} />
              </div>
              <div>
                <p>{t("footer.trust_multi", "Multilingual AI")}</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box">
                <Sprout size={16} />
              </div>
              <div>
                <p>{t("footer.trust_free", "100% Free Access")}</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div className="footer-copyright">
              <Sprout size={15} />
              <span>
                &copy; {new Date().getFullYear()}{" "}
                {t(
                  "footer.copyright",
                  "AgriAI Platform Inc. All rights reserved.",
                )}
              </span>
            </div>

            <div className="footer-legal-wrap">
              <div className="footer-legal-links">
                <button onClick={() => setActiveModal("privacy")}>
                  {t("footer.privacy_policy", "Privacy Policy")}
                </button>
                <span className="bullet">&bull;</span>
                <button onClick={() => setActiveModal("terms")}>
                  {t("footer.terms_of_service", "Terms of Service")}
                </button>
                <span className="bullet">&bull;</span>
                <button onClick={() => setActiveModal("security")}>
                  {t("footer.security", "Security")}
                </button>
                <span className="bullet">&bull;</span>
                <button onClick={() => setActiveModal("data")}>
                  {t("footer.documentation", "Documentation")}
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className={`back-to-top-popup ${showScrollTop ? "visible" : ""}`}
        aria-label="Back to top"
        title="Back to top"
      >
        <ArrowUp size={18} />
      </button>

      {activeModal && (
        <div
          className="footer-modal-overlay"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="footer-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="footer-modal-header">
              <h3 className="footer-modal-title">
                {activeModal === "privacy" && (
                  <>
                    <Lock size={20} />
                    <span>{t("footer.privacy_policy", "Privacy Policy")}</span>
                  </>
                )}
                {activeModal === "terms" && (
                  <>
                    <FileText size={20} />
                    <span>
                      {t("footer.terms_of_service", "Terms of Service")}
                    </span>
                  </>
                )}
                {activeModal === "security" && (
                  <>
                    <Lock size={20} />
                    <span>{t("footer.security", "Security")}</span>
                  </>
                )}
                {activeModal === "data" && (
                  <>
                    <FileText size={20} />
                    <span>{t("footer.documentation", "Documentation")}</span>
                  </>
                )}
              </h3>
              <button
                className="footer-modal-close"
                onClick={() => setActiveModal(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="footer-modal-body">
              {activeModal === "privacy" && (
                <>
                  <p>
                    At AgriAI, we believe farmers own their farm data. We are
                    committed to transparency, data minimization, and
                    industry-grade security protocols.
                  </p>
                  <h4>1. Information We Collect</h4>
                  <p>
                    We collect crop leaf images, meteorological coordinates, and
                    soil NPK values strictly to execute real-time machine
                    learning inference and provide tailored agricultural
                    recommendations.
                  </p>
                  <h4>2. Zero Commercial Data Reselling</h4>
                  <p>
                    AgriAI never sells, rents, or commercializes personal farmer
                    identities or specific field yields to third-party
                    advertisers or speculative trading commodities.
                  </p>
                  <h4>3. Data Retention &amp; Erasure</h4>
                  <p>
                    You can request complete deletion of your account, diagnosis
                    history, and uploaded photographs at any time from the
                    account settings.
                  </p>
                </>
              )}

              {activeModal === "terms" && (
                <>
                  <p>
                    By using AgriAI, agree to these Terms of Service
                    designed to foster safe, informed, and responsible
                    artificial intelligence usage in agriculture.
                  </p>
                  <h4>1. AI Advisory Scope</h4>
                  <p>
                    AgriAI models provide diagnostic estimations and management
                    suggestions based on computer vision and regression
                    benchmarks. They serve as supportive tools alongside
                    standard agronomic practices.
                  </p>
                  <h4>2. Responsible Input Submission</h4>
                  <p>
                    Users agree to upload genuine botanical photographs and
                    accurate field parameters to ensure high-fidelity diagnostic
                    performance.
                  </p>
                  <h4>3. Free Platform Guarantee</h4>
                  <p>
                    Core diagnostics (disease scanner, yield estimates, weather
                    advisory, and multilingual chat) remain accessible to
                    independent smallholder farmers worldwide.
                  </p>
                </>
              )}

              {activeModal === "security" && (
                <>
                  <p>
                    AgriAI is built with a modern React frontend and a Python
                    Flask backend, designed for fast inference and reliable
                    agricultural recommendations.
                  </p>
                  <h4>Machine Learning Models</h4>
                  <p>
                    Our plant disease detector utilizes Convolutional Neural
                    Networks (CNNs) trained on verified crop leaf datasets for
                    accurate pathogen identification.
                  </p>
                  <h4>Backend &amp; Data Security</h4>
                  <p>
                    All requests between the frontend interface and backend APIs
                    are processed securely with input sanitization and safe file
                    handling.
                  </p>
                  <h4>Weather Telemetry</h4>
                  <p>
                    Real-time meteorological forecasts are synchronized with
                    reliable Open-Meteo APIs to deliver timely field updates.
                  </p>
                </>
              )}

              {activeModal === "data" && (
                <>
                  <p>
                    AgriAI is an open-access precision agriculture platform
                    designed to assist farmers with AI-driven diagnostics,
                    weather forecasting, and crop advisory tools.
                  </p>
                  <h4>1. Disease Detection</h4>
                  <p>
                    Upload leaf photos to identify plant pathologies with
                    instant organic and chemical treatment recommendations.
                  </p>
                  <h4>2. Yield &amp; Weather Advisory</h4>
                  <p>
                    Estimate harvest yields per hectare and receive live weather
                    insights tailored for pesticide spraying and irrigation.
                  </p>
                  <h4>3. Multilingual Support</h4>
                  <p>
                    Ask questions in English, Hindi, or Bengali to get instant
                    smart agronomy assistance anytime.
                  </p>
                </>
              )}
            </div>

            <div className="footer-modal-footer">
              <button
                className="btn-primary"
                onClick={() => setActiveModal(null)}
              >
                <Check size={16} />
                <span>{t("footer.got_it", "Got It")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
