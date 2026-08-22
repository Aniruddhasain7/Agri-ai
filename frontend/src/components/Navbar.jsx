import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Sprout,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const getStoredUser = () => {
  try {
    const u = localStorage.getItem("agriai_user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = getStoredUser();
  const token = localStorage.getItem("agriai_token");
  const isAuthenticated = Boolean(user && token);
  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--bg-nav)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            onClick={() => setMobileOpen(false)}
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                flexShrink: 0,
              }}
            >
              <Sprout size={20} />
            </div>
            <span
              style={{
                fontFamily: "Outfit, system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "22px",
                letterSpacing: "-0.5px",
                color: "var(--text-main)",
              }}
            >
              Agri<span style={{ color: "var(--primary-500)" }}>AI</span>
            </span>
          </Link>

          {isAuthenticated && !isDashboard && (
            <>
              <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "1px",
                    height: "22px",
                    background: "var(--border-color)",
                  }}
                />

                <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Link
                    to="/dashboard"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: "var(--radius-sm)",
                      textDecoration: "none",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--primary-500)",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ArrowLeft size={15} />
                    <span>{t("nav.dashboard")}</span>
                  </Link>
                </nav>
              </div>

              <Link
                to="/dashboard"
                aria-label="Back to Dashboard"
                className="mobile-only"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  color: "var(--primary-500)",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={16} />
              </Link>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {isAuthenticated && (
            <div className="desktop-only">
              <LanguageSwitcher />
            </div>
          )}
          <ThemeToggle />

          <div className="desktop-only">
            {isAuthenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-color)",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "var(--text-main)",
                  }}
                >
                  <UserIcon size={15} style={{ color: "var(--primary-500)" }} />
                  <span>{user?.name || t("nav.farmer", "Farmer")}</span>
                </div>

                <button
                  onClick={handleLogout}
                  title={t("nav.logout", "Log Out")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-input)",
                    color: "var(--accent-error)",
                    cursor: "pointer",
                    fontSize: "13.5px",
                    fontWeight: 600,
                  }}
                >
                  <LogOut size={15} />
                  <span>{t("nav.logout", "Log Out")}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-input)",
                    color: "var(--text-main)",
                    textDecoration: "none",
                    fontSize: "13.5px",
                    fontWeight: 600,
                  }}
                >
                  <LogIn size={15} />
                  <span>{t("nav.login", "Log In")}</span>
                </Link>

                <Link
                  to="/signup"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "var(--radius-sm)",
                    background:
                      "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  <UserPlus size={15} />
                  <span>{t("nav.signup", "Sign Up")}</span>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              background: "var(--bg-input)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-main)",
              cursor: "pointer",
            }}
            className="mobile-only"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          style={{
            padding: "16px 20px 24px",
            background: "var(--bg-nav)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
          className="mobile-only"
        >
          {isAuthenticated ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                  <UserIcon size={16} style={{ color: "var(--primary-500)" }} />
                  <span>{user?.name || t("nav.farmer", "Farmer")}</span>
                </div>
                <LanguageSwitcher />
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{ justifyContent: "flex-start", padding: "12px 16px" }}
              >
                <LayoutDashboard size={18} />
                <span>{t("nav.go_dashboard", "Go to Dashboard")}</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "var(--accent-error)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14.5px",
                }}
              >
                <LogOut size={18} />
                <span>{t("nav.logout", "Log Out")}</span>
              </button>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary"
                style={{ width: "100%" }}
              >
                <LogIn size={18} />
                <span>{t("nav.login", "Log In")}</span>
              </Link>

              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{ width: "100%" }}
              >
                <UserPlus size={18} />
                <span>{t("nav.signup", "Sign Up")}</span>
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
