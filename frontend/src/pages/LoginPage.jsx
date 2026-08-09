import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { api } from "../api/client";
import heroImg from "../assets/hero.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If user is already logged in, redirect straight to dashboard
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
      const data = await api.login({
        email: form.email,
        password: form.password,
      });

      if (data.error) throw new Error(data.error);

      localStorage.setItem("agriai_token", data.token);
      localStorage.setItem("agriai_user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "20px auto 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "32px",
        alignItems: "center",
      }}
    >
      {/* Left Info Panel */}
      <div style={{ textAlign: "left" }}>
        <div className="page-badge">
          <ShieldCheck size={14} />
          <span>Secure SQLite Database Portal</span>
        </div>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            marginBottom: "16px",
            lineHeight: 1.2,
          }}
        >
          Welcome Back to <span style={{ color: "var(--primary-500)" }}>AgriAI</span>
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "16px",
            marginBottom: "28px",
            lineHeight: 1.6,
          }}
        >
          Access your farm analytics, disease scanner history, live weather advisories, and AI recommendations.
        </p>

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
            alt="AgriAI Farm"
            style={{ width: "100%", maxHeight: "240px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Right Login Glass Card */}
      <div className="glass-card" style={{ padding: "36px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "8px", textAlign: "left" }}>
          Account Login
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          Enter your registered email and password to log in.
        </p>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: "20px", marginTop: "0" }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "12px" }}>
            <span>{loading ? "Authenticating..." : "Log In to Portal"}</span>
            <LogIn size={18} />
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
          Don&apos;t have an account yet?{" "}
          <Link
            to="/signup"
            style={{
              color: "var(--primary-500)",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>Sign Up Free</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
