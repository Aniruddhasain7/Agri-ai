import { useState } from "react";
import { api } from "../api/client";
import {
  TrendingUp,
  Globe,
  Sprout,
  Calendar,
  CloudRain,
  ShieldAlert,
  Thermometer,
  RefreshCw,
  AlertTriangle,
  Award,
} from "lucide-react";

const CROPS = [
  "Maize",
  "Potatoes",
  "Rice, paddy",
  "Sorghum",
  "Soybeans",
  "Wheat",
  "Cassava",
  "Sweet potatoes",
  "Plantains and others",
  "Yams",
];

export default function YieldPrediction() {
  const [form, setForm] = useState({
    area: "India",
    item: "Rice, paddy",
    year: new Date().getFullYear(),
    rainfall_mm: "",
    pesticides_tonnes: "",
    avg_temp: "",
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

    if (!form.area || !form.rainfall_mm || !form.pesticides_tonnes || !form.avg_temp) {
      setError("Please fill in all input parameters.");
      setLoading(false);
      return;
    }

    try {
      const data = await api.predictYield({
        area: form.area,
        item: form.item,
        year: Number(form.year),
        rainfall_mm: Number(form.rainfall_mm),
        pesticides_tonnes: Number(form.pesticides_tonnes),
        avg_temp: Number(form.avg_temp),
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
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="page-header">
        <div className="page-badge">
          <TrendingUp size={14} />
          <span>Harvest Yield Predictor</span>
        </div>
        <h1 className="page-title">Crop Yield Prediction</h1>
        <p className="page-subtitle">
          Estimate harvest yield per hectare based on historical climate, geographical, and pesticide data.
        </p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            <div className="form-group">
              <label className="form-label">
                <Globe size={16} /> Country / Region
              </label>
              <div className="input-wrapper">
                <Globe size={18} className="input-icon" />
                <input
                  name="area"
                  className="form-input input-with-icon"
                  placeholder="e.g. India"
                  value={form.area}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Sprout size={16} /> Crop Commodity
              </label>
              <select
                name="item"
                className="form-select"
                value={form.item}
                onChange={handleChange}
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} /> Target Harvest Year
              </label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input
                  name="year"
                  type="number"
                  className="form-input input-with-icon"
                  value={form.year}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <CloudRain size={16} /> Annual Rainfall (mm)
              </label>
              <div className="input-wrapper">
                <CloudRain size={18} className="input-icon" />
                <input
                  name="rainfall_mm"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 1083"
                  value={form.rainfall_mm}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <ShieldAlert size={16} /> Pesticide Usage (tonnes)
              </label>
              <div className="input-wrapper">
                <ShieldAlert size={18} className="input-icon" />
                <input
                  name="pesticides_tonnes"
                  type="number"
                  className="form-input input-with-icon"
                  placeholder="e.g. 750"
                  value={form.pesticides_tonnes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Thermometer size={16} /> Average Temp (°C)
              </label>
              <div className="input-wrapper">
                <Thermometer size={18} className="input-icon" />
                <input
                  name="avg_temp"
                  type="number"
                  step="0.1"
                  className="form-input input-with-icon"
                  placeholder="e.g. 26.5"
                  value={form.avg_temp}
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
                  <span>Calculating Prediction...</span>
                </>
              ) : (
                <>
                  <TrendingUp size={18} />
                  <span>Predict Yield</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert-box alert-error">
            <AlertTriangle size={20} />
            <div>
              <strong>Prediction Error</strong>
              <p style={{ fontSize: "13px" }}>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "32px",
              padding: "24px",
              borderRadius: "var(--radius-md)",
              background:
                "radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 21, 16, 0.3) 100%)",
              border: "1px solid var(--primary-500)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--primary-500)",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              <Award size={20} />
              <span>Estimated Harvest Yield</span>
            </div>

            <h2
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "var(--text-main)",
                margin: "8px 0",
              }}
            >
              {result.estimated_yield_tons_per_hectare}{" "}
              <span style={{ fontSize: "20px", fontWeight: 600, color: "var(--primary-400)" }}>
                tonnes / hectare
              </span>
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "12px",
              }}
            >
              <span>Country: {result.area}</span>
              <span>•</span>
              <span>Crop: {result.item}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
