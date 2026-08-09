import { useState } from "react";
import { api } from "../api/client";
import {
  FlaskConical,
  Layers,
  TestTube,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Info,
} from "lucide-react";

export default function SoilAnalysis() {
  const [form, setForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (!form.nitrogen || !form.phosphorus || !form.potassium || !form.ph) {
      setError("Please fill in all soil parameter inputs.");
      setLoading(false);
      return;
    }

    try {
      const data = await api.getSoilRecommendation({
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        ph: Number(form.ph),
      });
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className="page-header">
        <div className="page-badge">
          <FlaskConical size={14} />
          <span>Soil Health & Fertilizer Advisor</span>
        </div>
        <h1 className="page-title">Soil Analysis & Recommendations</h1>
        <p className="page-subtitle">
          Input your soil test laboratory results (N-P-K and pH) to receive tailor-made fertilizer and treatment guidance.
        </p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Nitrogen (N) */}
            <div className="form-group">
              <label className="form-label">
                <Layers size={16} style={{ color: "var(--primary-500)" }} />
                Nitrogen (N) - mg/kg
              </label>
              <div className="input-wrapper">
                <Layers size={18} className="input-icon" />
                <input
                  name="nitrogen"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 45"
                  value={form.nitrogen}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="form-group">
              <label className="form-label">
                <TestTube size={16} style={{ color: "#3b82f6" }} />
                Phosphorus (P) - mg/kg
              </label>
              <div className="input-wrapper">
                <TestTube size={18} className="input-icon" />
                <input
                  name="phosphorus"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 25"
                  value={form.phosphorus}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="form-group">
              <label className="form-label">
                <FlaskConical size={16} style={{ color: "#f59e0b" }} />
                Potassium (K) - mg/kg
              </label>
              <div className="input-wrapper">
                <FlaskConical size={18} className="input-icon" />
                <input
                  name="potassium"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 35"
                  value={form.potassium}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* pH Value */}
            <div className="form-group">
              <label className="form-label">
                <Info size={16} style={{ color: "var(--accent-lime)" }} />
                Soil pH (0 - 14)
              </label>
              <div className="input-wrapper">
                <Info size={18} className="input-icon" />
                <input
                  name="ph"
                  type="number"
                  step="0.1"
                  className="form-input input-with-icon"
                  placeholder="e.g. 6.5"
                  value={form.ph}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw size={18} className="spinner" />
                  <span>Analyzing Soil Data...</span>
                </>
              ) : (
                <>
                  <FlaskConical size={18} />
                  <span>Get Recommendation</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert-box alert-error">
            <AlertTriangle size={20} />
            <div>
              <strong>Input Error</strong>
              <p style={{ fontSize: "13px" }}>{error}</p>
            </div>
          </div>
        )}

        {result && result.recommendations && (
          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border-color)", textAlign: "left" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Soil Advisory & Action Plan</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {result.recommendations.map((tip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "16px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <CheckCircle size={20} style={{ color: "var(--primary-500)", flexShrink: 0 }} />
                  <p style={{ fontSize: "14.5px", color: "var(--text-main)", lineHeight: 1.5 }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
