import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "var(--bg-input)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        padding: "4px 8px",
      }}
    >
      <Globe size={16} style={{ color: "var(--primary-500)" }} />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-main)",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          fontWeight: 600,
          outline: "none",
          cursor: "pointer",
        }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} style={{ background: "var(--bg-app)", color: "var(--text-main)" }}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
