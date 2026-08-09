import { useState } from "react";
import { api } from "../api/client";
import {
  LineChart,
  Coins,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

const CROPS = [
  { id: "rice", name: "Rice" },
  { id: "wheat", name: "Wheat" },
  { id: "maize", name: "Maize" },
  { id: "cotton", name: "Cotton" },
  { id: "sugarcane", name: "Sugarcane" },
  { id: "soybean", name: "Soybean" },
];

export default function MarketPrices() {
  const [crop, setCrop] = useState("rice");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (selectedCrop = crop) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await api.getMarketTrend(selectedCrop);
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (cId) => {
    setCrop(cId);
    handleFetch(cId);
  };

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <LineChart size={14} />
          <span>AgriMarket Intelligence</span>
        </div>
        <h1 className="page-title">Market Price Trends</h1>
        <p className="page-subtitle">
          Track 7-day historical market trends and view next-day AI price forecasts for major agricultural commodities.
        </p>
      </div>

      <div className="glass-card">
        {/* Crop Selection Pills */}
        <div style={{ marginBottom: "24px", textAlign: "left" }}>
          <label className="form-label" style={{ marginBottom: "12px" }}>
            <Coins size={16} /> Select Agricultural Commodity
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {CROPS.map((c) => {
              const isActive = crop === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCropSelect(c.id)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "var(--radius-full)",
                    border: isActive
                      ? "1px solid var(--primary-500)"
                      : "1px solid var(--border-color)",
                    background: isActive
                      ? "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)"
                      : "var(--bg-input)",
                    color: isActive ? "#ffffff" : "var(--text-main)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: isActive ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => handleFetch(crop)}
          className="btn-primary"
          disabled={loading}
          style={{ width: "auto", padding: "12px 32px" }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="spinner" />
              <span>Fetching Market Data...</span>
            </>
          ) : (
            <>
              <TrendingUp size={18} />
              <span>Analyze Price Trend</span>
            </>
          )}
        </button>

        {error && (
          <div className="alert-box alert-error">
            <AlertTriangle size={20} />
            <div>
              <strong>Market Error</strong>
              <p style={{ fontSize: "13px" }}>{error}</p>
            </div>
          </div>
        )}

        {result && result.last_7_day_trend && (
          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border-color)", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
              <div>
                <h3 style={{ fontSize: "20px", textTransform: "capitalize" }}>
                  {result.crop} Market Overview
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Unit: {result.unit}</p>
              </div>

              {/* Next Day Forecast Card */}
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid var(--primary-500)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <ArrowUpRight size={22} style={{ color: "var(--primary-500)" }} />
                <div>
                  <p style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, color: "var(--primary-400)" }}>
                    Predicted Next Day
                  </p>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-main)" }}>
                    ₹{result.predicted_next_day}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-muted)" }}>
              7-Day Price History (INR / Quintal)
            </h4>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
                height: "180px",
                padding: "16px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {result.last_7_day_trend.map((val, idx) => {
                const maxVal = Math.max(...result.last_7_day_trend);
                const minVal = Math.min(...result.last_7_day_trend);
                const heightPercent = Math.max(25, ((val - minVal * 0.9) / (maxVal - minVal * 0.9)) * 100);

                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>
                      ₹{val}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        height: `${heightPercent}%`,
                        background:
                          idx === result.last_7_day_trend.length - 1
                            ? "linear-gradient(180deg, var(--accent-lime) 0%, var(--primary-500) 100%)"
                            : "linear-gradient(180deg, var(--primary-500) 0%, var(--primary-700) 100%)",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.5s ease",
                      }}
                    />
                    <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
                      Day {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
