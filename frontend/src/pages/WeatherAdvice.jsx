import { useState } from "react";
import { api } from "../api/client";
import {
  CloudSun,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function WeatherAdvice() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = () => {
    setLoading(true);
    setError("");
    setResult(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await api.getWeatherAdvice(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          if (data.error) throw new Error(data.error);
          setResult(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please enable GPS permissions.");
        setLoading(false);
      },
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-badge">
          <CloudSun size={14} />
          <span>Open-Meteo Live Service</span>
        </div>
        <h1 className="page-title">Weather-Based Farming Advice</h1>
        <p className="page-subtitle">
          Fetch real-time weather observations for your field location to get smart agricultural recommendations.
        </p>
      </div>

      <div className="glass-card" style={{ textAlign: "center" }}>
        <button
          onClick={fetchWeather}
          className="btn-primary"
          disabled={loading}
          style={{ width: "auto", minWidth: "260px", margin: "0 auto 24px" }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="spinner" />
              <span>Fetching Location Weather...</span>
            </>
          ) : (
            <>
              <MapPin size={18} />
              <span>Get Weather Advice for My Location</span>
            </>
          )}
        </button>

        {error && (
          <div className="alert-box alert-error">
            <AlertTriangle size={20} />
            <div>
              <strong>Weather Error</strong>
              <p style={{ fontSize: "13px" }}>{error}</p>
            </div>
          </div>
        )}

        {result && result.current_conditions && (
          <div style={{ textAlign: "left", marginTop: "24px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Current Live Conditions</h3>

            {/* Metrics Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              {/* Temperature */}
              <div
                style={{
                  background: "var(--bg-input)",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#f59e0b",
                    marginBottom: "8px",
                  }}
                >
                  <Thermometer size={20} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Temperature</span>
                </div>
                <p style={{ fontSize: "24px", fontWeight: 800 }}>
                  {result.current_conditions.temperature_c}°C
                </p>
              </div>

              {/* Humidity */}
              <div
                style={{
                  background: "var(--bg-input)",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#3b82f6",
                    marginBottom: "8px",
                  }}
                >
                  <Droplets size={20} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Humidity</span>
                </div>
                <p style={{ fontSize: "24px", fontWeight: 800 }}>
                  {result.current_conditions.humidity_percent}%
                </p>
              </div>

              {/* Rain */}
              <div
                style={{
                  background: "var(--bg-input)",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--primary-500)",
                    marginBottom: "8px",
                  }}
                >
                  <CloudRain size={20} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Precipitation</span>
                </div>
                <p style={{ fontSize: "24px", fontWeight: 800 }}>
                  {result.current_conditions.precipitation_mm} mm
                </p>
              </div>

              {/* Wind */}
              <div
                style={{
                  background: "var(--bg-input)",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--primary-400)",
                    marginBottom: "8px",
                  }}
                >
                  <Wind size={20} />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>Wind Speed</span>
                </div>
                <p style={{ fontSize: "24px", fontWeight: 800 }}>
                  {result.current_conditions.wind_speed_kph} km/h
                </p>
              </div>
            </div>

            {/* Farming Advice Checklist */}
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Farming Recommendations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {result.farming_advice.map((tip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "16px",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <CheckCircle size={20} style={{ color: "var(--primary-500)", flexShrink: 0 }} />
                  <p style={{ fontSize: "14px", color: "var(--text-main)", lineHeight: 1.5 }}>
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
