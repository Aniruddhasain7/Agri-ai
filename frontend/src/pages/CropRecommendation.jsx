import { useState } from "react";
import { api } from "../api/client";
import {
  Sprout,
  Layers,
  TestTube,
  FlaskConical,
  Thermometer,
  Droplets,
  Info,
  CloudRain,
  RefreshCw,
  AlertTriangle,
  Award,
} from "lucide-react";

export default function CropRecommendation() {
  const [form, setForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
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

    const missingFields = Object.keys(form).filter((k) => !form[k]);
    if (missingFields.length > 0) {
      setError(`Please fill in all parameters: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const numericForm = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v)]),
      );
      const data = await api.recommendCrop(numericForm);
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className="page-header">
        <div className="page-badge">
          <Sprout size={14} />
          <span>Random Forest Crop Matcher</span>
        </div>
        <h1 className="page-title">Smart Crop Recommendation</h1>
        <p className="page-subtitle">
          Input your soil nutrients and local environmental conditions to find the highest-yielding crop for your land.
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
            {/* Nitrogen */}
            <div className="form-group">
              <label className="form-label">
                <Layers size={16} style={{ color: "var(--primary-500)" }} />
                Nitrogen (N)
              </label>
              <div className="input-wrapper">
                <Layers size={18} className="input-icon" />
                <input
                  name="nitrogen"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 90"
                  value={form.nitrogen}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phosphorus */}
            <div className="form-group">
              <label className="form-label">
                <TestTube size={16} style={{ color: "#3b82f6" }} />
                Phosphorus (P)
              </label>
              <div className="input-wrapper">
                <TestTube size={18} className="input-icon" />
                <input
                  name="phosphorus"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 42"
                  value={form.phosphorus}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Potassium */}
            <div className="form-group">
              <label className="form-label">
                <FlaskConical size={16} style={{ color: "#f59e0b" }} />
                Potassium (K)
              </label>
              <div className="input-wrapper">
                <FlaskConical size={18} className="input-icon" />
                <input
                  name="potassium"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 43"
                  value={form.potassium}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Temperature */}
            <div className="form-group">
              <label className="form-label">
                <Thermometer size={16} style={{ color: "#ef4444" }} />
                Temperature (°C)
              </label>
              <div className="input-wrapper">
                <Thermometer size={18} className="input-icon" />
                <input
                  name="temperature"
                  type="number"
                  step="0.1"
                  className="form-input input-with-icon"
                  placeholder="e.g. 20.8"
                  value={form.temperature}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Humidity */}
            <div className="form-group">
              <label className="form-label">
                <Droplets size={16} style={{ color: "#0ea5e9" }} />
                Humidity (%)
              </label>
              <div className="input-wrapper">
                <Droplets size={18} className="input-icon" />
                <input
                  name="humidity"
                  type="number"
                  step="0.1"
                  className="form-input input-with-icon"
                  placeholder="e.g. 82.0"
                  value={form.humidity}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* pH */}
            <div className="form-group">
              <label className="form-label">
                <Info size={16} style={{ color: "var(--accent-lime)" }} />
                Soil pH
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

            {/* Rainfall */}
            <div className="form-group">
              <label className="form-label">
                <CloudRain size={16} style={{ color: "var(--primary-400)" }} />
                Annual Rainfall (mm)
              </label>
              <div className="input-wrapper">
                <CloudRain size={18} className="input-icon" />
                <input
                  name="rainfall"
                  type="number"
                  step="0.1"
                  className="form-input input-with-icon"
                  placeholder="e.g. 202.9"
                  value={form.rainfall}
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
                  <span>Evaluating Crop Suitability...</span>
                </>
              ) : (
                <>
                  <Sprout size={18} />
                  <span>Recommend Optimal Crop</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert-box alert-error">
            <AlertTriangle size={20} />
            <div>
              <strong>Evaluation Error</strong>
              <p style={{ fontSize: "13px" }}>{error}</p>
            </div>
          </div>
        )}

        {result && result.recommended_crop && (
          <div
            style={{
              marginTop: "32px",
              padding: "28px",
              borderRadius: "var(--radius-md)",
              background:
                "radial-gradient(circle at 50% 0%, rgba(132, 204, 22, 0.2) 0%, rgba(6, 21, 16, 0.4) 100%)",
              border: "1px solid var(--accent-lime)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--accent-lime)",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              <Award size={22} />
              <span>Optimal Match Recommended</span>
            </div>

            <h2
              style={{
                fontSize: "44px",
                fontWeight: 800,
                textTransform: "capitalize",
                color: "var(--text-main)",
                margin: "8px 0",
              }}
            >
              {result.recommended_crop}
            </h2>

            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
              Selected by model engine: <strong>{result.source}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
