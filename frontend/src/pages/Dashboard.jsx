import { useState } from "react";
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
  Zap,
  Activity,
  Cpu,
  Globe2,
  Calendar,
  Compass,
  Lightbulb,
} from "lucide-react";

const TOOLS_CONFIG = [
  {
    to: "/disease",
    key: "disease",
    category: "diagnostics",
    icon: Scan,
    defaultBadge: "Computer Vision",
    defaultTags: ["Leaf Scanner", "Pathology", "Treatment Guide"],
    defaultDesc:
      "Scan crop leaves to detect plant pathologies instantly with organic and chemical remedies.",
  },
  {
    to: "/yield",
    key: "yield",
    category: "diagnostics",
    icon: TrendingUp,
    defaultBadge: "ML Regressor",
    defaultTags: ["Yield Forecast", "Rainfall Metric", "Tons / Hectare"],
    defaultDesc:
      "Predict harvest yields based on country, annual rainfall, average temperatures, and pesticide inputs.",
  },
  {
    to: "/weather",
    key: "weather",
    category: "market-weather",
    icon: CloudSun,
    defaultBadge: "Live Telemetry",
    defaultTags: ["GPS Sync", "3-Day Advisory", "Spraying Windows"],
    defaultDesc:
      "Real-time field weather radar and smart agricultural recommendations tailored to current conditions.",
  },
  {
    to: "/chatbot",
    key: "chatbot",
    category: "diagnostics",
    icon: Bot,
    defaultBadge: "AI Agronomist",
    defaultTags: ["Multi-Language", "Voice-Ready", "24/7 Consultation"],
    defaultDesc:
      "Interactive agricultural AI assistant for pest management, irrigation schedules, and plant health.",
  },
  {
    to: "/soil",
    key: "soil",
    category: "soil-crop",
    icon: FlaskConical,
    defaultBadge: "Nutrient Rules",
    defaultTags: ["N-P-K Analysis", "pH Balancer", "Fertilizer Dosing"],
    defaultDesc:
      "Evaluate Nitrogen, Phosphorus, Potassium, and pH balance to generate tailored fertilizer dosage plans.",
  },
  {
    to: "/crop",
    key: "crop",
    category: "soil-crop",
    icon: Sprout,
    defaultBadge: "Smart Classifier",
    defaultTags: ["Soil Matching", "Climate Adaptation", "Optimal Variety"],
    defaultDesc:
      "Identify the highest-performing crop varieties suited for your specific soil chemistry and climate.",
  },
  {
    to: "/market",
    key: "market",
    category: "market-weather",
    icon: LineChart,
    defaultBadge: "Market Analytics",
    defaultTags: ["7-Day Trends", "Mandi Prices", "Next-Day Forecast"],
    defaultDesc:
      "Monitor live commodity price curves across mandis and anticipate market movements.",
  },
];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");

  const storedUserRaw = localStorage.getItem("agriai_user");
  let userName = t("nav.farmer", "Farmer Partner");
  try {
    if (storedUserRaw) {
      const parsed = JSON.parse(storedUserRaw);
      userName =
        parsed.name ||
        parsed.username ||
        parsed.email?.split("@")[0] ||
        t("nav.farmer", "Farmer Partner");
    }
  } catch {
    userName = t("nav.farmer", "Farmer Partner");
  }

  const localeMap = { en: "en-US", hi: "hi-IN", bn: "bn-BD" };
  const currentLang = i18n.language?.split("-")[0] || "en";
  const currentDate = new Date().toLocaleDateString(
    localeMap[currentLang] || "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const categories = [
    { id: "all", label: t("dashboard.cat_all", "All Tools") },
    {
      id: "diagnostics",
      label: t("dashboard.cat_diagnostics", "AI & Advisory"),
    },
    {
      id: "soil-crop",
      label: t("dashboard.cat_soil_crop", "Soil & Crop Planning"),
    },
    {
      id: "market-weather",
      label: t("dashboard.cat_market_weather", "Weather & Market"),
    },
  ];

  const filteredTools =
    activeCategory === "all"
      ? TOOLS_CONFIG
      : TOOLS_CONFIG.filter((item) => item.category === activeCategory);

  return (
    <div className="dashboard-container">
      <section className="glass-card hero-card dashboard-hero">
        <div className="dashboard-hero-top">
          <div className="dashboard-hero-text">
            <div className="page-badge">
              <Sparkles size={14} />
              <span>
                {t(
                  "dashboard.badge",
                  "Smart Agriculture Command Center"
                )}
              </span>
            </div>
            <h1>
              {t("dashboard.welcome", "Welcome back,")}{" "}
              <span style={{ color: "var(--primary-500)" }}>{userName}</span> 👋
            </h1>
            <p>
              {t(
                "dashboard.subtitle",
                "Deploy real-time deep learning diagnostics, climate-informed crop forecasting, and precision soil analytics to optimize farm productivity."
              )}
            </p>
          </div>

          <div className="dashboard-hero-meta">
            <div className="dashboard-date-badge">
              <Calendar size={14} />
              <span>{currentDate}</span>
            </div>
            <div className="dashboard-status-indicator">
              <span className="status-pulse-dot" />
              <span>
                {t("dashboard.status_active", "All 7 AI Models Active")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrap emerald">
            <Activity size={22} />
          </div>
          <div>
            <div className="kpi-value">99.5%</div>
            <div className="kpi-label">
              {t("dashboard.kpi_accuracy", "Pathology Accuracy")}
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrap blue">
            <Zap size={22} />
          </div>
          <div>
            <div className="kpi-value">&lt; 1.2s</div>
            <div className="kpi-label">
              {t("dashboard.kpi_latency", "Inference Latency")}
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrap purple">
            <Cpu size={22} />
          </div>
          <div>
            <div className="kpi-value">7</div>
            <div className="kpi-label">
              {t("dashboard.kpi_tools", "Active Modules")}
            </div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrap amber">
            <Globe2 size={22} />
          </div>
          <div>
            <div className="kpi-value">3</div>
            <div className="kpi-label">
              {t("dashboard.kpi_lang", "EN • HI • BN")}
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card quick-actions-card">
        <div className="quick-actions-label">
          <Compass size={18} style={{ color: "var(--primary-500)" }} />
          <span>{t("dashboard.quick_actions", "Quick Actions:")}</span>
        </div>
        <div className="quick-actions-btns">
          <Link to="/disease" className="quick-btn">
            <Scan size={14} style={{ color: "var(--primary-500)" }} />
            <span>{t("dashboard.quick_scan", "Scan Leaf")}</span>
          </Link>
          <Link to="/weather" className="quick-btn">
            <CloudSun size={14} style={{ color: "var(--accent-blue)" }} />
            <span>{t("dashboard.quick_radar", "Live Radar")}</span>
          </Link>
          <Link to="/soil" className="quick-btn">
            <FlaskConical size={14} style={{ color: "var(--primary-500)" }} />
            <span>{t("dashboard.quick_soil", "Test Soil NPK")}</span>
          </Link>
          <Link to="/chatbot" className="quick-btn">
            <Bot size={14} style={{ color: "var(--accent-lime)" }} />
            <span>{t("dashboard.quick_ask", "Ask AgriAI")}</span>
          </Link>
        </div>
      </section>

      <section>
        <div className="tools-section-header">
          <div className="tools-title-group">
            <h2>
              {t("dashboard.tools_heading", "Decision & Diagnostic Tools")}
            </h2>
            <p>
              {t(
                "dashboard.tools_subheading",
                "Select an intelligent agricultural tool to launch real-time ML inference"
              )}
            </p>
          </div>

          <div className="category-filter-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tools-grid">
          {filteredTools.map((tItem) => {
            const Icon = tItem.icon;
            const translatedTags = t(
              `tools.${tItem.key}.tags`,
              { returnObjects: true, defaultValue: tItem.defaultTags }
            );
            const tags = Array.isArray(translatedTags)
              ? translatedTags
              : tItem.defaultTags;

            return (
              <Link
                key={tItem.to}
                to={tItem.to}
                className="glass-card tool-card"
              >
                <div>
                  <div className="tool-card-top">
                    <div className="tool-icon-box">
                      <Icon size={24} />
                    </div>
                    <span className="tool-badge">
                      {t(`tools.${tItem.key}.badge`, tItem.defaultBadge)}
                    </span>
                  </div>

                  <h3 className="tool-title">
                    {t(`nav.${tItem.key}`, tItem.key)}
                  </h3>

                  <p className="tool-desc">
                    {t(`tools.${tItem.key}.desc`, tItem.defaultDesc)}
                  </p>

                  <div className="tool-tags">
                    {tags.map((tag) => (
                      <span key={tag} className="tool-tag-item">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="tool-action-row">
                  <span>{t("dashboard.launch_tool", "Launch Tool")}</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="dashboard-tip-card">
        <div className="tip-icon-box">
          <Lightbulb size={22} />
        </div>
        <div className="tip-content">
          <h4>
            {t("dashboard.tip_title", "Smart Agronomy Advisory Tip")}
          </h4>
          <p>
            {t(
              "dashboard.tip_desc",
              "For maximum pesticide and foliar fertilizer efficiency, spray when wind speeds are below 12 km/h and relative humidity is between 50%–70%. Check the live Weather Radar before applying treatments to avoid rain wash-off."
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
