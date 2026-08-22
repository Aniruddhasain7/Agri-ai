import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { api } from "../api/client";
import heroImg from "../assets/hero.jpg";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("agriai_token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (data.error) throw new Error(data.error);

      localStorage.setItem("agriai_token", data.token);
      localStorage.setItem("agriai_user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1020px",
        margin: "20px auto 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "32px",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <div className="page-badge">
          <ShieldCheck size={14} />
          <span>Join 10,000+ Smart Farmers</span>
        </div>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          Start Your AI Farming <br />
          <span style={{ color: "var(--primary-500)" }}>Journey Free</span>
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          {[
            "Instant AI leaf disease diagnosis with treatment recommendations.",
            "FAO dataset crop yield predictor & live weather advisory.",
            "Multilingual farmer chatbot in English, Hindi, and Bengali.",
          ].map((benefit, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "15px",
                color: "var(--text-muted)",
              }}
            >
              <CheckCircle2
                size={20}
                style={{
                  color: "var(--primary-500)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <img
            src={heroImg}
            alt="Smart Farming"
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: "36px" }}>
        <h2
          style={{ fontSize: "24px", marginBottom: "8px", textAlign: "left" }}
        >
          Create Free Account
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          Get instant access to all AgriAI prediction tools & smart advisories.
        </p>

        {error && (
          <div
            className="alert-box alert-error"
            style={{ marginBottom: "20px", marginTop: "0" }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={16} /> Full Name
            </label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                required
                className="form-input input-with-icon"
                placeholder="John"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} /> Email Address
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-input input-with-icon"
                placeholder="farmer@agriai.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} /> Password
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                className="form-input input-with-icon"
                placeholder="Create strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: "12px" }}
          >
            <span>
              {loading
                ? "Registering Account..."
                : "Create Account & Get Started"}
            </span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-color)",
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          Already registered?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--primary-500)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
